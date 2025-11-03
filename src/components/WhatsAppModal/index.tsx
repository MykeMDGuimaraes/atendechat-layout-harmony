import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";

interface WhatsAppModalProps {
  open: boolean;
  onClose: () => void;
  whatsAppId?: number | null;
}

const WhatsAppSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Nome muito curto")
    .required("Nome obrigatório"),
  isDefault: Yup.boolean(),
});

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  open,
  onClose,
  whatsAppId,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!whatsAppId) {
      setInitialValues({ name: "", isDefault: false });
      return;
    }

    const fetchWhatsApp = async () => {
      try {
        const { data } = await api.get(`/whatsapp/${whatsAppId}`);
        setInitialValues({
          name: data.name,
          isDefault: data.isDefault,
        });
      } catch (err) {
        toastError(err);
      }
    };

    fetchWhatsApp();
  }, [whatsAppId]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (whatsAppId) {
        await api.put(`/whatsapp/${whatsAppId}`, values);
        toast.success(i18n.t("whatsappModal.success.edit"));
      } else {
        const { data } = await api.post("/whatsapp", values);
        toast.success(i18n.t("whatsappModal.success.add"));
      }
      onClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {whatsAppId
          ? i18n.t("whatsappModal.title.edit")
          : i18n.t("whatsappModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={WhatsAppSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label={i18n.t("whatsappModal.form.name")}
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={values.isDefault}
                    onChange={(e) => setFieldValue("isDefault", e.target.checked)}
                    name="isDefault"
                    color="primary"
                  />
                }
                label={i18n.t("whatsappModal.form.default")}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="default" disabled={isSubmitting}>
                {i18n.t("whatsappModal.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : i18n.t("whatsappModal.buttons.save")}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default WhatsAppModal;
