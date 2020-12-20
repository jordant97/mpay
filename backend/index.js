require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const requestIp = require("request-ip");
const { Maybank, Public, Cimb, Bsn, Rhb, HongLeong, data } = require("./banks");
const database = require("./database");
const e = require("express");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const session = {};

const port = process.env.PORT || 8888;

const mapBankToClass = (bank, amount) => {
  switch (bank.toLowerCase()) {
    case "mbb":
      return new Maybank(amount);
    case "pbe":
      return new Public(amount);
    case "cimb":
      return new Cimb(amount);
    case "bsn":
      return new Bsn(amount);
    case "rhb":
      return new Rhb(amount);
    case "hlb":
      return new HongLeong(amount);
    default:
      return {};
  }
};

const sessionValid = (id) => {
  if (session[id]) {
    console.log(session[id]);
    if (
      session[id].starts[session[id].starts.length - 1] + 200000 >
      Date.now()
    ) {
      deleteBankSession(id);
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const deleteBankSession = async (id) => {
  await session[id].bank.close();
  delete session[id];
};

app.use((req, res, next) => {
  req.ipp = requestIp.getClientIp(res);
  console.log(req.ip);
  next();
});

// API
app.get("/new", async (req, res) => {
  let { apiKey, bank, amount, username } = req.body;

  try {
    let apiVerified = await database.verifyApi(apiKey);

    if (apiVerified) {
      console.log(apiVerified);
      let transactionID = await database.newTransaction({
        apiKey,
        bank,
        username,
        amount,
        ip: req.ip,
      });

      res.json({
        id: transactionID,
      });
    }
  } catch (e) {}
});

app.post("/transaction/:id", async (req, res) => {
  // check to see whether transaction exist
  let { id } = req.params;

  try {
    let transaction = await database.verifyTransaction({ id });

    if (transaction) {
      let { bank, amount, history } = transaction;

      console.log(history[0]["INIT"]);

      session[id] = {
        bank: mapBankToClass(bank, amount),
      };

      // Load website here
      session[id].bank.init(id);

      console.log(session);

      res.json({
        code: 200,
        data: {
          ...transaction,
        },
      });
    } else {
      res.json({
        code: 400,
      });
      console.log("Transaction not found");
    }
  } catch (e) {
    console.log(e);
  }

  // try {
  //   let transaction = database.verifyTransaction(id);

  //   if (transaction) {
  //     let { bank, amount } = transaction;
  //   }
  //   let { bank, amount } = req.body;

  //   session[id] = {
  //     bank: mapBankToClass(bank, amount),
  //   };

  //   session[id].bank.init(id);

  //   console.log(session);

  //   res.json({
  //     id,
  //     bank,
  //     amount,
  //   });
  // } catch (e) {
  //   // await deleteBankSession(id);

  //   res.json({
  //     code: 404,
  //     msg: "Cant load website",
  //   });
  // }
});

app.post("/username", async (req, res) => {
  let { id, username } = req.body;
  try {
    await session[id].bank.waitForBrowser();
    await session[id].bank.fillUsername(username);

    session[id].bank.addStart();
    res.json({
      code: 200,
      msg: "Successfully fill username",
    });
  } catch (e) {
    console.log(e);
    // await deleteBankSession(id);
    res.json({
      code: 400,
      msg: `Fill Username Error: ${e}`,
    });
  }
});

app.post("/authenticate", async (req, res) => {
  let { id, password } = req.body;
  try {
    await session[id].bank.login(password);
    let result = await session[id].bank.transfer();

    session[id].bank.addStart();

    res.json({
      code: 200,
      msg: "Successfully request TAC",
      phoneNumber: result.phoneNumber,
      date: result.date,
    });
  } catch (e) {
    // await deleteBankSession(id);
    res.json({
      code: 400,
      msg: `Authenticate Error: ${e}`,
    });
  }
});

app.post("/tac", async (req, res) => {
  let { id, tac } = req.body;
  try {
    let result = await session[id].bank.fillTac(tac);

    if (result.toUpperCase() == "TRANSACTION UNSUCCESSFUL") {
      console.log("Fail");

      res.json({
        code: 300,
        msg: "Transfer Unsuccessful",
        amount: session[id].bank.amount,
      });
    } else {
      console.log("Success");

      res.json({
        code: 200,
        msg: "Transfer Successfully",
        amount: session[id].bank.amount,
      });
    }
  } catch (e) {
    // await deleteBankSession(id);
    res.json({
      code: 400,
      msg: `TAC Error: ${e}`,
    });
  }
});

app.post("/resendTac", async (req, res) => {
  let { id } = req.body;
  try {
    await session[id].bank.resendTac();

    res.json({
      code: 200,
      msg: "Successfully request TAC",
    });
  } catch (e) {
    // await deleteBankSession(id);
    res.json({
      code: 400,
      msg: e,
    });
  }
});

app.post("/retry", async (req, res) => {
  let { id } = req.body;
  try {
    await session[id].bank.retry();

    res.json({
      code: 200,
      msg: "Retry",
    });
  } catch (e) {
    await deleteBankSession(id);
    res.json({
      code: 400,
      msg: e,
    });
  }
});

app.post("/close", async (req, res) => {
  let { id } = req.body;
  try {
    await session[id].bank.close();
    delete session[id];

    res.json({
      code: 200,
      msg: `Done closing session: ${id}`,
    });
  } catch (e) {
    res.json({
      code: 400,
      msg: e,
    });
  }
});

app.listen(port, async () => {
  console.log(`The server is listening on PORT: ${port}`);
  let id = await database.newTransaction({
    username: "test123",
    amount: "1",
    bank: "MBB",
    apiKey: "XUE5M1z7GMpQV4jQ3Vq1",
    ip: "12312313",
  });

  console.log(id);
});
