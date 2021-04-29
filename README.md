# Value Instrument Alpha - Version 2

### Integrating with

![eth-ledger](https://user-images.githubusercontent.com/20671922/79995007-f060a000-84b6-11ea-94cd-3b7c1ee50543.png) &nbsp;&nbsp;
![3box-ledger](https://user-images.githubusercontent.com/20671922/79994898-ceffb400-84b6-11ea-92d5-38d365f89d5c.png) &nbsp;&nbsp;
![xym-ledger](https://user-images.githubusercontent.com/20671922/79999144-daa1a980-84bb-11ea-8a9b-12501cc992a7.png) &nbsp;&nbsp;&nbsp;
![firebase](https://user-images.githubusercontent.com/20671922/103211186-cbef7a00-4907-11eb-930e-0e7add919317.png) &nbsp;&nbsp;
![mongodb-ledger](https://user-images.githubusercontent.com/20671922/79994780-abd50480-84b6-11ea-970d-ec0eedd7d609.png)

[Ethereum](https://ethereum.org/) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[3Box](https://3box.io/) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Symbol](https://nemtech.github.io/) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Firebase](https://firebase.google.com/) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[MongoDB](https://www.mongodb.com/)


### Written in

&nbsp;&nbsp;&nbsp;&nbsp;![javascript](https://user-images.githubusercontent.com/20671922/79997118-7ed62100-84b9-11ea-9e4e-47e7def69f47.png)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![solidity](https://user-images.githubusercontent.com/20671922/80140871-e4eda180-85a8-11ea-98e3-0cac98571010.png)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![graphql](https://user-images.githubusercontent.com/20671922/103210367-b8431400-4905-11eb-9ae9-5a1bb705d77b.png)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![tailwind-logo](https://user-images.githubusercontent.com/20671922/80020969-25cab500-84da-11ea-952e-74006c460884.png)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Solidity](https://docs.soliditylang.org/)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[GraphQL](https://graphql.org/)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[Tailwind CSS](https://tailwindcss.com/)


## Contains

This repository contains five distinct code bases:

🔸 **Web Interface** [View a code example](https://github.com/valueinstrument/v-alpha-2/blob/master/web-interface/app/plugins/src/marketplace/marketplace.js)

Modules to connect to distributed ledger technologies and distributed identity mechanisms, and build user interfaces around these technologies. All web interface modules are written in plain Javascript.

**VCore** provides modules to access Ethereum and all EVM-compatible ledgers, Symbol ledgers, 3Box profiles, storage and messages, MongoDB (e.g. our MongoDB Entity Store) and Firebase (e.g. our GraphQL/Firebase Entity Store). It further contains many methods for DOM node creation and manipulation, a state and caching module and other useful helper-methods.

**VTheme** is a first theme build with VCore. A responsive web app, featuring an intelligent menu, login user flow, mapping and more.

**VPlugins** create and display various content. Plugins control what and how content is displayed in the VTheme. Included are our first plugins to manage a marketplace, display the map, chat and entity management.


🔸 **Smart Contract** [View the code](https://github.com/valueinstrument/v-alpha-2/blob/master/smart-contract/contracts/VICoin.sol)

The VToken concept cast into a smart contract, which can be setup on Ethereum and EVM-compatible ledgers. This is a special kind of token with several customizable properties, which can be set to the initiators liking.


🔸 **Smart Contract Admin Panel**

The Admin Panel allows the initiators of a VToken smart contract to change any of its settings, conveniently via a web interface.


🔸 **MongoDB Entity Store**

The MongoDB Entity Store resolves user names to Web3 addresses, when a distributed ledger is used to transact funds but not used for identities. This is helpful for testing and exploring user needs. This module also enables token accounts and transactions in VToken format, if no distributed ledger is used for transactions either (as a simulation of such) and provides a network/community chat-thread.


🔸 **GraphQL/Firebase Entity Store**

The GraphQL/Firebase Entity Store is an API that manages entity names and their profiles and resolves them to Web3 addresses.


## Live Networks & Demos

[builderz.io network](https://builderz.io)

[Neighborhood Economics & Trinity Christian College Chicago](http://neighborhoodeconomics.trnty.edu/)


## Installation

Please refer to the [INSTALL](https://github.com/valueinstrument/v-alpha-2/blob/development/INSTALL.md) file.


## Documentation

Please visit the [Wiki](https://github.com/valueinstrument/v-alpha-2/wiki) here on GitHub to find the documentation.


## Contribute

Visit the [Issues](https://github.com/valueinstrument/v-alpha-2/issues) to find a selection of tasks in need of attention. The issues listed mainly provide a global overview. We do not currently track detailed issues or the project roadmap here on GitHub.


## Intro Video

View the [builderz.io Intro Video](https://youtu.be/kJbto4TISKA) on YouTube to get an idea of the project.

Here are some screenshots:

![V Alpha 2 Screenshot 1](https://user-images.githubusercontent.com/20671922/101465423-35e7b580-3940-11eb-9941-36f1b9469b07.png)

![V Alpha 2 Screenshot 2](https://user-images.githubusercontent.com/20671922/101465532-57e13800-3940-11eb-8e62-7896bd06c42a.png)
