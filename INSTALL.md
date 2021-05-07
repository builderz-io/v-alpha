# Installing V Alpha 2 - Running it locally

## Content

Prerequisites
- Node.js
- MongoDB
- Truffle

Installing the App
- MongoDB Entity Store
- Web Interface

Adding Content
- Manual Content
- Demo Content

Using the Smart Contract
- Starting Truffle and Deploy
- Adding Truffle to MetaMask
- Changing V Core Settings to EVM
- Using Addresses


## Prerequisites

### You need Node.js installed and running

Serving the Web Interface locally requires a simple Express server with Node.js. Node is also required when running the MongoDB Entity Store locally.

```
https://nodejs.org/en/
```

### You need MongoDB installed and running

Running the MongoDB Entity Store locally requires the Community Edition of MongoDB.

```
https://docs.mongodb.com/manual/administration/install-community/
```

Don't forget to start MongoDB after installation.

```
sudo mongod
```

### You need Truffle installed and running (optional)

Running the Smart Contract locally requires Truffle.

```
https://www.trufflesuite.com/truffle
```

### You need a wallet installed and running (optional)

Accessing the Smart Contract requires a wallet, such as
the MetaMask browser extension.

```
https://metamask.io/
```


## Installing the App

Open a Terminal window and run the following commands.

Clone the repository into a local folder. A new folder will be created.

```
git clone https://github.com/valueinstrument/v-alpha.git
```

Navigate to the new folder

```
cd v-alpha-2
```

Optionally change git branch before installing dependencies, you may skip this step.

```
git checkout branch-name
```

### Starting the MongoDB Entity Store

Make sure MongoDB is installed and running. Then, from the main V Alpha 2 folder, execute the following:

Install dependencies for the MongoDB Entity Store

```
cd mongodb-entity-store
```

```
npm install
```

Start the MongoDB Entity Store

```
node server.js
```

The MongoDB Entity Store should now be listening on port 6021

### Starting the Web Interface

Open a new Terminal window. Then, from the main V Alpha 2 folder, execute the following:

Install dependencies for the Web Interface

```
cd web-interface
```

```
npm install
```

Start the Web Interface

```
node server.js
```

Finally access the application in any browser

```
localhost:6029
```

If all is well you should see an empty app, with "no items found"

## Adding Content

### Manual Content

Press the Join Button, click "Create new account" and give your
account a name. Then send.

`Make a note of the key`!

Now you can add items to the marketplace. Click 'Jobs', click the plus button and fill out the form with a test job. Then send.

You may have to reload the page (currently) to see the added items.

### Demo Content

Note: When planning to use the Smart Contract, you should add addresses to the demo content file before running the following routine. See also `Using Addresses` below.

To install the demo content, open `v-setup.js` in your preferred text editor and set `demoContent` to `true`.

*in*
```
web-interface/app/src/vcore/v/v-setup.js
```
*set*
```
demoContent: true, // ...
```

Now reload the app in the browser. This triggers the adding of demo content into the MongoDB Entity Store.

```
reload app in browser
```

Before continuing, change `demoContent` back to `false` in order to not add it again with every browser reload.

```
demoContent: false, // ...
```

Now reload the app in the browser again to see all content added.

```
reload app in browser
```

## Using the Smart Contract

### Starting Truffle and Deploying the Smart Contract

Make sure Truffle is installed. Then, from the main V Alpha 2 folder,
execute the following:

Install dependencies for the Smart Contract / for Truffle

```
cd smart-contract
```

```
npm install
```

Start Truffle and deploy the Smart Contract

```
cd migrations
```

```
truffle develop
```

```
migrate
```

Take note of addresses and contract address

### Adding Truffle to MetaMask

Make sure MetaMask is installed. Add your local Truffle network to MetaMask where it usually says `Ethereuem Main Net` by selecting `Special RPC` and
entering/confirming the following:

*Network name*
```
Truffle
```
*RPC*
```
http://127.0.0.1:9545/
```


### Changing V Core Settings to use EVM and contract

To use the app/make transactions with the Smart Contract, open `v-setup.js` in your preferred text editor and set `transactionLedger` to `EVM`.

*in*
```
web-interface/app/src/vcore/v/v-setup.js
```
*set*
```
transactionLedger: 'EVM', // ...
```
*set*
```
contractAddress: '0x...',
```

### Using Addresses

The app will prompt to name your address, when joining and no entity associated with that address is found in the Entity Store.

You can optionally add addresses to `demo-content.js`, before running the demo content installation routine.

*in*
```
web-interface/app/assets/demo-content/demo-content.js
```
