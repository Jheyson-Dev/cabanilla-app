import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, MessageSquare, Send } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica de autenticación
    console.log("Email:", email);
    console.log("Password:", password);
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
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input type="email" placeholder="Email" className="w-full" />
              <Input type="text" placeholder="Username" className="w-full" />
              <Input
                type="password"
                placeholder="Password"
                className="w-full"
              />
              <Button className="w-full">Sign up</Button>
              <Button variant="outline" className="w-full">
                Sign up with Google
              </Button>
            </form>
            <p className="mt-6 text-sm text-center text-muted-foreground">
              Have an account?{" "}
              <a href="/signin" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
