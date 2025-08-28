// useAuth.ts
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "./validation";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/AuthApi";
import type { User } from "@/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Single form shape that works for both modes
type AuthFormValues = {
  name?: string; // optional for login, required by register schema
  email: string;
  password: string;
};

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authApi.login.bind(authApi),
    onSuccess: (res: { token: string; user: User }) => {
      setAuth(res.token, res.user);
      toast.success("Logged in");
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message ?? "Login failed");
      }
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authApi.register.bind(authApi),
    onSuccess: (res: { token: string; user: User }) => {
      setAuth(res.token, res.user);
      toast.success("Account created");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message ?? "Registration failed");
      }
    },
  });
}

export function useAuth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const schema = mode === "login" ? loginSchema : registerSchema;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema), // runtime schema switches per mode
    defaultValues: { name: "", email: "", password: "" },
  });

  // Optional: reset values & errors when mode changes
  useEffect(() => {
    form.reset({ name: "", email: "", password: "" });
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const onSubmit = async (values: AuthFormValues) => {
    if (mode === "login") {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      } satisfies LoginInput);
    } else {
      await registerMutation.mutateAsync({
        name: values.name ?? "",
        email: values.email,
        password: values.password,
      } satisfies RegisterInput);
    }
  };

  return { form, onSubmit, setMode, mode };
}
