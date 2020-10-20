var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

class Firebase {
  constructor() {
    this.admin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://mpay-9ce31.firebaseio.com",
    });

    this.firestore = this.admin.firestore();
  }

  verifyApi = async (apiKey) => {
    try {
      let entity = await this.firestore
        .collection("entities")
        .doc(apiKey)
        .get();

      if (entity.exists) {
        return {
          ...entity.data(),
        };
      } else {
        return false;
      }
    } catch (e) {
      throw e;
    }
  };

  verifyTransaction = async ({ apiKey, id }) => {
    try {
      let transaction = await this.firestore
        .collection(`entities/${apiKey}/transactions/${id}`)
        .get();

      if (transaction.exists) {
        return {
          ...transaction.data(),
        };
      } else {
        return false;
      }
    } catch (e) {
      throw e;
    }
  };

  newTransaction = async ({ apiKey, username, ip, bank, amount }) => {
    try {
      let isVerified = await this.verifyApi(apiKey);

      if (isVerified) {
        console.log(isVerified);
        let result = await this.firestore
          .collection(`entities/${apiKey}/transactions`)
          .add({
            entityID: apiKey,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            username,
            bank,
            amount,
            onHold: false,
            history: {
              0: admin.firestore.FieldValue.serverTimestamp(),
            },
            ip,
          });

        return result.id;
      } else {
        throw new Error("API Credentials error");
      }
    } catch (e) {
      throw e;
    }
  };

  getTransaction = async ({ apiKey, id }) => {
    let transaction = await this.firestore
      .collection(`entities/${apiKey}/transactions`)
      .doc(id)
      .get();

    return transaction.data();
  };

  subscribeToTransaction = async (transactionID) => {};

  updateTransction = async (transactionID) => {};
}

module.exports = Firebase;
