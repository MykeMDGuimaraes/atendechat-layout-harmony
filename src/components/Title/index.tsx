import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
  const classes = useStyles();
  
  return (
    <Typography variant="h5" className={classes.title}>
      {children}
    </Typography>
  );
};

export default Title;
