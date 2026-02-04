'use client'

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
import CardWrapper from "./card-wrapper"
// import { Form } from "../form"
import { useState } from "react"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import z from "zod"
import { signInUser } from "@/actions/auth"
import { signInSchema } from "@/lib/zod"

export function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSignin = (data: z.infer<typeof signInSchema>) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    signInUser(data).then((res) => {
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
      headerLabel="Login to your account"
      title="Sign In"
      backButtonLabel="Back to Sign Up"
      backButtonHref="/register"
      showSocial
    >
      <form onSubmit={form.handleSubmit(handleSignin)}>
        <FieldGroup>
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
          
          <FormSuccess message={success} />
          <FormError message={error} />
          
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </FieldGroup>
      </form>
    </CardWrapper>
  )
}