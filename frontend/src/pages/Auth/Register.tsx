import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as z from "zod";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Validation Schema
const registerSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">       

        <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mt-2 mb-8">Sign up for Employee Management System</p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="space-y-2">
            <Label>Username</Label>
            <Input 
              {...register("username")} 
              placeholder="Enter your username" 
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message as string}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              {...register("email")} 
              placeholder="Enter your email" 
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Input 
              {...register("password")} 
              type="password" 
              placeholder="Enter your password" 
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Register
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">© 2026 Employee Management System</p>
      </div>
    </div>
  );
};

export default Register;
