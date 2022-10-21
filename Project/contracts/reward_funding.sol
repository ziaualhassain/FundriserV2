//SPDX-License-Identifier:MIT
pragma solidity 0.8.17;

//importing ERC721 contract 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 

//contract address : 0xD0A7FeF1a0caB8a32210a5dB1D81fAaB5F908b03


//contract for crowdfunding

contract Funding is ERC721{
    //uint public fundAmt; 
    mapping(address => uint) public investors;                   // investors history
    address[] arrayOfInvestors;                                  //array of addresses 
    mapping(address => bool) aleardyInvestor;                    // sotres aleardy investors history
    address payable public manager;
    uint public totalAmt=0;                                       //intial total amount
    uint public noOfInvestors;
    uint public goalAmt;
    uint public goalTime;
    uint public endTime;
    uint public startTime;
    mapping(address => uint) nftHolders;
    mapping(address => bool) claims;                              // history fo the number of people claimed
    uint public tokenId;


    //events
    event invested(address from,uint value);
    event toManager(address from,address to,uint value);
    event toInvsetors(address from,address to,uint value);
    
    // function modifier
     modifier checkInvestor{
        require(manager!=msg.sender,"owner can't spam the pool"); 
        require(msg.value > 0 wei,"not enough funds"); 
        require(block.timestamp >= startTime,"funding pool is not started yet");
       // require(endTime > block.timestamp,"funding pool expired");
        require(amntRequired() > 0 ,"funding goal reached"); 
        _;
     }

     //function modifier fund to manger
     modifier fundToManager{
        require(msg.sender==manager,"only fundraiser can claim the funds"); // only manager can call this function 
        require(block.timestamp > endTime && totalAmt >= goalAmt); 
        _;
     }

     //function modifier funds back to investors
     // called by individual investor
     modifier fundToInvestors{
        require(investors[msg.sender] > 0,"claimed aleardy or ur are not the investor");
        //require(aleardyInvestor[msg.sender],"u cannot claim the funds");
        require(block.timestamp > endTime && totalAmt < goalAmt);
        _;
     }

    // to check for the 
     modifier rewardsToInvestors{
        require(block.timestamp > endTime && totalAmt >= goalAmt,"failure of funding so, u can't claim nfts");
        require(claims[msg.sender],"your not investor");
        require(tokenId < noOfInvestors,"minting completed");
        _;
     }

    //constructor for intializing manager 
    //goal time in days , for testing using the default one secondss
    constructor(uint _amt,uint _starTime,uint _endTime) ERC721("Mini project","MN"){
        goalAmt = _amt;
        //goalAmt=_amt*10**18;                              //goal amt is taking in ether and converting it to wei
        startTime = block.timestamp + _starTime;                                     // contract works with smallest units
        endTime   = startTime + _endTime;//(((goalTime*25)*60)*60);  // time in days as input    
        manager=payable(msg.sender);                        //contract ---> deploy address 
    }

    //getting fund amount to contract and checking for the conditions to met
    //the first and last person who is investing can invest more than required

    //do funding started 
    function hasFundingStarted()external view returns(bool ){
        if(block.timestamp >= startTime){
            return true;
        }
        return false;
    }

    //has funding ended
    function hasFundingEnded()external view returns(bool ){
        if(block.timestamp > endTime){
            return true;
        }
        return false;
    }

    function toGetfunds()external payable checkInvestor{
        if(!aleardyInvestor[msg.sender]){                   // checks for new investors
            investors[msg.sender]=msg.value;
            totalAmt=totalAmt + msg.value;
            arrayOfInvestors.push(msg.sender);
            noOfInvestors+=1;                               //number of investors here 
            aleardyInvestor[msg.sender]=true;               // adding him in the investors mapping
            claims[msg.sender]=true;                        // this for the condition checking in nft claims
        }
        else{                                               // aleardy investors here works
            investors[msg.sender]=msg.value + investors[msg.sender];
            totalAmt=totalAmt + msg.value;
        }
        emit invested(msg.sender,msg.value);
    }

    //array of investors function
    function investorsHistory()external view returns(address[] memory){
        return arrayOfInvestors;
    }

    //there are two outcomes for our project
    // 1.successful funding   2.failed funding 
   
   
    //1.If successful funding 
    // so funds will transfer to the fund raiser
    function FundsToManager() external payable fundToManager{
        manager.transfer(address(this).balance);
        emit toManager(address(this),manager,address(this).balance);
    }

    //2.If the funding is failed
    //here refunding the funds to the investors if funding goal is not reached
    function reFundingToInvestors() external fundToInvestors{
        payable(msg.sender).transfer(investors[msg.sender]);
        emit toInvsetors(address(this),msg.sender,investors[msg.sender]);
        investors[msg.sender]=0;
    }


    //to check the amount required
    function amntRequired()public view returns(uint a){
        if(totalAmt < goalAmt){
            return (goalAmt-totalAmt);
        }
        return 0;
    }

    //this function is to mint the number of tokens , if the successful funding is happend
    function mintReward()external rewardsToInvestors{
        _mint(msg.sender,tokenId);
        claims[msg.sender]=false;
        tokenId+=1;
    }


    //contract balance
    function contractBalance()public view returns(uint ){
        return address(this).balance;
    }

}

