"use client";

import React, { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "@/components/ui/toast";
function page() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      await login(data);
      router.replace("/dashboard");
      toast.add({
        title: "success",
        description: "Login successfully",
      });
    } catch (error) {
      setError(error?.response?.data?.errors || error?.response?.data?.message);
      console.log(error);
      console.log(error?.response);
      console.log(error?.response?.data?.error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-lg border p-8"
        >
          <h1 className="text-4xl font-bold">Join to sent Mestry Message...</h1>
          <h1 className="text-2xl font-bold">Login account</h1>
          {error && <p className="text-red-600">{error}</p>}

          {/* email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="email"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="password"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
          <p className="text-center text-sm">
            Do not have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold underline hover:text-blue-600"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default page;
