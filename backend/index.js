const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { Maybank, Public, Cimb, Bsn, Rhb, HongLeong } = require("./banks");
const session = {};

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const timeout = 180;

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

const timer = () => {
  console.log("Timer is running");
  setInterval(() => {
    if (Object.keys(session).length > 0) {
      let now = Date.now();

      Object.keys(session).forEach(async (key) => {
        let _s = session[key];
        let start = _s.bank.start;

        let timeSince = Math.round((now - start) / 1000);

        console.log(timeSince, session);
        if (timeSince > timeout + 10) {
          await _s.bank.close();
          delete session[key];
        }
      });
    }
  }, 1000);
};

const deleteBankSession = async (id) => {
  // await session[id].bank.close();
  delete session[id];
};

timer();

app.post("/new", async (req, res) => {
  let id = uuidv4();
  try {
    let { bank, amount } = req.body;

    session[id] = {
      bank: mapBankToClass(bank, amount),
    };

    session[id].bank.init(id);

    res.json({
      id,
      bank,
      amount,
    });
  } catch (e) {
    await deleteBankSession(id);

    res.json({
      code: 404,
      msg: "Cant load website",
    });
  }
});

app.post("/username", async (req, res) => {
  let { id, username } = req.body;
  try {
    let result = await session[id].bank.fillUsername(username);
    console.log(`Result: ${result}`);

    session[id].bank.addStart();
    res.json({
      code: 200,
      msg: "Successfully fill username",
    });
  } catch (e) {
    console.log(e);
    await deleteBankSession(id);
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
    await deleteBankSession(id);
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
    await deleteBankSession(id);
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
    await deleteBankSession(id);
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

app.listen(8888, () => {
  console.log("The server is listening on PORT: 8888");
});
