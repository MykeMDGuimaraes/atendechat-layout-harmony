import { useState } from "react";
import api from "../services/api";
import { toast } from "sonner";

interface DashboardParams {
  days?: number;
  date_from?: string;
  date_to?: string;
}

interface DashboardCounters {
  supportHappening: number;
  supportPending: number;
  supportFinished: number;
  avgSupportTime: number;
  avgWaitTime: number;
}

interface Attendant {
  id: number;
  name: string;
  online: boolean;
  ticketsOpen: number;
  avgSupportTime: number;
}

interface DashboardData {
  counters: DashboardCounters;
  attendants: Attendant[];
}

const useDashboard = () => {
  const [loading, setLoading] = useState(false);

  const find = async (params: DashboardParams): Promise<DashboardData> => {
    setLoading(true);
    try {
      const { data } = await api.get("/dashboard", { params });
      setLoading(false);
      return data;
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "Erro ao buscar dados do dashboard");
      return {
        counters: {
          supportHappening: 0,
          supportPending: 0,
          supportFinished: 0,
          avgSupportTime: 0,
          avgWaitTime: 0,
        },
        attendants: [],
      };
    }
  };

  return { find, loading };
};

export default useDashboard;
