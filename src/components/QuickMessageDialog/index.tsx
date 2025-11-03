import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import { AttachFile, Delete } from "@material-ui/icons";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";

interface QuickMessageDialogProps {
  open: boolean;
  onClose: () => void;
  resetPagination?: () => void;
  quickemessageId?: number | null;
}

const QuickMessageSchema = Yup.object().shape({
  shortcode: Yup.string()
    .min(2, "Atalho muito curto")
    .required("Atalho obrigatório"),
  message: Yup.string().required("Mensagem obrigatória"),
});

const QuickMessageDialog: React.FC<QuickMessageDialogProps> = ({
  open,
  onClose,
  resetPagination,
  quickemessageId,
}) => {
  const [initialValues, setInitialValues] = useState({
    shortcode: "",
    message: "",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [existingMediaName, setExistingMediaName] = useState<string | null>(null);

  useEffect(() => {
    if (!quickemessageId) {
      setInitialValues({ shortcode: "", message: "" });
      setMediaFile(null);
      setExistingMediaName(null);
      return;
    }

    const fetchQuickMessage = async () => {
      try {
        const { data } = await api.get(`/quick-messages/${quickemessageId}`);
        setInitialValues({
          shortcode: data.shortcode || "",
          message: data.message || "",
        });
        setExistingMediaName(data.mediaName || null);
      } catch (err) {
        toastError(err);
      }
    };

    fetchQuickMessage();
  }, [quickemessageId]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData();
      formData.append("shortcode", values.shortcode);
      formData.append("message", values.message);
      
      if (mediaFile) {
        formData.append("medias", mediaFile);
      }

      if (quickemessageId) {
        await api.put(`/quick-messages/${quickemessageId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(i18n.t("quickMessageDialog.success.edit"));
      } else {
        await api.post("/quick-messages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(i18n.t("quickMessageDialog.success.add"));
      }
      
      if (resetPagination) resetPagination();
      onClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {quickemessageId
          ? i18n.t("quickMessageDialog.title.edit")
          : i18n.t("quickMessageDialog.title.add")}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={QuickMessageSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label={i18n.t("quickMessageDialog.form.shortcode")}
                name="shortcode"
                error={touched.shortcode && Boolean(errors.shortcode)}
                helperText={touched.shortcode && errors.shortcode}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <Field
                as={TextField}
                label={i18n.t("quickMessageDialog.form.message")}
                name="message"
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                multiline
                rows={4}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <div style={{ marginTop: 16 }}>
                <input
                  accept="image/*,video/*,audio/*,.pdf"
                  style={{ display: "none" }}
                  id="media-upload"
                  type="file"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="media-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AttachFile />}
                  >
                    {i18n.t("quickMessageDialog.buttons.attachFile")}
                  </Button>
                </label>
                {(mediaFile || existingMediaName) && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center" }}>
                    <span>{mediaFile?.name || existingMediaName}</span>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setMediaFile(null);
                        setExistingMediaName(null);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="default" disabled={isSubmitting}>
                {i18n.t("quickMessageDialog.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  i18n.t("quickMessageDialog.buttons.save")
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default QuickMessageDialog;
