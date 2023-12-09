const secp = require("ethereum-cryptography/secp256k1");
const { hash, sign, isVerified } = require("./generate.js");
const privatekey = secp.secp256k1.utils.randomPrivateKey();
const message = "i am";

const signature = sign(privatekey, message);
console.log(signature);
const replacer = (key, value) =>
  typeof value === "bigint" ? value.toString() : value;

const signatureJSON = JSON.stringify(signature, replacer);
console.log(signatureJSON);
const reviverS = (key, value) => {
  if (key === "r" || key === "s") {
    return BigInt(value);
  }
  return value;
};
const s = JSON.parse(signatureJSON, reviverS);
console.log(s);
let reconstructedSignature = new secp.secp256k1.Signature(s.r, s.s, s.recovery);
console.log(reconstructedSignature);
const test = isVerified(signature, message);
const test1 = isVerified(reconstructedSignature, message);
console.log(test, test1);
