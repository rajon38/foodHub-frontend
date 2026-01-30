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
      callbackURL: "http://localhost:3000",
    });

    console.log(data);
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
      } catch (error) {
        toast.error("Something went wrong. Please try again.", {id: toastId});
      }
    }
  });
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id ="register-form"
          onSubmit={(e)=>{
            e.preventDefault();
            form.handleSubmit();
          }}>
            <FieldGroup>
              <form.Field name="name" 
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <input 
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.value)} />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}/>
              <form.Field name="email" 
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <input 
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.value)} />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}/>
              <form.Field
                name="role"
                children={(field) => {
                const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as any)}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="PROVIDER">Provider</option>
                    </select>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}/>

              <form.Field name="password" 
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <input 
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.value)} />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}/>
            </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-5 justify-end">
        <Button form="register-form" type="submit" className="w-full">
          Register
        </Button>
        <Button
                  onClick={() => handleGoogleLogin()}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  Register with Google
                </Button>
      </CardFooter>
    </Card>
  )
}