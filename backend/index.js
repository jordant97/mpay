const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const Maybank = require("./banks/maybank");
const Public = require("./banks/public");
const Cimb = require("./banks/cimb");
const Bsn = require("./banks/bsn");
const Rhb = require("./banks/rhb");
const HongLeong = require("./banks/hongleong");
const session = {};

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mapBankToClass = (bank, amount) => {
  switch (bank) {
    case "mbb":
      return new Maybank(amount);
    case "pbb":
      return new Public(amount);
    case "cimb":
      return new Cimb(amount);
    case "bsn":
      return new Bsn(amount);
    default:
      return {};
  }
};

app.get("/new", async (req, res) => {
  try {
    let id = uuidv4();
    let { bank, amount } = req.body;

    session[id] = {
      bank: mapBankToClass(bank, amount),
    };

    await session[id].bank.init();

    console.log(session);

    res.json({
      id,
      bank,
      amount,
    });
  } catch (e) {
    res.json({
      code: 404,
      msg: "Cant load website",
    });
  }
});

app.post("/authenticate", async (req, res) => {
  try {
    let { id, username, password } = req.body;

    await session[id].bank.login(username, password);
    await session[id].bank.transfer();

    res.json({
      code: 200,
      msg: "Successfully request TAC",
    });
  } catch (e) {
    res.json({
      code: 400,
      msg: `Authenticate Error: ${e}`,
    });
  }
});

app.post("/tac", async (req, res) => {
  try {
    let { id, tac } = req.body;

    await session[id].bank.fillTac(tac);

    res.json({
      code: 200,
      msg: "",
      amount: session[id].bank.amount,
    });
  } catch (e) {
    res.json({
      code: 400,
      msg: `TAC Error: ${e}`,
    });
  }
});

app.post("/resendTac", async (req, res) => {
  try {
    let { id } = req.body;

    await session[id].bank.resendTac();

    res.json({
      code: 200,
      msg: "Successfully request TAC",
    });
  } catch (e) {
    res.json({
      code: 400,
      msg: e,
    });
  }
});

app.post("/retry", async (req, res) => {
  try {
    let { id } = req.body;

    await session[id].bank.retry();

    res.json({
      code: 200,
      msg: "Retry",
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