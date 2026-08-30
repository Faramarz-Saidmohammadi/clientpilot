"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8)
});

type Values = z.infer<typeof schema>;

export function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations("registerForm");
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Values>({ resolver: zodResolver(schema) });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        setSubmitError("");
        try {
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
          });
          if (!res.ok) {
            setSubmitError(t("failed"));
            return;
          }
          window.location.assign(`/${locale}/login`);
        } catch {
          setSubmitError(t("failed"));
        }
      })}
    >
      <div>
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" {...register("name")} />
        {errors.name ? (
          <p className="mt-1 text-xs text-[var(--danger)]">
            {errors.name.message}
          </p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email ? (
          <p className="mt-1 text-xs text-[var(--danger)]">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password ? (
          <p className="mt-1 text-xs text-[var(--danger)]">
            {errors.password.message}
          </p>
        ) : null}
      </div>
      {submitError ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {submitError}
        </p>
      ) : null}
      <Button disabled={isSubmitting} className="w-full">
        {isSubmitting ? t("creating") : t("submit")}
      </Button>
    </form>
  );
}
