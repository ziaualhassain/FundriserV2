//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

//creating NFT MarketPlace 
//steps to follow 
// 1.sellers can List the NFTs.
// 2.Sellers can cancel the NFTs listed in the marketplace.
// 3.Sellers can update the price of the nft listed by the owner.
// 4.Anyone Can Buy the NFT(transfer ownership).
// 5.seller can withdraw the funds from the contract.


//contract address : 0xFFAb72107169DE95BcCE24136170C923557Ef16C
//verified contract URL : https://mumbai.polygonscan.com/address/0xFFAb72107169DE95BcCE24136170C923557Ef16C#code


import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NFTcontract.sol";

contract NFTMarketplace is ReentrancyGuard{

    struct ListOfUsers{
        uint price;
        address seller;
    }

    //state variables
    mapping(address => bool) private approvedSeller;               // registered seller at operator
    mapping(address => mapping(uint => ListOfUsers)) private user; // compelete details of the NFTs lister
    mapping(address => uint) private sellersHistory;               //sellers histroy of payments
    uint public nftCount=0;
    NFT public NFTcontractABI;


    //events
    event itemListed(
        address indexed sender,
        address indexed nftAddress,
        uint indexed tokenId,
        uint price
        );
    
    event Itemcancelled(
        address indexed seller,
        uint indexed tokenId,
        address indexed owner
        );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint indexed tokenId,
        uint price
    );

    event updatedPrice(
        address indexed nftAddress,
        uint indexed tokenId,
        uint indexed price,
        address seller
    );


    
    modifier notListed(address nftAddress,uint tokenId){
        require(user[nftAddress][tokenId].price <= 0,"aleardy listed the NFT");
        _;
    }

    //modifier for the spender and owner of the nft same or not
    modifier isOwner(address nftAddress,uint tokenId,address spender){
        NFTcontractABI = NFT(nftAddress);
        address owner = NFTcontractABI.ownerOf(tokenId);
        if (spender != owner) {
            revert("not the owner of NFT");
        }
        _;
    }

    //modifier for the here is the seller in the marketplace
    modifier isListed(address nftAddress,uint tokenId){
        require(user[nftAddress][tokenId].price > 0,"ur not listed member in the NFT marketplace");
        _;
    }

    //check for regestered NFT seller
    modifier notRegistered{
        require(approvedSeller[msg.sender]);
        _;
    }


    // 1. to add NFTs to the marketplace and details
    // 1.1. checking the he/she is the owner of the nft
    // 1.2. aleardy listed or not in the marketplace
    function addTtemToMarketplace(address nftAddress,uint tokenId,uint price)
    external notListed(nftAddress,tokenId)isOwner(nftAddress,tokenId,msg.sender){
        if(price<=0){                                   //checking for price
            revert ("price must be greater than 0");
        }
        //getting approval over the tokenId to the NFT marketplace operator by the NFT owner
        //checking approved or not
        if(NFTcontractABI.getApproved(tokenId) != address(this)){
            revert("operator not approved");
        }
        user[nftAddress][tokenId].price=price;
        user[nftAddress][tokenId].seller=msg.sender;
        //user[nftAddress][tokenId]=ListOfUsers(price,msg.sender);  //same as above two lines
        approvedSeller[msg.sender]=true;
        nftCount++;
        emit itemListed(msg.sender,nftAddress,tokenId,price); 
    }


    //2.cancel the listing of item
    function cancleListing(address nftAddress,uint tokenId)external
     isListed(nftAddress,tokenId)isOwner(nftAddress,tokenId,msg.sender){
        delete user[nftAddress][tokenId];                       // deleting the seller details
        nftCount--;
        emit Itemcancelled(nftAddress,tokenId,msg.sender);
    }


   // 3.the owner can update the price of the NFT
   function updateNFTPrice(address nftAddress,uint tokenId,uint price)external
   isListed(nftAddress,tokenId)isOwner(nftAddress,tokenId,msg.sender){
        ListOfUsers memory item =user[nftAddress][tokenId];
        item.price=price;
        emit updatedPrice(nftAddress,tokenId,price,msg.sender);
   }
   
   // 4.buying the nft

   function buy(address nftAddress,uint tokenId)external payable
    isListed(nftAddress,tokenId) nonReentrant{
        ListOfUsers memory item = user[nftAddress][tokenId];
        if(msg.value < item.price){
            revert("less price payament");
        }
        sellersHistory[user[nftAddress][tokenId].seller]+=msg.value;
        IERC721(nftAddress).safeTransferFrom(item.seller,msg.sender, tokenId);
        delete user[nftAddress][tokenId];            //deleting the nft from marketplace
        emit ItemBought(msg.sender,nftAddress,tokenId,item.price);
   }


   // 5.seller withdraw
   // can withdraw funds to another contract or externally owned account
   function sellerWithdraw()external payable nonReentrant
    notRegistered{
        if(sellersHistory[msg.sender]<=0){
            revert("0 balance in the contract");
        }
        uint draw = sellersHistory[msg.sender];
        sellersHistory[msg.sender]=0;
        (bool success,)=payable(msg.sender).call{value:draw}("");
        require(success,"withdraw failed");
        // payable(msg.sender).transfer(sellersHistory[msg.sender]);
        
    }

    fallback()external payable{

    }
    receive()external payable{

    }

}

