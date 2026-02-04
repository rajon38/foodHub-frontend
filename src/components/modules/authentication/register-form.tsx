"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import * as z from "zod";
import { useForm} from "@tanstack/react-form"
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
  email: z.string(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const handleGoogleLogin = async () => {
    const data = authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_FRONTEND_API || "http://localhost:3000",
    });

  };
  const form = useForm({
    defaultValues: {
      name: '',
      role: "CUSTOMER",
      email: '',
      password: '',
    },
    validators:{
      onSubmit: formSchema
    },
    onSubmit: async ({value}) => {
      const toastId = toast.loading("Creating your account...");
      try {
        const {data, error} = await authClient.signUp.email(value)

        if (error) {
          toast.error(error.message, {id: toastId});
          return;
        }
        toast.success("Account created successfully! Please check your email to verify your account.", {id: toastId});
        window.location.href = "/";
      } catch (error) {
        toast.error("Something went wrong. Please try again.", {id: toastId});
      }
    }
  });
return (
  <Card {...props} className="max-w-md mx-auto shadow-lg">
    <CardHeader className="text-center space-y-2">
      <div className="text-4xl">🍕</div>
      <CardTitle className="text-2xl font-bold">
        Join FoodHub Today
      </CardTitle>
      <CardDescription>
        Create an account to order delicious meals or serve customers
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form
        id="register-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          {/* Name */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Full Name
                  </FieldLabel>
                  <input
                    type="text"
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                    placeholder="John Doe"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />

          {/* Email */}
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Email
                  </FieldLabel>
                  <input
                    type="email"
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
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

          {/* Role */}
          <form.Field
            name="role"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    I want to join as
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
                      👨‍🍳 Provider – Sell meals
                    </option>
                  </select>

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
                  <FieldLabel htmlFor={field.name}>
                    Password
                  </FieldLabel>
                  <input
                    type="password"
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                    placeholder="At least 8 characters"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
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
        form="register-form"
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
      >
        Create FoodHub Account
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
        Sign up with Google
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        Google registration is available for <span className="font-medium">customers only</span>.
      </p>


      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-orange-600 hover:underline"
        >
          Login
        </a>
      </p>
    </CardFooter>
  </Card>
);

}