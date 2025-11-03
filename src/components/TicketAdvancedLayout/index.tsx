import React from "react";

interface TicketAdvancedLayoutProps {
  children: React.ReactNode;
}

const TicketAdvancedLayout: React.FC<TicketAdvancedLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {children}
    </div>
  );
};

export default TicketAdvancedLayout;
