import React, { useState } from "react";
import { IconButton, Popover, Slider, Box } from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    padding: theme.spacing(2),
    width: 200,
  },
}));

interface NotificationsVolumeProps {
  setVolume: (volume: number) => void;
  volume: number;
}

const NotificationsVolume: React.FC<NotificationsVolumeProps> = ({ setVolume, volume }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVolumeChange = (_event: any, newValue: number | number[]) => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volumeValue);
    localStorage.setItem("volume", String(volumeValue));
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        {Number(volume) > 0 ? (
          <VolumeUpIcon style={{ color: "white" }} />
        ) : (
          <VolumeOffIcon style={{ color: "white" }} />
        )}
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
          <Slider
            value={Number(volume)}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          />
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsVolume;
