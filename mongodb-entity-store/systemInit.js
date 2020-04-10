// Initialization

exports.production = false;  // resets or keeps database when restarting app // Type Boolean // 'false' to reset

exports.runUpgradeRoutine = false;  // enables/disables upgrade routine // Type Boolean // 'true' to enable

exports.initializeDatabase = true;  // enables/disables Database initialization on first install // Type Boolean // 'true' to enable

exports.loadDemoContent = true;  // enables/disables Plugin Demo Content // Type Boolean // 'true' to enable


// Ledger settings

   /*
      Be aware of allocated accounts

      one: Community
      two: Community Contribution
      three: Vivi
      four: Token Twister
   */

exports.ledger = {
                    choice: 'ropsten',  // choose from network names below

                    truffle: {
                      contractAddress: '0xfb8f1f762801e54b300E3679645fBB3571339Bc0',
                      rpc: 'HTTP://127.0.0.1:9545'
                    },

                    ropsten: {
                      contractAddress: '0x1BA1f453D3d6d48757C84303bC1d93E87Bfd0a54',
                      rpc: 'https://ropsten.infura.io/v3/625537f6d9c8478980570cd3c99f5623'
                    },

                    pchain: {
                      contractAddress: '0x7f4c6ba99864fcf201f6cb07b0df8da0ffd0b818',
                      rpc: 'https://node0x.pchain.club:6969/child_0'
                    },

                    // Test wallet 1 - Mnemonic: park image awkward badge lift scheme leave useless opera prefer soon bag

                    accounts: {
                      one: '0x77eae521bda57bb38496f26cc2d250c26c3dd22a',
                      two: '0xdfb69ffdfe70fd00698891b753c2b029bceb3807',
                      three: '0x345bb575d9679b36a5f1670f34e72d10cdf57aed',
                      four: '0x3cbecbcaf1d31a9d4f2fd7f3de84ae80859e012f',
                      five: '0xedd15e1748002c2ca04226cbee0519a00d3aaad4',
                      six: '0xd0b751e669e7696395656e168136af60be257586',
                      seven: '0x0dc22cbb100d82ad25f9ef5f80148e28dadd038d',
                      eight: '0x285db3427495ce837feec3a93e7034a5da005b50',
                      nine: '0x9006580d71d01b418720dccde359f94f50076974',
                      ten: '0x7f79130a59a6950abf5d053ff705ff6a2eb60c2c',
                    },
                    privKeys: {
                      one: 'ae458e1123dede0b9efb6880f55bc63174b4ea8d76d2e8e59e841083d04aebe3',
                      two: '990d63e7b06c44a0b8dee996fd0176ced100f4a027d8eee7fe1881dd742b44a4',
                      three: 'f7a28b093a9a0086cc3ae182b43b92878f8c486b512e1bdad01a0e6758375593',
                      four: 'a957da349b5696ecb2b2803ba18ecc18303337d82e4d0fb547ee48147d175124',
                      five: '114d94932f41ce6496301091da4b74536155d43ca5c99ca24dfa483710f308a5',
                      six: 'b1198ad90ba2c320d5a3e4e37b71fec42d177a8b3c2fe277f30a3486c9247b6c',
                      seven: '82e835bc6a8397cdcd1d84e5c6a3b6195b0f6eb21e890f1acc058da3ff93f5a1',
                      eight: '5abc054d4c9bd0019b1b7a79e39e8b32bf404250b363587f8813a49443f7fc79',
                      nine: 'ef941aa20ec676acbddf0e5be471f1cbacd9c93164d8928ce06a4d896c022059',
                      ten: '1d1757eaf408e98c1637967c256dc75bb14d7c270f42cd109e910639318c2389',
                    },

                    // // Test wallet 2 - Mnemonic: bachelor subway public potato crunch domain carbon scissors scene gauge what congress
                    //
                    // accounts: {
                    //   one: '0xe438d672987b63591d2dc49482734e0389f0b110',
                    //   two: '0x3107b077b7745994cd93d85092db034ca1984d46',
                    //   three: '0xaa95dbb75e08d3dff45b1471efcff68a2d24f86b',
                    //   four: '0x623fed039bb4b321eadd1d94aee9778d365bb48f',
                    //   five: '0xd7b9425876ccdfaac0999c645803e4bfd4b593df',
                    //   six: '0xed86eb7a300119fee3ace44cdf0da2383789b628',
                    //   seven: '0x3250c42056ac611876522dab5e6c05f69f36efca',
                    //   eight: '0x249f01414972c2667fb2c8610237a08aa6f1f43e',
                    //   nine: '0x10dee3399b9c819c2465fd61bc59ecd61b63567e',
                    //   ten: '0xd601fa8bab4df5bcb1b72f031f8643263917b81b',
                    // },
                    // privKeys: {
                    //   one: '07fecb9f5a8641dd8c37583c825a4bced971f907f1aa324caf0e48b34180fa18',
                    //   two: 'eea3eb3f098e41fb51baed92a134d1e9cc19b6ae93e29c66968f081f05f20106',
                    //   three: '43df8e1351e48f5d8504175d36f128a5f27e5557093fbe173f5f62b2e8b48bea',
                    //   four: '0456c3a58bad2b369438a3a64790351ce0eb5f6b3df0df1a1cafe0b31a56c587',
                    //   five: '3473bed605d1cc715649751dc4ec7d57bf0c5caf2b0a2076a150d7bfd956e30b',
                    //   six: 'a15ca36448b5fdc886de75e8e1d306fbc1b276f722f9ade79daae7e77dc21af5',
                    //   seven: '38891eef221026da27b869174fb69c7a86a12b9fc83d33aa14bc949244e237c5',
                    //   eight: 'aa26df2625fd2e420b0d4ae59e1963451ac76f02894b80760f0c0e4dfbee8b0b',
                    //   nine: '2b09171a08f9701c76dd8694310fca18e936fe6127fe0c62400278a575518ce1',
                    //   ten: 'b9db386121e8c6480b2e0a2df4ccfb35567846329bc7cf7c498a3aa2efd588f2',
                    // },

                 }


// Plugins

exports.geoModule = true;   // enables/disables Location Service // Type Boolean // 'true' to enable

exports.telegramModule = {
                           on: false,  // enables/disables Telegram Service // Type Boolean // 'true' to enable
                           adminNotifications: true,  // enables/disables admin notification via Telegram // Type Boolean // 'true' to enable
                         }

exports.emailModule = {
                         on: true,  // enables/disables Email Service // Type Boolean // 'true' to enable
                         adminNotifications: false,  // enables/disables admin notification via Email // Type Boolean // 'true' to enable
                      }

exports.appAnalyticsModule = false;   // enables/disables App Analytics Service // Type Boolean // 'true' to enable

exports.poolModule = false;  // enables/disables Pool Plugin // Type Boolean // 'true' to enable

exports.contributionModule = false;   // enables/disables Contribution Service // Type Boolean // 'true' to enable

exports.tokenTwister = true;   // enables/disables Token Twister game // Type Boolean // 'true' to enable


// Network Settings

exports.language = 'en-US';  // sets the app-language // Type String // e.g. en US for English, de DE for German

exports.initTag = '#2121'; // the first entity tag // MUST be 4 digits preceded by '#' , e.g. '#2121' // Type String

exports.admins = [  // add objects for each admin

                  // {
                  //   name: 'Anna Blume',  // the community admin name // MUST be in one word // Type String // choose your preferred admin name
                  //   uPhrase: 'vxABTestLogin',  // corresponding admin uPhrase // MUST start with "vx" // Type String // choose your preferred phrase
                  //   tag: exports.initTag,
                  //   evmCredentials: {
                  //     address: exports.ledger.accounts.five,
                  //   }
                  // },
                  // {
                  //   name: 'Grifma',
                  //   uPhrase: 'vxMGTestLogin',
                  //   tag: exports.initTag,
                  //   evmCredentials: {
                  //     address: exports.ledger.accounts.six,
                  //   }
                  // },
                  // {
                  //   name: 'Philipeachille',
                  //   uPhrase: 'vxPAVPrivateLogin',
                  //   tag: exports.initTag,
                  //   evmCredentials: {
                  //     address: exports.ledger.accounts.seven,
                  //   }
                  // },
                  // {
                  //   name: 'Bertrand Juglas',
                  //   uPhrase: 'vxBJPrivateLogin',
                  //   tag: exports.initTag,
                  //   evmCredentials: {
                  //     address: exports.ledger.accounts.eight,
                  //   }
                  // },
                  // {
                  //   name: 'Le Zhang',
                  //   uPhrase: 'vxLZPrivateLogin',
                  //   tag: exports.initTag,
                  //   evmCredentials: {
                  //     address: exports.ledger.accounts.nine,
                  //   }
                  // },
                  {
                    name: 'Vivi',
                    uPhrase: 'vxViviBotLogin3001',
                    tag: exports.initTag,
                    evmCredentials: {
                      address: exports.ledger.accounts.three,
                    }
                  },
               ];


// Community Governance Settings - uncomment/comment alternative setups within object

exports.communityGovernance = {
                                // PChain network
                                commName: 'Community',
                                commuPhrase: 'vxPChainClubLogin3001',
                                excludeNames: ['Vivi'],
                                indexSuffix: 'pc',
                                commPort: 3051,
                                logo: '<img style="width:50px" src="css/pchain2.png" alt="" />',

                                // Value Instrument
                                // commName: 'Value Instrument',  // the community name // MUST have at least two letters // MUST have capital initials AND no other capital lettering // Type String
                                // commuPhrase: 'vxCommTestLogin',  // corresponding community uPhrase // MUST start with "vx" // Type String
                                // excludeNames: ['Value', 'Vaiue', 'Vivi'],  // avoid impostering by listing names to exclude. Check your community name for things like cap I looking like lower l
                                // indexSuffix: 'vi',  // the index-xx.html suffix
                                // commPort: 3021,  // the app listening port
                                // logo: '',
                                // teleToken: '697711267:AAGx6jVVyc3dNCXesNpJpuqAfqf-rM-n4Y4', // VI Test Telegram Bot token
                                // // teleToken: '807765781:AAGHOLRAkHJ_0nF2pSuS0aiNiWzhTMR8XyM', // VI Alpha Telegram Bot token

                                // // Impact Journey
                                // commName: 'Impact Journey',  // the community name // MUST have at least two letters // MUST have capital initials AND no other capital lettering // Type String
                                // commuPhrase: 'vx19022019HappyNewYear!',  // corresponding community uPhrase // MUST start with "vx" // Type String
                                // excludeNames: ['Impact Journey', 'Vivi'],  // avoid impostering by listing names to exclude. Check your community name for things like cap I looking like lower l
                                // indexSuffix: 'ij',  // the index.html prefix
                                // commPort: 3023,  // the app listening port
                                // logo: '',
                                // teleToken: '711518551:AAHHry2z4qAYBtYSr2_Rp6yErHxyp6rABQY', // IJ Telegram bot token

                                // // Sustainable Development Goals
                                // commName: 'SDG Budgeting HQ',  // the community name // MUST have at least two letters // MUST have capital initials AND no other capital lettering // Type String
                                // commuPhrase: 'vxCommSDGLogin3000',  // corresponding community uPhrase // MUST start with "vx" // Type String
                                // excludeNames: ['Vivi'],  // avoid impostering by listing names to exclude. Check your community name for things like cap I looking like lower l
                                // indexSuffix: 'sdg',  // the index-xx.html suffix
                                // commPort: 3025,  // the app listening port
                                // logo: '',

                                // Core Settings
                                teleAdminNofityChat: -1001183339458, // Telegram Group Chat ID for admin notifications // starts with -
                                adminEmail: 'philipeachille@gmail.com',  // Email address for admin notifications
                                locationPreset: 'Berlin, Deutschland',  // Location for initialization
                                geoPreset: [ 13.314, 52.4901 ],  // Lng and Lat for initialization
                                commTag: exports.initTag,  // the community tag
                                commIgnition: 250000,  // token amount for community account at start // Type Number (integer)
                                allowPublic: true,  // allow public user signup
                                limitTransactions: true,  // unverified entities can only transact with other unverified entities // Type Boolean // 'true' to enable
                                limitCreation: false,  // unverified entities can not create pools or other entities // Type Boolean // 'true' to enable
                                capWordLength: 7,  // a cap on the number of words in an entity name that the system can handle
                                maxEntityWords: 7,  // max allowed words in entity names (not humans) // MUST be less or equal to capWordLength
                                maxHumanWords: 3,  // max allowed words in human entity names // MUST be less or equal to capWordLength
                                maxWordLength: 12,  // max allowed length of each word in name

                                evmCredentials: {
                                  address: exports.ledger.accounts.one,
                                  privKey: exports.ledger.privKeys.one,
                                }

                             }


// Token Dynamic - uncomment/comment alternative setups within object

exports.tokenDyn = {
                      // alpha.valueinstrument.org
                      baseTimeToZero: 60 * 60 * 24,  // token-lifetime in seconds // e.g. 60 * 60 * 24 is one day // Type Number (integer)
                      daysToZero: 120,  // multiplier for token-lifetime in days // this can ALSO be seconds, if baseTimeToZero is set to 1 // Type Number (integer)
                      payout: 140,  // regular payout amount // expressed in tokens // Type Number (integer)
                      payoutInterval: 60 * 60 * 24,  // regular payout interval // expressed in sec // Maximum delay value is 24 days // Type Number (integer)
                      initialBalance: 1000, // 24 * 40,  // initial balance on new accounts // expressed in tokens // Type Number (integer)
                      updateVisFreq: 60 * 60,  // how often the user interface updates // expressed in sec // Type Number (integer)
                      setTxFee: 0.5,  // transaction fee // e.g. 0.5 for 50%, can also be 0 // Type Number (decimal)

                      // // Workshops
                      // baseTimeToZero: 60,  // token-lifetime in seconds // e.g. 60 * 60 * 24 is one day // Type Number (integer)
                      // daysToZero: 70,  // multiplier for token-lifetime in days // this can ALSO be seconds, if baseTimeToZero is set to 1 // Type Number (integer)
                      // payout: 24,  // regular payout amount // expressed in tokens // Type Number (integer)
                      // payoutInterval: 60 * 4,  // regular payout interval // expressed in sec // Maximum delay value is 24 days // Type Number (integer)
                      // initialBalance: 24 * 12,  // initial balance on new accounts // expressed in tokens // Type Number (integer)
                      // updateVisFreq: 60 * 2,  // how often the user interface updates // expressed in sec // Type Number (integer)
                      // setTxFee: 0.3333333333,  // transaction fee // e.g. 0.5 for 50%, can also be 0 // Type Number (decimal)

                      // // Fair Shares
                      // baseTimeToZero: 60 * 60 * 24,  // token-lifetime in seconds // e.g. 60 * 60 * 24 is one day // Type Number (integer)
                      // daysToZero: 360 * 200, // multiplier for token-lifetime in days // this can ALSO be seconds, if baseTimeToZero is set to 1 // Type Number (integer)
                      // payout: 12,  // regular payout amount // expressed in tokens // Type Number (integer)
                      // payoutInterval: 60 * 60 * 24,  // regular payout interval // expressed in sec // Maximum delay value is 24 days // Type Number (integer)
                      // initialBalance: 12,  // initial balance on new accounts // expressed in tokens // Type Number (integer)
                      // updateVisFreq: 60 * 60,  // how often the user interface updates // expressed in sec // Type Number (integer)
                      // setTxFee: 0, // transaction fee // e.g. 0.5 for 50%, can also be 0 // Type Number (decimal)

                      // // Live Presentation of burn
                      // baseTimeToZero: 1,  // token-lifetime in seconds // e.g. 60 * 60 * 24 is one day // Type Number (integer)
                      // daysToZero: 60 * 3,  // multiplier for token-lifetime in days // this can ALSO be seconds, if baseTimeToZero is set to 1 // Type Number (integer)
                      // payout: 24,  // regular payout amount // expressed in tokens // Type Number (integer)
                      // payoutInterval: 4,  // regular payout interval // expressed in sec // Maximum delay value is 24 days // Type Number (integer)
                      // initialBalance: 24 * 25,  // initial balance on new accounts // expressed in tokens // Type Number (integer)
                      // updateVisFreq: 60 * 60,  // how often the user interface updates // expressed in sec // Type Number (integer)
                      // setTxFee: 0.3333333333,  // transaction fee // e.g. 0.5 for 50%, can also be 0 // Type Number (decimal)

                  }


const i18n = require('./lang/' + exports.language);


exports.tokenDynDisplay = {  // refer to language files also
                             payoutTitle: i18n.strSysI110,  // Title for payout given as reference // Type String
                             intervalString: 'weekly',// i18n.strSysI120,  // display interval string in community statistics // e.g. "daily", "weekly" etc... // Type String
                             tt0String: 'indefinite', // i18n.strSysI130,  // display time-to-zero info in community statistics // e.g. "1 day", "6 months" etc... // Type String
                             tt0StringTable: i18n.strSysI140,  // column title in tx history page for time-to-zero // e.g. "Days" // Type String
                             displayBurn: true,  // display burned amount in table in tx history page // 'true' to display // Type Boolean
                             displayTt0: true,  // display time-to-zero in table in tx history page // 'true' to display // Type Boolean
                          }


exports.taxPool = {  // refer to language files also
                     name: 'Community Contribution',  // the community tax pool name // MUST be in one word // Type String
                     uPhrase: 'vxCCLogin3001', // corresponding community tax pool uPhrase // MUST start with "vpx" // Type String
                     tag: exports.initTag,
                     description: i18n.strSysI150,  // tax pool description // Type string
                     target: 20000,  // tax pool target // Type Number (integer)
                     ignition: 10,  // tax pool first balance // MUST be greater than 0 // Type Number (integer)
                     commTax: 0.15,  // taxation on transaction calculated FROM TX FEE (!) expressed in decimal number such as 0.1 for 10% // Type Number (decimal)
                     displayInPools: false,  // display tax pool in pools list // 'true' to display // Type Boolean
                     displayInStats: false,  // display tax pool balance in community stats // 'true' to display // Type Boolean

                     evmCredentials: {
                       address: exports.ledger.accounts.two,
                     }

                  }


exports.poolGovernance = {
                            ignition: 0,  // new pool first balance expressed in tokens // Type Number (integer)
                            timeLimit: 60 * 60 * 24,  // time limit on requesting funds, expressed in seconds // Type Number (integer)
                            maxRequest: 100,  // limit of amount when requesting funds, expressed in tokens // Type Number (integer)
                            minTarget: 100,  // minimum target, expressed in tokens // MUST be greater than 0 // Type Number (integer)
                            taxOnTx: false,  // taxation on pool transactions? // 'true' to enable // Type Boolean
                            expires: 6,  // automatic pool expiry, expressed in months // Type Number (integer)
                            fillPeriod: 7,  // how long a pool can be filled, expressed in days // Type Number (integer)
                         }
