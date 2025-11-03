import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import QRCode from "qrcode.react";
import { SocketContext } from "@/context/Socket/SocketContext";
import { i18n } from "@/translate/i18n";
import api from "@/services/api";
import toastError from "@/errors/toastError";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
}));

interface QrcodeModalProps {
  open: boolean;
  onClose: () => void;
  whatsAppId: number | null | undefined;
}

const QrcodeModal: React.FC<QrcodeModalProps> = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const [qrCode, setQrCode] = useState("");
  const socketManager = useContext(SocketContext);

  useEffect(() => {
    if (!whatsAppId) return;

    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/whatsapp/${whatsAppId}`);
        setQrCode(data.qrcode || "");
      } catch (err) {
        toastError(err);
      }
    };

    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    if (!whatsAppId) return;

    const companyId = localStorage.getItem("companyId");
    const socket = socketManager;

    socket.on(`whatsappSession-${whatsAppId}`, (data: any) => {
      if (data.action === "update" && data.session?.qrcode) {
        setQrCode(data.session.qrcode);
      }

      if (data.action === "update" && data.session?.status === "CONNECTED") {
        onClose();
      }
    });

    return () => {
      socket.off(`whatsappSession-${whatsAppId}`);
    };
  }, [whatsAppId, socketManager, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{i18n.t("qrcodeModal.title")}</DialogTitle>
      <DialogContent>
        <Paper className={classes.paper}>
          {qrCode ? (
            <>
              <QRCode value={qrCode} size={256} />
              <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                {i18n.t("qrcodeModal.message")}
              </Typography>
            </>
          ) : (
            <>
              <CircularProgress />
              <Typography variant="body1" style={{ marginTop: 16 }}>
                {i18n.t("qrcodeModal.waiting")}
              </Typography>
            </>
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default QrcodeModal;
