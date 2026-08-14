import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/snap/bin/chromium", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
const logs = [];
page.on("console", (msg) => logs.push(`[console.${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));

await page.goto("http://localhost:5187/");
await page.waitForTimeout(500);

const inputs = page.getByPlaceholder("Adicionar tópico de estudo...");
console.log("num inputs:", await inputs.count());

// Simulate real typing (char by char) then Enter, on the FIRST subject card
const input0 = inputs.nth(0);
await input0.click();
await input0.type("Digitado via teclado", { delay: 30 });
await page.keyboard.press("Enter");
await page.waitForTimeout(300);

let bodyText = await page.locator("body").innerText();
console.log("Enter worked (1st card):", bodyText.includes("Digitado via teclado"));

// Now try the SECOND subject card's add button (not first)
const input1 = inputs.nth(1);
await input1.click();
await input1.type("Topico segundo card", { delay: 30 });
const addButtons = page.getByLabel("Adicionar");
console.log("num add buttons:", await addButtons.count());
await addButtons.nth(1).click();
await page.waitForTimeout(300);

bodyText = await page.locator("body").innerText();
console.log("Button worked (2nd card):", bodyText.includes("Topico segundo card"));

console.log("---LOGS---");
console.log(logs.join("\n"));

await browser.close();
