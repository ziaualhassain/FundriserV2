// const { ethers } = require("hardhat");
// const { time,loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


// describe("testing time based functions ",function (){
//     let startTime,endTime,goalAmt;
//     startTime =  new ethers.BigNumber.from(time.latest() + 500);
//     //startTime = time.latest() + 500;      // time.latest() method returns the latest block timestamp
//     endTime = new ethers.BigNumber.from(startTime + 1000);
//     async function deployLoadfixture(){
//         const [owner] = await ethers.getSigners();
//         const factoryObject = await ethers.getContractFactory("TimeBased");
//         const contractObject = await factoryObject.deploy(startTime,endTime);
//         return {contractObject};
//     }

//     it("testing started yet or not :",async function(){
//         const {contractObject} = await loadFixture(deployLoadfixture);

//         console.log("starting",await contractObject.hasStarted());
//         console.log("ending :",await contractObject.hasEnded());
//     });
// });
