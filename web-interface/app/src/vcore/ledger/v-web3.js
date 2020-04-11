const VWeb3 = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Web3
   *
   */

  'use strict';

  let Web3Obj;
  let contract;
  let box, space;

  /* ================== private methods ================= */

  function viAbi() {
    return JSON.parse( JSON.stringify( [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          {
            name: '',
            type: 'string'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: 'spender',
            type: 'address'
          },
          {
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'communityTax',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'initialBalance',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'multiplier',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'address'
          }
        ],
        name: 'lastGenerationBlock',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'communityTaxAccount',
        outputs: [
          {
            name: '',
            type: 'address'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: 'spender',
            type: 'address'
          },
          {
            name: 'addedValue',
            type: 'uint256'
          }
        ],
        name: 'increaseAllowance',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_newController',
            type: 'address'
          }
        ],
        name: 'changeController',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'burn',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'address'
          }
        ],
        name: 'zeroBlock',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'lifetime',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: 'owner',
            type: 'address'
          }
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: 'from',
            type: 'address'
          },
          {
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'burnFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'blocksMined',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            name: '',
            type: 'string'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: 'account',
            type: 'address'
          }
        ],
        name: 'addMinter',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'renounceMinter',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'taxFeeDecimals',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'transactionFee',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: 'spender',
            type: 'address'
          },
          {
            name: 'subtractedValue',
            type: 'uint256'
          }
        ],
        name: 'decreaseAllowance',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'address'
          }
        ],
        name: 'lastTransactionBlock',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: 'account',
            type: 'address'
          }
        ],
        name: 'isMinter',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: 'owner',
            type: 'address'
          },
          {
            name: 'spender',
            type: 'address'
          }
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'generationAmount',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_fuseID',
            type: 'uint8'
          },
          {
            name: '_confirm',
            type: 'bool'
          }
        ],
        name: 'blowFuse',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_confirm',
            type: 'bool'
          }
        ],
        name: 'blowAllFuses',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'generationPeriod',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'address'
          }
        ],
        name: 'accountApproved',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'controller',
        outputs: [
          {
            name: '',
            type: 'address'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [
          {
            name: '_name',
            type: 'string'
          },
          {
            name: '_symbol',
            type: 'string'
          },
          {
            name: '_decimals',
            type: 'uint8'
          },
          {
            name: '_lifetime',
            type: 'uint256'
          },
          {
            name: '_generationAmount',
            type: 'uint256'
          },
          {
            name: '_generationPeriod',
            type: 'uint256'
          },
          {
            name: '_communityTax',
            type: 'uint256'
          },
          {
            name: '_transactionFee',
            type: 'uint256'
          },
          {
            name: '_initialBalance',
            type: 'uint256'
          },
          {
            name: '_communityTaxAccount',
            type: 'address'
          },
          {
            name: '_controller',
            type: 'address'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor'
      },
      {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_account',
            type: 'address'
          },
          {
            indexed: false,
            name: '_income',
            type: 'uint256'
          }
        ],
        name: 'IncomeReceived',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_account',
            type: 'address'
          },
          {
            indexed: false,
            name: '_decay',
            type: 'uint256'
          }
        ],
        name: 'Decay',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'Mint',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_account',
            type: 'address'
          }
        ],
        name: 'NewAccount',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'Burn',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'PaidTax',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'BurnedFees',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_account',
            type: 'address'
          }
        ],
        name: 'ApproveAccount',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_account',
            type: 'address'
          }
        ],
        name: 'UnapproveAccount',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_lifetime',
            type: 'uint256'
          }
        ],
        name: 'UpdateLifetime',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_initialBalance',
            type: 'uint256'
          }
        ],
        name: 'UpdateInitialBalance',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_generationAmount',
            type: 'uint256'
          }
        ],
        name: 'UpdateGenerationAmount',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_generationPeriod',
            type: 'uint256'
          }
        ],
        name: 'UpdateGenerationPeriod',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_newCommunityTaxAccount',
            type: 'address'
          }
        ],
        name: 'UpdateCommunityTaxAccount',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_transactionFee',
            type: 'uint256'
          }
        ],
        name: 'UpdateTransactionFee',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_communityTax',
            type: 'uint256'
          }
        ],
        name: 'UpdateCommunityTax',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_block',
            type: 'uint256'
          }
        ],
        name: 'Mined',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_name',
            type: 'string'
          },
          {
            indexed: false,
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'Log',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_fuseID',
            type: 'uint8'
          }
        ],
        name: 'BlowFuse',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [],
        name: 'BlowAllFuses',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_newController',
            type: 'address'
          }
        ],
        name: 'ChangeController',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'account',
            type: 'address'
          }
        ],
        name: 'MinterAdded',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'account',
            type: 'address'
          }
        ],
        name: 'MinterRemoved',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address'
          },
          {
            indexed: true,
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'Transfer',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address'
          },
          {
            indexed: true,
            name: 'spender',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'Approval',
        type: 'event'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_blockNumber',
            type: 'uint256'
          },
          {
            name: '_lastGenerationBlock',
            type: 'uint256'
          },
          {
            name: '_generationPeriod',
            type: 'uint256'
          }
        ],
        name: 'calcNumCompletedPeriods',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_account',
            type: 'address'
          }
        ],
        name: 'triggerOnchainBalanceUpdate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_blockNumber',
            type: 'uint256'
          },
          {
            name: '_lastGenerationBlock',
            type: 'uint256'
          },
          {
            name: '_lifetime',
            type: 'uint256'
          },
          {
            name: '_generationAmount',
            type: 'uint256'
          },
          {
            name: '_generationPeriod',
            type: 'uint256'
          }
        ],
        name: 'calcGeneration',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_account',
            type: 'address'
          }
        ],
        name: 'liveBalanceOf',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_account',
            type: 'address'
          }
        ],
        name: 'getDecayedBalance',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address'
          },
          {
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '',
            type: 'address'
          },
          {
            name: '',
            type: 'address'
          },
          {
            name: '',
            type: 'uint256'
          }
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_value',
            type: 'uint256'
          },
          {
            name: '_feeRate',
            type: 'uint256'
          },
          {
            name: '_taxRate',
            type: 'uint256'
          }
        ],
        name: 'calcTax',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_value',
            type: 'uint256'
          },
          {
            name: '_feeRate',
            type: 'uint256'
          },
          {
            name: '_taxRate',
            type: 'uint256'
          }
        ],
        name: 'calcFeesToBurn',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_value',
            type: 'uint256'
          },
          {
            name: '_feeRate',
            type: 'uint256'
          }
        ],
        name: 'calcFeesIncTax',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_account',
            type: 'address'
          }
        ],
        name: 'getDetails',
        outputs: [
          {
            name: '_lastBlock',
            type: 'uint256'
          },
          {
            name: '_balance',
            type: 'uint256'
          },
          {
            name: '_zeroBlock',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_value',
            type: 'uint256'
          },
          {
            name: '_balance',
            type: 'uint256'
          },
          {
            name: '_blockNumber',
            type: 'uint256'
          },
          {
            name: '_lifetime',
            type: 'uint256'
          },
          {
            name: '_originalZeroBlock',
            type: 'uint256'
          }
        ],
        name: 'calcZeroBlock',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_lastTransactionBlock',
            type: 'uint256'
          },
          {
            name: '_balance',
            type: 'uint256'
          },
          {
            name: '_thisBlock',
            type: 'uint256'
          },
          {
            name: '_zeroBlock',
            type: 'uint256'
          }
        ],
        name: 'calcDecay',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'getBlockNumber',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'finishMinting',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'mint',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: 'to',
            type: 'address'
          },
          {
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'mint',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_account',
            type: 'address'
          }
        ],
        name: 'approveAccount',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_account',
            type: 'address'
          }
        ],
        name: 'unapproveAccount',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_account',
            type: 'address'
          }
        ],
        name: 'newAccount',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_lifetime',
            type: 'uint256'
          }
        ],
        name: 'updateLifetime',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_initialBalance',
            type: 'uint256'
          }
        ],
        name: 'updateInitialBalance',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_generationPeriod',
            type: 'uint256'
          }
        ],
        name: 'updateGenerationPeriod',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_generationAmount',
            type: 'uint256'
          }
        ],
        name: 'updateGenerationAmount',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'getGenerationAmount',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'mine',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_newCommunityTaxAccount',
            type: 'address'
          }
        ],
        name: 'updateCommunityTaxAccount',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_communityTax',
            type: 'uint256'
          }
        ],
        name: 'updateCommunityTax',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_transactionFee',
            type: 'uint256'
          }
        ],
        name: 'updateTransactionFee',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_confirm',
            type: 'bool'
          },
          {
            name: '_recoverFunds',
            type: 'address'
          }
        ],
        name: 'terminateCurrency',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ] ) );
  }

  function castEthBalance( balance ) {
    return Number( balance / 10**18 ).toFixed( 1 );
  }

  function castTokenBalance( balance, decimals ) {
    return Number( balance / 10**( decimals || 6 ) ).toFixed( 0 ); // TODO: get decimals from contract
  }

  async function getWeb3Provider() {

    let provider;

    // Modern dapp browsers...
    if ( window.ethereum ) {
      // console.log( 'ethereum is there' );
      provider = window.ethereum;

      try {
      // Request account access
        await window.ethereum.enable();

        return {
          success: true,
          status: 'provider set',
          data: [ provider ]
        };

      }
      catch ( error ) {
      // User denied account access...
        return {
          success: false,
          status: 'user denied auth',
        };
      }
    }
    // Legacy dapp browsers...
    else if ( window.web3 ) {
      // console.log( 'web3 is there' );
      provider = window.web3.currentProvider;

      return {
        success: true,
        status: 'legacy provider set',
        data: [ provider ]
      };
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      //  console.log( 'local network is there' );
      //  provider = new Web3.providers.HttpProvider( 'http://localhost:9545' );
      return {
        success: false,
        status: 'web3 provider not found',
      };
    }

  }

  /* ============ public methods and exports ============ */

  async function set3BoxSpace( which, data ) {
    await space.public.set( which, data );

    // for testing only
    // const entityData = await space.public.get( 'entity' );
    // console.log( 'saved:', entityData );
  }

  async function get3BoxSpace( which ) {
    if ( Web3Obj && Web3Obj._provider ) {
      box = await Box.openBox( which, Web3Obj._provider );
      await box.syncDone;
      space = await box.openSpace( 'v-alpha-2' );

      if ( space && V.getSetting( 'update3BoxEntityStore' ) ) {
        return {
          success: false,
          reset: true,
        };
      }

      const entityData = await space.public.get( 'entity' );

      // for testing only
      // box.public.remove( 'fullId' );
      // const profile = await box.public.all();
      // console.log( profile );
      // console.log( space );

      if ( entityData && entityData.fullId ) {
        console.log( 'retrieved 3Box V Alpha 2 entity: ', entityData );
        return {
          success: true,
          status: 'retrieved 3Box V Alpha 2 entity data',
          data: [ entityData ]
        };
      }
      else {
        return {
          success: false,
          status: 'could not retrieve 3Box V Alpha 2 entity data',
          data: []
        };
      }

    }
    else {
      return {
        success: false,
        status: '3Box not retrieved/no provider',
        data: []
      };
    }
  }

  function setActiveAddress() {

    if ( window.ethereum && !window.ethereum.selectedAddress ) {
      Join.draw( 'wallet locked' );
    }

    return getWeb3Provider().then( res => {

      if ( res.success ) {

        Web3Obj = new Web3( res.data[0] );
        contract = new Web3Obj.eth.Contract( viAbi(), V.getNetwork( V.getNetwork( 'choice' ) )['contractAddress'] );

        const activeAddress = Web3Obj.currentProvider.publicConfigStore._state.selectedAddress;
        V.setState( 'activeAddress', activeAddress ? activeAddress.toLowerCase() : false );

        Web3Obj.currentProvider.publicConfigStore.on( 'update', function setNewActiveAddress() {

          var currentActiveAddress = Web3Obj.currentProvider.publicConfigStore._state.selectedAddress;
          // console.log( currentActiveAddress );
          // console.log( V.getState( 'activeAddress' ) );
          if ( currentActiveAddress == null ) {
            V.setState( 'activeAddress', false );
            Join.draw( 'logged out' );
          }
          else if ( currentActiveAddress != V.getState( 'activeAddress' ) ) {
            V.setState( 'activeAddress', currentActiveAddress.toLowerCase() );
            Join.draw( 'new address set' );
          }

        } );

        return {
          success: true,
          status: 'address set',
        };
      }
      else {
        return res;
      }
    } );
  }

  async function getContractState() {
    if ( contract ) {

      const blockNumber = contract.methods.getBlockNumber().call();

      const allEvents = contract.getPastEvents( 'allEvents', {
      // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
        fromBlock: 0,
        toBlock: 'latest'
      }, ( error ) => {return error ? console.error( error ) : null} )
        .then( res => {
          return res.map( item => {
            return {
              b: item.blockNumber,
              e: item.event,
              val: item.returnValues.value/( 10**6 ),
              to: item.returnValues.to,
              from: item.returnValues.from,
              all: item
            };
          } ).reverse();
        } );

      const all = await Promise.all( [ blockNumber, allEvents ] );

      if ( all[0] && all[1] ) {

        console.log( '*** CONTRACT STATUS ***' );
        console.log( 'Current Block: ', all[0] );
        console.log( 'Contract: ', contract._address );
        console.log( 'All Events:', all[1] );
        console.log( '*** CONTRACT STATUS END ***' );

        return {
          success: true,
          status: 'contract state retrieved',
          data: [{
            currentBlock: Number( all[0] ),
            contract: contract._address,
            allEvents: all[1],
          }]
        };
      }
      else {

        console.log( '*** CONTRACT STATUS ***' );
        console.log( 'Could not get contract status' );
        console.log( '*** CONTRACT STATUS END ***' );

        return {
          success: false,
          status: 'contract state not retrieved',
        };
      }
    }
    else {
      return {
        success: false,
        status: 'contract state not retrieved',
      };
    }
  }

  async function getAddressState( which ) {

    const all = await Promise.all( [
      Web3Obj.eth.getBalance( which ),
      contract.methods.liveBalanceOf( which ).call(),
      contract.methods.getDetails( which ).call()
    ] );

    if ( all[0] && all[1] && all[2] ) {
      return {
        success: true,
        status: 'address state retrieved',
        data: [{
          ethBalance: castEthBalance( all[0] ),
          liveBalance: castTokenBalance( all[1] ),
          tokenBalance: castTokenBalance( all[2]._balance ),
          lastBlock: all[2]._lastBlock,
          zeroBlock: all[2]._zeroBlock,
        }]
      };
    }
    else {
      return {
        success: false,
        status: 'address state not retrieved',
      };
    }

  }

  async function getAddressHistory(
    which = V.getState( 'activeAddress' ),
    data = { fromBlock: 0, toBlock: 'latest' }
  ) {

    const burnA = '0x0000000000000000000000000000000000000000';

    const transfers = await contract.getPastEvents( 'Transfer', {
      // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
      fromBlock: data.fromBlock,
      toBlock: data.toBlock
    }, ( error ) => {
      error ? console.error( error ) : null;
    } )
      .then( ( events ) => {
        return events;
      } );

    if ( !transfers.length ) {
      return {
        success: false,
        status: 'no transfers retrieved',
        data: [ ]
      };
    }

    const filteredTransfers = transfers.filter( tx => {
      const data = tx.returnValues;
      return data.from.toLowerCase() == which ||
                data.to.toLowerCase() == which;

    } ).map( tx => {
      const txData = {};

      txData.fromAddress = tx.returnValues.from.toLowerCase();
      txData.toAddress = tx.returnValues.to.toLowerCase();
      txData.amount = ( tx.returnValues.value / 10**6 ).toFixed( 0 );

      txData.fromAddress == which ? txData.txType = 'out' : null;
      txData.toAddress == which ? txData.txType = 'in' : null;
      txData.toAddress == burnA ? txData.txType = 'burned' : null;
      txData.fromAddress == burnA ? txData.txType = 'generated' : null;

      txData.block = tx.blockNumber;
      txData.logIndex = tx.logIndex;
      txData.hash = tx.transactionHash;

      return txData;

    } );

    return {
      success: true,
      status: 'transfer history retrieved',
      message: 'Transfer history retrieved from EVM',
      data: [ filteredTransfers ]
    };

  }

  function setAddressVerification( which ) {
    console.log( 'verify:', which );
    return contract.methods.newAccount( which ).send( { from: V.getState( 'activeAddress' ), gas: 6001000 } )
      .on( 'transactionHash', ( hash ) => {
        console.log( 'Hash: ', hash );
        // contract.methods.accountApproved( ethAddress ).call( ( err, result ) => {
        //   console.log( 'accountApproved result (confirm):', result, ' error: ', err );
        // } );
      } )
      .on( 'error', function( error ) { console.log( 'Error: ' + error ) } )
      .then( function( receipt ) {
        console.log( 'Success: ' + JSON.stringify( receipt ) );

        return {
          success: true,
          status: 'account verified',
        };

      } );
  }

  function setEtherTransaction( data ) {

    const txObject = {
      from: data.initiatorAddress,
      to: data.recipientAddress,
      value: Web3Obj.utils.toWei( data.amount.toString(), 'ether' ),
      // "gas": 21000,         (optional)
      // "gasPrice": 4500000,  (optional)
      // "data": 'For testing' (optional)
      // "nonce": 10           (optional)
    };

    return Web3Obj.eth.sendTransaction( txObject )
      .once( 'transactionHash', function( hash ) { console.log( 'Hash: ' + hash ) } )
      .once( 'receipt', function( receipt ) { console.log( 'Receipt A: ' + JSON.stringify( receipt ) ) } )
      .on( 'confirmation', function( confNumber, receipt ) {
        console.log( 'Confirmation Number: ' + JSON.stringify( confNumber ) );
        console.log( 'Receipt B: ' + JSON.stringify( receipt ) );
      } )
      .on( 'error', function( error ) { console.log( 'Error: ' + error ) } )
      .then( function( receipt ) {
        console.log( 'Success: ' + JSON.stringify( receipt ) );
        Account.drawHeaderBalance();

        return {
          success: true,
          status: 'last eth transaction successful',
        };

      } );

  }

  function setTokenTransaction( data ) {
    const recipient = Web3Obj.utils.toChecksumAddress( data.recipientAddress );
    const sender = data.initiatorAddress;
    const amount = data.amount * 10**6;
    contract.methods.transfer( recipient, amount ).send( { from: sender } )
      .once( 'transactionHash', function( hash ) { console.log( 'Hash: ' + hash ) } )
      .once( 'receipt', function( receipt ) { console.log( 'Receipt A: ' + JSON.stringify( receipt ) ) } )
      .on( 'confirmation', function( confNumber, receipt ) {
        console.log( 'Confirmation Number: ' + JSON.stringify( confNumber ) );
        console.log( 'Receipt B: ' + JSON.stringify( receipt ) );
      } )
      .on( 'error', function( error ) {
        console.log( 'Error: ' + error );
      } )
      .then( function( receipt ) {
        console.log( 'Success: ' + JSON.stringify( receipt ) );

        return {
          success: true,
          status: 'last token transaction successful',
        };

      } );
  }

  return {
    set3BoxSpace: set3BoxSpace,
    get3BoxSpace: get3BoxSpace,
    setActiveAddress: setActiveAddress,
    getContractState: getContractState,
    getAddressState: getAddressState,
    getAddressHistory: getAddressHistory,
    setAddressVerification: setAddressVerification,
    setEtherTransaction: setEtherTransaction,
    setTokenTransaction: setTokenTransaction,
  };

} )();
