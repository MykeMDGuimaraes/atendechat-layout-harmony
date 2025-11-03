import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
  Box,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import { toast } from "sonner";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";

interface ImportContactsModalProps {
  open: boolean;
  onClose: () => void;
}

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({
  open,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      toast.error(i18n.t("importContactsModal.errors.invalidFile"));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(i18n.t("importContactsModal.errors.selectFile"));
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await api.post("/contacts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });
      toast.success(i18n.t("importContactsModal.success"));
      onClose();
      window.location.reload();
    } catch (err) {
      toastError(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{i18n.t("importContactsModal.title")}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" style={{ gap: 16 }}>
          <input
            accept=".csv"
            style={{ display: "none" }}
            id="csv-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="csv-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
            >
              {i18n.t("importContactsModal.buttons.selectFile")}
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2">{selectedFile.name}</Typography>
          )}
          {uploading && (
            <Box width="100%">
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" align="center">
                {progress}%
              </Typography>
            </Box>
          )}
          <Typography variant="caption" color="textSecondary">
            {i18n.t("importContactsModal.hint")}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default" disabled={uploading}>
          {i18n.t("importContactsModal.buttons.cancel")}
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          variant="contained"
          disabled={!selectedFile || uploading}
        >
          {i18n.t("importContactsModal.buttons.upload")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportContactsModal;
