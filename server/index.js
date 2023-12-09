const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { hash, sign, isVerified } = require("./script/generate.js");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "2a383368128e335cd2c1": 50, //priv e408d6a7d1554fd7367a33570490c829be905aaa6a269cd2e48ea4e81b90416e
  "5521fa5f2e6477ab9916": 75,
  "14fcdb2a6d8806a5712e": 150,
  "9de652cddf00d3c726a9": 200, // priv 80c3672235aadd046a04f4f109399162bc3278e175e5f66b1f9f24597dce2b51
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // get a signature from the client side
  // recover public address from the signature
  // the puplic address will be sender
  const { sender, amount, recipient, signature, msg } = req.body;
  console.log("Received request:", {
    sender,
    amount,
    recipient,
    signature,
    msg,
  });
  const express = require("express");
  const app = express();
  const cors = require("cors");
  const secp = require("ethereum-cryptography/secp256k1");
  const { hash, sign, isVerified } = require("./script/generate.js");
  const port = 3042;

  app.use(cors());
  app.use(express.json());

  const balances = {
    "2a383368128e335cd2c1": 50, //priv e408d6a7d1554fd7367a33570490c829be905aaa6a269cd2e48ea4e81b90416e
    "5521fa5f2e6477ab9916": 75,
    "14fcdb2a6d8806a5712e": 150,
    "9de652cddf00d3c726a9": 200, // priv 80c3672235aadd046a04f4f109399162bc3278e175e5f66b1f9f24597dce2b51
  };

  app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
  });

  app.post("/send", (req, res) => {
    // get a signature from the client side
    // recover public address from the signature
    // the puplic address will be sender
    const { sender, amount, recipient, signature, msg } = req.body;
    console.log("Received request:", {
      sender,
      amount,
      recipient,
      signature,
      msg,
    });
    const reviverS = (key, value) => {
      if (key === "r" || key === "s") {
        return BigInt(value);
      }
      return value;
    };
    const s = JSON.parse(signature, reviverS);
    let reconstructedSignature = new secp.secp256k1.Signature(
      s.r,
      s.s,
      s.recovery
    );
    let verifySignature = isVerified(reconstructedSignature, msg);
    if (verifySignature === false) {
      res.status(400).send({ message: "You are not authorize" });
      return;
    }
    setInitialBalance(sender);
    setInitialBalance(recipient);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });

  function setInitialBalance(address) {
    if (!balances[address]) {
      balances[address] = 0;
    }
  }

  const reviverS = (key, value) => {
    if (key === "r" || key === "s") {
      return BigInt(value);
    }
    return value;
  };
  const s = JSON.parse(signature, reviverS);
  let reconstructedSignature = new secp.secp256k1.Signature(
    s.r,
    s.s,
    s.recovery
  );
  let verifySignature = isVerified(reconstructedSignature, msg);
  if (verifySignature === false) {
    res.status(400).send({ message: "You are not authorize" });
    return;
  }
  setInitialBalance(sender);
  setInitialBalance(recipient);
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
