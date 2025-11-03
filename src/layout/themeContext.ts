import { createContext } from "react";

interface ColorModeContextType {
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<{ colorMode: ColorModeContextType }>({
  colorMode: {
    toggleColorMode: () => {},
  },
});

export default ColorModeContext;
