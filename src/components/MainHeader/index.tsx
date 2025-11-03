import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
    flexWrap: "wrap",
    gap: theme.spacing(2),
  },
}));

interface MainHeaderProps {
  children: React.ReactNode;
}

const MainHeader: React.FC<MainHeaderProps> = ({ children }) => {
  const classes = useStyles();
  
  return <Box className={classes.root}>{children}</Box>;
};

export default MainHeader;
