function p1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1000);
    }, 1000);
  });
}

function p2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(500);
    }, 500);
  });
}

function p3() {
  return new Promise(async (resolve, reject) => {
    p2()
      .then((value) => {
        reject(`Inside p3: ${value}`);
      })
      .catch(() => {
        resolve();
      });
  });
}

async function main() {
  try {
    let start = Date.now();
    let result = await Promise.race([p1(), p3()]);
    console.log(result);
    let end = Date.now();

    console.log((end - start) / 1000);
  } catch (e) {
    console.log(`This is an error: ${e}`);
  }
}

main();
