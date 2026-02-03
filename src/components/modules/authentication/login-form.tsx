"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { useForm} from "@tanstack/react-form"
import { toast } from "sonner";
import * as z from "zod"

const formSchema = z.object({
  email: z.string(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(["ADMIN", "PROVIDER", "CUSTOMER"])
});

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const handleGoogleLogin = async () => {
    const data = authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.FRONTEND_API || "http://localhost:3000",
    });

  };
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      role: "CUSTOMER",
    },
    validators:{
      onSubmit: formSchema
    },
    onSubmit: async ({value}) => {
      const toastId = toast.loading("Logging you in...");
      try {
        const {data, error} = await authClient.signIn.email(value)

        if (error) {
          toast.error(error.message, {id: toastId});
          return;
        }
        toast.success("Logged in successfully!", {id: toastId});
        window.location.href = "/";
      } catch (error) {
        toast.error("Something went wrong. Please try again.", {id: toastId});
      }
    }
  });
return (
  <Card {...props} className="max-w-md mx-auto shadow-lg">
    <CardHeader className="text-center space-y-2">
      <div className="text-4xl">🍔</div>
      <CardTitle className="text-2xl font-bold">
        Welcome back to FoodHub
      </CardTitle>
      <CardDescription>
        Login to order delicious meals or manage your kitchen
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form
        id="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          {/* Email */}
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <input
                    type="email"
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@foodhub.com"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />

          {/* Password */}
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <input
                    type="password"
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />

          {/* Role */}
          <form.Field
            name="role"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Continue as
                  </FieldLabel>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value as any)
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                  >
                    <option value="CUSTOMER">
                      🍽️ Customer – Order food
                    </option>
                    <option value="PROVIDER">
                      👨‍🍳 Provider – Manage meals
                    </option>
                    <option value="ADMIN">
                      🛠️ Admin – Manage platform
                    </option>
                  </select>

                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </form>
    </CardContent>

    <CardFooter className="flex flex-col gap-4">
      <Button
        form="login-form"
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
      >
        Login to FoodHub
      </Button>

      <div className="relative w-full text-center text-sm text-muted-foreground">
        <span className="bg-background px-2">or</span>
      </div>

      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        type="button"
        className="w-full"
      >
        Continue with Google
      </Button>
    </CardFooter>
  </Card>
);

}
