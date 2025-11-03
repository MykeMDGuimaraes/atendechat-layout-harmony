import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Container, Select } from "@material-ui/core";
import { toast } from "sonner";

import api from "@/services/api";
import { i18n } from "@/translate/i18n";
import toastError from "@/errors/toastError";
import { SocketContext } from "@/context/Socket/SocketContext";

interface Setting {
  key: string;
  value: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  settingOption: {
    marginLeft: "auto",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const Settings: React.FC = () => {
  const classes = useStyles();
  const socketManager = useContext(SocketContext);

  const [settings, setSettings] = useState<Setting[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) return;

    socketManager.on(`company-${companyId}-settings`, (data: any) => {
      if (data.action === "update") {
        setSettings((prevState) => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex((s) => s.key === data.setting.key);
          if (settingIndex !== -1) {
            aux[settingIndex].value = data.setting.value;
          }
          return aux;
        });
      }
    });

    return () => {
      socketManager.off(`company-${companyId}-settings`);
    };
  }, [socketManager]);

  const handleChangeSetting = async (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const selectedValue = e.target.value as string;
    const settingKey = e.target.name as string;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue,
      });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value || "";
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Typography variant="body2" gutterBottom>
          {i18n.t("settings.title")}
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant="body1">
            {i18n.t("settings.settings.userCreation.name")}
          </Typography>
          <Select
            margin="dense"
            variant="outlined"
            native
            id="userCreation-setting"
            name="userCreation"
            value={settings && settings.length > 0 ? getSettingValue("userCreation") : ""}
            className={classes.settingOption}
            onChange={handleChangeSetting}
          >
            <option value="enabled">
              {i18n.t("settings.settings.userCreation.options.enabled")}
            </option>
            <option value="disabled">
              {i18n.t("settings.settings.userCreation.options.disabled")}
            </option>
          </Select>
        </Paper>
      </Container>
    </div>
  );
};

export default Settings;
