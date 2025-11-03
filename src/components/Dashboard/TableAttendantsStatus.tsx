import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  online: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  offline: {
    backgroundColor: "#f44336",
    color: "white",
  },
}));

interface Attendant {
  id: number;
  name: string;
  online: boolean;
  ticketsOpen?: number;
  avgSupportTime?: number;
}

interface TableAttendantsStatusProps {
  attendants: Attendant[];
  loading: boolean;
}

const TableAttendantsStatus: React.FC<TableAttendantsStatusProps> = ({ attendants, loading }) => {
  const classes = useStyles();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Atendente</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Tickets Abertos</TableCell>
            <TableCell align="right">T.M. Atendimento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : attendants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Nenhum atendente encontrado
              </TableCell>
            </TableRow>
          ) : (
            attendants.map((attendant) => (
              <TableRow key={attendant.id}>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar className={classes.avatar}>{attendant.name.charAt(0)}</Avatar>
                    {attendant.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={attendant.online ? "Online" : "Offline"}
                    size="small"
                    className={attendant.online ? classes.online : classes.offline}
                  />
                </TableCell>
                <TableCell align="right">{attendant.ticketsOpen || 0}</TableCell>
                <TableCell align="right">
                  {attendant.avgSupportTime ? formatTime(attendant.avgSupportTime) : "0h 0m"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableAttendantsStatus;
