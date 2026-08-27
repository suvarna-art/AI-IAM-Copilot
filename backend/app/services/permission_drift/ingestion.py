import json
from pathlib import Path
from typing import Any
from app.scripts.generate_audit_logs import (
    load_assigned_permissions,
    generate_activity_events,
    save_events,
)


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data" / "permission_drift"

ASSIGNED_PERMISSIONS_FILE = (
    DATA_DIR / "assigned_permissions.json"
)

AUDIT_LOG_FILE = (
    DATA_DIR / "synthetic_audit_logs.json"
)


def _load_json_file(
    file_path: Path,
) -> list[dict[str, Any]]:
    if not file_path.exists():
        raise FileNotFoundError(
            f"Required data source not found: {file_path}"
        )

    with open(
        file_path,
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise ValueError(
            f"Expected a JSON list in {file_path}"
        )

    return data


def load_current_assignments() -> list[dict[str, Any]]:
    """
    Returns the latest identity-to-permission assignments.

    Current implementation:
        Local JSON prototype source.

    Future implementations can replace this with:
        - Microsoft Entra ID
        - SailPoint
        - Active Directory
        - HRIS
        - SQL database
        - REST API
    """

    return _load_json_file(
        ASSIGNED_PERMISSIONS_FILE
    )


def load_audit_events() -> list[dict[str, Any]]:
    """
    Returns raw permission-usage audit events.

    Current demo implementation:
        Local synthetic JSON logs.

    If the runtime log file does not yet exist,
    generate the demo audit dataset automatically.

    Future implementations can replace this with:
        - SIEM event stream
        - Entra audit logs
        - SailPoint audit data
        - PAM activity logs
        - application audit APIs
        - cloud storage exports
    """

    if not AUDIT_LOG_FILE.exists():
        assigned_permissions = (
            load_assigned_permissions()
        )

        events = (
            generate_activity_events(
                assigned_permissions
            )
        )

        save_events(events)

    return _load_json_file(
        AUDIT_LOG_FILE
    )

def load_identity_metadata() -> list[dict[str, Any]]:
    """
    Returns normalized identity metadata derived from the
    current assignment source.

    Multiple permission assignments may belong to the same
    identity, so this function de-duplicates identities.
    """

    assignments = (
        load_current_assignments()
    )

    identities: dict[
        str,
        dict[str, Any],
    ] = {}

    for assignment in assignments:
        user_id = assignment["user_id"]

        if user_id not in identities:
            identities[user_id] = {
                "user_id":
                    user_id,

                "user_name":
                    assignment.get(
                        "user_name"
                    ),

                "account_type":
                    assignment.get(
                        "account_type"
                    ),

                "privileged":
                    assignment.get(
                        "privileged",
                        False,
                    ),

                "status":
                    assignment.get(
                        "status",
                        "UNKNOWN",
                    ),

                "department":
                    assignment.get(
                        "department"
                    ),

                "owner":
                    assignment.get(
                        "owner"
                    ),
            }

        else:
            # An identity can have both normal and privileged
            # permissions. Once privileged, keep that context.
            if assignment.get(
                "privileged",
                False,
            ):
                identities[
                    user_id
                ]["privileged"] = True

    return list(
        identities.values()
    )


def get_ingestion_summary() -> dict[str, int]:
    assignments = (
        load_current_assignments()
    )

    audit_events = (
        load_audit_events()
    )

    identities = (
        load_identity_metadata()
    )

    privileged_identities = sum(
        1
        for identity in identities
        if identity.get(
            "privileged"
        )
    )

    service_accounts = sum(
        1
        for identity in identities
        if identity.get(
            "account_type"
        )
        == "SERVICE"
    )

    break_glass_accounts = sum(
        1
        for identity in identities
        if identity.get(
            "account_type"
        )
        == "BREAK_GLASS"
    )

    return {
        "identities":
            len(identities),

        "assignments":
            len(assignments),

        "audit_events":
            len(audit_events),

        "privileged_identities":
            privileged_identities,

        "service_accounts":
            service_accounts,

        "break_glass_accounts":
            break_glass_accounts,
    }


def main() -> None:
    summary = (
        get_ingestion_summary()
    )

    print(
        "\nPermission Drift Ingestion Summary"
    )

    print("=" * 50)

    print(
        f"Identities: "
        f"{summary['identities']}"
    )

    print(
        f"Assignments: "
        f"{summary['assignments']}"
    )

    print(
        f"Audit events: "
        f"{summary['audit_events']}"
    )

    print(
        f"Privileged identities: "
        f"{summary['privileged_identities']}"
    )

    print(
        f"Service accounts: "
        f"{summary['service_accounts']}"
    )

    print(
        f"Break-glass accounts: "
        f"{summary['break_glass_accounts']}"
    )

    print("=" * 50)


if __name__ == "__main__":
    main()