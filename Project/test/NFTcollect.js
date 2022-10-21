// const { ethers }=require("hardhat");
// const { expect }=require("chai");
// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


// describe("here deploying the contract",function(){

//     async function deployTokenFixture(){
//         const metadataURL = "ipfs://QmbHmu3hPzhLSzMwksCYzVNcCMTVZ9g8NuQ427Z671griM/";
//         const [owner,addr1,addr2,addr3,addr4]=await ethers.getSigners();
//         const factoryObject = await ethers.getContractFactory("NFT");
//         const contractObject = await factoryObject.deploy(metadataURL);
//         await contractObject.deployed();
//         return {owner,addr1,addr2,addr3,addr4,contractObject};
//     }

//     it("printing the contract address and state variables in the contract",async function(){
//         const {owner,addr1,addr2,addr3,addr4,contractObject}= await loadFixture(deployTokenFixture);
//         //contract address
//         console.log("contract address",await contractObject.address);
//         //ower address
//         console.log("owner address",await owner.address);
//         //baseURI
//         console.log("baseURI :",await contractObject.baseURI());
//         console.log("token count",await contractObject.tokenCount());
//         console.log("maxtoken count",await contractObject.maxTokenIds());
//     });

//     it("minting the tokens",async function(){
//         const {owner,addr1,addr2,addr3,addr4,contractObject}= await loadFixture(deployTokenFixture);
//         await contractObject.connect(addr1).mintNFT();
//         await contractObject.connect(addr1).mintNFT();
//         await contractObject.connect(addr2).mintNFT();
//         await contractObject.connect(addr2).mintNFT();
//         await contractObject.connect(addr3).mintNFT();
//         await contractObject.connect(addr4).mintNFT();
//         //checking the balance of addresses
//         console.log("blance of addr1 :",await contractObject.balanceOf(addr1.address));
//         console.log("blance of addr2 :",await contractObject.balanceOf(addr2.address));
//         console.log("blance of addr3 :",await contractObject.balanceOf(addr3.address));
//         console.log("blance of addr4 :",await contractObject.balanceOf(addr4.address));
//         //checking the owners of tokenIDs
//         console.log("owner of tokenId=3",await contractObject.ownerOf(3));
//         console.log("owner of tokenId=4",await contractObject.ownerOf(4));
//         console.log("owner of tokenId=6",await contractObject.ownerOf(6));

        
//     });

// });