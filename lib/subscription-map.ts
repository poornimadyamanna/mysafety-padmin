export function mapPlanFromApi(plan: any) {
    const groupedFeatures: Record<string, string[]> = {};
  
    plan.features.forEach((f: any) => {
      const value =
        f.limit === null ? "Unlimited" : `${f.limit}`;
  
      const label = `${f.featureName} (${value})`;
  
      if (!groupedFeatures[f.moduleType]) {
        groupedFeatures[f.moduleType] = [];
      }
  
      groupedFeatures[f.moduleType].push(label);
    });
  
    return {
      id: plan._id,
      name: plan.name,
      price:
        plan.price === 0
          ? "Free"
          : `₹${plan.price.toLocaleString("en-IN")}`,
      billingCycle: plan.type || "N/A",
      featuresByModule: groupedFeatures,
      status: plan.isActive ? "active" : "inactive",
    };
  }
  