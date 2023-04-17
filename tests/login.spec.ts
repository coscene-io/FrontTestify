import { test, expect, webkit } from "@playwright/test";
import dotenv from "dotenv";

// Read from default ".env" file.
dotenv.config();

test("login for dingding", async ({ page, context }) => {
  context.setDefaultTimeout(60000);

  await page.goto("https://home.coscene.cn");
  await expect(page).toHaveURL(/.*sso.coscene.cn/);
  const loginBtn = page.getByRole("button", {
    name: "Sign in with DingTalk",
  });

  await loginBtn.click();

  await expect(page).toHaveURL(/.*login.dingtalk.com/);

  await page.getByText("Scan with DingTalk", { exact: true }).isVisible();

  await context.addCookies([
    {
      name: "deviceid",
      value: process.env.CN_DINGDING_DEVICE_ID || "",
      domain: "login.dingtalk.com",
      path: "/",
    },
    {
      name: "account",
      value: process.env.CN_DINGDING_ACCOUNT || "",
      domain: "login.dingtalk.com",
      path: "/",
    },
  ]);

  await page.reload();

  await page.getByText("Login now").click();

  await page.getByText("coScene", { exact: true }).click();

  await expect(page).toHaveURL(/.*home.coscene.cn/);
});

test("login for Lark", async ({ page, context }) => {
  context.setDefaultTimeout(60000);

  await page.goto("https://home.coscene.cn");
  await expect(page).toHaveURL(/.*sso.coscene.cn/);
  const loginBtn = page.getByRole("button", {
    name: "Sign in with Feishu",
  });

  await loginBtn.click();

  await expect(page).toHaveURL(/.*passport.feishu.cn/);

  await page.getByText("Scan QR Code", { exact: true }).isVisible();

  await context.addCookies([
    {
      name: "session",
      value: process.env.CN_LARK_LOGIN_SESSION || "",
      domain: "passport.feishu.cn",
      path: "/",
    },
  ]);

  await page.goBack();

  await page.getByText("Sign in with Feishu", { exact: true }).isVisible();

  await loginBtn.click();

  await page.getByText("Authorize", { exact: true }).click();

  await expect(page).toHaveURL(/.*home.coscene.cn/);
});
