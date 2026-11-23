import { expect, test } from "@playwright/test";

test.describe("resource pathways", () => {
  test("hydrates a legacy shareable pathway query into the new filters", async ({ page }) => {
    await page.goto("/resources?pathway=women-veterans");

    // Legacy ?pathway= links map onto the need taxonomy and the URL is rewritten.
    await expect(page).toHaveURL(/\/resources\?need=legal$/);
    await expect(page.getByRole("button", { name: "Remove filter: Legal & benefits" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Legal & benefits/, pressed: true })).toBeVisible();
    // NVLSP is pinned in START_HERE_ORDER, so it stays on the first page however many legal listings are added.
    await expect(page.getByRole("link", { name: "Learn more about National Veterans Legal Services Program (NVLSP)" })).toBeVisible();
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

  test("maps newly added need pathways to focused directory filters", async ({ page }) => {
    await page.goto("/resources?pathway=digital-safety");

    await expect(page).toHaveURL(/\/resources\?need=safety$/);
    await expect(page.getByRole("button", { name: "Remove filter: Fraud & digital safety" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Fraud & digital safety/, pressed: true })).toBeVisible();
  });

  test("maps the adaptive outdoor pathway to the fitness and outdoors directory", async ({ page }) => {
    await page.goto("/resources?pathway=adaptive-outdoor-sports");

    await expect(page).toHaveURL(/\/resources\?need=fitness$/);
    await expect(page.getByRole("button", { name: "Remove filter: Fitness & outdoors" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Fitness & outdoors/, pressed: true })).toBeVisible();
  });

  test("offers a special-needs follow-up for military children and dependents", async ({ page }) => {
    await page.goto("/resources/guide");

    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "My children or dependents need support" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("button", { name: "Special medical or educational needs" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Child care or respite" })).toBeVisible();
  });

  test("offers disabled veterans a pathway into adaptive endurance and outdoor sports", async ({ page }) => {
    await page.goto("/resources/guide");

    await page.getByRole("button", { name: "Veteran" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "I want to get into adaptive sports or outdoor recreation" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("button", { name: "Triathlon, running, cycling, or swimming" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Borrow or fund adaptive equipment" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Accessible hunting or fishing" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Outdoor respite with family or a caregiver" })).toBeVisible();
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
