"use client";
import api from "../api/route";
import { usecontext } from "@/context/AuthProvider";
import React, { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import SidebarUser from "@/components/Sidebar";

function page() {
  const { user, loading, logout } = usecontext();
  const [room, setRoom] = useState(null);
  const [name, setname] = useState([]);
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      // 1. username se user dhundo
      const searchRes = await api.get(`/search?q=${data.username}`);
      const users = searchRes.data.data;
      console.log(users);
      setname(users);

      // exact username match chuno
      const found = users.find(
        (u) => u.username.toLowerCase() === data.username.trim().toLowerCase(),
      );

      if (!found) {
        toast.add({ title: "error", description: "User not found" });
        return;
      }

      // 2. uski _id se room banao
      const res = await api.post("/createRoom", { userId: found._id });
      console.log(res.data.data);

      setRoom(res.data.data);
      form.reset();
    } catch (error) {
      console.log(error);
      toast.add({
        title: "error",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <>
      <Navbar />
      <SidebarUser />
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-lg border p-8"
        >
          <h1 className="text-4xl font-bold">Join to sent Mestry Message...</h1>
          {name ? (
            name.map((naam) => <h1 key={naam}>{naam.username}</h1>)
          ) : (
            <p>here you see user</p>
          )}
          {/* {error && <p className="text-red-600">{error}</p>} */}

          {/* email */}
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
                  placeholder="email"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-full">
            search
          </Button>
        </form>
      </div>
    </>
  );
}

export default page;
