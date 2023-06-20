import { test, expect } from "@playwright/test";

const cases = [
  {
    name: "Gaoxian - old",
    url: "https://cloud.gs-robot.com/#/robot/shared-record-list/80dcaece-c32f-48fe-8f23-769945f5ae4b/GS101-0100-T6N-C100",
    noDir: true,
  },
  {
    name: "Gaoxian - new - 0508",
    url: "https://cloud.gs-robot.com/#/robot/shared-record-list/840c03a0-fc45-498d-9497-6547e9fee7ac/GS101-0100-S5N-W000",
    noDir: true,
  },
  {
    name: "OSS - bz2 bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/压缩-bz2文件/GS_2023-01-04-20-26-19_103.bag",
  },
  {
    name: "OSS - lz4 bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/压缩-lz4文件/GS_2022-12-16-21-43-31_271.bag",
  },
  {
    name: "OSS - GSbag.active",
    url: "oss://coscene-playground/A - 上线必须回归文件集/单个active/2022-09-20-14-12-54.bag.active",
  },
  {
    name: "OSS - KNbag.active",
    url: "oss://coscene-playground/A - 上线必须回归文件集/KNbag/",
  },
  {
    name: "OSS - Gaoxian map",
    url: "oss://coscene-playground/A - 上线必须回归文件集/导入地图/GS地图导入/导入地图1/",
  },
  {
    name: "OSS - Gaoxian TF",
    url: "oss://coscene-playground/A - 上线必须回归文件集/导入静态TF/",
  },
  {
    name: "OSS - KN map",
    url: "oss://coscene-playground/A - 上线必须回归文件集/导入地图/KN地图导入/",
  },
  {
    name: "OSS - GS 存在不支持的topic",
    url: "oss://coscene-playground/A - 上线必须回归文件集/有不支持的GStopic/",
  },
  {
    name: "OSS - CyberRT",
    url: "oss://coscene-playground/A - 上线必须回归文件集/CyberRT/",
  },
  {
    name: "OSS - 12点的日志",
    url: "oss://coscene-playground/A - 上线必须回归文件集/12点的日志/",
  },
  {
    name: "OSS - 未上传完成的bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/未上传完成的bag/",
  },
  {
    name: "OSS - MCAP",
    url: "oss://coscene-playground/A - 上线必须回归文件集/MCAP/",
  },
  {
    name: "OSS - 新的bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/需要实时更新/新的bag/",
  },
  {
    name: "OSS - 新的bagzip",
    url: "oss://coscene-playground/A - 上线必须回归文件集/需要实时更新/新的bagzip/",
  },
];

const timeout = 5 * 60 * 1000;

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
  test(`Upload and play bag ${cases[i].name}`, async ({ page, context }) => {
    const currentCase = { ...cases[i], dirNames: [] };
    currentCase["dirNames"] = currentCase.url
      .split("oss://coscene-playground/")
      .pop()
      .split("/")
      .filter((item) => item);

    test.setTimeout(timeout);

    await page.getByText("Create Record", { exact: true }).click();

    const inputElement = await page.$('input[placeholder="Input record name"]');

    await inputElement?.fill("Upload and play bag-" + Date.now());

    await page.getByText("Confirm", { exact: true }).click();

    await page.getByTitle("Import File").click();

    await page.getByText("Link", { exact: true }).click();

    const inputUrlElement = await page.$(
      'input[placeholder="For example https://www.baidu.com/example.jpg"]'
    );

    await inputUrlElement?.fill(currentCase.url);

    await page.getByText("OK", { exact: true }).click();

    await page.waitForTimeout(1000);

    if (!currentCase.noDir) {
      for (let i = 0; i < currentCase.dirNames.length; i++) {
        await page
          .getByRole("cell", { name: currentCase.dirNames[i] })
          .getByText(currentCase.dirNames[i])
          .click();
      }
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

    const pagePromise = context.waitForEvent("page");

    await page.getByText("Play", { exact: true }).click();

    const newPage = await pagePromise;

    const responsePromise = newPage.waitForResponse(
      new RegExp(".*/data/getStreams")
    );

    const response = await responsePromise;

    expect(response.status()).toBe(200);
  });
}
