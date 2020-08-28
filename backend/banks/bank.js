class Bank {
  constructor(browser, page, link, amount) {
    this.browser = browser;
    this.page = page;
    this.link = link;
    this.amount = amount;
  }

  async goTo() {
    try {
      await this.page.goto(this.link);
    } catch (e) {
      throw `Maybank GoTo: ${e.stack}`;
    }
  }

  async click(page, name, selector) {
    try {
      await page.waitForSelector(selector);
      await page.waitFor(200);
      await page.evaluate((selector) => {
        document.querySelector(selector).click();
      }, selector);
      await page.waitFor(500);
    } catch (e) {
      throw Error(`${name}: ${e}`);
    }
  }

  async retry(promiseFactory, retryCount) {
    try {
      return await promiseFactory();
    } catch (error) {
      if (retryCount <= 0) {
        throw error;
      }
      return await retry(promiseFactory, retryCount - 1);
    }
  }

  async errorAppear(page, selector) {
    return new Promise((resolve, reject) => {
      page
        .waitFor(selector, {
          timeout: 0,
        })
        .then(async (element) => {
          reject(new Error("Error Appear"));
        })
        .catch((e) => {
          console.log(e);
          resolve("No error");
        });
    });
  }

  async checkExists(obj) {
    return new Promise((resolve) => {
      setInterval(() => {
        if (obj) {
          resolve(true);
        }
      }, 1000);
    });
  }

  async close() {
    await this.browser.close();
  }
}

export default Bank;
