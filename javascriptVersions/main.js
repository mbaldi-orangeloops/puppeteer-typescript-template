"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const prompt = require("prompt-sync");
const inputtedBranch = prompt({ sigint: true })('Branch name?(Enter to skip): ');
const branch = inputtedBranch.trim() === "" ? null : inputtedBranch;
const inputtedTimeToClose = prompt({ sigint: true })('Time to autoclose in seconds (defaults to never auto close)?(Enter to skip): ');
const timeToClose = inputtedTimeToClose.trim() === "" || isNaN(Number(inputtedTimeToClose))
    ? null
    : Number(inputtedTimeToClose);
(async () => {
    // Make the browser visible by default, extend the timeout, and set a default viewport size
    const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1080 },
        headless: false,
        timeout: 60000,
    });
    // The browser automatically opens a page, so use that
    const page = (await browser.pages())[0];
    const baseUrl = 'https://pp.grubhub.com';
    const branchExtension = branch ? `/?umami_version=${branch}` : '';
    const pickupSearchRoute = '/search?orderMethod=pickup&locationMode=PICKUP&facetSet=umamiV6&pageSize=20&hideHateos=true&searchMetrics=true&latitude=42.36008071&longitude=-71.05888367&geohash=drt2zp2mrgru&dinerLocation=POINT(-71.05888367 42.36008071)&radius=5&includeOffers=true&sortSetId=umamiv3&sponsoredSize=3&countOmittingTimes=true&pageNum=1&searchView=LIST';
    await page.goto(`${baseUrl}${branchExtension}`);
    await page.goto(`${baseUrl}${pickupSearchRoute}`);
    if (timeToClose) {
        setTimeout(async () => await browser.close(), timeToClose * 1000);
    }
    else {
        prompt({ sigint: true })('Press any key to close');
    }
})()
    .catch((error) => {
    console.log('Script failed with the following error:');
    console.error(error);
});
