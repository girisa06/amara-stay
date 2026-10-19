from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_admin, get_current_user
from app.database import get_db
from app.models.user import User
from app.models.washing_machine import WashingMachineSession, utc_now_naive
from app.schemas.washing_machine import (
    WashingMachineHistoryItem,
    WashingMachineSessionOut,
    WashingMachineStatusOut,
)

router = APIRouter(prefix="/api/washing-machines", tags=["washing machines"])
DEFAULT_MACHINE_KEY = "shared-washing-machine"


def _active_query(db: Session, machine_key: str):
    return (
        db.query(WashingMachineSession)
        .options(joinedload(WashingMachineSession.user))
        .filter(
            WashingMachineSession.machine_key == machine_key,
            WashingMachineSession.active_machine_key == machine_key,
        )
    )


def _session_out(session: WashingMachineSession, viewer_id: int) -> WashingMachineSessionOut:
    return WashingMachineSessionOut(
        id=session.id,
        machine_key=session.machine_key,
        user_name=session.user.name,
        is_mine=session.user_id == viewer_id,
        started_at=session.started_at,
        ended_at=session.ended_at,
        reported_at=session.reported_at,
    )


@router.get("/{machine_key}/status", response_model=WashingMachineStatusOut)
def get_status(
    machine_key: str = DEFAULT_MACHINE_KEY,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    active = _active_query(db, machine_key).first()
    return WashingMachineStatusOut(
        machine_key=machine_key,
        machine_name="Shared washing machine" if machine_key == DEFAULT_MACHINE_KEY else machine_key,
        status="in_use" if active else "available",
        active_session=_session_out(active, _.id) if active else None,
    )


@router.post(
    "/{machine_key}/sessions",
    response_model=WashingMachineSessionOut,
    status_code=status.HTTP_201_CREATED,
)
def start_session(
    machine_key: str = DEFAULT_MACHINE_KEY,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = WashingMachineSession(
        machine_key=machine_key,
        active_machine_key=machine_key,
        user_id=current_user.id,
        started_at=utc_now_naive(),
    )
    db.add(session)
    try:
        db.commit()
        db.refresh(session)
    except IntegrityError as exc:
        db.rollback()
        if _active_query(db, machine_key).first():
            raise HTTPException(status_code=409, detail="The washing machine is already in use") from exc
        raise
    return _session_out(session, current_user.id)


@router.post("/{machine_key}/sessions/{session_id}/end", response_model=WashingMachineSessionOut)
def end_session(
    session_id: int,
    machine_key: str = DEFAULT_MACHINE_KEY,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(WashingMachineSession)
        .options(joinedload(WashingMachineSession.user))
        .filter(WashingMachineSession.id == session_id, WashingMachineSession.machine_key == machine_key)
        .with_for_update()
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Washing session not found")
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only end your own washing session")
    if session.ended_at is None:
        session.ended_at = utc_now_naive()
        session.active_machine_key = None
        session.ended_by_user_id = current_user.id
        session.end_reason = "resident"
        db.commit()
        db.refresh(session)
    return _session_out(session, current_user.id)


@router.post("/{machine_key}/sessions/{session_id}/report", response_model=WashingMachineSessionOut)
def report_session(
    session_id: int,
    machine_key: str = DEFAULT_MACHINE_KEY,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        _active_query(db, machine_key)
        .filter(WashingMachineSession.id == session_id)
        .with_for_update()
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Active washing session not found")
    if session.user_id == current_user.id:
        raise HTTPException(status_code=409, detail="You can end your own session directly")
    if session.reported_at is None:
        session.reported_at = utc_now_naive()
        session.reported_by_user_id = current_user.id
        db.commit()
        db.refresh(session)
    return _session_out(session, current_user.id)


@router.post("/{machine_key}/sessions/{session_id}/release", response_model=WashingMachineSessionOut)
def release_reported_session(
    session_id: int,
    machine_key: str = DEFAULT_MACHINE_KEY,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    session = (
        db.query(WashingMachineSession)
        .options(joinedload(WashingMachineSession.user))
        .filter(WashingMachineSession.id == session_id, WashingMachineSession.machine_key == machine_key)
        .with_for_update()
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Washing session not found")
    if session.ended_at is None:
        if session.reported_at is None:
            raise HTTPException(status_code=409, detail="A resident report is required before release")
        session.ended_at = utc_now_naive()
        session.active_machine_key = None
        session.ended_by_user_id = admin.id
        session.end_reason = "admin_reported"
        db.commit()
        db.refresh(session)
    return _session_out(session, admin.id)


@router.get("/{machine_key}/history", response_model=list[WashingMachineHistoryItem])
def get_history(
    machine_key: str = DEFAULT_MACHINE_KEY,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    sessions = (
        db.query(WashingMachineSession)
        .filter(
            WashingMachineSession.machine_key == machine_key,
            WashingMachineSession.ended_at.is_not(None),
        )
        .order_by(WashingMachineSession.ended_at.desc())
        .limit(limit)
        .all()
    )
    return [
        WashingMachineHistoryItem(
            id=item.id,
            machine_key=item.machine_key,
            started_at=item.started_at,
            ended_at=item.ended_at,
            end_reason=item.end_reason,
            was_reported=item.reported_at is not None,
        )
        for item in sessions
    ]
