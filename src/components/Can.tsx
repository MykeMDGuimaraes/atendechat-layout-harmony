import React from "react";

interface CanProps {
  role: string;
  perform: string;
  yes: () => React.ReactNode;
  no?: () => React.ReactNode;
}

const permissions: Record<string, string[]> = {
  admin: ["dashboard:view", "drawer-admin-items:view"],
  user: [],
};

export const Can: React.FC<CanProps> = ({ role, perform, yes, no }) => {
  const userPermissions = permissions[role] || [];
  
  if (userPermissions.includes(perform)) {
    return <>{yes()}</>;
  }
  
  return no ? <>{no()}</> : null;
};
