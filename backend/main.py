from datetime import date

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import SessionLocal, engine

app = FastAPI(title="Subscription Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def to_subscription_out(subscription: models.Subscription) -> schemas.SubscriptionOut:
    monthly_cost = subscription.cost
    if subscription.billing_cycle == "yearly":
        monthly_cost = subscription.cost / 12

    days_until_renewal = (subscription.next_renewal_date - date.today()).days
    renewing_soon = 0 <= days_until_renewal <= 7

    return schemas.SubscriptionOut(
        id=subscription.id,
        service_name=subscription.service_name,
        cost=subscription.cost,
        billing_cycle=subscription.billing_cycle,
        next_renewal_date=subscription.next_renewal_date,
        status=subscription.status,
        created_at=subscription.created_at,
        monthly_cost=round(monthly_cost, 2),
        days_until_renewal=days_until_renewal,
        renewing_soon=renewing_soon,
    )


def calculate_metrics(subscriptions: list[models.Subscription]) -> schemas.MetricsOut:
    total_monthly_burn = 0.0
    upcoming_renewals_alert_count = 0

    for subscription in subscriptions:
        days_until_renewal = (subscription.next_renewal_date - date.today()).days

        if subscription.status == "active":
            monthly_cost = subscription.cost
            if subscription.billing_cycle == "yearly":
                monthly_cost = subscription.cost / 12
            total_monthly_burn += monthly_cost

        if 0 <= days_until_renewal <= 7:
            upcoming_renewals_alert_count += 1

    return schemas.MetricsOut(
        total_monthly_burn=round(total_monthly_burn, 2),
        upcoming_renewals_alert_count=upcoming_renewals_alert_count,
    )


@app.post("/subscriptions", response_model=schemas.SubscriptionOut)
def create_subscription(
    payload: schemas.SubscriptionCreate,
    db: Session = Depends(get_db),
):
    service_name = payload.service_name.strip()
    if not service_name:
        raise HTTPException(status_code=422, detail="service_name cannot be empty")

    subscription = models.Subscription(
        service_name=service_name,
        cost=payload.cost,
        billing_cycle=payload.billing_cycle,
        next_renewal_date=payload.next_renewal_date,
        status="active",
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return to_subscription_out(subscription)


@app.get("/subscriptions", response_model=list[schemas.SubscriptionOut])
def list_subscriptions(db: Session = Depends(get_db)):
    subscriptions = (
        db.query(models.Subscription)
        .order_by(models.Subscription.created_at.desc())
        .all()
    )
    return [to_subscription_out(subscription) for subscription in subscriptions]


@app.get("/metrics", response_model=schemas.MetricsOut)
def get_metrics(db: Session = Depends(get_db)):
    subscriptions = db.query(models.Subscription).all()
    return calculate_metrics(subscriptions)


@app.patch("/subscriptions/{id}/status", response_model=schemas.SubscriptionOut)
def update_subscription_status(
    id: int,
    payload: schemas.SubscriptionStatusUpdate,
    db: Session = Depends(get_db),
):
    subscription = db.query(models.Subscription).filter(models.Subscription.id == id).first()

    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    subscription.status = payload.status
    db.commit()
    db.refresh(subscription)

    return to_subscription_out(subscription)


@app.delete("/subscriptions/{id}", status_code=204)
def delete_subscription(
    id: int,
    db: Session = Depends(get_db),
):
    subscription = db.query(models.Subscription).filter(models.Subscription.id == id).first()

    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    db.delete(subscription)
    db.commit()