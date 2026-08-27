import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import psycopg
from psycopg.rows import dict_row


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data" / "permission_drift"

SQLITE_DATABASE_FILE = (
    DATA_DIR / "policy_exemptions.db"
)

RAW_FINDINGS_FILE = (
    DATA_DIR / "raw_drift_findings.json"
)

FINAL_FINDINGS_FILE = (
    DATA_DIR / "final_drift_findings.json"
)

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)


# =========================================================
# DATABASE BACKEND
# =========================================================

def using_postgres() -> bool:
    return bool(DATABASE_URL)


def get_connection():
    """
    Production:
        PostgreSQL via DATABASE_URL.

    Local fallback:
        SQLite.

    This keeps development simple while ensuring durable
    governance state in production.
    """

    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    if using_postgres():
        return psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row,
        )

    connection = sqlite3.connect(
        SQLITE_DATABASE_FILE
    )

    connection.row_factory = (
        sqlite3.Row
    )

    return connection


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

def initialize_database() -> None:
    connection = get_connection()

    try:
        if using_postgres():
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS policy_exemptions (
                    exemption_id BIGSERIAL PRIMARY KEY,

                    user_id TEXT,
                    account_type TEXT,
                    permission TEXT,

                    exemption_type TEXT NOT NULL,
                    reason TEXT NOT NULL,
                    expected_frequency TEXT,

                    valid_from TIMESTAMPTZ NOT NULL,
                    valid_until TIMESTAMPTZ,

                    created_by TEXT NOT NULL,

                    status TEXT NOT NULL
                        DEFAULT 'ACTIVE',

                    created_at TIMESTAMPTZ NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

            connection.execute(
                """
                CREATE INDEX IF NOT EXISTS
                idx_policy_exemptions_lookup
                ON policy_exemptions (
                    user_id,
                    account_type,
                    permission,
                    status
                )
                """
            )

        else:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS policy_exemptions (
                    exemption_id INTEGER
                        PRIMARY KEY AUTOINCREMENT,

                    user_id TEXT,
                    account_type TEXT,
                    permission TEXT,

                    exemption_type TEXT NOT NULL,
                    reason TEXT NOT NULL,
                    expected_frequency TEXT,

                    valid_from TEXT NOT NULL,
                    valid_until TEXT,

                    created_by TEXT NOT NULL,

                    status TEXT NOT NULL
                        DEFAULT 'ACTIVE',

                    created_at TEXT NOT NULL
                )
                """
            )

        connection.commit()

    finally:
        connection.close()


# =========================================================
# DEMO EXEMPTION SEEDING
# =========================================================

def seed_demo_exemptions() -> None:
    """
    Seed demo governance rules.

    These rules exist only to make the demo environment
    reproducible. The exemption engine itself supports
    dynamically created enterprise rules.
    """

    connection = get_connection()

    now = datetime.now(
        timezone.utc
    )

    demo_rules = [
        {
            "user_id": None,
            "account_type": "BREAK_GLASS",
            "permission": "global.admin",
            "exemption_type":
                "EMERGENCY_ACCESS",
            "reason":
                "Break-glass privilege is reserved for emergency use.",
            "expected_frequency":
                "emergency_only",
            "valid_from":
                "2026-01-01T00:00:00+00:00",
            "valid_until":
                "2026-12-31T23:59:59+00:00",
            "created_by":
                "Security Operations",
            "status":
                "ACTIVE",
        },
        {
            "user_id": None,
            "account_type": "SERVICE",
            "permission":
                "payroll.batch.execute",
            "exemption_type":
                "PERIODIC_SERVICE",
            "reason":
                "Payroll service executes on a scheduled monthly cycle.",
            "expected_frequency":
                "monthly",
            "valid_from":
                "2026-01-01T00:00:00+00:00",
            "valid_until":
                "2026-12-31T23:59:59+00:00",
            "created_by":
                "ERP Operations",
            "status":
                "ACTIVE",
        },
        {
            "user_id": None,
            "account_type": "HUMAN",
            "permission":
                "audit.export",
            "exemption_type":
                "PERIODIC_TASK",
            "reason":
                "Audit export is expected only during quarterly audit cycles.",
            "expected_frequency":
                "quarterly",
            "valid_from":
                "2026-01-01T00:00:00+00:00",
            "valid_until":
                "2026-12-31T23:59:59+00:00",
            "created_by":
                "IAM Governance",
            "status":
                "ACTIVE",
        },
    ]

    try:
        for rule in demo_rules:
            existing = find_exact_rule(
                connection,
                user_id=rule["user_id"],
                account_type=rule[
                    "account_type"
                ],
                permission=rule[
                    "permission"
                ],
                status="ACTIVE",
            )

            if existing:
                continue

            insert_exemption_record(
                connection=connection,
                user_id=rule["user_id"],
                account_type=rule[
                    "account_type"
                ],
                permission=rule[
                    "permission"
                ],
                exemption_type=rule[
                    "exemption_type"
                ],
                reason=rule["reason"],
                expected_frequency=rule[
                    "expected_frequency"
                ],
                valid_from=rule[
                    "valid_from"
                ],
                valid_until=rule[
                    "valid_until"
                ],
                created_by=rule[
                    "created_by"
                ],
                status=rule["status"],
                created_at=now.isoformat(),
            )

        connection.commit()

    finally:
        connection.close()


# =========================================================
# SQL HELPERS
# =========================================================

def find_exact_rule(
    connection,
    user_id: str | None,
    account_type: str | None,
    permission: str | None,
    status: str,
):
    if using_postgres():
        return connection.execute(
            """
            SELECT exemption_id
            FROM policy_exemptions

            WHERE status = %s

              AND user_id
                  IS NOT DISTINCT FROM %s

              AND account_type
                  IS NOT DISTINCT FROM %s

              AND permission
                  IS NOT DISTINCT FROM %s

            LIMIT 1
            """,
            (
                status,
                user_id,
                account_type,
                permission,
            ),
        ).fetchone()

    return connection.execute(
        """
        SELECT exemption_id
        FROM policy_exemptions

        WHERE status = ?

          AND (
              user_id = ?
              OR (
                  user_id IS NULL
                  AND ? IS NULL
              )
          )

          AND (
              account_type = ?
              OR (
                  account_type IS NULL
                  AND ? IS NULL
              )
          )

          AND (
              permission = ?
              OR (
                  permission IS NULL
                  AND ? IS NULL
              )
          )

        LIMIT 1
        """,
        (
            status,

            user_id,
            user_id,

            account_type,
            account_type,

            permission,
            permission,
        ),
    ).fetchone()


def insert_exemption_record(
    connection,
    user_id: str | None,
    account_type: str | None,
    permission: str | None,
    exemption_type: str,
    reason: str,
    expected_frequency: str | None,
    valid_from: str,
    valid_until: str | None,
    created_by: str,
    status: str,
    created_at: str,
) -> int:
    if using_postgres():
        row = connection.execute(
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
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s
            )

            RETURNING exemption_id
            """,
            (
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
                created_at,
            ),
        ).fetchone()

        return int(
            row["exemption_id"]
        )

    cursor = connection.execute(
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
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?
        )
        """,
        (
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
            created_at,
        ),
    )

    return int(
        cursor.lastrowid
    )


def get_exemption_by_id(
    connection,
    exemption_id: int,
) -> dict | None:
    placeholder = (
        "%s"
        if using_postgres()
        else "?"
    )

    row = connection.execute(
        f"""
        SELECT
            exemption_id,
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

        FROM policy_exemptions

        WHERE exemption_id = {placeholder}
        """,
        (
            exemption_id,
        ),
    ).fetchone()

    if row is None:
        return None

    return dict(row)


def list_exemptions() -> list[dict]:
    initialize_database()
    seed_demo_exemptions()

    connection = get_connection()

    try:
        rows = connection.execute(
            """
            SELECT
                exemption_id,
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

            FROM policy_exemptions

            ORDER BY exemption_id
            """
        ).fetchall()

        results = []

        for row in rows:
            item = dict(row)

            for field in (
                "valid_from",
                "valid_until",
                "created_at",
            ):
                value = item.get(field)

                if isinstance(
                    value,
                    datetime,
                ):
                    item[field] = (
                        value.isoformat()
                    )

            results.append(item)

        return results

    finally:
        connection.close()


# =========================================================
# RAW FINDINGS
# =========================================================

def load_raw_findings() -> list[dict]:
    with open(
        RAW_FINDINGS_FILE,
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


# =========================================================
# TIMESTAMP HELPERS
# =========================================================

def parse_timestamp(
    value: Any,
) -> datetime | None:
    if value is None:
        return None

    if isinstance(
        value,
        datetime,
    ):
        parsed = value

    else:
        parsed = datetime.fromisoformat(
            str(value).replace(
                "Z",
                "+00:00",
            )
        )

    if parsed.tzinfo is None:
        parsed = parsed.replace(
            tzinfo=timezone.utc
        )

    return parsed


# =========================================================
# EXEMPTION MATCHING
# =========================================================

def find_matching_exemption(
    finding: dict,
) -> dict | None:
    connection = get_connection()

    try:
        if using_postgres():
            row = connection.execute(
                """
                SELECT *
                FROM policy_exemptions

                WHERE status = 'ACTIVE'

                  AND (
                      user_id = %s
                      OR user_id IS NULL
                  )

                  AND (
                      account_type = %s
                      OR account_type IS NULL
                  )

                  AND (
                      permission = %s
                      OR permission IS NULL
                  )

                ORDER BY

                    CASE
                        WHEN user_id = %s
                        THEN 0
                        ELSE 1
                    END,

                    CASE
                        WHEN account_type = %s
                        THEN 0
                        ELSE 1
                    END,

                    CASE
                        WHEN permission = %s
                        THEN 0
                        ELSE 1
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

        else:
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
                        WHEN user_id = ?
                        THEN 0
                        ELSE 1
                    END,

                    CASE
                        WHEN account_type = ?
                        THEN 0
                        ELSE 1
                    END,

                    CASE
                        WHEN permission = ?
                        THEN 0
                        ELSE 1
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

        return (
            dict(row)
            if row
            else None
        )

    finally:
        connection.close()


# =========================================================
# EXEMPTION EVALUATION
# =========================================================

def evaluate_exemption(
    finding: dict,
) -> dict:
    exemption = (
        find_matching_exemption(
            finding
        )
    )

    if exemption is None:
        return {
            "exemption_applied":
                False,

            "exemption_status":
                None,

            "exemption_id":
                None,

            "exemption_type":
                None,

            "exemption_reason":
                None,

            "expected_frequency":
                None,
        }

    now = datetime.now(
        timezone.utc
    )

    valid_from = parse_timestamp(
        exemption[
            "valid_from"
        ]
    )

    valid_until = parse_timestamp(
        exemption[
            "valid_until"
        ]
    )

    if (
        valid_until is not None
        and now > valid_until
    ):
        exemption_status = (
            "EXPIRED"
        )

        applied = False

    elif (
        valid_from is not None
        and now < valid_from
    ):
        exemption_status = (
            "NOT_YET_ACTIVE"
        )

        applied = False

    else:
        exemption_status = (
            "ACTIVE"
        )

        applied = True

    return {
        "exemption_applied":
            applied,

        "exemption_status":
            exemption_status,

        "exemption_id":
            exemption[
                "exemption_id"
            ],

        "exemption_type":
            exemption[
                "exemption_type"
            ],

        "exemption_reason":
            exemption[
                "reason"
            ],

        "expected_frequency":
            exemption[
                "expected_frequency"
            ],
    }


# =========================================================
# FINAL GOVERNANCE STATUS
# =========================================================

def determine_final_status(
    finding: dict,
    exemption_result: dict,
) -> str:
    if (
        exemption_result[
            "exemption_status"
        ]
        == "EXPIRED"
    ):
        return (
            "EXEMPTION_EXPIRED"
        )

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
        activity_state
        == "ACTIVE"
        and raw_classification
        == "LOW"
    ):
        return "ACTIVE"

    if (
        activity_state
        == "LOW_ACTIVITY"
        and raw_classification
        == "LOW"
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


# =========================================================
# OPTIONAL LOCAL OUTPUT
# =========================================================

def save_final_findings(
    findings: list[dict],
) -> None:
    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

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
            item[
                "exemption_status"
            ]
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