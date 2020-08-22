const maybank = require("./banks/maybank");
const bsn = require('./banks/bsn');

const main = () => {

  maybank("YSCE1234", "Live1313.", "50");
  // bsn("jiasong88", 'Qwer1122@', '50');
};

main();
