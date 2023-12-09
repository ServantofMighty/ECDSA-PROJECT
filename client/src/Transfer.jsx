import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance, senderPrivatekey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const msg = `I an sending ${sendAmount} to ${recipient}`;
    const hashmsg = keccak256(utf8ToBytes(msg));
    //console.log(senderPrivatekey);
    const signature = await secp.secp256k1.sign(hashmsg, senderPrivatekey);

    //console.log(signature);
    const replacer = (key, value) =>
      typeof value === "bigint" ? value.toString() : value;
    const signatureJSON = JSON.stringify(signature, replacer);
    //console.log(signatureJSON);
    console.log("Sending request:", {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
      signature: signatureJSON,
      msg,
    });
    try {
      //const {
      //  data: { balance },
      //}
      const response = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: signature,
        msg: msg,
      });
      console.log("response", response);
      const {
        data: { balance },
      } = response;
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          id="sendAmount"
          name="sendAmount"
          placeholder="Input the amount "
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
