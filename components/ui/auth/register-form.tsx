"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUpSchema } from "@/lib/zod"
import CardWrapper from "./card-wrapper"
// import { Form } from "../form"
import { useState } from "react"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import z from "zod"
import { registerUser } from "@/actions/auth"

export function RegisterForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleRegister = (data: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    registerUser(data).then((res) => {
      setLoading(false);
      if (res.error) {
        setError(res.error);
      }
      if (res.success) {
        setSuccess(res.success);
      }
    });
  }

  return (
    <CardWrapper
      headerLabel="Create your account"
      title="Register"
      backButtonLabel="Back to Sign In"
      backButtonHref="/signin"
      showSocial
    >
      <form onSubmit={form.handleSubmit(handleRegister)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </Field>
          
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
            <FieldDescription>
              We&apos;ll use this to contact you.
            </FieldDescription>
          </Field>
          
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input 
              id="password" 
              type="password" 
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input 
              id="confirmPassword" 
              type="password" 
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
            )}
            <FieldDescription>
              Must be at least 8 characters long and match the password.
            </FieldDescription>
          </Field>
          
          <FormSuccess message={success} />
          <FormError message={error} />
          
          <Button className="cursor-pointer" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </FieldGroup>
      </form>
    </CardWrapper>
  )
}