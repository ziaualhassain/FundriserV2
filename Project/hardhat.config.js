require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env"});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    rinkeby:{
      url:process.env.INFURA_KEY_URL,
      accounts:[process.env.RINKEBY_TESTNET_PRIVATE_KEY],
    },
  },
};


//here deploying to polyon mumbai testnet