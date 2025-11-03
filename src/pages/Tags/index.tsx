import React, { useState, useEffect, useReducer, useCallback, useContext } from "react";
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
  Chip,
} from "@material-ui/core";
import {
  Search as SearchIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import MainContainer from "@/components/MainContainer";
import MainHeader from "@/components/MainHeader";
import MainHeaderButtonsWrapper from "@/components/MainHeaderButtonsWrapper";
import Title from "@/components/Title";
import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import TableRowSkeleton from "@/components/TableRowSkeleton";
import TagModal from "@/components/TagModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import toastError from "@/errors/toastError";
import { SocketContext } from "@/context/Socket/SocketContext";
import { useAuth } from "@/context/Auth/AuthContext";

interface Tag {
  id: number;
  name: string;
  color: string;
  ticketsCount?: number;
}

type TagAction =
  | { type: "LOAD_TAGS"; payload: Tag[] }
  | { type: "UPDATE_TAGS"; payload: Tag }
  | { type: "DELETE_TAG"; payload: number }
  | { type: "RESET" };

const reducer = (state: Tag[], action: TagAction): Tag[] => {
  if (action.type === "LOAD_TAGS") {
    const tags = action.payload;
    const newTags: Tag[] = [];

    tags.forEach((tag) => {
      const tagIndex = state.findIndex((s) => s.id === tag.id);
      if (tagIndex !== -1) {
        state[tagIndex] = tag;
      } else {
        newTags.push(tag);
      }
    });

    return [...state, ...newTags];
  }

  if (action.type === "UPDATE_TAGS") {
    const tag = action.payload;
    const tagIndex = state.findIndex((s) => s.id === tag.id);

    if (tagIndex !== -1) {
      state[tagIndex] = tag;
      return [...state];
    } else {
      return [tag, ...state];
    }
  }

  if (action.type === "DELETE_TAG") {
    const tagId = action.payload;
    const tagIndex = state.findIndex((s) => s.id === tagId);
    if (tagIndex !== -1) {
      state.splice(tagIndex, 1);
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

const Tags: React.FC = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const socketManager = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [tags, dispatch] = useReducer(reducer, []);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await api.get("/tags/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_TAGS", payload: data.tags });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  }, [searchParam, pageNumber]);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchTags();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, fetchTags]);

  useEffect(() => {
    if (!user?.companyId) return;

    socketManager.on(`company-${user.companyId}-tag`, (data: any) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_TAGS", payload: data.tags });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_TAG", payload: +data.tagId });
      }
    });

    return () => {
      socketManager.off(`company-${user.companyId}-tag`);
    };
  }, [socketManager, user]);

  const handleOpenTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag);
    setTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      await api.delete(`/tags/${tagId}`);
      toast.success(i18n.t("tags.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingTag(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchTags();
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
        title={deletingTag ? i18n.t("tags.confirmationModal.deleteTitle") : ""}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => deletingTag && handleDeleteTag(deletingTag.id)}
      >
        {i18n.t("tags.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <TagModal
        open={tagModalOpen}
        onClose={handleCloseTagModal}
        reload={fetchTags}
        tagId={selectedTag?.id}
      />
      <MainHeader>
        <Title>{i18n.t("tags.title")}</Title>
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
            onClick={handleOpenTagModal}
          >
            {i18n.t("tags.buttons.add")}
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
              <TableCell align="center">{i18n.t("tags.table.name")}</TableCell>
              <TableCell align="center">{i18n.t("tags.table.tickets")}</TableCell>
              <TableCell align="center">{i18n.t("tags.table.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell align="center">
                  <Chip
                    variant="outlined"
                    style={{
                      backgroundColor: tag.color,
                      textShadow: "1px 1px 1px #000",
                      color: "white",
                    }}
                    label={tag.name}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{tag.ticketsCount}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleEditTag(tag)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setConfirmModalOpen(true);
                      setDeletingTag(tag);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {loading && <TableRowSkeleton columns={4} />}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Tags;
