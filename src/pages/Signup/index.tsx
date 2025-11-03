import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/Auth/AuthContext";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .required("Nome obrigatório"),
  email: Yup.string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .required("Email obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .matches(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "Senha deve conter pelo menos um número")
    .required("Senha obrigatória"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "As senhas não coincidem")
    .required("Confirmação obrigatória"),
});

const Signup: React.FC = () => {
  const { handleSignup } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { confirmPassword, ...signupData } = values;
      await handleSignup(signupData);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Criar Conta</CardTitle>
          <CardDescription>Cadastre-se para começar a usar o DIA Agent&apos;s House</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-sm text-destructive">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
