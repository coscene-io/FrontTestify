import { test, expect } from "@playwright/test";

test("login for dingding", async ({ page, context }) => {
  await page.goto("https://home.coscene.cn");
  await expect(page).toHaveURL(/.*sso.coscene.cn/);
  const loginBtn = page.getByRole("button", {
    name: "Sign in with DingTalk",
  });

  await loginBtn.click();

  await expect(page).toHaveURL(/.*login.dingtalk.com/);

  await context.addCookies([
    {
      name: "deviceid",
      value: "0349ee65b5064529b9b6272f6a1d3f35",
      domain: "login.dingtalk.com",
      path: "/",
    },
    {
      name: "account",
      value:
        "oauth_k1%3ALi5Sd4YieYRpia%2B%2FlL5STumZux4nxpgjaAE8xFXCR%2BA%2Bn8RJAH8g2v2cnYQZe1lTPo1BJRJBXsnYNyouYPYb0jp43HNOqzafTk2Nx6qivS0%3D",
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
  await page.goto("https://home.coscene.cn");
  await expect(page).toHaveURL(/.*sso.coscene.cn/);
  const loginBtn = page.getByRole("button", {
    name: "Sign in with Feishu",
  });

  await loginBtn.click();

  await expect(page).toHaveURL(/.*passport.feishu.cn/);

  await context.addCookies([
    {
      name: "session",
      value: "XN0YXJ0-0aej10d2-c69e-40fe-ac90-d8c7dfdf8084-WVuZA",
      domain: "passport.feishu.cn",
      path: "/",
    },
  ]);

  await page.goBack();

  await loginBtn.click();

  await page.getByText("Authorize", { exact: true }).click();

  await expect(page).toHaveURL(/.*home.coscene.cn/);
});
