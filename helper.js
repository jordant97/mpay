async function click(page, name, selector) {
  try {
    await page.waitForSelector(selector);
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
};
