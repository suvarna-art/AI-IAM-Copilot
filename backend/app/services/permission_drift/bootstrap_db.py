from app.services.permission_drift.exemptions_engine import (
    initialize_database,
    seed_demo_exemptions,
)


def main() -> None:
    print(
        "Initializing Permission Drift governance database..."
    )

    initialize_database()
    seed_demo_exemptions()

    print(
        "Permission Drift governance database is ready."
    )


if __name__ == "__main__":
    main()