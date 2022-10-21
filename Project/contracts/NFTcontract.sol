//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//minting nfts to put in our marketplace

//metadata cID : QmbHmu3hPzhLSzMwksCYzVNcCMTVZ9g8NuQ427Z671griM
//mumbai testnet contract address : 0x0fb79495fCB2a83B6da1d8A9390192997336d393
//verified URL :https://mumbai.polygonscan.com/address/0x0fb79495fCB2a83B6da1d8A9390192997336d393#writeContract


contract NFT is ERC721{
     using Strings for uint256;
    
    //state variables
    string public baseURI;                          //token URI
    uint public tokenCount;                   //no of tokens minting
    uint public maxTokenIds=10;

    //events
    event mintedNFT(uint indexed tokenId);

    constructor(string memory _baseURI)ERC721("NFTMarketPlace","MP"){
        baseURI=_baseURI;
        tokenCount=0;
    }

    //tokenURI function
    function tokenURI(uint tokenId)public view virtual override returns(string memory){
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }

    //to mint the nft
    function mintNFT()external{
        require(tokenCount <= maxTokenIds, "Exceed maximum  supply");
        tokenCount+=1;
        _mint(msg.sender,tokenCount);
        emit mintedNFT(tokenCount);
    }

    // //fallback function
    // fallback()external payable{}
    // //receive function
    // receive()external payable{}

}