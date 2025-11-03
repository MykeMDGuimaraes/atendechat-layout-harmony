import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { toast } from "sonner";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";

interface Queue {
  id: number;
  name: string;
  color: string;
}

interface Contact {
  id: number;
  name: string;
  number: string;
}

interface NewTicketModalProps {
  modalOpen: boolean;
  initialContact: Contact | null;
  onClose: (ticket?: any) => void;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({
  modalOpen,
  initialContact,
  onClose,
}) => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const { data } = await api.get("/queue");
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    };

    if (modalOpen) {
      fetchQueues();
    }
  }, [modalOpen]);

  const handleCreateTicket = async () => {
    if (!initialContact || !selectedQueue) {
      toast.error(i18n.t("newTicketModal.errors.selectQueue"));
      return;
    }

    setLoading(true);
    try {
      const { data: ticket } = await api.post("/tickets", {
        contactId: initialContact.id,
        queueId: selectedQueue,
        status: "open",
      });
      toast.success(i18n.t("newTicketModal.success"));
      onClose(ticket);
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{i18n.t("newTicketModal.title")}</DialogTitle>
      <DialogContent>
        <FormControl variant="outlined" fullWidth margin="dense">
          <InputLabel>{i18n.t("newTicketModal.form.queue")}</InputLabel>
          <Select
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value as number)}
            label={i18n.t("newTicketModal.form.queue")}
          >
            {queues.map((queue) => (
              <MenuItem key={queue.id} value={queue.id}>
                {queue.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="default" disabled={loading}>
          {i18n.t("newTicketModal.buttons.cancel")}
        </Button>
        <Button
          onClick={handleCreateTicket}
          color="primary"
          variant="contained"
          disabled={loading || !selectedQueue}
        >
          {loading ? <CircularProgress size={24} /> : i18n.t("newTicketModal.buttons.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTicketModal;
