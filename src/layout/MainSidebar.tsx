import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  Tag,
  ListChecks,
  Calendar,
  FileText,
  DollarSign,
  Mail,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: MessageSquare, label: "Tickets", path: "/tickets" },
  { icon: Users, label: "Contatos", path: "/contacts" },
  { icon: Users, label: "Usuários", path: "/users" },
  { icon: ListChecks, label: "Filas", path: "/queues" },
  { icon: Tag, label: "Tags", path: "/tags" },
  { icon: Calendar, label: "Agendamentos", path: "/schedules" },
  { icon: FileText, label: "Mensagens Rápidas", path: "/quick-messages" },
  { icon: Mail, label: "API de Mensagens", path: "/messages-api" },
  { icon: DollarSign, label: "Financeiro", path: "/financeiro" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

const MainSidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <aside className="w-64 border-r bg-card overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default MainSidebar;
