import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  contactId?: number | null;
}

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Nome muito curto")
    .required("Nome obrigatório"),
  number: Yup.string()
    .min(8, "Número inválido")
    .required("Número obrigatório"),
  email: Yup.string().email("Email inválido"),
});

const ContactModal: React.FC<ContactModalProps> = ({
  open,
  onClose,
  contactId,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    number: "",
    email: "",
  });

  useEffect(() => {
    if (!contactId) {
      setInitialValues({ name: "", number: "", email: "" });
      return;
    }

    const fetchContact = async () => {
      try {
        const { data } = await api.get(`/contacts/${contactId}`);
        setInitialValues({
          name: data.name || "",
          number: data.number || "",
          email: data.email || "",
        });
      } catch (err) {
        toastError(err);
      }
    };

    fetchContact();
  }, [contactId]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (contactId) {
        await api.put(`/contacts/${contactId}`, values);
        toast.success(i18n.t("contactModal.success.edit"));
      } else {
        await api.post("/contacts", values);
        toast.success(i18n.t("contactModal.success.add"));
      }
      onClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {contactId
          ? i18n.t("contactModal.title.edit")
          : i18n.t("contactModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ContactSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label={i18n.t("contactModal.form.name")}
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <Field
                as={TextField}
                label={i18n.t("contactModal.form.number")}
                name="number"
                error={touched.number && Boolean(errors.number)}
                helperText={touched.number && errors.number}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <Field
                as={TextField}
                label={i18n.t("contactModal.form.email")}
                name="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="default" disabled={isSubmitting}>
                {i18n.t("contactModal.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : i18n.t("contactModal.buttons.save")}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ContactModal;
