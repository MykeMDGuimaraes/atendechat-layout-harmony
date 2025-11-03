import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "sonner";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
} from "@material-ui/core";
import {
  Search as SearchIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import { isArray } from "lodash";

import MainContainer from "@/components/MainContainer";
import MainHeader from "@/components/MainHeader";
import Title from "@/components/Title";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import TableRowSkeleton from "@/components/TableRowSkeleton";
import QuickMessageDialog from "@/components/QuickMessageDialog";
import ConfirmationModal from "@/components/ConfirmationModal";
import toastError from "@/errors/toastError";
import { SocketContext } from "@/context/Socket/SocketContext";
import { useAuth } from "@/context/Auth/AuthContext";

interface QuickMessage {
  id: number;
  shortcode: string;
  message: string;
  mediaName?: string;
}

type QuickMessageAction =
  | { type: "LOAD_QUICKMESSAGES"; payload: QuickMessage[] }
  | { type: "UPDATE_QUICKMESSAGES"; payload: QuickMessage }
  | { type: "DELETE_QUICKMESSAGE"; payload: number }
  | { type: "RESET" };

const reducer = (state: QuickMessage[], action: QuickMessageAction): QuickMessage[] => {
  if (action.type === "LOAD_QUICKMESSAGES") {
    const quickmessages = action.payload;
    const newQuickmessages: QuickMessage[] = [];

    if (isArray(quickmessages)) {
      quickmessages.forEach((quickemessage) => {
        const quickemessageIndex = state.findIndex((u) => u.id === quickemessage.id);
        if (quickemessageIndex !== -1) {
          state[quickemessageIndex] = quickemessage;
        } else {
          newQuickmessages.push(quickemessage);
        }
      });
    }

    return [...state, ...newQuickmessages];
  }

  if (action.type === "UPDATE_QUICKMESSAGES") {
    const quickemessage = action.payload;
    const quickemessageIndex = state.findIndex((u) => u.id === quickemessage.id);

    if (quickemessageIndex !== -1) {
      state[quickemessageIndex] = quickemessage;
      return [...state];
    } else {
      return [quickemessage, ...state];
    }
  }

  if (action.type === "DELETE_QUICKMESSAGE") {
    const quickemessageId = action.payload;
    const quickemessageIndex = state.findIndex((u) => u.id === quickemessageId);
    if (quickemessageIndex !== -1) {
      state.splice(quickemessageIndex, 1);
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

const Quickemessages: React.FC = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const socketManager = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedQuickemessage, setSelectedQuickemessage] = useState<QuickMessage | null>(null);
  const [deletingQuickemessage, setDeletingQuickemessage] = useState<QuickMessage | null>(null);
  const [quickemessageModalOpen, setQuickMessageDialogOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [quickemessages, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchQuickemessages();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    if (!user?.companyId) return;

    socketManager.on(`company${user.companyId}-quickemessage`, (data: any) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUICKMESSAGES", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUICKMESSAGE", payload: +data.id });
      }
    });

    return () => {
      socketManager.off(`company${user.companyId}-quickemessage`);
    };
  }, [socketManager, user]);

  const fetchQuickemessages = async () => {
    try {
      const { data } = await api.get("/quick-messages", {
        params: { searchParam, pageNumber, userId: user.id },
      });

      dispatch({ type: "LOAD_QUICKMESSAGES", payload: data.records });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  const handleOpenQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(true);
  };

  const handleCloseQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(false);
    fetchQuickemessages();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditQuickemessage = (quickemessage: QuickMessage) => {
    setSelectedQuickemessage(quickemessage);
    setQuickMessageDialogOpen(true);
  };

  const handleDeleteQuickemessage = async (quickemessageId: number) => {
    try {
      await api.delete(`/quick-messages/${quickemessageId}`);
      toast.success(i18n.t("quickMessages.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingQuickemessage(null);
    setSearchParam("");
    setPageNumber(1);
    fetchQuickemessages();
    dispatch({ type: "RESET" });
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

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingQuickemessage
            ? `${i18n.t("quickMessages.confirmationModal.deleteTitle")} ${
                deletingQuickemessage.shortcode
              }?`
            : ""
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() =>
          deletingQuickemessage && handleDeleteQuickemessage(deletingQuickemessage.id)
        }
      >
        {i18n.t("quickMessages.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QuickMessageDialog
        resetPagination={() => {
          setPageNumber(1);
          fetchQuickemessages();
        }}
        open={quickemessageModalOpen}
        onClose={handleCloseQuickMessageDialog}
        quickemessageId={selectedQuickemessage?.id}
      />
      <MainHeader>
        <Grid style={{ width: "99.6%" }} container>
          <Grid xs={12} sm={8} item>
            <Title>{i18n.t("quickMessages.title")}</Title>
          </Grid>
          <Grid xs={12} sm={4} item>
            <Grid spacing={2} container>
              <Grid xs={6} sm={6} item>
                <TextField
                  fullWidth
                  placeholder={i18n.t("quickMessages.searchPlaceholder")}
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
              </Grid>
              <Grid xs={6} sm={6} item>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOpenQuickMessageDialog}
                  color="primary"
                >
                  {i18n.t("quickMessages.buttons.add")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                {i18n.t("quickMessages.table.shortcode")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("quickMessages.table.mediaName")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("quickMessages.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quickemessages.map((quickemessage) => (
              <TableRow key={quickemessage.id}>
                <TableCell align="center">{quickemessage.shortcode}</TableCell>
                <TableCell align="center">
                  {quickemessage.mediaName ?? i18n.t("quickMessages.noAttachment")}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditQuickemessage(quickemessage)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setConfirmModalOpen(true);
                      setDeletingQuickemessage(quickemessage);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {loading && <TableRowSkeleton columns={5} />}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Quickemessages;
