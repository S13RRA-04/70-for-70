import { expect, test } from "@playwright/test";

test.describe("resource pathways", () => {
  test("hydrates a shareable pathway query", async ({ page }) => {
    await page.goto("/resources?pathway=women-veterans#browse-resources");

    const directory = page.locator("#browse-resources");
    await expect(page).toHaveURL(/\/resources\?pathway=women-veterans/);
    await expect(
      directory.getByLabel("Active filters").getByRole("button", { name: "Support for women veterans" }),
    ).toBeVisible();
    await expect(directory.locator('[data-resource-id="women-veterans-call-center"]')).toBeVisible();
  });

  test("removes a hydrated pathway from state and the URL", async ({ page }) => {
    await page.goto("/resources?pathway=women-veterans#browse-resources");

    const directory = page.locator("#browse-resources");
    const activePathway = directory
      .getByLabel("Active filters")
      .getByRole("button", { name: "Support for women veterans" });
    await expect(activePathway).toBeVisible();
    await activePathway.click();

    await expect(page).not.toHaveURL(/pathway=/);
    await expect(directory.getByRole("button", { name: "All", pressed: true }).first()).toBeVisible();
    await expect(directory.getByLabel("Active filters")).toHaveCount(0);
  });

  test("ranks a service-tag match ahead of broad category fallbacks", async ({ page }) => {
    await page.goto("/resources");

    await page.getByRole("button", { name: /^Start/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "I'm involved with the courts, jail, or reentry" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Discharge or benefits problem" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "See results" }).click();

    const firstRecommendation = page.locator('[data-analytics-event="resource_recommendation_shown"]').first();
    await expect(firstRecommendation.locator('[data-resource-id="national-veterans-legal-services-program-nvlsp"]')).toBeVisible();
    await expect(firstRecommendation).toContainText("offers the kind of help you selected");
  });
});
