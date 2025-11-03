import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  userId?: number | null;
}

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Nome muito curto")
    .required("Nome obrigatório"),
  email: Yup.string()
    .email("Email inválido")
    .required("Email obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .when("$isEditing", {
      is: false,
      then: (schema) => schema.required("Senha obrigatória"),
    }),
  profile: Yup.string().required("Perfil obrigatório"),
});

const UserModal: React.FC<UserModalProps> = ({ open, onClose, userId }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    profile: "user",
  });

  useEffect(() => {
    if (!userId) {
      setInitialValues({ name: "", email: "", password: "", profile: "user" });
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${userId}`);
        setInitialValues({
          name: data.name || "",
          email: data.email || "",
          password: "",
          profile: data.profile || "user",
        });
      } catch (err) {
        toastError(err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (userId) {
        await api.put(`/users/${userId}`, values);
        toast.success(i18n.t("userModal.success.edit"));
      } else {
        await api.post("/users", values);
        toast.success(i18n.t("userModal.success.add"));
      }
      onClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {userId ? i18n.t("userModal.title.edit") : i18n.t("userModal.title.add")}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={UserSchema}
        context={{ isEditing: !!userId }}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label={i18n.t("userModal.form.name")}
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <Field
                as={TextField}
                label={i18n.t("userModal.form.email")}
                name="email"
                type="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <Field
                as={TextField}
                label={i18n.t("userModal.form.password")}
                name="password"
                type="password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                variant="outlined"
                margin="dense"
                fullWidth
              />
              <FormControl variant="outlined" margin="dense" fullWidth>
                <InputLabel>{i18n.t("userModal.form.profile")}</InputLabel>
                <Select
                  value={values.profile}
                  onChange={(e) => setFieldValue("profile", e.target.value)}
                  label={i18n.t("userModal.form.profile")}
                >
                  <MenuItem value="user">
                    {String(i18n.t("userModal.form.profiles.user"))}
                  </MenuItem>
                  <MenuItem value="admin">
                    {String(i18n.t("userModal.form.profiles.admin"))}
                  </MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="default" disabled={isSubmitting}>
                {i18n.t("userModal.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : i18n.t("userModal.buttons.save")}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UserModal;
