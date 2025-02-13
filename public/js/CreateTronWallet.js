async function createNewWallet() {
    try {
        if (typeof window.tronWeb !== "undefined") {
            const wallet = await window.tronWeb.createAccount();
            console.log("New Wallet:", wallet);

            // Update the DOM with the new wallet details
            document.getElementById("walletAddress").innerText = wallet.address.base58;
            document.getElementById("privateKey").innerText = wallet.privateKey;
            document.getElementById("publicKey").innerText = wallet.publicKey;

            // Show the wallet details section
            document.getElementById("walletDetails").style.display = "block";
        } else {
            alert("TronLink is not installed. Please install it.");
        }
    } catch (error) {
        console.error("Error creating new wallet:", error);
        alert("Failed to create new wallet. Check the console for details.");
    }
}