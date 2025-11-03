import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import CallIcon from "@material-ui/icons/Call";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import TimerIcon from "@material-ui/icons/Timer";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "sonner";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray, isEmpty } from "lodash";
import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import { ChatsUser } from "./ChartsUser";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card1: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#682ee3",
    color: "#eee",
  },
  card2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#682ee3",
    color: "#eee",
  },
  card3: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#682ee3",
    color: "#eee",
  },
  card4: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#682ee3",
    color: "#eee",
  },
  card8: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#682ee3",
    color: "#eee",
  },
  card9: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#682ee3",
    color: "#eee",
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fullWidth: {
    width: "100%",
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  alignRight: {
    textAlign: "right",
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState<any>({});
  const [attendants, setAttendants] = useState<any[]>([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
  }, []);

  async function handleChangePeriod(value: number) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value: number) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData() {
    setLoading(true);

    let params: any = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error(String(i18n.t("dashboard.toasts.selectFilterError")));
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  function formatTime(minutes: number) {
    return moment().startOf("day").add(minutes, "minutes").format("HH[h] mm[m]");
  }

  const GetContacts = (all: boolean) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };

  function renderFilters() {
    if (filterType === 1) {
      return (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label={String(i18n.t("dashboard.filters.initialDate"))}
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label={String(i18n.t("dashboard.filters.finalDate"))}
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl className={classes.selectContainer}>
            <InputLabel id="period-selector-label">
              {String(i18n.t("dashboard.periodSelect.title"))}
            </InputLabel>
            <Select
              labelId="period-selector-label"
              id="period-selector"
              value={period}
              onChange={(e) => handleChangePeriod(Number(e.target.value))}
            >
              <MenuItem value={0}>{String(i18n.t("dashboard.periodSelect.options.none"))}</MenuItem>
              <MenuItem value={3}>{String(i18n.t("dashboard.periodSelect.options.last3"))}</MenuItem>
              <MenuItem value={7}>{String(i18n.t("dashboard.periodSelect.options.last7"))}</MenuItem>
              <MenuItem value={15}>{String(i18n.t("dashboard.periodSelect.options.last15"))}</MenuItem>
              <MenuItem value={30}>{String(i18n.t("dashboard.periodSelect.options.last30"))}</MenuItem>
              <MenuItem value={60}>{String(i18n.t("dashboard.periodSelect.options.last60"))}</MenuItem>
              <MenuItem value={90}>{String(i18n.t("dashboard.periodSelect.options.last90"))}</MenuItem>
            </Select>
            <FormHelperText>{String(i18n.t("dashboard.periodSelect.helper"))}</FormHelperText>
          </FormControl>
        </Grid>
      );
    }
  }

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} justifyContent="flex-end">
          {/* EM ATENDIMENTO */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card1} style={{ overflow: "hidden" }} elevation={4}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography component="h3" variant="h6" paragraph>
                    {String(i18n.t("dashboard.counters.inTalk"))}
                  </Typography>
                  <Grid item>
                    <Typography component="h1" variant="h4">
                      {counters.supportHappening || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <CallIcon style={{ fontSize: 100, color: "#FFFFFF" }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* AGUARDANDO */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card2} style={{ overflow: "hidden" }} elevation={6}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography component="h3" variant="h6" paragraph>
                    {String(i18n.t("dashboard.counters.waiting"))}
                  </Typography>
                  <Grid item>
                    <Typography component="h1" variant="h4">
                      {counters.supportPending || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <HourglassEmptyIcon style={{ fontSize: 100, color: "#FFFFFF" }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* FINALIZADOS */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card3} style={{ overflow: "hidden" }} elevation={6}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography component="h3" variant="h6" paragraph>
                    {i18n.t("dashboard.counters.finished")}
                  </Typography>
                  <Grid item>
                    <Typography component="h1" variant="h4">
                      {counters.supportFinished || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <CheckCircleIcon style={{ fontSize: 100, color: "#FFFFFF" }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* NOVOS CONTATOS */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card4} style={{ overflow: "hidden" }} elevation={6}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography component="h3" variant="h6" paragraph>
                    {i18n.t("dashboard.counters.newContacts")}
                  </Typography>
                  <Grid item>
                    <Typography component="h1" variant="h4">
                      {GetContacts(true)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <GroupAddIcon style={{ fontSize: 100, color: "#FFFFFF" }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* T.M. DE ATENDIMENTO */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card8} style={{ overflow: "hidden" }} elevation={6}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography component="h3" variant="h6" paragraph>
                    {i18n.t("dashboard.counters.averageTalkTime")}
                  </Typography>
                  <Grid item>
                    <Typography component="h1" variant="h4">
                      {formatTime(counters.avgSupportTime || 0)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <AccessAlarmIcon style={{ fontSize: 100, color: "#FFFFFF" }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* T.M. DE ESPERA */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card9} style={{ overflow: "hidden" }} elevation={6}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography component="h3" variant="h6" paragraph>
                    {i18n.t("dashboard.counters.averageWaitTime")}
                  </Typography>
                  <Grid item>
                    <Typography component="h1" variant="h4">
                      {formatTime(counters.avgWaitTime || 0)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <TimerIcon style={{ fontSize: 100, color: "#FFFFFF" }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* FILTROS */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.selectContainer}>
              <InputLabel id="period-selector-label">
                {String(i18n.t("dashboard.filters.filterType.title"))}
              </InputLabel>
              <Select
                labelId="period-selector-label"
                value={filterType}
                onChange={(e) => handleChangeFilterType(Number(e.target.value))}
              >
                <MenuItem value={1}>
                  {String(i18n.t("dashboard.filters.filterType.options.perDate"))}
                </MenuItem>
                <MenuItem value={2}>
                  {String(i18n.t("dashboard.filters.filterType.options.perPeriod"))}
                </MenuItem>
              </Select>
              <FormHelperText>
                {String(i18n.t("dashboard.filters.filterType.helper"))}
              </FormHelperText>
            </FormControl>
          </Grid>

          {renderFilters()}

          {/* BOTAO FILTRAR */}
          <Grid item xs={12} className={classes.alignRight}>
            <ButtonWithSpinner loading={loading} onClick={() => fetchData()} variant="contained" color="primary">
              {i18n.t("dashboard.buttons.filter")}
            </ButtonWithSpinner>
          </Grid>

          {/* USUARIOS ONLINE */}
          <Grid item xs={12}>
            {attendants.length ? (
              <TableAttendantsStatus attendants={attendants} loading={loading} />
            ) : null}
          </Grid>

          {/* TOTAL DE ATENDIMENTOS POR USUARIO */}
          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper2}>
              <ChatsUser />
            </Paper>
          </Grid>

          {/* TOTAL DE ATENDIMENTOS */}
          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper2}>
              <ChartsDate />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
