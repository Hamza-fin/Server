const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();

    const searchQuery = req.query.q || "ChatGPT";
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, { waitUntil: "domcontentloaded" });

    const firstResult = await page.$("h3");
    if (firstResult) {
        await firstResult.click();
        await page.waitForTimeout(5000);
        res.send("Clicked on the first search result!");
    } else {
        res.send("No results found.");
    }

    await browser.close();
});

// Start the Express server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
