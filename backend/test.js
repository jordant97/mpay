function p1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hello world");
    }, 1000);
  });
}

async function main() {
  let a = "hi";
  let result = await p1().then(() => {
    console.log(a);
  });
}

main();
