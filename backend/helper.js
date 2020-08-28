async function click(page, name, selector) {
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

async function retry(promiseFactory, retryCount) {
  try {
    return await promiseFactory();
  } catch (error) {
    if (retryCount <= 0) {
      throw error;
    }
    return await retry(promiseFactory, retryCount - 1);
  }
}

async function errorAppear(page, selector) {
  // const getResult = async () => {
  //   let _selector = selector;
  //   return await page.evaluate(() => {
  //     return document.querySelector(_selector).innerText;
  //   });
  // };

  return new Promise((resolve, reject) => {
    page
      .waitFor(selector, {
        timeout: 0,
      })
      .then(async (element) => {
        // let result = await getResult();

        // console.log(result);

        reject(new Error("Error Appear"));
      })
      .catch((e) => {
        console.log(e);
        resolve("No error");
      });
  });
}

async function checkExists(obj) {
  return new Promise((resolve) => {
    setInterval(() => {
      if (obj) {
        resolve(true);
      }
    }, 1000);
  });
}

/*
Code Sample

You can use the function like this:

await retry(
  () => page.waitForXPath('//*[contains(@class, ".customer_name")]/ancestor::li'),
  5 // retry this 5 times
);
You can also pass any other function returning a Promise like Promise.all:

await retry(
  () => Promise.all([
    page.goto(url),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  ]),
  1 // retry only once
);
*/

module.exports = {
  click,
  retry,
  errorAppear,
  checkExists,
};
