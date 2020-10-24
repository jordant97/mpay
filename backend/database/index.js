const Firebase = require("./firebase");

class Database {
  constructor() {
    this.db = new Firebase();
  }

  verifyApi = (apiKey) => this.db.verifyApi(apiKey);
  verifyTransaction = ({ id }) => this.db.verifyTransaction({ id });
  newTransaction = async ({ apiKey, username, ip, bank, amount }) =>
    this.db.newTransaction({ apiKey, username, ip, bank, amount });
  getTransaction = async ({ id }) => this.db.getTransaction({ id });
}

module.exports = new Database();
