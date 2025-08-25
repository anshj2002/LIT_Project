import { test, expect } from "@playwright/test"

test("profile renders and shows sections", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("Student Profile")).toBeVisible()
  await expect(page.getByText("Skills")).toBeVisible()
  await expect(page.getByText("Experience")).toBeVisible()
})

test("admin route is reachable", async ({ page }) => {
  await page.goto("/admin")
  await expect(page.getByText("Admin")).toBeVisible()
})
