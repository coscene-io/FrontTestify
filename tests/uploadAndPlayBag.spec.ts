import { test, expect } from "@playwright/test";

const cases = [
  {
    name: "OSS - bz2 bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/压缩-bz2文件/GS_2023-01-04-20-26-19_103.bag",
    noDir: false,
  },
  {
    name: "OSS - lz4 bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/压缩-lz4文件/GS_2022-12-16-21-43-31_271.bag",
    noDir: false,
  },
  {
    name: "OSS - GSbag.active",
    url: "oss://coscene-playground/A - 上线必须回归文件集/单个active/2022-09-20-14-12-54.bag.active",
    noDir: false,
  },
  {
    name: "OSS - KNbag.active",
    url: "oss://coscene-playground/A - 上线必须回归文件集/KNbag/",
    noDir: false,
  },
  {
    name: "OSS - Gaoxian map",
    url: "oss://coscene-playground/A - 上线必须回归文件集/导入地图/GS地图导入/导入地图1/",
    noDir: false,
  },
  {
    name: "OSS - Gaoxian TF",
    url: "oss://coscene-playground/A - 上线必须回归文件集/导入静态TF/",
    noDir: false,
  },
  {
    name: "OSS - KN map",
    url: "oss://coscene-playground/A - 上线必须回归文件集/导入地图/KN地图导入/",
    noDir: false,
  },

  {
    name: "OSS - GS 存在不支持的topic",
    url: "oss://coscene-playground/A - 上线必须回归文件集/有不支持的GStopic/",
    noDir: false,
  },
  {
    name: "OSS - CyberRT",
    url: "oss://coscene-playground/A - 上线必须回归文件集/CyberRT/",
    noDir: false,
  },
  {
    name: "OSS - 12点的日志",
    url: "oss://coscene-playground/A - 上线必须回归文件集/12点的日志/",
    noDir: false,
  },
  {
    name: "OSS - 未上传完成的bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/未上传完成的bag/",
    noDir: false,
  },
  {
    name: "OSS - MCAP",
    url: "oss://coscene-playground/A - 上线必须回归文件集/MCAP/",
    noDir: false,
  },
  {
    name: "OSS - 新的bag",
    url: "oss://coscene-playground/A - 上线必须回归文件集/需要实时更新/新的bag/",
    noDir: false,
  },
  {
    name: "OSS - 新的bagzip",
    url: "oss://coscene-playground/A - 上线必须回归文件集/需要实时更新/新的bagzip/",
    noDir: false,
  },
  {
    name: "OSS - 单个链接-可能会过期",
    url: "https://coscene-playground.oss-cn-hangzhou.aliyuncs.com/A%20-%20%E4%B8%8A%E7%BA%BF%E5%BF%85%E9%A1%BB%E5%9B%9E%E5%BD%92%E6%96%87%E4%BB%B6%E9%9B%86/%E9%9C%80%E8%A6%81%E5%AE%9E%E6%97%B6%E6%9B%B4%E6%96%B0/%E5%8D%95%E4%B8%AAOSS%E9%93%BE%E6%8E%A5/gen-0317089039.bag?OSSAccessKeyId=LTAI5tBnf4bCLaHoQwJ5QEXH&Expires=1e%2B30&Signature=8iahnCy8vzinIfjuJVSHfvrY9lc%3D",
    noDir: false,
  },
  {
    name: "record - 单个链接-可能会过期",
    url: "https://tempo-prod-cn-shanghai-dogfish.oss-cn-shanghai.aliyuncs.com/2023/8/7/9/GS142-0120-UCM-T000/e2a1e114-2364-4513-9f21-0ce6f52e94d6/GS_2023-08-07-17-47-27_20.bag?Expires=1691492205&OSSAccessKeyId=LTAI5t6N9Z4oqKAoLT41oMyR&Signature=aOiOwgtxHU5Rw%2FhExCtb%2FEanMME%3D&response-content-type=application%2Foctet-stream",
    noDir: false,
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

    await inputElement?.fill("Upload and play bag-" + currentCase.name);

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
