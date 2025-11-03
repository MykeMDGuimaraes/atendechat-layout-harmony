import React, { useState, useEffect, useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import { ptBR, enUS, esES } from "@material-ui/core/locale";

import ColorModeContext from "./layout/themeContext";
import { SocketContext, SocketManager } from "./context/Socket/SocketContext";
import { AuthProvider } from "./context/Auth/AuthContext";
import { TicketsContextProvider } from "./context/Tickets/TicketsContext";
import { WhatsAppsProvider } from "./context/WhatsApp/WhatsAppsContext";

import PrivateRoute from "./routes/Route";
import LoggedInLayout from "./layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TicketsCustom from "./pages/TicketsCustom";
import TicketsAdvanced from "./pages/TicketsAdvanced";
import Connections from "./pages/Connections";
import Contacts from "./pages/Contacts";

const queryClient = new QueryClient();

const App = () => {
  const [locale, setLocale] = useState();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredTheme = window.localStorage.getItem("preferredTheme");
  const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = createTheme(
    {
      palette: {
        type: mode,
        primary: { main: mode === "light" ? "#682EE3" : "#FFFFFF" },
        textPrimary: mode === "light" ? "#682EE3" : "#FFFFFF",
        borderPrimary: mode === "light" ? "#682EE3" : "#FFFFFF",
        dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
        light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
      },
      mode,
    } as any,
    locale
  );

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    const browserLocale = i18nlocale?.substring(0, 2) ?? "pt";

    if (browserLocale === "pt") {
      setLocale(ptBR as any);
    } else if (browserLocale === "en") {
      setLocale(enUS as any);
    } else if (browserLocale === "es") {
      setLocale(esES as any);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("preferredTheme", mode);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <SocketContext.Provider value={SocketManager}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AuthProvider>
                  <TicketsContextProvider>
                    <Routes>
                      {/* Public Routes */}
                      <Route
                        path="/login"
                        element={
                          <PrivateRoute isPrivate={false}>
                            <Login />
                          </PrivateRoute>
                        }
                      />

                      {/* Private Routes */}
                      <Route
                        path="/"
                        element={
                          <PrivateRoute isPrivate={true}>
                            <WhatsAppsProvider>
                              <LoggedInLayout />
                            </WhatsAppsProvider>
                          </PrivateRoute>
                        }
                      >
                        <Route index element={<Dashboard />} />
                        <Route path="/tickets" element={<TicketsCustom />} />
                        <Route path="/tickets/:ticketId" element={<TicketsCustom />} />
                        <Route path="/connections" element={<Connections />} />
                        <Route path="/contacts" element={<Contacts />} />
                      </Route>

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TicketsContextProvider>
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </SocketContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
