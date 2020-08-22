// const maybank = require("./banks/maybank");
const Maybank = require('./banks/maybank');
const bsn = require('./banks/bsn');

const main = async () => {
  const maybank = new Maybank('YSCE1234', 'Live1313.', '50');
  await maybank.init();
  await maybank.login();
  await maybank.transfer();
  await maybank.fillTac('123456');
};

main();
