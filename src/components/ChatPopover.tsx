import React, { useState } from "react";
import { IconButton, Badge, Popover, Typography, Box } from "@material-ui/core";
import ForumIcon from "@material-ui/icons/Forum";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    width: "100%",
    maxWidth: 350,
    padding: theme.spacing(2),
  },
}));

const ChatPopover: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [unreadChats] = useState(0);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={unreadChats} color="secondary">
          <ForumIcon style={{ color: "white" }} />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{ paper: classes.popoverPaper }}
      >
        <Box>
          <Typography variant="h6">Chat Interno</Typography>
          <Typography variant="body2" color="textSecondary">
            Nenhuma conversa ativa
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default ChatPopover;
