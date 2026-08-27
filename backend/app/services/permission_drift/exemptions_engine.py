import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data" / "permission_drift"

DATABASE_FILE = DATA_DIR / "policy_exemptions.db"
RAW_FINDINGS_FILE = DATA_DIR / "raw_drift_findings.json"
FINAL_FINDINGS_FILE = DATA_DIR / "final_drift_findings.json"


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row

    return connection


def initialize_database() -> None:
    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS policy_exemptions (
            exemption_id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id TEXT,
            account_type TEXT,
            permission TEXT,

            exemption_type TEXT NOT NULL,
            reason TEXT NOT NULL,
            expected_frequency TEXT,

            valid_from TEXT NOT NULL,
            valid_until TEXT,

            created_by TEXT NOT NULL,

            status TEXT NOT NULL DEFAULT 'ACTIVE',

            created_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


def seed_demo_exemptions() -> None:
    """
    Demo-only exemption rules.

    The engine itself is dynamic and does not depend on these
    identities. Later, administrators will create/update rules
    through the API/UI.
    """

    connection = get_connection()

    count = connection.execute(
        """
        SELECT COUNT(*)
        FROM policy_exemptions
        """
    ).fetchone()[0]

    if count > 0:
        connection.close()
        return

    now = datetime.now(timezone.utc).isoformat()

    demo_rules = [
        {
            "user_id": None,
            "account_type": "BREAK_GLASS",
            "permission": "global.admin",
            "exemption_type": "EMERGENCY_ACCESS",
            "reason":
                "Break-glass privilege is reserved for emergency use.",
            "expected_frequency": "emergency_only",
            "valid_from": "2026-01-01T00:00:00+00:00",
            "valid_until": "2026-12-31T23:59:59+00:00",
            "created_by": "Security Operations",
            "status": "ACTIVE",
            "created_at": now,
        },
        {
            "user_id": None,
            "account_type": "SERVICE",
            "permission": "payroll.batch.execute",
            "exemption_type": "PERIODIC_SERVICE",
            "reason":
                "Payroll service executes on a scheduled monthly cycle.",
            "expected_frequency": "monthly",
            "valid_from": "2026-01-01T00:00:00+00:00",
            "valid_until": "2026-12-31T23:59:59+00:00",
            "created_by": "ERP Operations",
            "status": "ACTIVE",
            "created_at": now,
        },
        {
            "user_id": None,
            "account_type": "HUMAN",
            "permission": "audit.export",
            "exemption_type": "PERIODIC_TASK",
            "reason":
                "Audit export is expected only during quarterly audit cycles.",
            "expected_frequency": "quarterly",
            "valid_from": "2026-01-01T00:00:00+00:00",
            "valid_until": "2026-12-31T23:59:59+00:00",
            "created_by": "IAM Governance",
            "status": "ACTIVE",
            "created_at": now,
        },
    ]

    connection.executemany(
        """
        INSERT INTO policy_exemptions (
            user_id,
            account_type,
            permission,
            exemption_type,
            reason,
            expected_frequency,
            valid_from,
            valid_until,
            created_by,
            status,
            created_at
        )
        VALUES (
            :user_id,
            :account_type,
            :permission,
            :exemption_type,
            :reason,
            :expected_frequency,
            :valid_from,
            :valid_until,
            :created_by,
            :status,
            :created_at
        )
        """,
        demo_rules,
    )

    connection.commit()
    connection.close()


def load_raw_findings() -> list[dict]:
    with open(
        RAW_FINDINGS_FILE,
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


def parse_timestamp(
    value: str | None,
) -> datetime | None:
    if not value:
        return None

    return datetime.fromisoformat(
        value.replace("Z", "+00:00")
    )


def find_matching_exemption(
    finding: dict,
) -> dict | None:
    """
    Matching priority:

    1. Exact user + account type + permission
    2. Account type + permission
    3. Permission-only rule

    This allows exemptions to work with dynamically arriving
    identities without hardcoding every user.
    """

    connection = get_connection()

    row = connection.execute(
        """
        SELECT *
        FROM policy_exemptions

        WHERE status = 'ACTIVE'

          AND (
              user_id = ?
              OR user_id IS NULL
          )

          AND (
              account_type = ?
              OR account_type IS NULL
          )

          AND (
              permission = ?
              OR permission IS NULL
          )

        ORDER BY

            CASE
                WHEN user_id = ? THEN 0
                WHEN user_id IS NULL THEN 1
                ELSE 2
            END,

            CASE
                WHEN account_type = ? THEN 0
                WHEN account_type IS NULL THEN 1
                ELSE 2
            END,

            CASE
                WHEN permission = ? THEN 0
                WHEN permission IS NULL THEN 1
                ELSE 2
            END,

            exemption_id

        LIMIT 1
        """,
        (
            finding["user_id"],
            finding["account_type"],
            finding["permission"],

            finding["user_id"],
            finding["account_type"],
            finding["permission"],
        ),
    ).fetchone()

    connection.close()

    return dict(row) if row else None


def evaluate_exemption(
    finding: dict,
) -> dict:
    exemption = find_matching_exemption(
        finding
    )

    if exemption is None:
        return {
            "exemption_applied": False,
            "exemption_status": None,
            "exemption_id": None,
            "exemption_type": None,
            "exemption_reason": None,
            "expected_frequency": None,
        }

    now = datetime.now(timezone.utc)

    valid_from = parse_timestamp(
        exemption["valid_from"]
    )

    valid_until = parse_timestamp(
        exemption["valid_until"]
    )

    if (
        valid_until is not None
        and now > valid_until
    ):
        exemption_status = "EXPIRED"
        applied = False

    elif (
        valid_from is not None
        and now < valid_from
    ):
        exemption_status = "NOT_YET_ACTIVE"
        applied = False

    else:
        exemption_status = "ACTIVE"
        applied = True

    return {
        "exemption_applied": applied,
        "exemption_status": exemption_status,
        "exemption_id":
            exemption["exemption_id"],
        "exemption_type":
            exemption["exemption_type"],
        "exemption_reason":
            exemption["reason"],
        "expected_frequency":
            exemption["expected_frequency"],
    }


def determine_final_status(
    finding: dict,
    exemption_result: dict,
) -> str:

    if (
        exemption_result[
            "exemption_status"
        ] == "EXPIRED"
    ):
        return "EXEMPTION_EXPIRED"

    if exemption_result[
        "exemption_applied"
    ]:
        return "EXEMPT"

    activity_state = finding[
        "activity_state"
    ]

    raw_classification = finding[
        "raw_classification"
    ]

    if (
        activity_state == "ACTIVE"
        and raw_classification == "LOW"
    ):
        return "ACTIVE"

    if (
        activity_state == "LOW_ACTIVITY"
        and raw_classification == "LOW"
    ):
        return "MONITORED"

    return "DRIFT_CANDIDATE"


def apply_exemptions(
    findings: list[dict],
) -> list[dict]:

    final_results = []

    for finding in findings:

        exemption_result = (
            evaluate_exemption(
                finding
            )
        )

        final_status = (
            determine_final_status(
                finding,
                exemption_result,
            )
        )

        final_results.append(
            {
                **finding,
                **exemption_result,
                "final_status":
                    final_status,
            }
        )

    return final_results


def save_final_findings(
    findings: list[dict],
) -> None:

    with open(
        FINAL_FINDINGS_FILE,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            findings,
            file,
            indent=2,
        )


def print_summary(
    findings: list[dict],
) -> None:

    print(
        "\nPermission Drift Governance Results"
    )

    print("=" * 100)

    for item in findings:

        exemption = (
            item["exemption_status"]
            or "-"
        )

        print(
            f"{item['user_id']:<18}"
            f"{item['permission']:<30}"
            f"{item['activity_state']:<14}"
            f"Score={item['drift_score']:<4}"
            f"Raw={item['raw_classification']:<7}"
            f"Exemption={exemption:<10}"
            f"Final={item['final_status']}"
        )

    print("=" * 100)

    statuses = {}

    for finding in findings:
        status = finding[
            "final_status"
        ]

        statuses[status] = (
            statuses.get(status, 0) + 1
        )

    print(
        f"Total analyzed: {len(findings)}"
    )

    for status, count in sorted(
        statuses.items()
    ):
        print(
            f"{status}: {count}"
        )

    print(
        "\nFinal findings saved to:"
    )

    print(
        FINAL_FINDINGS_FILE
    )


def main() -> None:

    initialize_database()

    seed_demo_exemptions()

    raw_findings = (
        load_raw_findings()
    )

    final_findings = (
        apply_exemptions(
            raw_findings
        )
    )

    save_final_findings(
        final_findings
    )

    print_summary(
        final_findings
    )


if __name__ == "__main__":
    main()