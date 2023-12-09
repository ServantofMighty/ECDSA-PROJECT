const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privatekey = secp.secp256k1.utils.randomPrivateKey();
//console.log(toHex(privatekey));
const publickey = secp.secp256k1.getPublicKey(privatekey);
//console.log(publickey);
const address = toHex(keccak256(publickey)).slice(-20);
//console.log(address);
const msg = "I want to send ...";

function hash(message) {
  return keccak256(utf8ToBytes(message));
}

//const msghash = hash(msg);
//console.log(msghash);
//const signature = secp.secp256k1.sign(msghash, privatekey);
//console.log(signature);
//const recoveredkey = signature.recoverPublicKey(msghash).toRawBytes();
///console.log(toHex(recoveredkey) === toHex(publickey));
//const verified = secp.secp256k1.verify(signature, msghash, recoveredkey);
//console.log(verified);
function sign(key, msg) {
  const msgHash = hash(msg);
  return secp.secp256k1.sign(msgHash, key);
}
const signature = sign(privatekey, msg);
//console.log(signature);
function isVerified(signature, msg) {
  const msgHash = hash(msg);
  const recoveredkey = signature.recoverPublicKey(msgHash).toRawBytes();
  //console.log(recoveredkey);
  return secp.secp256k1.verify(signature, msgHash, recoveredkey);
}
//console.log(isVerified(signature, msg));
module.exports = { hash, sign, isVerified };
