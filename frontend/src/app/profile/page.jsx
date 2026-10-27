"use client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import api from "@/lib/api";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { Form } from "react-hook-form";
function page() {
  const { user, loading, setUser } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) router.replace("/dashboard");
  }, [user, loading, router]);

  const handlerSumbit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const oldpassword = formData.get("oldpassword");
    const newpassword = formData.get("newpassword");

    const userChagePassword = oldpassword || newpassword;

    if (userChagePassword) {
      if (!oldpassword || !newpassword) {
        const msg = "oldpassword and newPassword is required";
        setError(msg);
        toast.add({ title: "error", description: msg });
        return;
      }
    }

    try {
      const response = await api.patch("/updatepassword", {
        oldpassword,
        newpassword,
      });
      console.log(response.data.data);
      setUser(response.data.data);
      toast.add({
        title: "success",
        description: "Profile successfully updated",
      });
    } catch (error) {
      console.log(error);

      setError(
        error?.response?.data?.errors ||
          error?.response?.data?.message ||
          "Something went wrong",
      );
    }

    try {
      const res = await api.patch("/update", { username, email });
      console.log("res", res.data.data);
      setUser(res.data.data);
    } catch (error) {
      setError(
        error?.response?.data?.errors ||
          error?.response?.data?.message ||
          "Something went wrong",
      );
      toast.add({ title: "error", description: "Profile update failed" });
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-500">
      <form
        className="w-full max-w-sm"
        key={user?._id}
        onSubmit={handlerSumbit}
      >
        {error && (
          <p className="mb-4 text-xl font-medium text-red-600">{error}</p>
        )}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-name">Name</FieldLabel>
            <Input
              id="form-name"
              name="username"
              type="text"
              defaultValue={user?.username}
              placeholder="Evil Rabbit"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
              id="form-email"
              type="email"
              name="email"
              defaultValue={user?.email}
              placeholder="john@example.com"
            />
            <FieldDescription>
              We&apos;ll never share your email with anyone.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="form-password">OldPassword</FieldLabel>
            <Input
              id="form-address"
              name="oldpassword"
              type="password"
              placeholder="123 Main St"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="form-password">newPassword</FieldLabel>
            <Input
              id="form-address"
              name="newpassword"
              type="password"
              placeholder="123 Main St"
            />
          </Field>
          <Field orientation="horizontal">
            <Link href="/dashboard">
              {" "}
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default page;
