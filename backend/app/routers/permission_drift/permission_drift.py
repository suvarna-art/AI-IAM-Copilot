from datetime import datetime, timezone
from fastapi import Depends 

from fastapi import (
    APIRouter,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from app.services.permission_drift.drift_engine import (
    analyze_permission_drift,
)

from app.services.permission_drift.exemptions_engine import (
    apply_exemptions,
    find_exact_rule,
    get_connection,
    get_exemption_by_id,
    initialize_database,
    insert_exemption_record,
    list_exemptions,
    seed_demo_exemptions,
)

from app.security.dependencies import require_admin

router = APIRouter(
    prefix="/permission-drift",
    tags=["Permission Drift"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class CreateExemptionRequest(BaseModel):
    user_id: str | None = None
    account_type: str | None = None
    permission: str | None = None

    exemption_type: str = Field(
        min_length=3,
        max_length=100,
    )

    reason: str = Field(
        min_length=5,
        max_length=500,
    )

    expected_frequency: str | None = None

    valid_from: datetime
    valid_until: datetime | None = None

    created_by: str = Field(
        min_length=3,
        max_length=150,
    )


# =========================================================
# INTERNAL PIPELINE
# =========================================================

def get_current_findings() -> list[dict]:
    try:
        initialize_database()
        seed_demo_exemptions()

        raw_findings = (
            analyze_permission_drift()
        )

        return apply_exemptions(
            raw_findings
        )

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Permission drift analysis "
                f"failed: {str(exc)}"
            ),
        ) from exc


# =========================================================
# SUMMARY
# =========================================================

@router.get("/summary")
def get_permission_drift_summary():
    findings = get_current_findings()

    status_counts = {
        "ACTIVE": 0,
        "MONITORED": 0,
        "DRIFT_CANDIDATE": 0,
        "EXEMPT": 0,
        "EXEMPTION_EXPIRED": 0,
    }

    identities = set()

    high_risk = 0
    dormant = 0
    privileged = 0
    service_accounts = 0

    for finding in findings:
        identities.add(
            finding[
                "user_id"
            ]
        )

        final_status = finding.get(
            "final_status"
        )

        if final_status in status_counts:
            status_counts[
                final_status
            ] += 1

        if (
            finding.get(
                "raw_classification"
            )
            == "HIGH"
        ):
            high_risk += 1

        if (
            finding.get(
                "activity_state"
            )
            == "DORMANT"
        ):
            dormant += 1

        if finding.get(
            "privileged"
        ):
            privileged += 1

        if (
            finding.get(
                "account_type"
            )
            == "SERVICE"
        ):
            service_accounts += 1

    return {
        "analysis_window_days": 14,

        "total_identities":
            len(identities),

        "total_permissions":
            len(findings),

        "active":
            status_counts[
                "ACTIVE"
            ],

        "monitored":
            status_counts[
                "MONITORED"
            ],

        "drift_candidates":
            status_counts[
                "DRIFT_CANDIDATE"
            ],

        "exempt":
            status_counts[
                "EXEMPT"
            ],

        "exemption_expired":
            status_counts[
                "EXEMPTION_EXPIRED"
            ],

        "high_risk_findings":
            high_risk,

        "dormant_permissions":
            dormant,

        "privileged_permissions":
            privileged,

        "service_account_permissions":
            service_accounts,
    }


# =========================================================
# FINDINGS
# =========================================================

@router.get("/findings")
def get_permission_drift_findings():
    return get_current_findings()


@router.get("/high-risk")
def get_high_risk_permission_drift():
    findings = get_current_findings()

    return [
        finding
        for finding in findings
        if (
            finding.get(
                "raw_classification"
            )
            == "HIGH"
            and finding.get(
                "final_status"
            )
            != "EXEMPT"
        )
    ]


@router.get("/drift-candidates")
def get_drift_candidates():
    findings = get_current_findings()

    return [
        finding
        for finding in findings
        if finding.get(
            "final_status"
        )
        == "DRIFT_CANDIDATE"
    ]


# =========================================================
# GET EXEMPTIONS
# =========================================================

@router.get("/exemptions")
def get_policy_exemptions():
    try:
        return list_exemptions()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load policy "
                f"exemptions: {str(exc)}"
            ),
        ) from exc


# =========================================================
# CREATE EXEMPTION
# =========================================================

@router.post("/exemptions")
def create_policy_exemption(
    request: CreateExemptionRequest,
    current_user: dict = Depends(require_admin),
):
    initialize_database()
    seed_demo_exemptions()

    now = datetime.now(
        timezone.utc
    )

    valid_from = request.valid_from

    valid_until = (
        request.valid_until
    )

    if valid_from.tzinfo is None:
        valid_from = (
            valid_from.replace(
                tzinfo=timezone.utc
            )
        )

    if (
        valid_until is not None
        and valid_until.tzinfo is None
    ):
        valid_until = (
            valid_until.replace(
                tzinfo=timezone.utc
            )
        )

    if (
        valid_until is not None
        and valid_until
        <= valid_from
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "valid_until must be later "
                "than valid_from."
            ),
        )

    if (
        request.user_id is None
        and request.account_type is None
        and request.permission is None
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "At least one exemption "
                "scope must be provided."
            ),
        )

    connection = get_connection()

    try:
        duplicate = find_exact_rule(
            connection=connection,

            user_id=
                request.user_id,

            account_type=
                request.account_type,

            permission=
                request.permission,

            status="ACTIVE",
        )

        if duplicate:
            raise HTTPException(
                status_code=409,
                detail=(
                    "An active exemption "
                    "already exists for this scope."
                ),
            )

        exemption_id = (
            insert_exemption_record(
                connection=connection,

                user_id=
                    request.user_id,

                account_type=
                    request.account_type,

                permission=
                    request.permission,

                exemption_type=
                    request.exemption_type,

                reason=
                    request.reason,

                expected_frequency=
                    request.expected_frequency,

                valid_from=
                    valid_from.isoformat(),

                valid_until=(
                    valid_until.isoformat()
                    if valid_until
                    else None
                ),

                created_by=
                    request.created_by,

                status="ACTIVE",

                created_at=
                    now.isoformat(),
            )
        )

        connection.commit()

        exemption = (
            get_exemption_by_id(
                connection,
                exemption_id,
            )
        )

        if exemption is None:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Exemption was created "
                    "but could not be retrieved."
                ),
            )

        for field in (
            "valid_from",
            "valid_until",
            "created_at",
        ):
            value = exemption.get(
                field
            )

            if isinstance(
                value,
                datetime,
            ):
                exemption[field] = (
                    value.isoformat()
                )

        return {
            "message":
                "Policy exemption created successfully.",

            "exemption":
                exemption,
        }

    finally:
        connection.close()