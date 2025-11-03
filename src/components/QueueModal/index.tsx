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
import { ColorPicker } from "material-ui-color";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";

interface QueueModalProps {
  open: boolean;
  onClose: () => void;
  queueId?: number | null;
}

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Nome muito curto")
    .required("Nome obrigatório"),
  color: Yup.string().required("Cor obrigatória"),
  greetingMessage: Yup.string(),
  orderQueue: Yup.number(),
});

const QueueModal: React.FC<QueueModalProps> = ({ open, onClose, queueId }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    color: "#0000FF",
    greetingMessage: "",
    orderQueue: 0,
  });

  useEffect(() => {
    if (!queueId) {
      setInitialValues({
        name: "",
        color: "#0000FF",
        greetingMessage: "",
        orderQueue: 0,
      });
      return;
    }

    const fetchQueue = async () => {
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setInitialValues({
          name: data.name || "",
          color: data.color || "#0000FF",
          greetingMessage: data.greetingMessage || "",
          orderQueue: data.orderQueue || 0,
        });
      } catch (err) {
        toastError(err);
      }
    };

    fetchQueue();
  }, [queueId]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, values);
        toast.success(i18n.t("queueModal.success.edit"));
      } else {
        await api.post("/queue", values);
        toast.success(i18n.t("queueModal.success.add"));
      }
      onClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {queueId ? i18n.t("queueModal.title.edit") : i18n.t("queueModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={QueueSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label={i18n.t("queueModal.form.name")}
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <label>{i18n.t("queueModal.form.color")}</label>
                <ColorPicker
                  value={values.color}
                  onChange={(color) => setFieldValue("color", `#${color.hex}`)}
                />
              </div>
              <Field
                as={TextField}
                label={i18n.t("queueModal.form.greetingMessage")}
                name="greetingMessage"
                multiline
                rows={3}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <Field
                as={TextField}
                label={i18n.t("queueModal.form.orderQueue")}
                name="orderQueue"
                type="number"
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="default" disabled={isSubmitting}>
                {i18n.t("queueModal.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : i18n.t("queueModal.buttons.save")}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default QueueModal;
