const Firebase = require("./firebase");

class Database {
  constructor() {
    this.db = new Firebase();
  }

  verifyApi = async (apiKey) => await this.db.verifyApi(apiKey);
  verifyTransaction = async ({ id }) => await this.db.verifyTransaction({ id });
  newTransaction = async ({ apiKey, username, ip, bank, amount }) =>
    await this.db.newTransaction({ apiKey, username, ip, bank, amount });
  getTransaction = async ({ id }) => await this.db.getTransaction({ id });
  updateTransaction = async ({ id, data }) =>
    await this.db.updateTransaction({ id, data });
  updateHistory = async ({ id, stage }) =>
    await this.db.updateHistory({ id, stage });
}

module.exports = new Database();
