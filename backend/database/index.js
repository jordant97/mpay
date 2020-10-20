const Firebase = require("./firebase");

class Database {
  constructor() {
    this.db = new Firebase();
  }

  verifyApi = (apiKey) => this.db.verifyApi(apiKey);
  verifyTransaction = ({ apiKey, id }) =>
    this.db.verifyTransaction({ apiKey, id });
  newTransaction = async ({ apiKey, username, ip, bank, amount }) =>
    this.db.newTransaction({ apiKey, username, ip, bank, amount });
  getTransaction = async ({ apiKey, id }) =>
    this.db.getTransaction({ apiKey, id });
}

module.exports = new Firebase();
