import { expect, test, type Page } from "@playwright/test";

async function registerAndCreateWorkspace(page: Page, suffix: string) {
  const email = `owner-${suffix}@example.test`;
  const password = "ClientPilot-Test-Password-2026";

  await page.goto("/en/register");
  await page.getByLabel("Name").fill(`Owner ${suffix}`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/en\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/en\/onboarding$/);

  await page.getByLabel("Workspace name").fill(`Workspace ${suffix}`);
  await page.getByLabel("Workspace slug").fill(`workspace-${suffix}`);
  await page.getByLabel("Plan").selectOption("free");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/en\/app$/);
}

test("authenticated product flow preserves workspace isolation", async ({
  browser,
  page,
  request
}) => {
  test.setTimeout(120_000);

  const suffix = `${Date.now()}-${process.pid}`;
  await registerAndCreateWorkspace(page, `primary-${suffix}`);

  await page.getByRole("link", { name: "Clients", exact: true }).click();
  await page.getByPlaceholder("Client name").fill("Acme Client");
  await page.getByPlaceholder("Email").fill("billing@acme.test");
  await page.getByRole("button", { name: "Add client" }).click();
  await expect(page.getByText("Acme Client")).toBeVisible();

  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await page.getByPlaceholder("Project name").fill("Acme Portal");
  await page.getByPlaceholder("Budget").fill("12500");
  await page
    .locator('select[name="clientId"]')
    .selectOption({ label: "Acme Client" });
  await page.getByRole("button", { name: "Create project" }).click();
  const projectLink = page.getByRole("link", { name: /Acme Portal/ });
  await expect(projectLink).toBeVisible();
  await projectLink.click();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: "project-scope.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("ClientPilot project scope")
  });
  await page.getByRole("button", { name: "Upload" }).click();
  const fileLink = page.getByRole("link", { name: /project-scope\.txt/ });
  await expect(fileLink).toBeVisible();
  const fileHref = await fileLink.getAttribute("href");
  expect(fileHref).toBeTruthy();
  const fileResponse = await page.request.get(fileHref!);
  expect(fileResponse.status()).toBe(200);
  expect(await fileResponse.text()).toBe("ClientPilot project scope");

  await page.getByRole("link", { name: "Tasks", exact: true }).click();
  await page.getByPlaceholder("Task title").fill("Security review");
  await page
    .locator('select[name="projectId"]')
    .selectOption({ label: "Acme Portal" });
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByText("Security review")).toBeVisible();

  await page.getByRole("link", { name: "Invoices", exact: true }).click();
  await page
    .locator('select[name="clientId"]')
    .selectOption({ label: "Acme Client" });
  await page
    .locator('select[name="projectId"]')
    .selectOption({ label: "Acme Portal" });
  await page.getByPlaceholder("Item").fill("Implementation milestone");
  await page.locator('input[name="quantity"]').fill("1");
  await page.locator('input[name="unitPrice"]').fill("2500");
  await page.locator('input[name="dueDate"]').fill("2026-10-01");
  await page.getByRole("button", { name: "Create invoice" }).click();
  await expect(page.getByText(/INV-00001/)).toBeVisible();

  const pdfHref = await page
    .getByRole("link", { name: "PDF" })
    .getAttribute("href");
  expect(pdfHref).toMatch(/^\/api\/invoices\/[a-f\d]{24}\/pdf$/i);
  const authenticatedPdf = await page.request.get(pdfHref!);
  expect(authenticatedPdf.status()).toBe(200);
  expect(authenticatedPdf.headers()["content-type"]).toContain(
    "application/pdf"
  );

  expect((await request.get(pdfHref!)).status()).toBe(401);
  expect((await request.post("/api/cron/overdue")).status()).toBe(401);

  const otherContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000"
  });
  const otherPage = await otherContext.newPage();
  await registerAndCreateWorkspace(otherPage, `secondary-${suffix}`);
  expect((await otherPage.request.get(pdfHref!)).status()).toBe(404);
  expect((await otherPage.request.get(fileHref!)).status()).toBe(404);
  await otherContext.close();
});
