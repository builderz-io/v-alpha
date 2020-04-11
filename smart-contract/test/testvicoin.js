var VICoin = artifacts.require( 'VICoin' );
const truffleAssert = require( 'truffle-assertions' );
const chalk = require( 'chalk' );

contract( 'VICoin', async ( accounts ) => {

  it( 'has name', async () => {
    const vicoin = await VICoin.deployed();
    const name = await vicoin.name.call();
    assert.equal( name, 'VI Berlin', 'Does not have correct name' );
  } );

  it( 'has symbol', async () => {
    const vicoin = await VICoin.deployed();
    const symbol = await vicoin.symbol.call();
    assert.equal( symbol, 'VALUE', 'Does not have correct symbol' );
  } );

  it( 'has 6 decimals', async () => {
    const vicoin = await VICoin.deployed();
    const decimals = await vicoin.decimals.call();
    assert.equal( Number( decimals.valueOf() ), 6, 'Does not have 6 decimals' );
  } );

  it( 'calculates number of generation periods', async () => {
    const vicoin = await VICoin.deployed();
    assert.equal(
      Number( await vicoin.calcNumCompletedPeriods.call( 100, 0, 100 ) ),
      1,
      'Num periods not correct' );
    assert.equal(
      Number( await vicoin.calcNumCompletedPeriods.call( 190, 0, 100 ) ),
      1,
      'Num periods not correct' );
    assert.equal(
      Number( await vicoin.calcNumCompletedPeriods.call( 200, 0, 100 ) ),
      2,
      'Num periods not correct' );
    assert.equal(
      Number( await vicoin.calcNumCompletedPeriods.call( 200, 0, 1 ) ),
      200,
      'Num periods not correct' );
  } );

  it( 'calculates generation correctly', async () => {
    const vicoin = await VICoin.deployed();

    // One generation period has elapsed:
    const generationAmount = await vicoin.calcGeneration.call( 20, 10, 10, 9000, 10 );
    assert.equal( Number( generationAmount.valueOf() ), 9000, 'Generation amount not correct' );

    // Caps out at one lifetime worth of blocks
    const generationAmount2 = await vicoin.calcGeneration.call( 2000, 10, 10, 9000, 10 );
    assert.equal( Number( generationAmount2.valueOf() ), 9000, 'Generation amount does not cap out at one lifetime worth of blocks ' );

    // Unless there are multiple generation periods since the last block, within the lifetime
    const generationAmount3 = await vicoin.calcGeneration.call( 2000, 10, 10, 9000, 1 );
    assert.equal( Number( generationAmount3.valueOf() ), 89991, 'Generation amount doesn\'t handle multiple generation periods within the lifetime' );

    // Longer lifetime
    const generationAmount4 = await vicoin.calcGeneration.call( 30, 10, 20, 9000, 10 );
    assert.equal( Number( generationAmount4.valueOf() ), 13500, 'Generation amount doesn\'t handle longer lifetime correctly' );

    // Part way through the second period
    const generationAmount5 = await vicoin.calcGeneration.call( 25, 10, 20, 9000, 10 );
    assert.equal( Number( generationAmount5.valueOf() ), 9000, 'Generation amount doesn\'t handle part way through the second period' );

    // Part way through the third period
    const generationAmount6 = await vicoin.calcGeneration.call( 35, 10, 20, 9000, 10 );
    assert.equal( Number( generationAmount6.valueOf() ), 13500, 'Generation amount doesn\'t handle part way through the third period' );

    // Part way through the third period, small decay
    const generationAmount7 = await vicoin.calcGeneration.call( 35, 10, 200, 9000, 10 );
    assert.equal( Number( generationAmount7.valueOf() ), 17550, 'Generation amount doesn\'t handle part way through the third period, small decay' );

    // Part way through the fourth period, small decay
    const generationAmount8 = await vicoin.calcGeneration.call( 47, 10, 200, 9000, 10 );
    assert.equal( Number( generationAmount8.valueOf() ), 25672, 'Generation amount doesn\'t handle part way through the fourth period, small decay' );

    // Part way through the fifth period, small decay
    const generationAmount9 = await vicoin.calcGeneration.call( 51, 10, 200, 9000, 10 );
    assert.equal( Number( generationAmount9.valueOf() ), 33388, 'Generation amount doesn\'t handle part way through the fifth period, small decay' );

    // Part way through the fifth period, small decay
    const generationAmount10 = await vicoin.calcGeneration.call( 69, 10, 200, 9000, 10 );
    assert.equal( Number( generationAmount10.valueOf() ), 40718, 'Generation amount doesn\'t handle part way through the sixth period, small decay' );
  } );

  it( 'calculates decay correctly', async () => {
    const vicoin = await VICoin.deployed();
    assert.equal(
      Number( await vicoin.calcDecay.call( 100, 100, 100, 100 ).valueOf() ),
      100,
      'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcDecay.call( 100, 100, 100, 200 ).valueOf() ),
      0,
      'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcDecay.call( 100, 100, 150, 200 ).valueOf() ),
      50,
      'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcDecay.call( 100, 100, 110, 200 ).valueOf() ),
      10,
      'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcDecay.call( 100, 100, 190, 200 ).valueOf() ),
      90,
      'Calculation not correct' );
  } );

  it( 'calculates blocks to zero', async () => {
    const vicoin = await VICoin.deployed();
    assert.equal(
      Number( await vicoin.calcZeroBlock
        .call( 1000, 0, /*460, */460, 10, 0 ).valueOf() ),
      470, 'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcZeroBlock
        .call( 1000, 0, /*460, */460, 10, 470 ).valueOf() ),
      470, 'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcZeroBlock
        .call( 10000, 10000, /*460, */469, 10, 470 ).valueOf() ),
      475, 'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcZeroBlock
        .call( 1000, 100, /*147, */166, 10, 152 ).valueOf() ),
      161, 'Calculation not correct' );
  } );

  it( 'calculates fees correctly', async () => {
    const vicoin = await VICoin.deployed();
    assert.equal(
      Number( await vicoin.calcFeesIncContribution
        .call( 1000000, 3300 ).valueOf() ),
      330000, 'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcFeesIncContribution
        .call( 10, 3300 ).valueOf() ),
      3, 'Calculation not correct' );
  } );

  it( 'calculates contribution correctly', async () => {
    const vicoin = await VICoin.deployed();
    assert.equal(
      Number( await vicoin.calcContribution
        .call( 1000000, 3300, 1000 ).valueOf() ),
      33000, 'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcContribution
        .call( 10, 3300, 1000 ).valueOf() ),
      0, 'Calculation not correct' );
  } );

  it( 'calculates fees to burn correctly', async () => {
    const vicoin = await VICoin.deployed();
    assert.equal(
      Number( await vicoin.calcFeesToBurn
        .call( 1000000, 3300, 1000 ).valueOf() ),
      330000 - 33000, 'Calculation not correct' );
    assert.equal(
      Number( await vicoin.calcFeesToBurn
        .call( 10, 3300, 1000 ).valueOf() ),
      3, 'Calculation not correct' );
  } );

  it( 'can mine', async () => {
    const vicoin = await VICoin.deployed();
    const blockNumberBefore = await vicoin.getBlockNumber.call();
    for( var i = 0; i < 50; i++ ) {
      const mined = await vicoin.mine();
    }
    const blockNumberAfter = await vicoin.getBlockNumber.call();
    assert.isAtLeast( Number( blockNumberAfter.valueOf() ), Number( blockNumberBefore.valueOf() ) + 50, 'Not enough blocks passed' );
  } );

  it( 'add accounts', async () => {
    const vicoin = await VICoin.deployed();
    const maxPoolRequest = 100**6;
    const addAccount0 = await vicoin.verifyAccount( accounts[0] );
    const addAccount1 = await vicoin.verifyAccount( accounts[1] );
    const addAccount2 = await vicoin.verifyAccount( accounts[2] );
    const addAccount3 = await vicoin.verifyAccount( accounts[3] );
    const addAccount4 = await vicoin.verifyAccount( accounts[4] );
    const isApproved0 = await vicoin.accountApproved.call( accounts[0] );
    assert.equal( isApproved0, true );
    const isApproved1 = await vicoin.accountApproved.call( accounts[0] );
    assert.equal( isApproved1, true );
    const isApproved2 = await vicoin.accountApproved.call( accounts[0] );
    assert.equal( isApproved2, true );
    const isApproved3 = await vicoin.accountApproved.call( accounts[0] );
    assert.equal( isApproved3, true );
    const isApproved4 = await vicoin.accountApproved.call( accounts[0] );
    assert.equal( isApproved4, true );
  } );

  it( 'starting balance is initialBalance', async () => {
    const vicoin = await VICoin.deployed();
    const balance0 = await vicoin.balanceOf.call( accounts[0] );
    const initialBalance = await vicoin.initialBalance.call();
    const expectedBalance = Number( initialBalance.valueOf() );
    assert.equal( Number( balance0 ), Number( expectedBalance ), 'Starting balance not correct' );
  } );

  // VICoin.Log(
  //       _name: 'Recipient balance before update' (type: string),
  //       _value: 99999000 (type: uint256)
  //     )

  it( 'can transfer', async () => {
    const vicoin = await VICoin.deployed();
    // console.log("############transfer################");
    // console.log(accounts[0]);
    // console.log(accounts[1]);
    // console.log(accounts[2]);
    // console.log(accounts[6]);
    const blockNumberBefore = await vicoin.getBlockNumber.call();
    // console.log("balance 0: "+ await vicoin.balanceOf( accounts[0] ));
    // console.log("balance 6: "+ await vicoin.balanceOf( accounts[6] ));
    const transferred = await vicoin.transfer( accounts[6], 1000, {from: accounts[0]} );
    const balance6 = await vicoin.balanceOf( accounts[6] );
    // console.log("balance 0: "+ await vicoin.balanceOf( accounts[0] ));
    // console.log("balance 6: "+ await vicoin.balanceOf( accounts[6] ));
    assert.equal( Number( balance6.valueOf() ), 1000, 'Balance not correct' );
    // console.log("############################");
  } );


  it( 'lifetime in blocks is 10', async () => {
    const vicoin = await VICoin.deployed();
    const lifetime = await vicoin.lifetime.call();
    assert.equal( Number( lifetime.valueOf() ), 10, 'Lifetime not correct' );
  } );

  it( 'balance after 6 blocks is 40%', async () => {
    const vicoin = await VICoin.deployed();
    //Mine one block:
    vicoin.mine();
    const burnedBalance = await vicoin.getDecayedBalance.call( accounts[6] );
    // console.log("Balance at block " + await vicoin.getBlockNumber.call() + " is " + burnedBalance);
    // console.log("Zero block at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.zeroBlock.call(accounts[6]));
    // console.log("Last transaction at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.lastTransactionBlock.call(accounts[6]));

    assert.equal( Number( burnedBalance.valueOf() ), 900, 'Balance not correct after one block' );
    const blockNumberBefore = await vicoin.getBlockNumber.call();
    // console.log(chalk.green("HEY!"));
    const blocksPassed = 5;
    for( var i = 0; i < blocksPassed; i++ ) {
      const mined = await vicoin.mine();
    }
    const blockNumberAfter = await vicoin.getBlockNumber.call();
    assert.equal( Number( blockNumberAfter.valueOf() ), Number( blockNumberBefore.valueOf() ) + blocksPassed, 'Not enough blocks passed' );
    const burnedBalanceAfterMining = await vicoin.getDecayedBalance.call( accounts[6] );
    assert.equal( Number( burnedBalanceAfterMining.valueOf() ), 400, 'Balance not correct after 2 blocks' );
  } );

  it( 'balance after 8 blocks is 20%', async () => {
    const vicoin = await VICoin.deployed();
    const blockNumberBefore = await vicoin.getBlockNumber.call();
    const blocksPassed = 2;
    for( var i = 0; i < blocksPassed; i++ ) {
      const mined = await vicoin.mine();
    }
    const blockNumberAfter = await vicoin.getBlockNumber.call();
    assert.equal( Number( blockNumberAfter.valueOf() ), Number( blockNumberBefore.valueOf() ) + blocksPassed, 'Not enough blocks passed' );
    const burnedBalanceAfterMining = await vicoin.getDecayedBalance.call( accounts[6] );
    assert.equal( Number( burnedBalanceAfterMining.valueOf() ), 200, 'Balance not correct after 8 blocks' );
  } );

  it( 'balance after 10 blocks is zero', async () => {
    const vicoin = await VICoin.deployed();
    const blockNumberBefore = await vicoin.getBlockNumber.call();
    const blocksPassed = 2;
    for( var i = 0; i < blocksPassed; i++ ) {
      const mined = await vicoin.mine();
    }
    const blockNumberAfter = await vicoin.getBlockNumber.call();
    assert.equal( Number( blockNumberAfter.valueOf() ), Number( blockNumberBefore.valueOf() ) + blocksPassed, 'Not enough blocks passed' );
    const burnedBalanceAfterMining = await vicoin.getDecayedBalance.call( accounts[6] );
    assert.equal( Number( burnedBalanceAfterMining.valueOf() ), 0, 'Balance not correct after 10 blocks' );
  } );

  it( 'balance after 15 blocks is zero', async () => {
    const vicoin = await VICoin.deployed();
    const blockNumberBefore = await vicoin.getBlockNumber.call();
    const blocksPassed = 5;
    for( var i = 0; i < blocksPassed; i++ ) {
      const mined = await vicoin.mine();
    }
    const blockNumberAfter = await vicoin.getBlockNumber.call();
    assert.equal( Number( blockNumberAfter.valueOf() ), Number( blockNumberBefore.valueOf() ) + blocksPassed, 'Not enough blocks passed' );
    const burnedBalanceAfterMining = await vicoin.getDecayedBalance.call( accounts[6] );
    assert.equal( Number( burnedBalanceAfterMining.valueOf() ), 0, 'Balance not correct after 15 blocks' );
  } );

  it( 'can adjust contribution', async () => {
    const vicoin = await VICoin.deployed();
    const originalContribution = await vicoin.communityContribution.call();
    assert.equal( Number( originalContribution.valueOf() ), 0, 'Contribution not 0' );
    const tx = await vicoin.updateCommunityContribution( 1000 );
    const newContribution = await vicoin.communityContribution.call();
    assert.equal( Number( newContribution.valueOf() ), 1000, 'Contribution not 1000' );
    await vicoin.updateCommunityContribution( 0 );
  } );

  it( 'large incoming transfer renews lifetime', async () => {
    const vicoin = await VICoin.deployed();
    await vicoin.verifyAccount( accounts[5] );
    const zeroBlockBefore = await vicoin.zeroBlock.call( accounts[0] ).valueOf();
    await vicoin.transfer( accounts[0], 1000, {from: accounts[5]} );
    const zeroBlockAfter = await vicoin.zeroBlock.call( accounts[0] ).valueOf();
    const lifetime = await vicoin.lifetime.call();
    const thisBlock = await vicoin.getBlockNumber.call().valueOf();
    assert.equal( Number( zeroBlockAfter ), Number( thisBlock ) + 10, 'Lifetime not extended correctly' );
  } );

  it( 'Medium incoming transfer renews partial lifetime', async () => {
    const vicoin = await VICoin.deployed();
    for( var i = 0; i < 5; i++ ) {
      const mined = await vicoin.mine();
    }
    await vicoin.verifyAccount( accounts[8] );

    const acc = accounts[0];
    // console.log("Balance at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.balanceOf.call(acc));
    // console.log(chalk.yellow("Live balance at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.liveBalanceOf.call(acc)));
    // console.log("Decayed balance at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.getDecayedBalance.call(acc));
    // console.log(chalk.blue("Zero block at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.zeroBlock.call(acc)));
    // console.log("Last transaction at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.lastTransactionBlock.call(acc));
    // console.log(chalk.red("---Transfer 800---"));

    const zeroBlockBefore = await vicoin.zeroBlock.call( accounts[0] ).valueOf();
    const liveBalanceBefore = await vicoin.liveBalanceOf.call( accounts[0] ).valueOf();
    await vicoin.transfer( accounts[0], 800, {from: accounts[8]} );

    // console.log("Balance at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.balanceOf.call(acc));
    // console.log(chalk.yellow("Live balance at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.liveBalanceOf.call(acc)));
    // console.log("Decayed balance at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.getDecayedBalance.call(acc));
    // console.log(chalk.blue("Zero block at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.zeroBlock.call(acc)));
    // console.log("Last transaction at block " + await vicoin.getBlockNumber.call() + " is " + await vicoin.lastTransactionBlock.call(acc));


    const zeroBlockAfter = await vicoin.zeroBlock.call( accounts[0] ).valueOf();
    const liveBalanceAfter = await vicoin.liveBalanceOf.call( accounts[0] ).valueOf();
    const changeToZeroBlock = Number( zeroBlockAfter ) - Number( zeroBlockBefore );
    const expectedChange = Number( await vicoin.lifetime.call().valueOf() )/2;
    const differenceToExpected = Math.abs( changeToZeroBlock - expectedChange );
    assert.isAtMost( differenceToExpected, 2, 'Difference was more than expected - expected around 50% of full lifetime to be added' );
  } );

  it( 'Small incoming transfer renews a little lifetime', async () => {
    const vicoin = await VICoin.deployed();
    await vicoin.verifyAccount( accounts[7] );
    const zeroBlockBefore = await vicoin.zeroBlock.call( accounts[0] ).valueOf();
    const liveBalanceBefore = await vicoin.liveBalanceOf.call( accounts[0] ).valueOf();

    await vicoin.transfer( accounts[0], 50, {from: accounts[7]} );
    const zeroBlockAfter = await vicoin.zeroBlock.call( accounts[0] ).valueOf();
    const liveBalanceAfter = await vicoin.liveBalanceOf.call( accounts[0] ).valueOf();

    const changeToZeroBlock = Number( zeroBlockAfter ) - Number( zeroBlockBefore );
    const expectedChange = Number( await vicoin.lifetime.call().valueOf() )/10;
    const differenceToExpected = Math.abs( changeToZeroBlock - expectedChange );
    assert.isAtMost( differenceToExpected, 2, 'Difference was more than expected' );
  } );

  it( 'can disable contribution change function', async () => {
    const vicoin = await VICoin.deployed();
    const txDisableFunction = await vicoin.blowFuse( 1, true );
    await truffleAssert.reverts( vicoin.updateCommunityContribution( 2000 ), 'Function fuse has been triggered' );
  } );

  it( 'can still adjust fees', async () => {
    const vicoin = await VICoin.deployed();
    const txChangeFees = await vicoin.updateTransactionFee( 3310 );
    const newFees = await vicoin.transactionFee.call();
    assert.equal( Number( newFees.valueOf() ), 3310, 'Fees not correct' );
  } );

  it( 'can blow all fuses', async () => {
    const vicoin = await VICoin.deployed();
    const txMakeImmutable = await vicoin.blowAllFuses( true );
    await truffleAssert.reverts( vicoin.updateTransactionFee( 4444 ), 'Function fuse has been triggered' );
  } );

} );
