import { expect, test } from "@playwright/test";

const cases = [
  {
    name: "OSS - 新的bagzip",
    url: "oss://coscene-playground/A - 上线必须回归文件集/需要实时更新/新的bagzip/",
    dirNames: ["A - 上线必须回归文件集", "需要实时更新", "新的bagzip"],
    timeout: 5 * 60 * 1000, // 5 minutes
    decompressBtnRow:
      "gen-8851682833.bag.zip Workflow remote-file-for-record-gmrtz run and output 1 files Active 69.0 MiB Zip 2023-06-05 15:59:16",
    bagName: "gen-8851682833.bag",
    bagStartTime: "2022-12-169:52:42.871 PM CST",
  },
];

test.describe("Unzip and play bag", () => {
  const casesNames = new Set(cases.filter((item) => item.name));

  if (casesNames.size !== cases.length) {
    throw new Error("Cases names should be unique");
  }

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
    test("Unzip and play bag" + cases[i].name, async ({ page, context }) => {
      const currentCase = cases[i];
      test.setTimeout(currentCase.timeout);

      await page.getByText("Create Record", { exact: true }).click();

      const inputElement = await page.$(
        'input[placeholder="Input record name"]'
      );

      await inputElement?.fill(
        `Unzip and play bag-${currentCase.name}-${Date.now()}`
      );

      await page.getByText("Confirm", { exact: true }).click();

      await page.getByTitle("Import File").click();

      await page.getByText("Link", { exact: true }).click();

      const inputUrlElement = await page.$(
        'input[placeholder="For example https://www.baidu.com/example.jpg"]'
      );

      await inputUrlElement?.fill(currentCase.url);

      await page.getByText("OK", { exact: true }).click();

      await page.waitForTimeout(1000);

      for (let i = 0; i < currentCase.dirNames.length; i++) {
        await page
          .getByRole("cell", { name: currentCase.dirNames[i] })
          .getByText(currentCase.dirNames[i])
          .click();
      }

      for (let i = 0; i < 10 * 60; i++) {
        const tdTagCount = await page.$$eval("tr", (tds) => tds.length);

        const activeElementCount = await page
          .getByText("Active", { exact: true })
          .all();
        const failedElementCount = await page
          .getByText("Failed", { exact: true })
          .all();

        expect(failedElementCount.length).toBe(0);

        if (activeElementCount.length === 1) {
          break;
        }

        await page.waitForTimeout(1000);
      }

      await page.locator("td:nth-child(8) > .flex").getByRole("button").click();

      await page.getByText("Decompress", { exact: true }).click();

      await page.getByText("All Files").first().click();

      for (let i = 0; i < 10 * 60; i++) {
        const tdTagCount = await page.$$eval("tr", (tds) => tds.length);

        const activeElementCount = await page
          .getByText("Active", { exact: true })
          .all();
        const failedElementCount = await page
          .getByText("Failed", { exact: true })
          .all();

        expect(failedElementCount.length).toBe(0);

        if (activeElementCount.length === 1) {
          break;
        }

        await page.waitForTimeout(1000);
      }

      const pagePromise = context.waitForEvent("page");

      await page.getByText("Play", { exact: true }).click();

      const newPage = await pagePromise;

      await expect(newPage.getByText(currentCase.bagStartTime)).toBeVisible({
        timeout: 5 * 60 * 1000,
      });
    });
  }
});
