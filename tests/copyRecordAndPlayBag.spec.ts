import { expect, test } from "@playwright/test";

const cases = [
  {
    nameOfTheRecordBeingCopied: "Record for testing replication",
    projectName: "e2e",
    bagStartTime: "2022-12-169:52:42.871 PM CST",
    timeout: 5 * 60 * 1000, // 5 minutes
  },
];
test.describe("Copy record and play bag", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://staging.coscene.cn/coscene-lark/e2e/records");
    await page.evaluate((jwt) => {
      localStorage.setItem("coScene_org_jwt", jwt);
      localStorage.setItem("i18nextLng", "en");
    }, process.env.CN_JWT);
    await page.goto("https://staging.coscene.cn/coscene-lark/e2e/records", {
      timeout: 3 * 60 * 1000,
    });
  });

  for (let i = 0; i < cases.length; i++) {
    const currentCase = cases[i];

    test("Copy record and play bag" + i, async ({ page, context }) => {
      test.setTimeout(currentCase.timeout);

      await page
        .getByPlaceholder("Search Name or Label")
        .fill(currentCase.nameOfTheRecordBeingCopied);

      await page.waitForTimeout(2000);

      await page.locator("td").first().getByRole("checkbox").click();

      await page.getByText("Copy Record", { exact: true }).click();

      await page
        .getByPlaceholder("Search by display name")
        .fill(currentCase.projectName);

      await page.getByText("Current Project", { exact: true }).click();

      await page.getByText("Confirm", { exact: true }).click();

      await page
        .getByPlaceholder("Search Name or Label")
        .fill(currentCase.nameOfTheRecordBeingCopied + "-copy");

      await page.waitForTimeout(2000);

      await page
        .getByText(currentCase.nameOfTheRecordBeingCopied + "-copy")
        .first()
        .click();

      await page.waitForTimeout(2000);

      await page
        .getByText(currentCase.nameOfTheRecordBeingCopied + "-copy")
        .first()
        .click();

      const pagePromise = context.waitForEvent("page");

      await page.getByText("Play", { exact: true }).click();

      const newPage = await pagePromise;

      await expect(newPage.getByText(currentCase.bagStartTime)).toBeVisible({
        timeout: 5 * 60 * 1000,
      });
    });
  }
});
