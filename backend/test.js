(async () => {
  function waitFor() {
    return new Promise((resolve) => {
      let count = 0;
      let timer = setInterval(() => {
        console.log(count);
        if (count > 5) {
          resolve(timer);
        }
        count++;
      }, 1000);
    });
  }

  let result = await waitFor();
  console.log(`result: ${result}`);
  //   clearInterval(result);
})();
