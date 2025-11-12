import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/Auth/AuthContext";
import logoNetwork from "@/assets/logo-network.png";
import brainBg from "@/assets/brain-bg.png";
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email obrigatório"),
  password: Yup.string().min(6, "Senha deve ter no mínimo 6 caracteres").required("Senha obrigatória")
});
const Login: React.FC = () => {
  const {
    handleLogin, handleMockLogin
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
  return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${brainBg})` }}
      />
      <Card className="w-full max-w-md mx-4 relative z-10 bg-background/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logoNetwork} alt="DIA Agent's House Logo" className="w-32 h-32 object-contain" />
          </div>
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
            <Button type="button" variant="outline" className="w-full mt-2" onClick={handleMockLogin}>
              Usar Login de Teste (admin@teste.com / 123456)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default Login;