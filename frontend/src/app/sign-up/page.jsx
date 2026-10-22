"use client";
import { toast } from "@/components/ui/toast";
import React, { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { usecontext } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
function page() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [ButtonDisable, setButtonDisable] = useState(false);
  const { register } = usecontext();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await register(data);
      router.replace("/dashboard");
      toast.add({
        title: "success",
        description: "sign-up successfully",
      });
    } catch (error) {
      console.log(error);
      console.log(error.response);

      setError(error.response?.data?.errors || error?.response?.data?.message);
      toast.add({ title: "error", description: "signup failed" });
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
          <h1 className="text-2xl font-bold">Create account</h1>
          {error && <p className="text-red-600">{error}</p>}
          {/* //username */}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>username</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="username"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Sign up"}
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold underline hover:text-blue-600"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default page;
