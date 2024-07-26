<!--
..%%%%...%%..%%..%%%%%...%%%%%%..%%%%%...........%%..%%..%%..%%..%%%%%%...%%%%...%%..%%..%%%%%%.
.%%..%%...%%%%...%%..%%..%%......%%..%%..........%%.%%...%%%.%%....%%....%%......%%..%%....%%...
.%%........%%....%%%%%...%%%%....%%%%%...........%%%%....%%.%%%....%%....%%.%%%..%%%%%%....%%...
.%%..%%....%%....%%..%%..%%......%%..%%..........%%.%%...%%..%%....%%....%%..%%..%%..%%....%%...
..%%%%.....%%....%%%%%...%%%%%%..%%..%%..........%%..%%..%%..%%..%%%%%%...%%%%...%%..%%....%%...
................................................................................................
-->

# Cyber Knight Coin (Web приложение внутри телеграмма)

---

* React
* TypeScript
* Node js (express)
* MongoDB
* CSS
* React-Spring

---

## Функционал

![Снимок экрана 2024-07-26 181839](https://github.com/user-attachments/assets/a163aea3-ea17-4abe-840c-7d6395faf8d3)


### Заходя, вы автоматически регистрируетесь и авторизуетесь (ТОЛЬКО через телеграмм) и попадаете в БД, каждое действие попадает в базу данных

![Снимок экрана 2024-07-26 181852](https://github.com/user-attachments/assets/b94378d4-45f1-43de-a026-3e672559e5dc)

### Возможность копить монеты, возможность выполнять задания, выполнять их меняя их состояние в базе данных

---
Всего 3 стейта 

```
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    img: String,
    task_text: String,
    status: {
        type: String,
        enum: ['blocked', 'claim', 'done', 'open'],
        default: 'blocked'
    },
    reward: Number,
    link: String
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
```

---

### Так же у пользователя есть возможность приглашать друзей, получать за это бонус, а так же % от их монет

```
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    img: String,
    task_text: String,
    status: {
        type: String,
        enum: ['blocked', 'claim', 'done','open'],
        default: function () {
            return this.link && this.link !== '' ? 'open' : 'blocked';
        }
    },
    reward: Number,
    link: String
});

const userSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    cbkCoins: {
        type: Number,
        default: 40 
    },
    friends: {
        type: [String],
        default: [] 
    },
    lastCollected: {
        type: Date,
        default: null
    },
    referralLink: {
        type: String,
        unique: true
    },
    referrer: {
        type: String,
        default: null
    },
    tasks: {
        type: [taskSchema],
        default: []
    },
    dailyRewardCollected: {
        type: Date,
        default: null
    }
});

const User = mongoose.model('User', userSchema);

export default User;
```

---

### Деплой сервера бьл на Ubutu
### Деплой клиента через Vercel
### SmartContract для "shitcoin" написал на Go


---

#Smart Contract
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Shitcoin {
    string public name = "Shitcoin";
    string public symbol = "SHIT";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}

```

---

## Smart Contract V2 with Golang (ERC20)

```
package main

import (
    "context"
    "crypto/ecdsa"
    "fmt"
    "log"
    "math/big"

    "github.com/ethereum/go-ethereum"
    "github.com/ethereum/go-ethereum/accounts/abi"
    "github.com/ethereum/go-ethereum/accounts/abi/bind"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/crypto"
    "github.com/ethereum/go-ethereum/ethclient"
)

const (
    privateKey    = // YOU SHOULD NOT KNOW DAT
    rpcURL        = // ALSO ONCE SHOULDNT
    contractABI   = // XD
    contractBytecode = // EVEN TRY TO GUESS MY BYTECODE its started with 0x goodluck!
)

func main() {
    client, err := ethclient.Dial(rpcURL)
    if err != nil {
        log.Fatalf("Failed to connect to the Ethereum client: %v", err)
    }

    privateKey, err := crypto.HexToECDSA(privateKey)
    if err != nil {
        log.Fatalf("Failed to parse private key: %v", err)
    }

    publicKey := privateKey.Public()
    publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
    if !ok {
        log.Fatalf("Failed to cast public key to ECDSA")
    }

    fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
    nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
    if err != nil {
        log.Fatalf("Failed to get account nonce: %v", err)
    }

    gasPrice, err := client.SuggestGasPrice(context.Background())
    if err != nil {
        log.Fatalf("Failed to get gas price: %v", err)
    }

    auth, err := bind.NewKeyedTransactorWithChainID(privateKey, big.NewInt(1)) // ChainID 1 for Mainnet
    if err != nil {
        log.Fatalf("Failed to create transactor: %v", err)
    }
    auth.Nonce = big.NewInt(int64(nonce))
    auth.Value = big.NewInt(0)     // in wei
    auth.GasLimit = uint64(300000) // in units
    auth.GasPrice = gasPrice

    parsedABI, err := abi.JSON(strings.NewReader(contractABI))
    if err != nil {
        log.Fatalf("Failed to parse contract ABI: %v", err)
    }

    address, tx, instance, err := bind.DeployContract(auth, parsedABI, common.FromHex(contractBytecode), client)
    if err != nil {
        log.Fatalf("Failed to deploy contract: %v", err)
    }

    fmt.Printf("Contract deployed to: %s\n", address.Hex())
    fmt.Printf("Transaction hash: %s\n", tx.Hash().Hex())

    // Interact with the deployed contract
    totalSupply, err := instance.TotalSupply(&bind.CallOpts{})
    if err != nil {
        log.Fatalf("Failed to retrieve total supply: %v", err)
    }

    fmt.Printf("Total supply: %s\n", totalSupply.String())
}
```
