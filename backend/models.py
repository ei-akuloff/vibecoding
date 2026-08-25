from datetime import datetime

from sqlalchemy import CheckConstraint, Column, Date, DateTime, Float, Integer, String

from database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String, nullable=False)
    cost = Column(Float, nullable=False)
    billing_cycle = Column(String, nullable=False)
    next_renewal_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint("cost > 0", name="ck_subscription_cost_positive"),
        CheckConstraint(
            "billing_cycle IN ('monthly', 'yearly')",
            name="ck_subscription_billing_cycle_valid",
        ),
        CheckConstraint(
            "status IN ('active', 'paused')",
            name="ck_subscription_status_valid",
        ),
    )
