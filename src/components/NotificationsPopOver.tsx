import React, { useState, useEffect, useContext } from "react";
import { IconButton, Badge, Popover, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext } from "../context/Socket/SocketContext";
import useSound from "use-sound";

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    width: "100%",
    maxWidth: 350,
    maxHeight: 400,
    overflow: "auto",
  },
  noNotifications: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

interface NotificationsPopOverProps {
  volume: number;
}

const NotificationsPopOver: React.FC<NotificationsPopOverProps> = ({ volume }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketManager = useContext(SocketContext);

  const [playSound] = useSound("/sounds/notification.mp3", { volume: Number(volume) });

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) return;

    const handleNotification = (data: any) => {
      setNotifications((prev) => [
        {
          id: `${Date.now()}`,
          message: data.message || "Nova notificação",
          timestamp: new Date(),
        },
        ...prev.slice(0, 9), // Mantém apenas as 10 mais recentes
      ]);

      if (volume > 0) {
        playSound();
      }
    };

    // Placeholder for socket connection - will be implemented when SocketContext is ready
    // socketManager.on(`company-${companyId}-notification`, handleNotification);

    return () => {
      // socketManager.off(`company-${companyId}-notification`, handleNotification);
    };
  }, [volume, playSound]);

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
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon style={{ color: "white" }} />
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
        {notifications.length === 0 ? (
          <div className={classes.noNotifications}>
            <Typography variant="body2" color="textSecondary">
              Nenhuma notificação
            </Typography>
          </div>
        ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} button>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NotificationsPopOver;
