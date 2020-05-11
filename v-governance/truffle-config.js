const TruffleConfig = require('@aragon/truffle-config-v5/truffle-config')

TruffleConfig.compilers.solc.version = '0.5.8'
TruffleConfig.networks.rpc.gas = 8e6
TruffleConfig.networks.rinkeby.gas = 8e6
TruffleConfig.networks.staging = TruffleConfig.networks.rinkeby
TruffleConfig.networks.usability = TruffleConfig.networks.rinkeby

module.exports = TruffleConfig
