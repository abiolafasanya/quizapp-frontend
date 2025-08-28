// Auth.tsx
import { Button } from "@/components/Button";
import { useAuth } from "./useAuth";
import TextInput from "@/components/TextInput";

export default function Auth() {
  const { form, mode, onSubmit, setMode } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-around mb-4">
          <Button
            variant="ghost"
            className={`px-4 py-2 font-medium ${
              mode === "login"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 font-medium ${
              mode === "register"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* ✅ Name should be visible ONLY in register mode */}
          {mode === "register" && (
            <TextInput
              {...form.register("name")}
              label="Name"
              placeholder="Name"
              error={form.formState.errors.name}
            />
          )}
          <TextInput
            {...form.register("email")}
            label="Email"
            placeholder="Email"
            error={form.formState.errors.email}
          />
          <TextInput
            {...form.register("password")}
            label="Password"
            type="password"
            placeholder="Password"
            error={form.formState.errors.password}
          />

          <Button type="submit" className="w-full py-2 rounded-lg">
            {mode === "login" ? "Login" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
