import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import duckdb

from app.services.permission_drift.ingestion import (
    load_audit_events,
    load_current_assignments,
)


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data" / "permission_drift"

OUTPUT_FILE = (
    DATA_DIR / "raw_drift_findings.json"
)

ANALYSIS_WINDOW_DAYS = 14


def calculate_drift_score(
    usage_count_14d: int,
    active_days_14d: int,
    risk_level: str,
) -> int:
    """
    Deterministic raw drift score.

    Exemptions are intentionally not applied here.
    They are evaluated separately by the exemptions engine.
    """

    risk_adjustment = {
        "low": 0,
        "medium": 8,
        "high": 15,
        "critical": 20,
    }.get(
        risk_level.lower(),
        0,
    )

    if usage_count_14d == 0:
        base_score = 80

    elif usage_count_14d <= 2:
        base_score = 55

    elif active_days_14d <= 3:
        base_score = 30

    else:
        base_score = 10

    return min(
        100,
        base_score + risk_adjustment,
    )


def classify_activity(
    usage_count_14d: int,
    last_used_at: str | None,
    window_start: datetime,
) -> str:
    if usage_count_14d >= 5:
        return "ACTIVE"

    if usage_count_14d > 0:
        return "LOW_ACTIVITY"

    if last_used_at is None:
        return "NEVER_USED"

    last_used = datetime.fromisoformat(
        last_used_at.replace(
            "Z",
            "+00:00",
        )
    )

    if last_used < window_start:
        return "DORMANT"

    return "LOW_ACTIVITY"


def classify_drift(
    drift_score: int,
) -> str:
    if drift_score >= 70:
        return "HIGH"

    if drift_score >= 30:
        return "MEDIUM"

    return "LOW"


def analyze_permission_drift() -> list[dict]:
    """
    Analyze current identity-permission assignments against
    observed activity over the configured analysis window.

    Data sources are provided by ingestion.py rather than being
    read directly from fixed JSON paths.
    """

    now = datetime.now(
        timezone.utc
    )

    window_start = (
        now
        - timedelta(
            days=ANALYSIS_WINDOW_DAYS
        )
    )

    assignments = (
        load_current_assignments()
    )

    audit_events = (
        load_audit_events()
    )

    connection = duckdb.connect(
        database=":memory:"
    )

    try:
        # Register Python collections as temporary DuckDB tables.
        #
        # DuckDB works well with pandas DataFrames, so we create
        # lightweight DataFrames only for analytical execution.
        import pandas as pd

        assignments_df = (
            pd.DataFrame(assignments)
        )

        audit_events_df = (
            pd.DataFrame(audit_events)
        )

        connection.register(
            "assignments_input",
            assignments_df,
        )

        connection.register(
            "audit_events_input",
            audit_events_df,
        )

        query = """
            WITH audit_events AS (
                SELECT
                    user_id,
                    permission,

                    TRY_CAST(
                        timestamp
                        AS TIMESTAMPTZ
                    ) AS event_timestamp

                FROM audit_events_input

                WHERE result = 'success'
            ),

            usage_summary AS (
                SELECT
                    a.user_id,
                    a.permission,

                    COUNT(
                        CASE
                            WHEN e.event_timestamp >= ?
                            THEN 1
                        END
                    ) AS usage_count_14d,

                    COUNT(
                        DISTINCT CASE
                            WHEN e.event_timestamp >= ?
                            THEN CAST(
                                e.event_timestamp
                                AS DATE
                            )
                        END
                    ) AS active_days_14d,

                    MAX(
                        e.event_timestamp
                    ) AS last_used_at

                FROM assignments_input a

                LEFT JOIN audit_events e
                    ON a.user_id = e.user_id
                    AND a.permission = e.permission

                GROUP BY
                    a.user_id,
                    a.permission
            )

            SELECT
                a.user_id,
                a.user_name,
                a.account_type,
                a.privileged,
                a.status,
                a.department,
                a.owner,
                a.permission,
                a.resource,
                a.risk_level,
                a.expected_usage_pattern,

                u.usage_count_14d,
                u.active_days_14d,
                u.last_used_at

            FROM assignments_input a

            LEFT JOIN usage_summary u
                ON a.user_id = u.user_id
                AND a.permission = u.permission

            ORDER BY
                a.user_id,
                a.permission
        """

        rows = connection.execute(
            query,
            [
                window_start,
                window_start,
            ],
        ).fetchall()

        columns = [
            description[0]
            for description
            in connection.description
        ]

    finally:
        connection.close()

    results: list[dict] = []

    for row in rows:
        record = dict(
            zip(
                columns,
                row,
            )
        )

        usage_count = int(
            record.get(
                "usage_count_14d"
            )
            or 0
        )

        active_days = int(
            record.get(
                "active_days_14d"
            )
            or 0
        )

        last_used_raw = (
            record.get(
                "last_used_at"
            )
        )

        last_used_at = (
            last_used_raw.isoformat()
            if last_used_raw
            else None
        )

        activity_state = (
            classify_activity(
                usage_count,
                last_used_at,
                window_start,
            )
        )

        drift_score = (
            calculate_drift_score(
                usage_count,
                active_days,
                record[
                    "risk_level"
                ],
            )
        )

        raw_classification = (
            classify_drift(
                drift_score
            )
        )

        result = {
            "user_id":
                record["user_id"],

            "user_name":
                record["user_name"],

            "account_type":
                record["account_type"],

            "privileged":
                bool(
                    record[
                        "privileged"
                    ]
                ),

            "status":
                record["status"],

            "department":
                record["department"],

            "owner":
                record["owner"],

            "permission":
                record["permission"],

            "resource":
                record["resource"],

            "risk_level":
                record[
                    "risk_level"
                ],

            "expected_usage_pattern":
                record[
                    "expected_usage_pattern"
                ],

            "analysis_window_days":
                ANALYSIS_WINDOW_DAYS,

            "analysis_window_start":
                window_start.isoformat(),

            "analysis_timestamp":
                now.isoformat(),

            "usage_count_14d":
                usage_count,

            "active_days_14d":
                active_days,

            "last_used_at":
                last_used_at,

            "activity_state":
                activity_state,

            "drift_score":
                drift_score,

            "raw_classification":
                raw_classification,
        }

        results.append(
            result
        )

    return results


def save_results(
    results: list[dict],
) -> None:
    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            results,
            file,
            indent=2,
        )


def print_summary(
    results: list[dict],
) -> None:
    print(
        "\nPermission Drift Analysis"
    )

    print("=" * 70)

    for item in results:
        print(
            f"{item['user_id']:<18} "
            f"{item['permission']:<30} "
            f"{item['activity_state']:<14} "
            f"Score={item['drift_score']:<3} "
            f"Risk={item['raw_classification']}"
        )

    print("=" * 70)

    print(
        f"Analyzed permissions: "
        f"{len(results)}"
    )

    print(
        f"Raw findings saved to: "
        f"{OUTPUT_FILE}"
    )


def main() -> None:
    results = (
        analyze_permission_drift()
    )

    save_results(
        results
    )

    print_summary(
        results
    )


if __name__ == "__main__":
    main()