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

interface TagModalProps {
  open: boolean;
  onClose: () => void;
  reload?: () => void;
  tagId?: number | null;
}

const TagSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Nome muito curto")
    .required("Nome obrigatório"),
  color: Yup.string().required("Cor obrigatória"),
});

const TagModal: React.FC<TagModalProps> = ({ open, onClose, reload, tagId }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    color: "#0000FF",
  });

  useEffect(() => {
    if (!tagId) {
      setInitialValues({ name: "", color: "#0000FF" });
      return;
    }

    const fetchTag = async () => {
      try {
        const { data } = await api.get(`/tags/${tagId}`);
        setInitialValues({
          name: data.name || "",
          color: data.color || "#0000FF",
        });
      } catch (err) {
        toastError(err);
      }
    };

    fetchTag();
  }, [tagId]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (tagId) {
        await api.put(`/tags/${tagId}`, values);
        toast.success(i18n.t("tagModal.success.edit"));
      } else {
        await api.post("/tags", values);
        toast.success(i18n.t("tagModal.success.add"));
      }
      if (reload) reload();
      onClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {tagId ? i18n.t("tagModal.title.edit") : i18n.t("tagModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={TagSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label={i18n.t("tagModal.form.name")}
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <label>{i18n.t("tagModal.form.color")}</label>
                <ColorPicker
                  value={values.color}
                  onChange={(color) => setFieldValue("color", `#${color.hex}`)}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="default" disabled={isSubmitting}>
                {i18n.t("tagModal.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : i18n.t("tagModal.buttons.save")}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TagModal;
