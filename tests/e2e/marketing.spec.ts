import { expect, test } from "@playwright/test";

test("English marketing flow exposes the core conversion path", async ({ page }) => {
  await page.goto("/en");

  await expect(page.getByText("ClientPilot").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run your client work from one clean dashboard." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start free" }).first()).toHaveAttribute("href", "/en/register");

  await page.getByRole("link", { name: "Pricing" }).first().click();
  await expect(page).toHaveURL(/\/en\/pricing$/);
  await expect(page.getByRole("heading", { name: "Free" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pro" })).toBeVisible();
});

test("Dari marketing page renders with RTL direction", async ({ page }) => {
  await page.goto("/fa");

  await expect(page.locator('[lang="fa"][dir="rtl"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "کارهای مشتریان را از یک داشبورد منظم مدیریت کنید." })).toBeVisible();
});
