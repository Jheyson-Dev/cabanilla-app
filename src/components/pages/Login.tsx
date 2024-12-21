import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "@/services";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { useAuthStore } from "@/store/authStore";
import { Label } from "../ui/label";

interface IFormInput {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    toast.promise(login(data.username, data.password), {
      loading: "Cargando...",
      success: (daa) => {
        setError(null);
        setUser(daa);

        console.log(daa);
        navigate("/"); // Redirige al usuario a la página de dashboard
        return "Inicio de sesión exitoso";
      },
      error: () => {
        // setError("Invalid credentials");
        return "Credenciales Invalidas";
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 p-12 bg-primary text-primary-foreground">
        <h2 className="mb-8 text-2xl font-semibold">How it works?</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary-foreground/10">
              <Download className="w-6 h-6" />
            </div>
            <p>Sign up</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary-foreground/10">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p>
              Fill in your basic details such as name and contact information
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary-foreground/10">
              <Send className="w-6 h-6" />
            </div>
            <p>Get started with the onboarding process</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center w-1/2 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Cabanilla Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2 grid-col-1">
                <Label htmlFor="username">Usuario:</Label>
                <Input
                  type="text"
                  placeholder="Username"
                  className="w-full"
                  id="username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div className="grid gap-2 grid-col-1">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-full"
                  id="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
                {error && <p className="text-red-500">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesion
              </Button>
            </form>
            {/* <p className="mt-6 text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </p> */}
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;
