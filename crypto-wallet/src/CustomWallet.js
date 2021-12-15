import React, { useState } from 'react'
import './CustomWallet.css'
import { ethers } from 'ethers'
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
    const [selectedToken, setSelectedToken] = useState(TokenList[0]);

    const connectWallet = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
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
                switch (decimalRepresentation) {
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

                if (decimalRepresentation !== 1) {
                    setErrorMessage("Please swtich to Main network (Mainnet) if you want to do real transactions")
                }
                setUserNetwork(currentNetwork);
            })
    }

    const getAccountBalance = (account) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
            .then(balance => {
                setUserBalance(ethers.utils.formatEther(balance));
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
    };

    async function getRC20TokenInfo() {

        if (userAccount == null) {
            alert("Please make sure you are connected to your wallet");
        } else {
            let provider = ethers.getDefaultProvider();
            let selectedAddress = selectedToken.address;
            let abi = [
                "function balanceOf(address owner) view returns (uint256)",
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)",
                "function totalSupply() view returns (uint)"
            ];

            let contract = new ethers.Contract(selectedAddress, abi, provider);

            let decimals = await contract.decimals();
            let symbol = await contract.symbol();
            let totalSupply = await contract.totalSupply();
            let balance = utils.BigNumber = await contract.balanceOf(userAccount);

            setTokenSymbol(symbol);
            setTokenDecimals(decimals);
            setTokenBalance(utils.formatUnits(balance, 18));
            setTokenTotalSupply(parseFloat(utils.formatUnits(totalSupply, 18)));
        }
    }

    const chainChangedHandler = () => {
        window.location.reload();
    }

    window.ethereum.on('chainChanged', chainChangedHandler);

    return (
        <div className='customWallet'>
            <h4> {"Please connect to MetaMask"} </h4>
            <button onClick={connectWallet}>{connectButton}</button>
            <div className='accountDisplay'>
                <h3>Address: {userAccount}</h3>
            </div>
            <div className='balanceDisplay'>
                <h3>ETH Balance: {userBalance}</h3>
            </div>
            <div className='networkDisplay'>
                <h3>Network: {userNetwork}</h3>
            </div>

            <p className="error">{errorMessage}.</p>

            <hr className="horizonalLine"></hr>
            <h5>Please make sure you are connected to the wallet</h5>
            <h5>Select the desired token and push the button to check it :)</h5>
            <select onChange={(e) => setSelectedToken(TokenList[e.target.value])}>
                {
                    TokenList.map((token, index) =>
                        (<option value={index} key={token.address}>{token.name}</option>))
                }
            </select>

            <button onClick={getRC20TokenInfo}>Check Token</button>

            <div className='networkDisplay'>
                <h3>Token Details:</h3>
                <h4>Symbol: {tokenSymbol} | Decimals: {tokenDecimals} | TotalSupply: {tokenTotalSupply}</h4>
                <h3>Balance: {tokenBalans}</h3>
            </div>
        </div>
    );
}

export default CustomWallet;
