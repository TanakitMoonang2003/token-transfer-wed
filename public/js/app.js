const TOKEN_CONTRACT = "TH7QvSVKAc9ZbEsbVhYmWrxtepikKhTmDL";
let walletAddress = null;

async function connectToTronLink() {
    try {
        if (typeof window.tronWeb !== "undefined") {
            const currentNetwork = window.tronWeb.fullNode.host;
            console.log("Current TronLink Network:", currentNetwork);

            if (!currentNetwork.includes("nileex")) {
                document.getElementById("status").innerText = "Please switch TronLink to Nile Testnet.";
                return;
            }

            const res = await window.tronWeb.request({
                method: "tron_requestAccounts"
            });

            console.log("Response from TronLink:", res);

            if (res && res.code === 200) {
                const account = await window.tronWeb.trx.getAccount();
                if (account && account.address) {
                    walletAddress = window.tronWeb.address.fromHex(account.address);
                    document.getElementById("status").innerText = `Connected to TronLink: ${walletAddress}`;
                    document.getElementById("wallet").innerText = `Wallet: ${walletAddress}`;

                    fetchTokenBalance(walletAddress);
                } else {
                    document.getElementById("status").innerText = "No accounts found in TronLink.";
                }
            } else {
                document.getElementById("status").innerText = "Failed to connect to TronLink.";
            }
        } else {
            document.getElementById("status").innerText = "TronLink is not installed. Please install it.";
        }
    } catch (error) {
        console.error("Error connecting to TronLink:", error);
        document.getElementById("status").innerText = "Failed to connect. Check console for details.";
    }
}

async function fetchTokenBalance(walletAddress) {
    try {
        const contract = await window.tronWeb.contract().at(TOKEN_CONTRACT);
        const balance = await contract.balanceOf(walletAddress).call();
        console.log("Token Balance:", balance.toString());

        document.getElementById("balance").innerText = `Token Balance: ${window.tronWeb.toBigNumber(balance).toString()}`;
    } catch (error) {
        console.error("Error fetching token balance:", error);
        document.getElementById("balance").innerText = "Error fetching balance";
    }
}

async function transferToken() {
    try {
        if (!walletAddress) {
            alert("Please connect to TronLink first!");
            return;
        }

        const recipient = document.getElementById("recipient").value;
        const amount = document.getElementById("amount").value;

        if (!recipient || !amount) {
            alert("Please enter a valid recipient address and amount.");
            return;
        }

        const contract = await window.tronWeb.contract().at(TOKEN_CONTRACT);
        const amountToSend = window.tronWeb.toSun(amount);

        const transaction = await contract.transfer(recipient, amountToSend).send({
            feeLimit: 100_000_000,
        });

        console.log("Transaction:", transaction);
        document.getElementById("transaction").innerHTML = `✅ Transaction Successful: <a href="https://nile.tronscan.org/#/transaction/${transaction}" target="_blank">View on TronScan</a>`;

        fetchTokenBalance(walletAddress);
    } catch (error) {
        console.error("Error transferring token:", error);
        alert("Transfer failed! Check the console for details.");
    }
}
