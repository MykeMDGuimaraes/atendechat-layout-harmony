import { toast } from "sonner";
import { i18n } from "@/translate/i18n";

const toastError = (err: any) => {
  const errorMsg = err.response?.data?.error || err.message || "Erro desconhecido";
  
  if (errorMsg) {
    if (i18n.exists(`backendErrors.${errorMsg}`)) {
      toast.error(i18n.t(`backendErrors.${errorMsg}`));
    } else {
      toast.error(errorMsg);
    }
  } else {
    toast.error("Ocorreu um erro desconhecido.");
  }
};

export default toastError;
