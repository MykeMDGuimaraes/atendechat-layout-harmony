import { useState } from "react";
import api from "../services/api";

interface PlanConfig {
  plan: {
    useCampaigns: boolean;
    useKanban: boolean;
    useOpenAi: boolean;
    useIntegrations: boolean;
    useSchedules: boolean;
    useInternalChat: boolean;
    useExternalApi: boolean;
  };
}

const usePlans = () => {
  const [loading, setLoading] = useState(false);

  const getPlanCompany = async (planId?: number, companyId?: number): Promise<PlanConfig> => {
    setLoading(true);
    try {
      const { data } = await api.get(`/plans/company/${companyId || ""}`);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      // Retornar valores padrão se falhar
      return {
        plan: {
          useCampaigns: true,
          useKanban: true,
          useOpenAi: true,
          useIntegrations: true,
          useSchedules: true,
          useInternalChat: true,
          useExternalApi: true,
        },
      };
    }
  };

  return { getPlanCompany, loading };
};

export default usePlans;
