import { test as baseTest, expect } from "@playwright/test";
import child from "child_process";
import debug from "debug";
import * as fs from "fs";

const log = debug("testing:log");

let page;
if (!process.env.REMOTE_TEST) {
  page = [
    async ({ page }, use) => {
      await page.goto("/");
      await use(page);
      // any cleanup needed
    },
    // can set a slower timeout for the fixture while keeping the test timeout low
    { timeout: 5000 },
  ];
} else {
  page = [
    async ({ browserName }, use) => {
      const { chromium } = await import("@playwright/test");
      const browserMap = {
        chromium: "pw-chromium",
        firefox: "pw-firefox",
        webkit: "pw-webkit",
      };

      const capabilities = {
        browserName: browserMap[browserName], // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
        browserVersion: "latest",
        "LT:Options": {
          platform: browserMap[browserName] === "pw-webkit" ? "MacOS Big sur" : "Windows 10",
          build: "branch:main",
          name: `base-test-${Date.now()}`,
          user: process.env.LAMBDATEST_USER,
          accessKey: process.env.LAMBDATEST_KEY,
          network: true,
          video: false,
          console: true,
          // screenshots
          visual: true,
          // tunnel for local hosting
          tunnel: true,
          playwrightClientVersion: child
            .execSync("npx playwright --version")
            .toString()
            .trim()
            .split(" ")[1],
        },
      };

      const browser = await chromium.connect({
        wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`,
      });

      page = await browser.newPage();
      await page.goto("/");
      try {
        await use(page);
        await page.evaluate(
          () => {},
          `lambdatest_action: ${JSON.stringify({ action: "setTestStatus", arguments: { status: "passed", remark: "Title matched" } })}`
        );
      } catch (error) {
        await page.evaluate(
          () => {},
          `lambdatest_action: ${JSON.stringify({ action: "setTestStatus", arguments: { status: "failed", remark: error.stack } })}`
        );
      }

      await page.close();
      await browser.close();
    },
    // can set a slower timeout for the fixture while keeping the test timeout low
    { timeout: 40000 },
  ];
}

// test fixture
const test = baseTest.extend({
  page,
  saveLogs: [
    async ({}, use, testInfo) => {
      // Collecting logs during the test.
      const logs = [];

      log.log = (...args) => logs.push(args.map(String).join(""));
      debug.enable("testing:log");
      log("logging");

      await use();

      // After the test we can check whether the test passed or failed.
      if (testInfo.status !== testInfo.expectedStatus) {
        // outputPath() API guarantees a unique file name.
        const logFile = testInfo.outputPath("logs.txt");
        await fs.promises.writeFile(logFile, logs.join("\n"), "utf8");
        testInfo.attachments.push({ name: "logs", contentType: "text/plain", path: logFile });
      }
    },
    // forces the fixture to run for each test even if they didn't call the fixture
    { auto: true },
  ],
});

test("when page first opened, title is set to 'Simple page'", async ({ page }) => {
  log("test 1 start");
  await expect(page).toHaveTitle("Simple page");
  log("test 1 end");
});

test("when page is rendered, text element with Mark is visible", async ({ page }) => {
  log("test 3 start");
  await expect(page.getByText("Mark")).toBeVisible();
  log("test 3 end");
});

test("when button is clicked, title is updated", async ({ page }) => {
  log("test 2 start");
  await page.getByText("Click me!").click();
  await expect(page).toHaveTitle("I been clicked!");
  log("test 2 end");
});
