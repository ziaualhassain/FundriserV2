const { ethers } = require("hardhat");

async function main(){
    const factoryObject = await ethers.getContractFactory("NFTMarketplace");
    const contractObject = await factoryObject.deploy();
    await contractObject.deployed();
    console.log("contract address :",contractObject.address);
}

main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    });