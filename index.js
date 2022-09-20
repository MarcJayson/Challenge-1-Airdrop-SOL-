// Import Solana web3 functinalities chapter 1
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

const getWalletBalance = async (publicKey) => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        const walletBalance = await connection.getBalance(new PublicKey(publicKey));
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async (publicKey) => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Request airdrop of 2 SOL to the wallet
        const solAmount = 2;
        console.log("Airdropping some SOL to the wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(publicKey),
            solAmount * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

function getArgInput()
{
    const input = process.argv[2];

    if(!input || input.trim().length === 0)
    {
        console.log("No arguments parsed. Provide wallet's public address and try again.");
        return "";
    }
    
    return input;
}

function isValidAddress(publicKey)
{
    let address;
    
    try
    {
        address = new PublicKey(publicKey);

        if(!PublicKey.isOnCurve(address))
        {
            console.log("Specified address (public key) doesn't exist");
            return false;
        }
    }
    catch(err)
    {
        console.log("Invalid address(public key) format")
        return false;
    }

    return true;
}

const mainFunction = async () => {
    
    const publicKey = getArgInput();
    
    //check if method didn't return empty string
    if(!publicKey)return;   

    //check if public key is valid
    if(!isValidAddress(publicKey))return;

    //aidrop sol on specified address
    await getWalletBalance(publicKey);
    await airDropSol(publicKey);
    await getWalletBalance(publicKey);
}

mainFunction();