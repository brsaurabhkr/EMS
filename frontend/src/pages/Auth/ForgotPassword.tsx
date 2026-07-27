import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as z from "zod";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// 1. Zod Schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const ForgotPassword = () => {
  // 2. React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Send reset link to:", data.email);
    // Yahan aap apna API call logic add kar sakte hain
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        
        <h2 className="text-3xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              {...register("email")}
              placeholder="Enter your registered email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message as string}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
            Send Reset Link
          </Button>
          
          <div className="text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
              Back to Login
            </Link>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">© 2026 Employee Management System</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
