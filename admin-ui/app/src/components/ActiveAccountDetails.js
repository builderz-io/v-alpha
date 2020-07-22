import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

const ActiveAccountDetails = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Active Account</h2>
      <p><i>View details of the account currently active in MetaMask</i></p>
      <p>
        <strong>V Live balance: </strong>
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
      <p>
        <strong>V Decayed balance: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="getDecayedBalance"
          methodArgs={[drizzleState.accounts[0]]}
        />
      </p>
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
