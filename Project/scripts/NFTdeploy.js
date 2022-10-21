const { ethers } = require("hardhat");

async function main(){
    const factoryObject = await ethers.getContractFactory("NFT");
    const contractObject = await factoryObject.deploy("QmbHmu3hPzhLSzMwksCYzVNcCMTVZ9g8NuQ427Z671griM");
    await contractObject.deployed();
    console.log("contract address :",contractObject.address);
}

main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    });