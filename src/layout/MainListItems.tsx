import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge, Collapse, List } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import EventIcon from "@material-ui/icons/Event";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/ListAlt";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ForumIcon from "@material-ui/icons/Forum";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import { i18n } from "../translate/i18n";
import { useWhatsApps } from "../context/WhatsApp/WhatsAppsContext";
import { useAuth } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import { SocketContext } from "../context/Socket/SocketContext";
import TableChartIcon from "@material-ui/icons/TableChart";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { makeStyles } from "@material-ui/core/styles";
import { AccountTree, AllInclusive, AttachFile, DeviceHubOutlined } from "@material-ui/icons";
import usePlans from "../hooks/usePlans";
import Typography from "@material-ui/core/Typography";
import { ShapeLine } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  ListSubheader: {
    height: 26,
    marginTop: "-15px",
    marginBottom: "-10px",
  },
}));

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
  className?: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to, className } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, any>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button dense component={renderLink as any} className={className}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

interface MainListItemsProps {
  drawerClose?: () => void;
  collapsed?: boolean;
}

const MainListItems: React.FC<MainListItemsProps> = ({ drawerClose, collapsed }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { whatsApps } = useWhatsApps();
  const { user } = useAuth();
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);
  const [invisible, setInvisible] = useState(true);
  const { getPlanCompany } = usePlans();
  const [openFlowsSubmenu, setOpenFlowsSubmenu] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
    }
    if (user?.companyId) {
      fetchData();
    }
  }, [user?.companyId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats: any) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  return (
    <div onClick={drawerClose}>
      <Can
        role={user.profile}
        perform="dashboard:view"
        yes={() => (
          <ListItemLink
            to="/"
            primary="Dashboard"
            icon={<DashboardOutlinedIcon />}
          />
        )}
      />

      <ListItemLink
        to="/tickets"
        primary={String(i18n.t("mainDrawer.listItems.tickets"))}
        icon={<WhatsAppIcon />}
      />

      {showKanban && (
        <ListItemLink
          to="/kanban"
          primary="Kanban"
          icon={<TableChartIcon />}
        />
      )}

      <ListItemLink
        to="/quick-messages"
        primary={String(i18n.t("mainDrawer.listItems.quickMessages"))}
        icon={<FlashOnIcon />}
      />

      <ListItemLink
        to="/todolist"
        primary={String(i18n.t("mainDrawer.listItems.tasks"))}
        icon={<BorderColorIcon />}
      />

      <ListItemLink
        to="/contacts"
        primary={String(i18n.t("mainDrawer.listItems.contacts"))}
        icon={<ContactPhoneOutlinedIcon />}
      />

      <ListItemLink
        to="/schedules"
        primary={String(i18n.t("mainDrawer.listItems.schedules"))}
        icon={<EventIcon />}
      />

      <ListItemLink
        to="/tags"
        primary={String(i18n.t("mainDrawer.listItems.tags"))}
        icon={<LocalOfferIcon />}
      />

      <ListItemLink
        to="/chats"
        primary={String(i18n.t("mainDrawer.listItems.chats"))}
        icon={
          <Badge color="secondary" variant="dot" invisible={invisible}>
            <ForumIcon />
          </Badge>
        }
      />

      <ListItemLink
        to="/helps"
        primary={String(i18n.t("mainDrawer.listItems.helps"))}
        icon={<HelpOutlineIcon />}
      />

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20,
              }}
              inset
              color="inherit"
            >
                {String(i18n.t("mainDrawer.listItems.administration"))}
            </ListSubheader>

            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  <ListItemText primary={String(i18n.t("mainDrawer.listItems.campaigns"))} />
                  {openCampaignSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openCampaignSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem onClick={() => navigate("/campaigns")} button>
                      <ListItemIcon>
                        <ListIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listagem" />
                    </ListItem>
                    <ListItem onClick={() => navigate("/contact-lists")} button>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listas de Contatos" />
                    </ListItem>
                    <ListItem onClick={() => navigate("/campaigns-config")} button>
                      <ListItemIcon>
                        <SettingsOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Configurações" />
                    </ListItem>
                  </List>
                </Collapse>

                <ListItem button onClick={() => setOpenFlowsSubmenu((prev) => !prev)}>
                  <ListItemIcon>
                    <AccountTree />
                  </ListItemIcon>
                  <ListItemText primary={String(i18n.t("mainDrawer.listItems.flows"))} />
                  {openFlowsSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>

                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openFlowsSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem onClick={() => navigate("/phrase-lists")} button>
                      <ListItemIcon>
                        <EventAvailableIcon />
                      </ListItemIcon>
                      <ListItemText primary="Campanha" />
                    </ListItem>

                    <ListItem onClick={() => navigate("/flowbuilders")} button>
                      <ListItemIcon>
                        <ShapeLine />
                      </ListItemIcon>
                      <ListItemText primary="Conversa" />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}

            {user?.super && (
              <ListItemLink
                to="/announcements"
                primary={String(i18n.t("mainDrawer.listItems.annoucements"))}
                icon={<AnnouncementIcon />}
              />
            )}

            {showOpenAi && (
              <ListItemLink
                to="/prompts"
                primary={String(i18n.t("mainDrawer.listItems.prompts"))}
                icon={<AllInclusive />}
              />
            )}

            {showIntegrations && (
              <ListItemLink
                to="/queue-integration"
                primary={String(i18n.t("mainDrawer.listItems.queueIntegration"))}
                icon={<DeviceHubOutlined />}
              />
            )}

            <ListItemLink
              to="/connections"
              primary={String(i18n.t("mainDrawer.listItems.connections"))}
              icon={
                <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                  <SyncAltIcon />
                </Badge>
              }
            />

            <ListItemLink
              to="/files"
              primary={String(i18n.t("mainDrawer.listItems.files"))}
              icon={<AttachFile />}
            />

            <ListItemLink
              to="/queues"
              primary={String(i18n.t("mainDrawer.listItems.queues"))}
              icon={<AccountTreeOutlinedIcon />}
            />

            <ListItemLink
              to="/users"
              primary={String(i18n.t("mainDrawer.listItems.users"))}
              icon={<PeopleAltOutlinedIcon />}
            />

            {showExternalApi && (
              <ListItemLink
                to="/messages-api"
                primary={String(i18n.t("mainDrawer.listItems.messagesAPI"))}
                icon={<CodeRoundedIcon />}
              />
            )}

            <ListItemLink
              to="/financeiro"
              primary={String(i18n.t("mainDrawer.listItems.financeiro"))}
              icon={<LocalAtmIcon />}
            />

            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
            />

            {!collapsed && (
              <React.Fragment>
                <Divider />
                <Typography
                  style={{
                    fontSize: "12px",
                    padding: "10px",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  8.0.1
                </Typography>
              </React.Fragment>
            )}
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
