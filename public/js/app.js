const TOKEN_CONTRACT = "TH7QvSVKAc9ZbEsbVhYmWrxtepikKhTmDL";

let walletAddress = null;

// Helper function to validate the network
function isNileTestnet(networkUrl) {
    return networkUrl.includes("nileex");
}

// Helper function to validate TRON addresses
function isValidTronAddress(address) {
    return window.tronWeb.isAddress(address);
}

async function connectToTronLink() {
    try {
        if (typeof window.tronWeb === "undefined") {
            document.getElementById("status").innerText = "TronLink is not installed. Please install it.";
            alert("Please install TronLink extension and try again.");
            return;
        }

        const currentNetwork = window.tronWeb.fullNode.host;
        console.log("Current TronLink Network:", currentNetwork);

        // Validate network
        if (!isNileTestnet(currentNetwork)) {
            document.getElementById("status").innerText = "Please switch TronLink to Nile Testnet.";
            return;
        }

        // Request accounts
        const res = await window.tronWeb.request({
            method: "tron_requestAccounts"
        });

        console.log("Response from TronLink:", res);

        if (res && res.code === 200) {
            const address = window.tronWeb.defaultAddress.base58;
            console.log("TronLink Account Address:", address);

            if (address) {
                walletAddress = address;
                document.getElementById("status").innerText = `Connected to TronLink: ${walletAddress}`;
                document.getElementById("wallet").innerText = `Wallet: ${walletAddress}`;

                // Fetch token balance
                await fetchTokenBalance(walletAddress);
            } else {
                document.getElementById("status").innerText = "No accounts found in TronLink. Please ensure you've logged in.";
            }
        } else {
            document.getElementById("status").innerText = "Failed to connect to TronLink. Please ensure TronLink is unlocked and logged in.";
        }
    } catch (error) {
        console.error("Error connecting to TronLink:", error);
        document.getElementById("status").innerText = "Failed to connect. Check console for details.";
        alert("Error connecting to TronLink. Check the console for details.");
    }
}

async function fetchTokenBalance(walletAddress) {
    try {
        const contract = await window.tronWeb.contract().at(TOKEN_CONTRACT);
        const balance = await contract.balanceOf(walletAddress).call();
        const formattedBalance = window.tronWeb.toBigNumber(balance).toString();

        console.log("Token Balance:", formattedBalance);
        document.getElementById("balance").innerText = `Token Balance: ${formattedBalance}`;
    } catch (error) {
        console.error("Error fetching token balance:", error);
        document.getElementById("balance").innerText = "Error fetching balance";
        alert("Error fetching token balance. Check the console for details.");
    }
}

async function transferToken() {
    try {
        if (!walletAddress) {
            alert("Please connect to TronLink first!");
            return;
        }

        const recipient = document.getElementById("recipient").value.trim();
        const amount = document.getElementById("amount").value.trim();

        // Validate inputs
        if (!recipient || !amount) {
            alert("Please enter a valid recipient address and amount.");
            return;
        }

        if (!isValidTronAddress(recipient)) {
            alert("Invalid recipient address. Please check and try again.");
            return;
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }

        // Disable button and show loading state
        const transferButton = document.getElementById("transferButton");
        if (!transferButton) {
            console.error("Transfer button not found in the DOM.");
            return;
        }
        transferButton.disabled = true;
        transferButton.innerText = "Processing...";

        const contract = await window.tronWeb.contract().at(TOKEN_CONTRACT);
        const amountToSend = window.tronWeb.toSun(amount); // Convert to smallest unit (sun)

        // Send transaction
        const transaction = await contract.transfer(recipient, amountToSend).send({
            feeLimit: 100_000_000,
        });

        console.log("Transaction:", transaction);
        document.getElementById("transaction").innerHTML = `✅ Transaction Successful: <a href="https://nile.tronscan.org/#/transaction/${transaction}" target="_blank">View on TronScan</a>`;

        // Re-fetch balance after transfer
        await fetchTokenBalance(walletAddress);
    } catch (error) {
        console.error("Error transferring token:", error);
        if (error.message.includes("insufficient balance")) {
            alert("Insufficient balance to complete the transaction.");
        } else {
            alert("Transfer failed! Check the console for details.");
        }
    } finally {
        // Re-enable button
        const transferButton = document.getElementById("transferButton");
        if (transferButton) {
            transferButton.disabled = false;
            transferButton.innerText = "Transfer Tokens";
        }
    }
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded. Initializing TronLink integration...");
});