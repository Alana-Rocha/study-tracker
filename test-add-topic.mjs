import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/snap/bin/chromium", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
const logs = [];
page.on("console", (msg) => logs.push(`[console.${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));

await page.goto("http://localhost:5186/");
await page.waitForTimeout(500);

const input = page.getByPlaceholder("Adicionar tópico de estudo...").first();
await input.click();
await input.fill("Teste de tópico novo");
await page.getByLabel("Adicionar").first().click();
await page.waitForTimeout(300);

const bodyText = await page.locator("body").innerText();
console.log("CONTAINS_NEW_TOPIC:", bodyText.includes("Teste de tópico novo"));
console.log("---LOGS---");
console.log(logs.join("\n"));

await browser.close();
