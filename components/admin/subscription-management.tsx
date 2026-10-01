"use client";

import { PaymentStats } from "./payment-stats";
import { SubscriptionPlans } from "./subscription-plans";

export function SubscriptionsTab() {
    return (
        <div className="space-y-6">
            {/* Header*/}
            <div>
                <h2 className="text-xl font-semibold text-foreground">
                    Subscription Plans
                </h2>
                <p className="text-sm text-muted-foreground">
                    Create, update, and manage subscription plans available to users.
                </p>
            </div>

            <PaymentStats />

            {/* Main content */}
            <SubscriptionPlans />
        </div>
    );
}
