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

module.exports = {
  click,
};
