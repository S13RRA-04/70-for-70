import { expect, test } from "@playwright/test";

test.describe("resource pathways", () => {
  test("hydrates a legacy shareable pathway query into the new filters", async ({ page }) => {
    await page.goto("/resources?pathway=women-veterans");

    // Legacy ?pathway= links map onto the need taxonomy and the URL is rewritten.
    await expect(page).toHaveURL(/\/resources\?need=legal$/);
    await expect(page.getByRole("button", { name: "Remove filter: Legal & benefits" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Legal & benefits/, pressed: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Learn more about Women Veterans Call Center" })).toBeVisible();
  });

  test("removes a hydrated filter from state and the URL", async ({ page }) => {
    await page.goto("/resources?pathway=women-veterans");

    const activeFilter = page.getByRole("button", { name: "Remove filter: Legal & benefits" });
    await expect(activeFilter).toBeVisible();
    await activeFilter.click();

    await expect(page).not.toHaveURL(/[?&](need|pathway)=/);
    await expect(page.getByRole("heading", { name: "Start here" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Remove filter:/ })).toHaveCount(0);
  });

  test("ranks a service-tag match ahead of broad category fallbacks", async ({ page }) => {
    // The guided flow lives on its own page and starts at the first question.
    await page.goto("/resources/guide");

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
