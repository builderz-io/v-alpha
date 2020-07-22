import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { AccountData, ContractData, ContractForm } = newContextComponents;

const ActiveAccountDetails = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Your Account</h2>
      <div class="description">
        <p><i>View details of the account currently active in MetaMask</i></p>
      </div>
      <div class="active-account">
      <h3>Active Address</h3>
      <AccountData
        drizzle={drizzle}
        drizzleState={drizzleState}
        accountIndex={0}
        units="ether"
        precision={3}
      />
      </div>
      <h3 class="h3-margin-top">Balances</h3>
      <p>
        <strong>V Live Balance: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="liveBalanceOf"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p>
      <p>
        <strong>V OnChain Balance: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="balanceOf"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p>
      {/* <p>
        <strong>V Decayed balance: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="getDecayedBalance"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p> */}
      <h3 class="h3-margin-top">Contract State</h3>
      <p>
        <strong>Zero block: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="zeroBlock"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p>
      <p>
        <strong>Last generation block: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="lastGenerationBlock"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p>
      <p>
        <strong>Last incoming transaction block: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="lastTransactionBlock"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p>
      <p>
        <strong>Account verified: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="accountApproved"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p>
    </div>
  );
};

export default ActiveAccountDetails;
