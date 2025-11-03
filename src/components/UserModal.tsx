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
import { makeStyles } from "@material-ui/core/styles";
import api from "../services/api";
import { toast } from "sonner";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, userId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open && userId) {
      fetchUser();
    }
  }, [open, userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users/${userId}`);
      setName(data.name);
      setEmail(data.email);
    } catch (err: any) {
      toast.error("Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/users/${userId}`, {
        name,
        email,
        password: password || undefined,
      });
      toast.success("Perfil atualizado com sucesso!");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Perfil</DialogTitle>
      <DialogContent>
        {loading && !name ? (
          <CircularProgress />
        ) : (
          <form className={classes.form}>
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nova Senha (opcional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              helperText="Deixe em branco para manter a senha atual"
            />
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
