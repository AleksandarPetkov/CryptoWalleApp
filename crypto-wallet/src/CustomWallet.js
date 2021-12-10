import React, {useState} from 'react'
import './CustomWallet.css'
import {ethers} from 'ethers'

const CustomWallet = () => {

    
	const [userAccount, setUserAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
    const [userNetwork, setUserNetwork] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
	const [buttonText, setConnButtonText] = useState('Connect Wallet')

    const connectWallet = () => {
        if(window.ethereum && window.ethereum.isMetaMask){
            window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				showUserDetails(result[0]);
			});
        } else {
            setErrorMessage("Meta Mask is not installed!")
        }
    }

    const showUserDetails = (newAccount) => {
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
            
            if(decimalRepresentation != 1){
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

    return (
		<div className='customWallet'>
		<h4> {"Please connect to Meta Mask"} </h4>
			<button onClick={connectWallet}>{buttonText}</button>
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
		</div>
	);
}

export default CustomWallet;
