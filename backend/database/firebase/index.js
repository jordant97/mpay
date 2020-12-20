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

  verifyTransaction = async ({ id }) => {
    try {
      let transaction = await this.getTransaction(id);

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

      console.log(isVerified);

      if (isVerified) {
        let now = Date.now();
        let result = await this.firestore.collection(`transactions`).add({
          entityID: apiKey,
          createdAt: now,
          username,
          bank,
          amount,
          onHold: false,
          history: [
            {
              INIT: now,
            },
          ],
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

  getTransaction = async (id) => {
    let transaction = await this.firestore
      .collection(`transactions`)
      .doc(id)
      .get();
    return transaction;
  };

  getTransactionRef = async (id) => {
    let reference = await this.firestore.collection(`transactions`).doc(id);
    return reference;
  };

  updateHistory = async ({ id, stage }) => {
    this.updateTransaction({
      id,
      data: {
        history: admin.firestore.FieldValue.arrayUnion({
          [stage]: Date.now(),
        }),
      },
    });
  };

  updateTransaction = async ({ id, data }) => {
    let ref = await this.firestore
      .collection("transactions")
      .doc(id)
      .update(data);
  };
}

module.exports = Firebase;
