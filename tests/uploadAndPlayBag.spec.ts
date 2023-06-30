import { test, expect } from "@playwright/test";

const cases = [
  // {
  //   name: "Gaoxian - old",
  //   url: "https://cloud.gs-robot.com/#/robot/shared-record-list/80dcaece-c32f-48fe-8f23-769945f5ae4b/GS101-0100-T6N-C100",
  //   noDir: true,
  // },
  // {
  //   name: "Gaoxian - new - 0508",
  //   url: "https://cloud.gs-robot.com/#/robot/shared-record-list/840c03a0-fc45-498d-9497-6547e9fee7ac/GS101-0100-S5N-W000",
  //   noDir: true,
  // },
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
    name: "GS-new",
    url: "https://tempo-prod-cn-shanghai-dogfish.oss-cn-shanghai.aliyuncs.com/2023/6/28/21/GS100-0210-77N-F000/e59e46b8-6541-4e57-b727-618bb9bafef5/GS_2023-06-29-05-11-59_313.bag?Expires=1688052199&OSSAccessKeyId=LTAI5t6N9Z4oqKAoLT41oMyR&Signature=bavfFMtMsClaCGpGgiB3oNOeJjc%3D&response-content-type=application%2Foctet-stream",
    noDir: false,
  },
  {
    name: "record - 单个链接",
    url: "https://storage-cn-hangzhou.staging.coscene.cn/default/blobs/da992666f3af3cb81877d5a00b1adbf2639ec4f46126d330b9c2da05fafa45c5?X-Amz-Checksum-Sha256=da992666f3af3cb81877d5a00b1adbf2639ec4f46126d330b9c2da05fafa45c5&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=coscene%2F20230629%2Fcn-hangzhou%2Fs3%2Faws4_request&X-Amz-Date=20230629T072025Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=5457d30e0a5595cc7550e1bcdf1fab0653ab1ce7db35f2483342fa3615689f3f&X-Amz-Tagging=x-cos-organization-id%3Dcf746e23-3210-4b8f-bdfa-fb771d1ac87c%26x-cos-user-id%3D4c3fe4a5-b86d-441d-b237-eb2b4ecd9139&response-content-disposition=attachment%3B%20filename%3D001.bag",
    noDir: false,
  },
  // {
  //   name: "OSS - 单个链接",
  //   url: "https://coscene-playground.oss-cn-hangzhou.aliyuncs.com/A%20-%20%E4%B8%8A%E7%BA%BF%E5%BF%85%E9%A1%BB%E5%9B%9E%E5%BD%92%E6%96%87%E4%BB%B6%E9%9B%86/12%E7%82%B9%E7%9A%84%E6%97%A5%E5%BF%97/GS_2023-04-01-12-54-31_0.bag?OSSAccessKeyId=LTAI5tBnf4bCLaHoQwJ5QEXH&Expires=1688390932&Signature=LGQ3UB9hLafZSh5c9%2FP4DXJ6aoU%3D",
  // },
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
