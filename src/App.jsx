import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

function App() {
  const [text, setText] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum && window.ethereum.isMetaMask && window.ethereum.selectedAddress) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        await tx.wait();
        alert("Message set successfully!");
      } else {
        alert("Please install and use MetaMask only.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || "Unexpected error");
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const message = await contract.getMessage();
        setFetchedMessage(message);
      } else {
        alert("Please install and use MetaMask only.");
      }
    } catch (error) {
      console.error("Error fetching message:", error);
      alert(error.message || "Unexpected error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set and GetBack Message</h1>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleSet}>Set Message</button>
      <br />
      <br />
      <button onClick={handleGet}>Get Message set</button>
      {fetchedMessage && (
        <div>
          <h3>Fetched Message:</h3>
          <p>{fetchedMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;
