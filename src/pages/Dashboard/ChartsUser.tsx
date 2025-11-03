import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}));

export const ChatsUser: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h6" gutterBottom>
        Total de Atendimentos por Usuário
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Gráfico em desenvolvimento
      </Typography>
    </div>
  );
};
