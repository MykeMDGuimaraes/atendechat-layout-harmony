import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";

interface ButtonWithSpinnerProps extends ButtonProps {
  loading?: boolean;
}

const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  loading = false,
  children,
  disabled,
  ...rest
}) => {
  return (
    <Button {...rest} disabled={disabled || loading}>
      {loading ? <CircularProgress size={24} /> : children}
    </Button>
  );
};

export default ButtonWithSpinner;
