from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

from app.services.permission_drift.exemptions_engine import (
    get_connection,
    using_postgres,
)


audit_logger = logging.getLogger(
    "identityforge.security.audit"
)


def persist_security_audit_event(
    event: dict[str, Any],
) -> None:
    connection = get_connection()

    try:
        metadata_json = json.dumps(
            event.get("metadata", {}),
            separators=(",", ":"),
            default=str,
        )

        if using_postgres():
            connection.execute(
                """
                INSERT INTO security_audit_events (
                    timestamp,
                    event_type,
                    actor,
                    actor_role,
                    resource,
                    action,
                    outcome,
                    decision,
                    risk_level,
                    risk_score,
                    reason,
                    metadata
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s::jsonb
                )
                """,
                (
                    event["timestamp"],
                    event["event_type"],
                    event["actor"],
                    event["actor_role"],
                    event["resource"],
                    event["action"],
                    event["outcome"],
                    event["decision"],
                    event["risk_level"],
                    event["risk_score"],
                    event["reason"],
                    metadata_json,
                ),
            )

        else:
            connection.execute(
                """
                INSERT INTO security_audit_events (
                    timestamp,
                    event_type,
                    actor,
                    actor_role,
                    resource,
                    action,
                    outcome,
                    decision,
                    risk_level,
                    risk_score,
                    reason,
                    metadata
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?
                )
                """,
                (
                    event["timestamp"],
                    event["event_type"],
                    event["actor"],
                    event["actor_role"],
                    event["resource"],
                    event["action"],
                    event["outcome"],
                    event["decision"],
                    event["risk_level"],
                    event["risk_score"],
                    event["reason"],
                    metadata_json,
                ),
            )

        connection.commit()

    finally:
        connection.close()


def write_security_audit_event(
    *,
    event_type: str,
    actor: str | None,
    actor_role: str | None,
    resource: str,
    action: str,
    outcome: str,
    decision: str | None = None,
    risk_level: str | None = None,
    risk_score: int | None = None,
    reason: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> None:
    event = {
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),
        "event_type": event_type,
        "actor": actor,
        "actor_role": actor_role,
        "resource": resource,
        "action": action,
        "outcome": outcome,
        "decision": decision,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "reason": reason,
        "metadata": metadata or {},
    }

    audit_logger.info(
        json.dumps(
            event,
            separators=(",", ":"),
            default=str,
        )
    )


    persist_security_audit_event(
        event
    )
