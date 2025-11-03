import React, { useState } from "react";
import { IconButton, Badge, Popover, Typography, Box } from "@material-ui/core";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    width: "100%",
    maxWidth: 400,
    padding: theme.spacing(2),
  },
}));

const AnnouncementsPopover: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [announcements] = useState<any[]>([]);

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
        <Badge badgeContent={announcements.length} color="secondary">
          <AnnouncementIcon style={{ color: "white" }} />
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
          <Typography variant="h6">Anúncios</Typography>
          {announcements.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Nenhum anúncio no momento
            </Typography>
          ) : (
            announcements.map((announcement, index) => (
              <Box key={index} mt={2}>
                <Typography variant="body1">{announcement.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {announcement.content}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Popover>
    </>
  );
};

export default AnnouncementsPopover;
