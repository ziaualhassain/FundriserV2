// const { ethers }=require("hardhat");
// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { expect }=require("chai");

// //here deploying the both NFTcollection and NFT marketplace contract

// describe("deploying the NFT MarketPlace contract :",function(){
//     async function deployTokenFixture(){
//         const [owner,addr1,addr2,addr3,addr4]=await ethers.getSigners();
//         //by default the owner address is deploying the both contracts

//         //NFT collection deployment
//         const metadataURL = "ipfs://QmbHmu3hPzhLSzMwksCYzVNcCMTVZ9g8NuQ427Z671griM/";
//         const factoryCollection= await ethers.getContractFactory("NFT");
//         const contractCollection = await factoryCollection.deploy(metadataURL);
//         await contractCollection.deployed();

//         //NFT marketplace deployment
//         const factoryObjectMarketplace = await ethers.getContractFactory("NFTMarketplace");
//         const contractObjectMarketplace = await factoryObjectMarketplace.deploy();
//         await contractObjectMarketplace.deployed();
//         return {owner,addr1,addr2,addr3,addr4,contractCollection,contractObjectMarketplace};
//     }

//     it("adding the NFTs to the marketplace :",async function(){
//         const {owner,addr1,addr2,addr3,contractCollection,contractObjectMarketplace} = await loadFixture(deployTokenFixture);

//         console.log("NFT collection contract address  :",await contractCollection.address);
//         console.log("NFT Marketplace contract address :",await contractObjectMarketplace.address);
//     });

//     it("minting NFT collection and adding NFTs marketplace",async function(){
//         const {owner,addr1,addr2,addr3,addr4,contractCollection,contractObjectMarketplace} = await loadFixture(deployTokenFixture);
       
//         //minting NFTs to the addresses
//         console.log("owner address :",await owner.address);
//         console.log("addr1         :",await addr1.address);
//         console.log("addr2         :",await addr2.address);
//         console.log("addr3         :",await addr3.address);
//         console.log("");
//         //balanceOf the ether in addresses
//         const provider = waffle.provider;
//         console.log("balance of addr1 :",await provider.getBalance(addr1.address));
//         console.log("balance of addr2 :",await provider.getBalance(addr2.address));
//         console.log("balance of addr3 :",await provider.getBalance(addr3.address));
//         console.log("balance of addr4 :",await provider.getBalance(addr4.address));
//         console.log("");
//         await contractCollection.connect(addr1).mintNFT();
//         await contractCollection.connect(addr2).mintNFT();
//         await contractCollection.connect(addr3).mintNFT();
//         await contractCollection.connect(addr1).mintNFT();
//         await contractCollection.connect(addr2).mintNFT();
//         await contractCollection.connect(addr3).mintNFT();
//         await contractCollection.connect(addr1).mintNFT();
//         //balance of addresses
//         console.log("balance of addr1 :",await contractCollection.balanceOf(addr1.address));
//         console.log("balance of addr2 :",await contractCollection.balanceOf(addr2.address));
//         console.log("balance of addr3 :",await contractCollection.balanceOf(addr3.address));
        

//         //<----------------------------addTtemToMarketplace()----------------------------->

//         //Adding items to NFT marketplace
//         //setps to follow (giving partial ownerShip of to the contract)
//         //1.before listing the NFT in the marketplace ,seller should approve the operator 
//         //2.seller approve the operator
//         //3.seller calls approve() function in ERC721 and adds him in state variable
//         //  _tokenApprovals(tokenId => address)
//         //4.in the contract checking for approved or not by getApproved() function returns 
//         // the tokenId holding address(i.e marketPlace contract address)
//         await contractCollection.connect(addr1).approve(contractObjectMarketplace.address,1);
//         console.log("approveed Address :",await contractCollection.getApproved(1));
//         await contractObjectMarketplace.connect(addr1).addTtemToMarketplace(contractCollection.address,1,300);
//         console.log("");
//         await contractCollection.connect(addr2).approve(contractObjectMarketplace.address,2);
//         console.log("approveed Address :",await contractCollection.getApproved(2));
//         await contractObjectMarketplace.connect(addr2).addTtemToMarketplace(contractCollection.address,2,6000);
//         console.log("");
//         await contractCollection.connect(addr3).approve(contractObjectMarketplace.address,3);
//         console.log("approveed Address :",await contractCollection.getApproved(3));
//         await contractObjectMarketplace.connect(addr3).addTtemToMarketplace(contractCollection.address,3,2345);
//         console.log("");

//         //to get 

//         //number of NFTs in the NFTmarketpalce
//         console.log("Total NFT's in the MarketPlace :");
//         console.log("NFTs count :",await contractObjectMarketplace.nftCount());
//         console.log("");    
        
//         //steps to delist from marketplace
//         //1.cancelListing
//         //2.remove approval to marketplace operator 


//         // <------------------cancleListing()------------------------->

//         //addr1 delisting the tokenId=1
//         //note : the zero address should be string 
//         const zeroAddr = "0x0000000000000000000000000000000000000000";
//         await contractCollection.connect(addr1).approve(zeroAddr,1);
//         await contractObjectMarketplace.connect(addr1).cancleListing(contractCollection.address,1);
        
//         //number of NFTs in the NFTmarketpalce
//         console.log("After canceling Listing :");
//         console.log("NFTs count :",await contractObjectMarketplace.nftCount());
//         console.log("");
         

//         //Here checking that after delising the operator is still approved one or not
//         //await contractObjectMarketplace.connect(addr1).addTtemToMarketplace(contractCollection.address,1,20);
//         //number of NFTs in the NFTmarketpalce
//         //console.log("NFTs count :",await contractObjectMarketplace.nftCount());
//         //console.log("");

//         // here calling the cancleListing with not owner of the tokenId=2
//         //await contractObjectMarketplace.connect(addr1).addTtemToMarketplace(contractCollection.address,5,50);
//         //output : Ur are not the owner of tokenId=5

//         //<-----------------------------updateNFTPrice()--------------------------->
        
//         //previous price
//         // const price1=await contractObjectMarketplace.user[contractCollection.address][1];
//         // console.log("price :",await price1.price);
//         //dont know how to get the mapping of mapping values;
//         await contractObjectMarketplace.connect(addr2).updateNFTPrice(contractCollection.address,2,10000000);
//         console.log("");


//         //<---------------------buy()--------------------------->


//         console.log("previous balance :");
//         console.log("balance of addr2 :",await contractCollection.balanceOf(addr2.address));
//         console.log("balance of addr4 :",await contractCollection.balanceOf(addr4.address));
//         await contractObjectMarketplace.connect(addr4).buy(contractCollection.address,2,{
//             value: 10000000});

//         //to parse to ether =  ethers.utils.parseEther("1.0")
//         console.log("");
//         //balance of addr1
//         console.log("after bought by addr4 from addr2 :");
//         console.log("balance of addr2 :",await contractCollection.balanceOf(addr2.address));

//         //balance of addr4
//         console.log("balance of addr4 :",await contractCollection.balanceOf(addr4.address));


//         //<-----------------------------sellerWithdraw()-------------------------->

//         //sellers addr1,addr2,addr3 to withdraw the funds for their sales
//         console.log("total balance in the marketplace contract :");
//         console.log("conract balance :",await provider.getBalance(contractObjectMarketplace.address));
//         console.log("");
//         const before=await provider.getBalance(addr2.address);
//         console.log("addr2 balance                    :",await before);
//         //seller withdrawing the funds
//         await contractObjectMarketplace.connect(addr2).sellerWithdraw();
//         const after = await provider.getBalance(addr2.address);
//         console.log("addr2 balance after withdrawing  :",await after);
//         //after withdrawing by addr2 , the marketPlace contract balance 
//         console.log("conract balance :",await provider.getBalance(contractObjectMarketplace.address));
        
        
//     });

// });