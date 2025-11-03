import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    flexWrap: "wrap",
  },
}));

interface MainHeaderButtonsWrapperProps {
  children: React.ReactNode;
}

const MainHeaderButtonsWrapper: React.FC<MainHeaderButtonsWrapperProps> = ({ children }) => {
  const classes = useStyles();
  
  return <Box className={classes.root}>{children}</Box>;
};

export default MainHeaderButtonsWrapper;
