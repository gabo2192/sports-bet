"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Please enter your email address.",
    })
    .min(2)
    .max(50)
    .email("This is not a valid email."),
});

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const { data } = useSession();
  console.log({ data });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await signIn("email", {
        email: values.email,
        redirect: false,
      });
      // form.reset();
      return;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <FormControl>
                <Input
                  placeholder="jhon.doe@gmail.com"
                  {...field}
                  className="col-span-3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <FormDescription
          className={cn("text-sm", {
            "text-destructive": !!form.formState.errors.email,
          })}
        >
          {(form.formState.errors.email || form.formState.errors.root) &&
            (form.formState.errors.email?.message ||
              form.formState.errors.root?.message)}
        </FormDescription>
      </form>
    </Form>
  );
}
