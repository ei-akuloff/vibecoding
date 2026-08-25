from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class SubscriptionCreate(BaseModel):
    service_name: str = Field(min_length=1)
    cost: float = Field(gt=0)
    billing_cycle: Literal["monthly", "yearly"]
    next_renewal_date: date


class SubscriptionStatusUpdate(BaseModel):
    status: Literal["active", "paused"]


class SubscriptionOut(BaseModel):
    id: int
    service_name: str
    cost: float
    billing_cycle: Literal["monthly", "yearly"]
    next_renewal_date: date
    status: Literal["active", "paused"]
    created_at: datetime
    monthly_cost: float
    days_until_renewal: int
    renewing_soon: bool

    model_config = ConfigDict(from_attributes=True)


class MetricsOut(BaseModel):
    total_monthly_burn: float
    upcoming_renewals_alert_count: int
