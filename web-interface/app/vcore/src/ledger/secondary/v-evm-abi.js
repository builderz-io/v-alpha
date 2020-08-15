const VEvmAbi = JSON.parse( JSON.stringify( // eslint-disable-line no-unused-vars

  /**
   * V Core Module for the V Token ABI
   *
   */

  // Ganache Dev Contract ABI
  [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Approval',
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
          internalType: 'uint8',
          name: '_fuseID',
          type: 'uint8'
        }
      ],
      name: 'BlowFuse',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
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
          indexed: false,
          internalType: 'string',
          name: 'name',
          type: 'string'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
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
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
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
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'feesBurned',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'contribution',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'payoutSender',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'payoutRecipient',
          type: 'uint256'
        }
      ],
      name: 'TransferSummary',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
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
          internalType: 'uint256',
          name: 'communityContribution',
          type: 'uint256'
        }
      ],
      name: 'UpdateCommunityContribution',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'newCommunityContributionAccount',
          type: 'address'
        }
      ],
      name: 'UpdateCommunityContributionAccount',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'generationAmount',
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
          internalType: 'uint256',
          name: 'generationPeriod',
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
          internalType: 'uint256',
          name: 'initialBalance',
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
          internalType: 'uint256',
          name: 'lifetime',
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
          internalType: 'uint256',
          name: 'transactionFee',
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
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'VerifyAccount',
      type: 'event'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'accountApproved',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address'
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        }
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bool',
          name: '_confirm',
          type: 'bool'
        }
      ],
      name: 'blowAllFuses',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: '_fuseID',
          type: 'uint8'
        },
        {
          internalType: 'bool',
          name: '_confirm',
          type: 'bool'
        }
      ],
      name: 'blowFuse',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burnAt',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burnFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_newController',
          type: 'address'
        }
      ],
      name: 'changeController',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'controller',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'subtractedValue',
          type: 'uint256'
        }
      ],
      name: 'decreaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getBlockNumber',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getCommunityContribution',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getCommunityContributionAccount',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'getDetails',
      outputs: [
        {
          internalType: 'uint256',
          name: '_lastBlock',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_balance',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_zeroBlock',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getGenerationAmount',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getGenerationPeriod',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getInitialBalance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getLifetime',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getTransactionFee',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'addedValue',
          type: 'uint256'
        }
      ],
      name: 'increaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string'
        },
        {
          internalType: 'string',
          name: '_symbol',
          type: 'string'
        },
        {
          internalType: 'uint256',
          name: '_lifetime',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_generationAmount',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_generationPeriod',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_communityContribution',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_transactionFee',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_initialBalance',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '_communityContributionAccount',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_controller',
          type: 'address'
        }
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_controller',
          type: 'address'
        }
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'lastGenerationBlock',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'lastTransactionBlock',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'liveBalanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'numAccounts',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_to',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'triggerOnchainBalanceUpdate',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'unapproveAccount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_communityContribution',
          type: 'uint256'
        }
      ],
      name: 'updateCommunityContribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_newCommunityContributionAccount',
          type: 'address'
        }
      ],
      name: 'updateCommunityContributionAccount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_generationAmount',
          type: 'uint256'
        }
      ],
      name: 'updateGenerationAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_generationPeriod',
          type: 'uint256'
        }
      ],
      name: 'updateGenerationPeriod',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_initialBalance',
          type: 'uint256'
        }
      ],
      name: 'updateInitialBalance',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_lifetime',
          type: 'uint256'
        }
      ],
      name: 'updateLifetime',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_transactionFee',
          type: 'uint256'
        }
      ],
      name: 'updateTransactionFee',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'verifyAccount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'zeroBlock',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      stateMutability: 'payable',
      type: 'receive'
    }
  ]

  // Ropsten Dev Contract ABI
  /*
  [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Approval',
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
          internalType: 'uint8',
          name: '_fuseID',
          type: 'uint8'
        }
      ],
      name: 'BlowFuse',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
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
          indexed: false,
          internalType: 'string',
          name: 'name',
          type: 'string'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
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
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
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
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'feesBurned',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'contribution',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'payoutSender',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'payoutRecipient',
          type: 'uint256'
        }
      ],
      name: 'TransferSummary',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
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
          internalType: 'uint256',
          name: 'communityContribution',
          type: 'uint256'
        }
      ],
      name: 'UpdateCommunityContribution',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'newCommunityContributionAccount',
          type: 'address'
        }
      ],
      name: 'UpdateCommunityContributionAccount',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'generationAmount',
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
          internalType: 'uint256',
          name: 'generationPeriod',
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
          internalType: 'uint256',
          name: 'initialBalance',
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
          internalType: 'uint256',
          name: 'lifetime',
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
          internalType: 'uint256',
          name: 'transactionFee',
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
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'VerifyAccount',
      type: 'event'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'accountApproved',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address'
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        }
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'bool',
          name: '_confirm',
          type: 'bool'
        }
      ],
      name: 'blowAllFuses',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: '_fuseID',
          type: 'uint8'
        },
        {
          internalType: 'bool',
          name: '_confirm',
          type: 'bool'
        }
      ],
      name: 'blowFuse',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burnAt',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'burnFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_newController',
          type: 'address'
        }
      ],
      name: 'changeController',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'controller',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'subtractedValue',
          type: 'uint256'
        }
      ],
      name: 'decreaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getBlockNumber',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'getDetails',
      outputs: [
        {
          internalType: 'uint256',
          name: '_lastBlock',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_balance',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_zeroBlock',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getGenerationAmount',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'addedValue',
          type: 'uint256'
        }
      ],
      name: 'increaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string'
        },
        {
          internalType: 'string',
          name: '_symbol',
          type: 'string'
        },
        {
          internalType: 'uint256',
          name: '_lifetime',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_generationAmount',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_generationPeriod',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_communityContribution',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_transactionFee',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_initialBalance',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '_communityContributionAccount',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_controller',
          type: 'address'
        }
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_controller',
          type: 'address'
        }
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'lastGenerationBlock',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'lastTransactionBlock',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'liveBalanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'numAccounts',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_to',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'triggerOnchainBalanceUpdate',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'unapproveAccount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_communityContribution',
          type: 'uint256'
        }
      ],
      name: 'updateCommunityContribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_newCommunityContributionAccount',
          type: 'address'
        }
      ],
      name: 'updateCommunityContributionAccount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_generationAmount',
          type: 'uint256'
        }
      ],
      name: 'updateGenerationAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_generationPeriod',
          type: 'uint256'
        }
      ],
      name: 'updateGenerationPeriod',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_initialBalance',
          type: 'uint256'
        }
      ],
      name: 'updateInitialBalance',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_lifetime',
          type: 'uint256'
        }
      ],
      name: 'updateLifetime',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_transactionFee',
          type: 'uint256'
        }
      ],
      name: 'updateTransactionFee',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'verifyAccount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'zeroBlock',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      stateMutability: 'payable',
      type: 'receive'
    }
  ]
*/

  // Kovan Test Contract ABI
  /*[
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
      name: 'contributionFeeDecimals',
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
      inputs: [],
      name: 'communityContributionAccount',
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
      constant: true,
      inputs: [],
      name: 'communityContribution',
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
          name: '_communityContribution',
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
          name: '_communityContributionAccount',
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
        },
        {
          indexed: false,
          name: 'feesBurned',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'contribution',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'payoutSender',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'payoutRecipient',
          type: 'uint256'
        }
      ],
      name: 'TransferSummary',
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
      name: 'VerifyAccount',
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
          name: '_newCommunityContributionAccount',
          type: 'address'
        }
      ],
      name: 'UpdateCommunityContributionAccount',
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
          name: '_communityContribution',
          type: 'uint256'
        }
      ],
      name: 'UpdateCommunityContribution',
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
      outputs: [
        {
          name: '',
          type: 'uint256'
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
          name: '_contributionRate',
          type: 'uint256'
        }
      ],
      name: 'calcContribution',
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
          name: '_contributionRate',
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
      name: 'calcFeesIncContribution',
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
      name: 'verifyAccount',
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
          name: '_newCommunityContributionAccount',
          type: 'address'
        }
      ],
      name: 'updateCommunityContributionAccount',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_communityContribution',
          type: 'uint256'
        }
      ],
      name: 'updateCommunityContribution',
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
  ]*/

) );
