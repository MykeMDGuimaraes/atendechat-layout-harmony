import React from "react";
import { Select, MenuItem } from "@material-ui/core";
import { i18n, changeLanguage } from "../translate/i18n";

const LanguageControl: React.FC = () => {
  const [language, setLanguage] = React.useState(i18n.language || "pt");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLanguage = event.target.value as string;
    setLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <Select value={language} onChange={handleChange} fullWidth>
      <MenuItem value="pt">Português</MenuItem>
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="es">Español</MenuItem>
    </Select>
  );
};

export default LanguageControl;
