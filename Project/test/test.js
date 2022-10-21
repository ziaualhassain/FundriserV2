// const { ethers,waffle } = require("hardhat");
// const { time,loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// //test cases :
// // 1.testing owner can invest or not
// // 2.testing pool goal is reached or not

// describe("testing the Reward Based Fundraising :",function(){
//     var startTime,endTime,goalAmt;
//     startTime=time.latest() + 500;      // time.latest() method returns the latest block timestamp
//     endTime=1000;
//     goalAmt=100;
//     async function deployLoadfixture(){
//         //by default the first account is the signer account
//         const [owner,addr1,addr2,addr3,addr4,addr5]= await ethers.getSigners();
//         const factoryObject = await ethers.getContractFactory("Funding");
//         const contractObject = await factoryObject.deploy(goalAmt,startTime,endTime);
//         return {owner,addr1,addr2,addr3,addr4,addr5,contractObject};
//     }

    

//     it("after deploying the contract :",async function(){
//         const {owner,addr1,addr2,addr3,contractObject} = await loadFixture(deployLoadfixture);
//         //provider is an ethereum node connnection which is used to read only data on current state of ethereum
//         const provider = waffle.provider;
//         const ownerBalance = await provider.getBalance(owner.address);
//         console.log("owner balance :",ownerBalance);
//         //or else we can use the signers accounts to do both the read and write
//         console.log("contract address :",await contractObject.address);
//         console.log("contract balance :",await provider.getBalance(contractObject.address));//using provider
//         //using signers
//         console.log("address 1 :",addr1.address);
//         console.log("balance of address 1:",await addr1.getBalance());
//         console.log("address 2",addr2.address);
//     });

//     it("Testing the pool is not started yet or not",async function(){
//         const {owner,addr1,addr2,addr3,addr4,addr5,contractObject} = await loadFixture(deployLoadfixture);
//         //1.checking the condition that owner can't send the transaction
//         //executed and shown the revert text
//         // await owner.sendTransaction({
//         //     to: contractObject.address,  //  value: ethers.utils.parseEther("1") // 1 ether
//         //     value: 20,
//         //     gasLimit: 50000,
//         //   });
        
//         await addr1.sendTransaction({
//             to: contractObject.address,  //  value: ethers.utils.parseEther("1") // 1 ether
//             value: 20,
//             gasLimit: 500000,
//           });
//         const provider = waffle.provider;
//         //balance of the contract
//         console.log("contract balance :", await provider.getBalance(contractObject.address)); 
//         //balance of addr1 after transaction 
//         console.log("user1 balance :",await addr1.getBalance());   

//         await addr2.sendTransaction({
//             to:contractObject.address,
//             value:20,
//             gasLimit:500000,
//         });
//         //balance of the contract
//         console.log("contract balance :", await provider.getBalance(contractObject.address));
//         //balance of the addr2 after the transaction
//         console.log("user2 balance :",await addr2.getBalance());

//         await addr3.sendTransaction({
//             to:contractObject.address,
//             value:20,
//             gasLimit:500000,
//         });
//         //balance of the contract
//         console.log("contract balance :", await provider.getBalance(contractObject.address));
//         //balance of the addr2 after the transaction
//         console.log("user3 balance :",await addr3.getBalance());
        
//         // 2.when the pool is fulled this call reverted the function with "funding goal reached"
//         // await addr4.sendTransaction({
//         //     to:contractObject.address,
//         //     value:20,
//         //     gasLimit:500000,
//         // });

//         // //balance of the contract
//         // console.log("contract balance :", await provider.getBalance(contractObject.address));
//         // //balance of the addr2 after the transaction
//         // console.log("user4 balance :",await addr4.getBalance());


//         //testing the investors history 
//         const total = await contractObject.investorsHistory(); // here calling the investorsHistory function to get the array of users
//         console.log("total investors :")
//         console.log();
//         console.log("user       :       amount in wei");
//         total.forEach(async function(address){             //here used the mapping which sould be public
//             console.log(address," : ",await contractObject.investors(address));
//         });
//      });

//     describe("testing the time based functions :",function(){

//         beforeEach(async function(){
//             await time.increaseTo(startTime);
//         });

//         it("testing the time based functions like receive",async function(){
//             const {owner,addr1,addr2,addr3,addr4,addr5,contractObject} = await loadFixture(deployLoadfixture);
//             await addr1.sendTransaction({
//                 to: contractObject.address,  //  value: ethers.utils.parseEther("1") // 1 ether
//                 value: 20,
//                 gasLimit: 500000,
//               });
//             const provider = waffle.provider;
//             //balance of the contract
//             console.log("contract balance :", await provider.getBalance(contractObject.address)); 
//             //balance of addr1 after transaction 
//             console.log("user1 balance :",await addr1.getBalance());   
    
//             await addr2.sendTransaction({
//                 to:contractObject.address,
//                 value:20,
//                 gasLimit:500000,
//             });
//             //balance of the contract
//             console.log("contract balance :", await provider.getBalance(contractObject.address));
//             //balance of the addr2 after the transaction
//             console.log("user2 balance :",await addr2.getBalance());
    
//             await addr3.sendTransaction({
//                 to:contractObject.address,
//                 value:20,
//                 gasLimit:500000,
//             });
//             //balance of the contract
//             console.log("contract balance :", await provider.getBalance(contractObject.address));
//             //balance of the addr2 after the transaction
//             console.log("user3 balance :",await addr3.getBalance());
    
//              //testing the investors history 
//              const total = await contractObject.investorsHistory(); // here calling the investorsHistory function to get the array of users
//              console.log("total investors :")
//              console.log();
//              console.log("user       :       amount in wei");
//              total.forEach(async function(address){             //here used the mapping which sould be public
//                  console.log(address," : ",await contractObject.investors(address));
//              });
    
//         });
//     });
// });