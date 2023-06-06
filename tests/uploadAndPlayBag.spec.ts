import { test, expect } from "@playwright/test";

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

test("Upload and play bag", async ({ page, context }) => {
  test.setTimeout(5 * 60 * 1000);

  await page.getByText("Create Record", { exact: true }).click();

  const inputElement = await page.$('input[placeholder="Input record name"]');

  await inputElement?.fill("Upload and play bag-" + Date.now());

  await page.getByText("Confirm", { exact: true }).click();

  await page.getByTitle("Import File").click();

  await page.getByText("Link", { exact: true }).click();

  const inputUrlElement = await page.$(
    'input[placeholder="For example https://www.baidu.com/example.jpg"]'
  );

  await inputUrlElement?.fill(
    "oss://coscene-playground/A - 上线必须回归文件集/压缩-bz2文件/GS_2023-01-04-20-26-19_103.bag"
  );

  await page.getByText("OK", { exact: true }).click();

  await page.waitForTimeout(1000);

  await page
    .getByRole("cell", { name: "A - 上线必须回归文件集" })
    .getByText("A - 上线必须回归文件集")
    .click();

  await page
    .getByRole("cell", { name: "压缩-bz2文件" })
    .getByText("压缩-bz2文件")
    .click();

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

  await expect(newPage.getByText("2023-01-048:26:19.319 PM CST")).toBeVisible({
    timeout: 5 * 60 * 1000,
  });
});

const cases = [
  {
    name: "OSS - 新的bagzip",
    url: "oss://coscene-playground/A - 上线必须回归文件集/需要实时更新/新的bagzip/",
  },
];
