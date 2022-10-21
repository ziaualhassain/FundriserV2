const { ethers } = require("hardhat");

async function main(){
    const factoryObject = await ethers.getContractFactory("Funding");
    const contractObject = await factoryObject.deploy(10,60,300);
    await contractObject.deployed();
    console.log("contract address :",await contractObject.address);
}

main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    });