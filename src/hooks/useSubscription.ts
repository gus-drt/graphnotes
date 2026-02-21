import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPlanByProductId, type PlanKey } from "@/config/plans";

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  plan: PlanKey;
  subscriptionEnd: string | null;
  loading: boolean;
}

export function useSubscription(userEmail: string | undefined) {
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    plan: "free",
    subscriptionEnd: null,
    loading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!userEmail) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "check-subscription"
      );

      if (error) throw error;

      setState({
        subscribed: data.subscribed ?? false,
        productId: data.product_id ?? null,
        plan: getPlanByProductId(data.product_id ?? null),
        subscriptionEnd: data.subscription_end ?? null,
        loading: false,
      });
    } catch (err) {
      console.error("Error checking subscription:", err);
      setState((s) => ({ ...s, loading: false }));
    }
  }, [userEmail]);

  useEffect(() => {
    checkSubscription();

    // Auto-refresh every 60 seconds
    const interval = setInterval(checkSubscription, 60_000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const createCheckout = async (priceId: string) => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  const openCustomerPortal = async () => {
    const { data, error } = await supabase.functions.invoke("customer-portal");

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  return {
    ...state,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
}
