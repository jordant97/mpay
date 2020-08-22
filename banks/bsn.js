const puppeteer = require("puppeteer");
const _puppeteer = require("../helper");

const bsn = async (username, password, amount) => {
    try {
        let startTime = Date.now();

        let browser = await puppeteer.launch({
            headless: false,
        });

        let page = await browser.newPage();

        const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
        const chromeUserAgent = headlessUserAgent.replace(
            "HeadlessChrome",
            "Chrome"
        );
        await page.setUserAgent(chromeUserAgent);
        await page.setExtraHTTPHeaders({
            "accept-language": "en-US,en;q=0.8",
        });

        await page.setRequestInterception(true);

        page.on("request", (req) => {
            if (
                req.resourceType() == "stylesheet" ||
                req.resourceType() == "font" ||
                req.resourceType() == "image"
            ) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto("https://www.mybsn.com.my/mybsn/login/login.do");

        // Detect when
        await page.evaluate(() => {
            window.respondToVisibility = (element, callback) => {
                var options = {
                    root: document.documentElement,
                };

                var observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        callback(entry.intersectionRatio > 0);
                    });
                }, options);

                observer.observe(element);
            };
        });

        let usernameInput = await page.waitForSelector("#username");
        await usernameInput.type(username, { delay: 50 });

        await page.waitFor(500);

        await _puppeteer.click(
            page,
            "OK Button",
            "#confirmImage"
        );

        await _puppeteer.click(
            page,
            "Yes Button",
            "#step2"
        );

        let passwordInput = await page.waitForSelector("#password", { visible: true });
        await passwordInput.type(password, { delay: 50 });

        await _puppeteer.click(
            page,
            "Login Button",
            "#step3"
        );

        await page.waitForNavigation();
        await page.waitFor(500);

        let endTime = Date.now();
        console.log((endTime - startTime) / 1000);

        await page.screenshot({ path: "./bsn.png" });
    } catch (e) {
        console.log(e);
    }
};

module.exports = bsn;
