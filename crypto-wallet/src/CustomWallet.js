import React, {useState} from 'react'
import './CustomWallet.css'
import {ethers} from 'ethers'
import { utils } from 'ethers'
import TokenList from './assets/token-list-mainnet.json'



const CustomWallet = () => {
    
	const [userAccount, setUserAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
    const [userNetwork, setUserNetwork] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
	const [connectButton, setConnectButtonText] = useState("Connect Wallet");
    const [tokenDecimals, setTokenDecimals] = useState(null);
    const [tokenSymbol, setTokenSymbol] = useState(null);
    const [tokenBalans, setTokenBalance] = useState(null);
    const [tokenTotalSupply, setTokenTotalSupply] = useState(null);
    
    // const [selectedToken, setSelectedToken] = useState(TokenList[0]);

    const connectWallet = () => {
        if(window.ethereum && window.ethereum.isMetaMask){
            window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				populateUserDetails(result[0]);
                setConnectButtonText("Wallet Connected");
			})
            .catch(error => {
				setErrorMessage(error.message);
			});
        } else {
            setErrorMessage("MetaMask is not installed!")
        }
    }

    const populateUserDetails = (newAccount) => {
		setUserAccount(newAccount);
		getAccountBalance(newAccount.toString());
        getUserNetwork();
	}

    const getUserNetwork = () => {
        window.ethereum.request({ method: 'eth_chainId' })
        .then(userNetwork => {
            let decimalRepresentation = parseInt(userNetwork, 16);
            let currentNetwork;
            switch(decimalRepresentation) {
                case 1:
                  currentNetwork = "Ethereum Main Network (Mainnet)";
                  break;
                case 3:
                    currentNetwork = "Ropsten Test Network";
                  break;
                  case 4:
                    currentNetwork = "Rinkeby Test Network";
                  break;
                case 5:
                    currentNetwork = "Goerli Test Network";
                  break;
                case 42:
                    currentNetwork = "Kovan Test Network";
                  break;
                default:
                    currentNetwork = "Unknown Network";
                }
            
            if(decimalRepresentation !== 1){
                setErrorMessage("Please swtich to Main network (Mainnet) if you want to do real transactions")
            }
            setUserNetwork(currentNetwork);
		})
    }

    const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

    const chainChangedHandler = () => {
		window.location.reload();
	}
    
    window.ethereum.on('chainChanged', chainChangedHandler);

    /// Test Start
    async function  TestERC20Token  ()  {
        let provider = ethers.getDefaultProvider();
        let address = "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206";
        let testAddress = "0x2a98f128092abbadef25d17910ebe15b8495d0c1"
        let abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
            "function totalSupply() view returns (uint)"
        ];
        let contract = new ethers.Contract(testAddress, abi, provider);
 
        let decimals = await contract.decimals();
        let symbol = await contract.symbol();
        let totalSupply = await contract.totalSupply();
        let balance = utils.BigNumber = await contract.balanceOf(userAccount);
        parseFloat(utils.formatUnits(balance, 18));

        setTokenSymbol(symbol);
        setTokenDecimals(decimals);
        setTokenBalance(utils.formatUnits(balance, 18));
        setTokenTotalSupply(parseFloat(utils.formatUnits(totalSupply, 18)))

        console.log(parseFloat(utils.formatUnits(totalSupply, 18)));
        console.log(decimals);
        console.log(symbol);
        console.log(parseFloat(utils.formatUnits(balance, 18)));
    }

    /// Test End

    return (
		<div className='customWallet'>
		<h4> {"Please connect to Meta Mask"} </h4>
			<button onClick={connectWallet}>{connectButton}</button>
			<div className='accountDisplay'>
				<h3>Address: {userAccount}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {userBalance}</h3>
			</div>
            <div className='networkDisplay'>
				<h3>Network: {userNetwork}</h3>
			</div>
			{errorMessage}
            <hr className="horizonalLine"></hr>
            <button onClick={TestERC20Token}>{connectButton}</button>

            {/* <select onChange={(e) => setSelectedToken(TokenListRinkeby[e.target.value])}>
                {TokenListRinkeby.map((token, index) => 
                (<option value={index} key={token.address}>{token.name}</option>))}
            </select> */}

            <div className='networkDisplay'>
                <h3>Token Details:</h3>
				<h4>Symbol: {tokenSymbol} | Decimals: {tokenDecimals} | TotalSupply: {tokenTotalSupply}</h4>
                <h3>Balance: {tokenBalans}</h3>
			</div>
		</div>
	);
}

export default CustomWallet;
