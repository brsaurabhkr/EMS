import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

import api from "../../api/client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const Login = () => {  
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoginError("");

    try {
      const response = await api.post("/api/auth/login", data);
      const { token, role } = response.data;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate("/");
    } catch (error: any) {
      setLoginError(error.response?.data?.message || "Unable to log in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500 mt-2 mb-8">Login to EMS</p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              {...register("email")} 
              placeholder="admin@gmail.com" 
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input 
              {...register("password")} 
              type="password" 
              placeholder="••••••••" 
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
          
          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
