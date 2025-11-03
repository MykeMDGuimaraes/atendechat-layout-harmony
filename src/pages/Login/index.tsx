import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/Auth/AuthContext";
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email obrigatório"),
  password: Yup.string().min(6, "Senha deve ter no mínimo 6 caracteres").required("Senha obrigatória")
});
const Login: React.FC = () => {
  const {
    handleLogin
  } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema,
    onSubmit: async values => {
      await handleLogin(values);
    }
  });
  return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">DIA Agent's House</CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" {...formik.getFieldProps("email")} />
              {formik.touched.email && formik.errors.email && <p className="text-sm text-destructive">{formik.errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" {...formik.getFieldProps("password")} />
              {formik.touched.password && formik.errors.password && <p className="text-sm text-destructive">{formik.errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default Login;