"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompt = require("prompt-sync");
const puppeteer_cluster_1 = require("puppeteer-cluster");
const inputtedBranch = prompt({ sigint: true })("Branch name?(Enter to skip): ");
const branch = inputtedBranch.trim() === "" ? null : inputtedBranch;
const inputtedTimeToClose = prompt({ sigint: true })("Time to autoclose in seconds (defaults to never auto close)?(Enter to skip): ");
const timeToClose = inputtedTimeToClose.trim() === "" || isNaN(Number(inputtedTimeToClose))
    ? null
    : Number(inputtedTimeToClose);
(async () => {
    // Make the browser visible by default, extend the timeout, and set a default viewport size
    const cluster = await puppeteer_cluster_1.Cluster.launch({
        concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 5,
        puppeteerOptions: {
            defaultViewport: { width: 1920, height: 1080 },
            headless: false,
            timeout: 60000,
        },
    });
    const baseUrl = "https://pp.grubhub.com";
    const branchExtension = branch ? `/?umami_version=${branch}` : "";
    const pickupSearchRoute = "/search?orderMethod=pickup&locationMode=PICKUP&facetSet=umamiV6&pageSize=20&hideHateos=true&searchMetrics=true&latitude=42.36008071&longitude=-71.05888367&geohash=drt2zp2mrgru&dinerLocation=POINT(-71.05888367 42.36008071)&radius=5&includeOffers=true&sortSetId=umamiv3&sponsoredSize=3&countOmittingTimes=true&pageNum=1&searchView=LIST";
    await cluster.task(async ({ page }) => {
        await page.goto(`${baseUrl}${branchExtension}`);
        await page.goto(`${baseUrl}${pickupSearchRoute}`);
    });
    for (let i = 0; i < 5; i++) {
        await cluster.queue({});
    }
    if (timeToClose !== null) {
        setTimeout(async () => await cluster.close(), timeToClose * 1000);
    }
})().catch((error) => {
    console.log("Script failed with the following error:");
    console.error(error);
});
