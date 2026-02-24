import { test, expect } from "@playwright/test";

test("marketing homepage loads", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByText("ClientPilot")).toBeVisible();
});
