const puppeteer = require("puppeteer");

browserless = async () => {
  let browser = null;

  try {
    // If your script executes too quickly, you can add a ?pause query parameter
    // to the connect call to pause the script from running until you're watching it
    browser = await puppeteer.connect({
      browserWSEndpoint: `ws://localhost:3000`,
    });

    let pages = await browser.pages();
    let page = pages[0];
    await page.goto("https://maybank2u.com.my");

    // let usernameInput = await page.waitForSelector("#username");
    // await usernameInput.type("123123132");
  } catch (error) {
    console.log(error);
  } finally {
    // browser && browser.close();
  }
};

module.exports = browserless;
