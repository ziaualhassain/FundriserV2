// const {ethers,waffle } = require("hardhat");
// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { expect }=require("chai");

// //Here checking the storage slots of the contract
// describe("testing the storageTest contract",function(){

//     async function deployTokenFixture(){ 
//         [owner,addr1,addr2,addr3,addr4]=await ethers.getSigners();
//         const factoryObject = await ethers.getContractFactory("A");
//         const contractObject = await factoryObject.deploy();
//         await contractObject.deployed();
//         return {owner,addr1,addr2,contractObject};
//     }

//     it("checking addressess",async function(){
//         const  {owner,addr1,addr2,contractObject} = await loadFixture(deployTokenFixture);
//         console.log("contract address    :",await contractObject.address);
//         console.log("owner address       :",await owner.address);

//         //to get the value at the first solt
//         const provider = waffle.provider;
//         const slot0=await provider.getStorageAt(contractObject.address,0);
//         console.log("hex string at slot0 :",await provider.getStorageAt(contractObject.address,0));
//         console.log("at slot 0           :",await parseInt(slot0));

//         //to get the value at the second slot
//         const slot1 = await provider.getStorageAt(contractObject.address,1);
//         console.log("hex string at slot1 :",await provider.getStorageAt(contractObject.address,1));
//         console.log("at slot 1           :",await parseInt(slot1));

//         //calling the addElements function
//         await contractObject.addElements(30);
//         await contractObject.addElements(40);
//         await contractObject.addElements(50);
//         await contractObject.addElements(60);

//         //to get the arrays 
//         console.log("hex                 :",await provider.getStorageAt(contractObject.address,2));
//         slot2 = await provider.getStorageAt(contractObject.address,2);
//         console.log("length of array     :",await parseInt(slot2));
//         console.log("value at index[0]   :",await provider.getStorageAt(contractObject.address,await ethers.utils.keccak256(2)));
//         console.log("value at index[1]   :",await provider.getStorageAt(contractObject.address,await ethers.utils.keccak256(2+1)));
       
//     });
// }); 