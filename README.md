# V Alpha 2
Value Instrument Prototype - Version 2

## Contains

This repository contains three distinct code bases:

- Web Interface
- Smart Contract
- MongoDB Entity Store

**Web Interface**

Modules to connect to distributed ledger technologies and distributed identity mechanisms, and build user interfaces around these technologies. All written in plain Javascript.

VCore

> VCore provides modules to access [Ethereum](https://ethereum.org/) and all [EVM compatible](https://chainid.network/) ledgers, [Symbol](https://nemtech.github.io/) ledgers (by NEM), [3Box](https://3box.io/) identity store and chat, [MongoDB](https://www.mongodb.com/) entity store

VTheme

> A first theme build with VCore. A responsive web app, featuring an intelligent menu, login user flow, mapping and more.

VPlugins

> Modules to create and display content. Plugins control what is displayed in the Theme.

**Smart Contract**

The VToken concept cast into a smart contract, which can be setup on Ethereum and EVM-compatible ledgers. This is a special kind of token with several customizable properties, which can be set to the initiators liking.

**MongoDB Entity Store**

The MongoDB Entity Store resolves user names to Web3 addresses, when a distributed ledger is used to transact funds but not used for identities. This is helpful for testing and exploring user needs. This module also enables token accounts and transactions in VToken format, if no distributed ledger is used for transactions either (as a simulation of such).

## Documentation

Please visit the [Wiki](https://github.com/valueinstrument/v-alpha-2/wiki) here on GitHub to find the documentation

## Contribute

Visit the [Project Board](https://github.com/valueinstrument/v-alpha-2/projects/1) here on GitHub to find things to contribute

## Intro Video

View the [Intro Video](https://youtu.be/47wnrc06FDo) on YouTube to get an idea of the project

![V Alpha 2 Screenshot](https://user-images.githubusercontent.com/20671922/78137776-2796e080-7426-11ea-9208-87a2d4c5741f.png)
