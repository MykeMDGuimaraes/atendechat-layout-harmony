import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/Auth/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email obrigatório"),
  password: Yup.string().min(6, "Senha deve ter no mínimo 6 caracteres").required("Senha obrigatória"),
});

const Login: React.FC = () => {
  const { handleLogin, handleMockLogin } = useAuth();
  const [showMockLogin, setShowMockLogin] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await handleLogin(values);
      } catch (error) {
        setShowMockLogin(true);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">DIA Agent&apos;s Home</CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-destructive">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-destructive">{formik.errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>

            {showMockLogin && (
              <Alert>
                <AlertDescription className="text-center">
                  Backend não disponível. Use o login de teste abaixo.
                </AlertDescription>
              </Alert>
            )}

            {showMockLogin && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleMockLogin}
              >
                🧪 Usar Login de Teste
              </Button>
            )}

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
