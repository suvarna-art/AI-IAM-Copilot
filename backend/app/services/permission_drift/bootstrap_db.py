from app.services.permission_drift.exemptions_engine import (
    get_connection,
    initialize_database,
    seed_demo_exemptions,
    using_postgres,
)


def initialize_security_audit_table() -> None:
    connection = get_connection()

    try:
        if using_postgres():
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS security_audit_events (
                    event_id BIGSERIAL PRIMARY KEY,

                    timestamp TIMESTAMPTZ NOT NULL,

                    event_type TEXT NOT NULL,

                    actor TEXT,
                    actor_role TEXT,

                    resource TEXT NOT NULL,
                    action TEXT NOT NULL,

                    outcome TEXT NOT NULL,

                    decision TEXT,
                    risk_level TEXT,
                    risk_score INTEGER,

                    reason TEXT,

                    metadata JSONB,

                    created_at TIMESTAMPTZ NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

        else:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS security_audit_events (
                    event_id INTEGER
                        PRIMARY KEY AUTOINCREMENT,

                    timestamp TEXT NOT NULL,

                    event_type TEXT NOT NULL,

                    actor TEXT,
                    actor_role TEXT,

                    resource TEXT NOT NULL,
                    action TEXT NOT NULL,

                    outcome TEXT NOT NULL,

                    decision TEXT,
                    risk_level TEXT,
                    risk_score INTEGER,

                    reason TEXT,

                    metadata TEXT,

                    created_at TEXT NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_security_audit_events_timestamp
            ON security_audit_events (
                timestamp DESC
            )
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_security_audit_events_type
            ON security_audit_events (
                event_type
            )
            """
        )

        connection.commit()

    finally:
        connection.close()


def main() -> None:
    print(
        "Initializing IdentityForge governance database..."
    )

    initialize_database()
    seed_demo_exemptions()
    initialize_security_audit_table()

    print(
        "IdentityForge governance database is ready."
    )


if __name__ == "__main__":
    main()