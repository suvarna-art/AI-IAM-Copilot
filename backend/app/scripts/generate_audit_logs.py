import json
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "permission_drift"

ASSIGNED_PERMISSIONS_FILE = (
    DATA_DIR / "assigned_permissions.json"
)

AUDIT_LOG_FILE = (
    DATA_DIR / "synthetic_audit_logs.json"
)


def load_assigned_permissions() -> list[dict]:
    with open(
        ASSIGNED_PERMISSIONS_FILE,
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


def create_event(
    event_id: int,
    assignment: dict,
    timestamp: datetime,
) -> dict:
    return {
        "event_id": f"evt-{event_id:04d}",
        "timestamp": timestamp.isoformat(),
        "user_id": assignment["user_id"],
        "user_name": assignment["user_name"],
        "account_type": assignment["account_type"],
        "privileged": assignment["privileged"],
        "department": assignment["department"],
        "permission": assignment["permission"],
        "resource": assignment["resource"],
        "action": "permission_use",
        "result": "success",
    }


def generate_activity_events(
    assigned_permissions: list[dict],
) -> list[dict]:
    now = datetime.now(timezone.utc)

    usage_profiles = {
        # Normal active human usage
        "finance.reports.read": {
            "count": 18,
            "window_days": 14,
        },

        # Intentionally unused privileged permission
        "finance.admin": {
            "count": 0,
            "window_days": 14,
        },

        # Service account: legitimate low-frequency usage
        "payroll.batch.execute": {
            "count": 1,
            "window_days": 14,
        },

        # Quarterly permission: intentionally unused in 14-day window
        "audit.export": {
            "count": 0,
            "window_days": 14,
        },

        # Privileged IT permission used infrequently
        "directory.users.write": {
            "count": 1,
            "window_days": 14,
        },

        # Security admin permission used normally
        "security.policies.manage": {
            "count": 4,
            "window_days": 14,
        },

        # Break-glass should normally have no activity
        "global.admin": {
            "count": 0,
            "window_days": 14,
        },

        # Dormant-style human identity:
        # no use during current 14-day window
        "hr.records.read": {
            "count": 0,
            "window_days": 14,
        },
    }

    events: list[dict] = []
    event_id = 1

    for assignment in assigned_permissions:
        permission = assignment["permission"]

        profile = usage_profiles.get(
            permission,
            {
                "count": random.randint(1, 5),
                "window_days": 14,
            },
        )

        event_count = profile["count"]
        window_days = profile["window_days"]

        for _ in range(event_count):
            days_ago = random.randint(
                0,
                window_days - 1,
            )

            hours_ago = random.randint(0, 23)
            minutes_ago = random.randint(0, 59)

            timestamp = (
                now
                - timedelta(
                    days=days_ago,
                    hours=hours_ago,
                    minutes=minutes_ago,
                )
            )

            events.append(
                create_event(
                    event_id,
                    assignment,
                    timestamp,
                )
            )

            event_id += 1

    # Add one historical HR event outside the 14-day window.
    # This lets us distinguish "never used" from "dormant".
    hr_assignment = next(
        (
            item
            for item in assigned_permissions
            if item["permission"]
            == "hr.records.read"
        ),
        None,
    )

    if hr_assignment:
        historical_timestamp = (
            now
            - timedelta(days=45)
        )

        events.append(
            create_event(
                event_id,
                hr_assignment,
                historical_timestamp,
            )
        )

    events.sort(
        key=lambda item: item["timestamp"]
    )

    return events


def save_events(
    events: list[dict],
) -> None:
    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(
        AUDIT_LOG_FILE,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            events,
            file,
            indent=2,
        )


def main() -> None:
    assigned_permissions = (
        load_assigned_permissions()
    )

    events = generate_activity_events(
        assigned_permissions
    )

    save_events(events)

    print(
        f"Generated {len(events)} audit events."
    )

    print(
        f"Saved to: {AUDIT_LOG_FILE}"
    )


if __name__ == "__main__":
    main()