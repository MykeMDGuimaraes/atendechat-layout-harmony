import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import {
  WhatsApp as WhatsAppIcon,
  Search as SearchIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import api from "@/services/api";
import TableRowSkeleton from "@/components/TableRowSkeleton";
import ContactModal from "@/components/ContactModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { i18n } from "@/translate/i18n";
import MainHeader from "@/components/MainHeader";
import Title from "@/components/Title";
import MainHeaderButtonsWrapper from "@/components/MainHeaderButtonsWrapper";
import MainContainer from "@/components/MainContainer";
import toastError from "@/errors/toastError";
import { useAuth } from "@/context/Auth/AuthContext";
import { Can } from "@/components/Can";
import NewTicketModal from "@/components/NewTicketModal";
import { SocketContext } from "@/context/Socket/SocketContext";
import ImportContactsModal from "@/components/ImportContactsModal";

interface Contact {
  id: number;
  name: string;
  number: string;
  email: string;
  profilePicUrl?: string;
}

type ContactAction =
  | { type: "LOAD_CONTACTS"; payload: Contact[] }
  | { type: "UPDATE_CONTACTS"; payload: Contact }
  | { type: "DELETE_CONTACT"; payload: number }
  | { type: "RESET" };

const reducer = (state: Contact[], action: ContactAction): Contact[] => {
  if (action.type === "LOAD_CONTACTS") {
    const contacts = action.payload;
    const newContacts: Contact[] = [];

    contacts.forEach((contact) => {
      const contactIndex = state.findIndex((c) => c.id === contact.id);
      if (contactIndex !== -1) {
        state[contactIndex] = contact;
      } else {
        newContacts.push(contact);
      }
    });

    return [...state, ...newContacts];
  }

  if (action.type === "UPDATE_CONTACTS") {
    const contact = action.payload;
    const contactIndex = state.findIndex((c) => c.id === contact.id);

    if (contactIndex !== -1) {
      state[contactIndex] = contact;
      return [...state];
    } else {
      return [contact, ...state];
    }
  }

  if (action.type === "DELETE_CONTACT") {
    const contactId = action.payload;
    const contactIndex = state.findIndex((c) => c.id === contactId);
    if (contactIndex !== -1) {
      state.splice(contactIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  return state;
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const Contacts: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socketManager = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [contacts, dispatch] = useReducer(reducer, []);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [contactTicket, setContactTicket] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("/contacts/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CONTACTS", payload: data.contacts });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
          setLoading(false);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) return;

    socketManager.on(`company-${companyId}-contact`, (data: any) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTS", payload: data.contact });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACT", payload: +data.contactId });
      }
    });

    return () => {
      socketManager.off(`company-${companyId}-contact`);
    };
  }, [socketManager]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleOpenContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };

  const handleCloseOrOpenTicket = (ticket?: any) => {
    setNewTicketModalOpen(false);
    if (ticket?.uuid) {
      navigate(`/tickets/${ticket.uuid}`);
    }
  };

  const hadleEditContact = (contactId: number) => {
    setSelectedContactId(contactId);
    setContactModalOpen(true);
  };

  const handleDeleteContact = async (contactId: number) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      toast.success(i18n.t("contacts.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContact(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const handleimportContact = async () => {
    try {
      await api.post("/contacts/import");
      window.location.reload();
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenImportModal = () => {
    setOpenModalImport(true);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  const handleCloseModalImport = () => {
    setOpenModalImport(false);
  };

  return (
    <MainContainer>
      <ImportContactsModal
        open={openModalImport}
        onClose={handleCloseModalImport}
      />
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        initialContact={contactTicket}
        onClose={handleCloseOrOpenTicket}
      />
      <ContactModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        contactId={selectedContactId}
      />
      <ConfirmationModal
        title={
          deletingContact
            ? `${i18n.t("contacts.confirmationModal.deleteTitle")} ${deletingContact.name}?`
            : i18n.t("contacts.confirmationModal.importTitle")
        }
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={() =>
          deletingContact
            ? handleDeleteContact(deletingContact.id)
            : handleimportContact()
        }
      >
        {deletingContact
          ? i18n.t("contacts.confirmationModal.deleteMessage")
          : i18n.t("contacts.confirmationModal.importMessage")}
      </ConfirmationModal>
      <MainHeader>
        <Title>{i18n.t("contacts.title")}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenImportModal}
          >
            {i18n.t("contacts.buttons.import")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenContactModal}
          >
            {i18n.t("contacts.buttons.add")}
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              const csvData = contacts.map((contact) => ({
                name: contact.name,
                number: contact.number,
                email: contact.email,
              }));
              const csvContent = "data:text/csv;charset=utf-8," 
                + "name;number;email\n"
                + csvData.map(e => `${e.name};${e.number};${e.email}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "contatos.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            {i18n.t("contacts.buttons.export")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>{i18n.t("contacts.table.name")}</TableCell>
              <TableCell align="center">
                {i18n.t("contacts.table.whatsapp")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("contacts.table.email")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("contacts.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell style={{ paddingRight: 0 }}>
                  <Avatar src={contact.profilePicUrl} />
                </TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell align="center">{contact.number}</TableCell>
                <TableCell align="center">{contact.email}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setContactTicket(contact);
                      setNewTicketModalOpen(true);
                    }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => hadleEditContact(contact.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <Can
                    role={user.profile}
                    perform="contacts-page:deleteContact"
                    yes={() => (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setConfirmOpen(true);
                          setDeletingContact(contact);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
            {loading && <TableRowSkeleton avatar columns={3} />}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Contacts;
