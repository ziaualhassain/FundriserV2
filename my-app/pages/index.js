import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import Web3modal from "web3modal";
import {ethers,providers,Contract,utils} from "ethers";
import {FUNDING_CONTRACT_ADDRESS,FUNDING_CONTRACT_ABI} from "../constant"; 



export default function Home() {
  //state variables
  const [walletConnected,setWalletConnected] = useState(false);
  const [fundingStarted,setFundingStarted] = useState(false);
  const [fundingEnded,setFundingEnded] = useState(false);
  const [success,setSuccess] = useState(false);
  const [failure,setFailure] = useState(false);
  const [getInput,setInput] = useState("0");
  const [contractBalance,setContractBalance] = useState(0);
  const [amtRequired,setAmtRequired] = useState(0);
  const [owner,setOwner] = useState(false);
  const web3ModalRef = useRef();
  const goalAmt = "";
  const totalAmt = "";
  const neededAmt = 0;

//this is for provider only
const getContract = async() =>{
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    FUNDING_CONTRACT_ADDRESS,
    FUNDING_CONTRACT_ABI,
    provider
);
return contract;
};


//get Goal amount
const getGoalAmt = async() => {
  try{
    const contractObject = await getContract();
    const required = await contractObject.goalAmt();
    goalAmt=required.toString();
    console.log("goal amount :",goalAmt);
  }catch(error){
    console.error(error);
  }
}

//amount required
const amtR = async() =>{
  const contractObject = await getContract();
  neededAmt = await contractObject.amntRequired();
  console.log("amount required :",neededAmt.toNumber());
}

  // 1.to check funding is started 
  const started = async() =>{
    console.log("At funding started function top");
    try{
      //1.should required provider to read the data from the blockchain
      // const provider = await getSignerOrProvider();
      // console.log("provider",provider);
      // //2.Get an instance of the contract
      // const contractObject = new Contract(
      //   FUNDING_CONTRACT_ADDRESS,
      //   FUNDING_CONTRACT_ABI,
      //   provider
      // );
      const contractObject = await getContract();

      //3.creating contractObject
      const isFundingStarted = await contractObject.hasFundingStarted();
      setFundingStarted(isFundingStarted);
      console.log("isFundingStarted :",isFundingStarted);
      return isFundingStarted;
    }catch(error){
      console.error(error);
      return false;
    }
  }

  // 2.To check funding is ended
  const ended = async() =>{
   try{
      // //1.should required provider to read the data from the blockchain
      // const provider = await getSignerOrProvider();
      // //2.Get an instance of the contract
      // const contractObject = new Contract(
      //   FUNDING_CONTRACT_ADDRESS,
      //   FUNDING_CONTRACT_ABI,
      //   provider
      // );
      const contractObject = await getContract();
      //3.creating contractObject
      const isFundingEnded = await contractObject.hasFundingEnded();
      setFundingEnded(isFundingEnded);
      console.log("isFundingEnded :",isFundingEnded);
      return isFundingEnded;
    }catch(err){
    console.error(err);
    return false;
   }
  }

  const getSignerOrProvider = async(needSigner =false) => {
     //we need to gain the provider/signer
     const provider = await web3ModalRef.current.connect(); //which creates provider and metamsk pop
     const web3Provider = new ethers.providers.Web3Provider(provider);
 
     //connect to the Rinkeby network or not
     const { chainId } = await web3Provider.getNetwork();
     if(chainId!==4){
       window.alert("incorrect network selected,Please switch to rinkeby network");
       throw new Error("Incorrect network");
     }

     if(needSigner){
      const signer = web3Provider.getSigner();
      return signer;
     }
     return web3Provider;
  }

  const connectWallet = async() => {
    try{
      await getSignerOrProvider();     //created provider object
      setWalletConnected(true);
    }catch(error){
      console.error(error);
    }
  }

  //on successfull funding
  const onSuccess = async() => {
    try{
      const contractObject = await getContract();
      totalAmt = await contractObject.totalAmt();  //public getter function to get totalAmt
      goalAmt = await contractObject.goalAmt();   //public getter function to get goalAmt
      //since this totalAmt and goalAmt are retruning the bignumber , should handled properly
      if(totalAmt.gt(goalAmt) || totalAmt.eq(goalAmt)){
        setSuccess(true);
      }
      else{
        setSuccess(false);
      }
      console.log("total amount :",totalAmt.toString());
      console.log("goal amount :",goalAmt.toString());
    }catch(error){
      console.error(error);
    }
  }

  //onFailure of funding
  const onFailure = async() => {
    try{
      const contractObject = await getContract();
      totalAmt = await contractObject.totalAmt();  //public getter function to get totalAmt
      goalAmt = await contractObject.goalAmt();   //public getter function to get goalAmt
      if(totalAmt.lt(goalAmt)){
        setFailure(true);
      }
    }catch(error){
      console.error(error);
    }
  }

  //contract Balance
  const balance = async() => {
    const contractObject = await getContract();
    const amt = await contractObject.contractBalance();
    setContractBalance(amt.toString());
  }



  //to invest into the contract
  const getFundsFromInvestor = async() =>{
    try{
      const signer = await getSignerOrProvider(true);
      const contractObject = new Contract(
        FUNDING_CONTRACT_ADDRESS,
        FUNDING_CONTRACT_ABI,
        signer
      );
      const tx = await contractObject.toGetfunds({value:getInput});
      await tx.wait();
      window.alert("you successfully invested !");

    }catch(error){
      console.error(error);
    }
  }

  //onSuccess claim NFT 
  const claimNFT = async() =>{
    try{
      const signer = await getSignerOrProvider(true);
      const contractObject = new Contract(
      FUNDING_CONTRACT_ADDRESS,
      FUNDING_CONTRACT_ABI,
      signer
    );
    const tx = await contractObject.mintReward();
    await tx.wait();
    }catch(error){
      console.error(error);
    }
    window.alert("you have successfully claimed NFT");
  }


  //To load the page everyTime to get the latest state variables s
  const onPageLoad = async() => {
    // await connectWallet(); 
    const start = await started();
    if(start){
      await ended();
    }
    await onSuccess();
   // await onFailure();
    await getGoalAmt();

   // setInterval(async function () {
    //  await amtR();            //required amount
   // }, 600 * 1000);
  }

  //get the owner of the contract
  const getOwner = async() =>{
    try{
      //creating contract object/instance which gives only provider
      const contractObject = await getContract();
     
      //manager is public state variable , getting it by getter funtion
      const owner = await contractObject.manager();

      //getting signer 
      const signer = await getSignerOrProvider(true);

      const address = await signer.getAddress();
      if (address.toLowerCase() === owner.toLowerCase()) {
        setOwner(true);
      }
    }catch(error){
      console.error(error);
    }
  }

  //funds back to investors
  const reFundToInvestors = async() =>{
    try{
      const signer = await getSignerOrProvider(true);
      const contractObject = new Contract(
        FUNDING_CONTRACT_ADDRESS,
        FUNDING_CONTRACT_ABI,
        signer
      );
    
    const tx = await contractObject.reFundingToInvestors();
    await tx.wait();
    window.alert("you successfully claimed the funds back !");
    }catch(error){
      console.error(error);
    }
  }
  
 //will load at eveytime to get only the state variables change 
 //state changes should be seen only when rendering happens
  useEffect(() =>{
    if(!walletConnected){
      web3ModalRef.current = new Web3modal({
        network:"rinkeby",
        providerOptions:{},
        disableInjectedProvider: false,
      });
      //console.log("web3ModalRef :",web3ModalRef.current);
      console.log("In the useEffect");
      onPageLoad();
    }
  },[]);


  //this is to get the multiple javascript functions to return html
  function renderBody(){
    // 1.funding started
    if(!fundingStarted){
      return(
        <div>
            <div className={styles.failure}>
                <h1>Who are We? What we try to do?</h1><br/>
                <div className={styles.text}>
                To change the crowdfunding space and to bring transparency we're using
                blockchain and eliminating third-party.
                We're not limited to a region Here the investors can invest from around the
                globe with the help of cryptocurrency Ether.
                To bring more trust we are using smartcontracts.
                </div>
                <h2>Funding is not started yet. Comeback later !</h2>
          
            </div>
          
        </div>
      );
    }

    // 2.if finding started but not yet ended,anyone can invest
    if(fundingStarted && !fundingEnded){
      return(
        <div>
          <h3>Funding started !, you can invest now into the pool</h3>
          {/* <p className={styles.a}>Goal amount  </p> <br/> */}

          <div>
            {/* <input type="number" placeholder="enter eth in wei" alt="To enter the funds"  required> */}
            {/* <input id="amount" type="number" placeholder="eth amount" ref="input" required></input>
            <button onclick={getFundsFromInvestor}>Invest</button> */}
            <div>
              Goal Amount : 100 {goalAmt}
            </div>
            <label className={styles.lab}>Enter the amount </label>
            <input className={styles.ip} type="number" placeholder="ETH in WEI" onChange={(e) =>setInput(e.target.value)} required/><br/>
            {/* <span>entered :{getInput}</span> */}
            <button className={styles.btn } id={styles.investbtn} onClick={getFundsFromInvestor}>Invest</button>
          </div>
        </div>
      );
    }
    // // 3.if funding ended
    // if(fundingEnded){
    //   return(
    //     <div>
    //       <h3>Funding ended</h3>
    //     </div>
    //   );
    // }
    // 4.if successfull funding
    if(fundingEnded && success){
      return(
        <div className={styles.failure}>
          <h1>HURRY ! Funding is successfully,<br/>So you can claim the NFT reward.</h1>
          <button className={styles.btn}  id={styles.bttn2} onClick={claimNFT}>Claim NFT</button>
        </div>
      );
    }

    // 5.if failure of funding
    if(fundingEnded && !success){
      return(
        <div className={styles.failure}>
          <h1>Funding has failed,<br/> Unable to reach the goal.</h1>
          <h3>Please ! Claim Your Funds Back !</h3>
          <button className={styles.btn}  id={styles.bttn} onClick={reFundToInvestors}>Claim</button>
          </div>
      );
    }





  } 
  return(
    <div>
      <Head>
        <title>Fundraising !</title>
      </Head>
      <div className={styles.container}>

      <div className={styles.main}>
        <div className={styles.mainLogo}>
        
        <img className={styles.logo} src="images/logo.png"/>
        </div>
        <div className={styles.btnl}>
        <button className={styles.btn} onClick={connectWallet}>Wallet</button>
        </div>
        {renderBody()}
        <img className={styles.image} src="/images/0.svg" />
        {/* <img className={styles.image} src="/images/unsplash_R2HtYWs5-QA.png" /> */}
      </div>

      <footer id={styles.footer}>
        {/* Developed by  team <b>Develop!</b> &#10084;   */}
        Developed by  team <b>Fundraisers!</b> &#128156; 
      </footer>
      </div>
    </div>
  );
}


