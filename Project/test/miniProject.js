const { ethers } = require("hardhat");
const { time,loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

//Testing Reward based crowdfunding
// 1.toGetfunds function Can be tested  in 3 phases
// 1.1.Testing before the startTime of the funding
// 1.2.Testing During the funding
// 1.3.Testing after the endTime of funding

// 2.successfull fundings
// 2.1. funds will be transfered to fundraiser



//3.On failure of funding
// 3.1. funds revert back to the investors


//NOTE: here the value is in wei, time is in sec(all are in its lowest values)

describe("Deploying & Testing the Reward Based Fundraising(RBDR)",function(){

    async function deployLoadfixture(){
        let startTime,endTime;
        startTime=3600;
        endTime=3600;
        const [owner,addr1,addr2,addr3,addr4] = await ethers.getSigners();
        const factoryObject = await ethers.getContractFactory("Funding");
        const contractObject = await factoryObject.deploy(1000,startTime,endTime);
        await contractObject.deployed();
        return {owner,addr1,addr2,addr3,addr4,contractObject,startTime,endTime};
    }


    it("Owner and start and end times testing",async function(){
        const {owner,addr1,addr2,addr3,addr4,contractObject,startTime,endTime} = await loadFixture(deployLoadfixture);
        console.log("owner address      :",owner.address);
        console.log("owner balance      :",await owner.getBalance());
        //starting time of the funding and ending time of the funding 
        console.log("starting time      :",startTime);
        console.log("ending time        :",endTime);   
        console.log("latest block time  :",await time.latest());

        //start time and end time of contract
        //note : HERE USING THE GETTER FUNCTION OF FUNDING CONTRACT WHICH ARE PUBLICS
        console.log("contract startTime :",await contractObject.startTime());
        console.log("contract endTime   :",await contractObject.endTime());

        //finding contract unlockTime periods
        let unlockTime = await contractObject.endTime() - await contractObject.startTime();
        console.log("unlock time period :",unlockTime);
        console.log();
    });

    // //trying to send funds inbetween deployment time and start time
    // it("Investing funds before startTime of Fundraising:",async function(){
    //     const {owner,addr1,addr2,addr3,addr4,contractObject,startTime,endTime} = await loadFixture(deployLoadfixture);
    //     console.log();
    //     console.log("latest block time  :",await time.latest());
    //     //we are in deployment time < startTime

    //     // 1.owner can't spam the pool(fundraising)  
    //     // console.log("<--------------------------------owner can't spam the pool(fundraising) error ------------------------->");
    //     // await contractObject.toGetfunds({
    //     //     value:100                         
    //     // });

    //     // console.log("addr1 of address  :",addr1.address);
    //     // console.log("balanceOf addr1   :",await addr1.getBalance());

    //     // 2.not enough funds
    //     // console.log("<--------------------------------not enough funds error------------------------->");
    //     // await contractObject.connect(addr1).toGetfunds({
    //     //     value:0
    //     // });

    //     // 3.funding pool is not started yet
    //     // console.log("<--------------------------------funding pool is not started yet error ------------------------->");
    //     // await contractObject.connect(addr1).toGetfunds({
    //     //     value:100
    //     // });

    // });


    // //Testing unlocktime period = endTime-startTime
    // it("Testing the contract in unlockTime period :",async function(){
    //     const {owner,addr1,addr2,addr3,addr4,contractObject,startTime,endTime} = await loadFixture(deployLoadfixture);
    //     console.log();
    //     //before latest block time
    //     console.log("latest block time  :",await time.latest());
    //     console.log("startTime in contract :",await contractObject.startTime());
    //     console.log("endTime in   contract :",await contractObject.endTime());

    //     //which mines new block for the given time
    //     //note : the given argument unlocktime > latest blockTime
    //     await time.increaseTo(await contractObject.startTime());
    //     console.log("latest block time  :",await time.latest());
        

    //     //Testing after startTime
    //     // console.log("Testing after the startTime(unlockTime)");
    //     // 1.owner can't spam the pool(fundraising)  
    //     // console.log("<----------owner can't spam the pool(fundraising) error ----------->");
    //     // await contractObject.toGetfunds({
    //     //     value:100                         
    //     // });
       
    //     // 4. funding goal reached
    //     //console.log("<----------funding goal reached error -------------->")
    //     // await contractObject.connect(addr1).toGetfunds({value:100});
    //     // await contractObject.connect(addr2).toGetfunds({value:200});
    //     // await contractObject.connect(addr3).toGetfunds({value:300});
    //     // await contractObject.connect(addr1).toGetfunds({value:400});
    //     // await contractObject.connect(addr2).toGetfunds({value:100});
    //     // console.log("Total amount in the contract :",await contractObject.totalAmt());

    // });


    //Testing after the endtime contract Locked
    // it("Investing funds after the endTime :",async function(){
    //     const {owner,addr1,addr2,addr3,addr4,contractObject,startTime,endTime} = await loadFixture(deployLoadfixture);
    //     console.log();
    //     //before latest block time
    //     console.log("latest block time  :",await time.latest());

    //     //which mines new block for the given time
    //     //note : the given argument unlocktime > latest blockTime
    //     await time.increaseTo(await contractObject.endTime());

    //     //5. funding pool expired 
    //     // console.log("<---------------funding pool expired error ----------------->");
    //     // await contractObject.connect(addr2).toGetfunds({value:100});

    // });

    describe("After Time is completed ", function(){
      //  case 1: on successful funding
        it("getting funds :",async function(){
            const {owner,addr1,addr2,addr3,addr4,contractObject,startTime,endTime} = await loadFixture(deployLoadfixture);
            await time.increaseTo(await contractObject.startTime());
            console.log("startTime :",await contractObject.startTime());
            console.log("endTime   :",await contractObject.endTime());
            await contractObject.connect(addr1).toGetfunds({value:100});
            await contractObject.connect(addr2).toGetfunds({value:200});
            await contractObject.connect(addr3).toGetfunds({value:300});
            await contractObject.connect(addr1).toGetfunds({value:400});

            console.log("total funds in contract :",await contractObject.totalAmt());
            console.log("total number of investors :",await contractObject.noOfInvestors());

            await time.increaseTo(await contractObject.endTime());

            //time completed and goal reached

            // 6.only fundraiser can claim the funds
            // console.log("<------------only fundraiser can claim the funds error ---------------->");
            // await contractObject.connect(addr1).FundsToManager();
            
            //before 
            console.log("contract balance :",await contractObject.contractBalance());
            await contractObject.FundsToManager();
            //after
            console.log("contract balance :",await contractObject.contractBalance());

        });

        //case 2: on failure of funding

        // it("on failure of funding :",async function(){
        //     const {owner,addr1,addr2,addr3,addr4,contractObject,startTime,endTime} = await loadFixture(deployLoadfixture);
        //     //context : goal is not reached and time is completed
        //     //so, revert back funds to investors (i.e they should have to claim the funds)
        //     await time.increaseTo(await contractObject.startTime());
        //     console.log("startTime :",await contractObject.startTime());
        //     console.log("endTime   :",await contractObject.endTime());
        //     await contractObject.connect(addr1).toGetfunds({value:100});
        //     await contractObject.connect(addr2).toGetfunds({value:200});
        //     await contractObject.connect(addr3).toGetfunds({value:300});
        //     await time.increaseTo(await contractObject.endTime());
        //     //funds claimed by the users

        //     await contractObject.connect(addr1).reFundingToInvestors();
        //     await contractObject.connect(addr2).reFundingToInvestors();

        //     //7.claimed aleardy or ur are not the investor
        //     //await contractObject.connect(addr1).reFundingToInvestors();
        //     console.log("contract balance :",await contractObject.contractBalance());


        // });


    });



});