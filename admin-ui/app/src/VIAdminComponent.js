import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import viLogo from "./vi-logo.png";
import styled from "styled-components";
import EconomicParameters from "./components/EconomicParameters";
import ContributionAndFees from "./components/ContributionAndFees";

const { AccountData, ContractData, ContractForm } = newContextComponents;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  @media only screen and (min-width: 769px) {
    grid-template-rows: 225px 1fr 1fr;
  }
  @media only screen and (max-width: 768px) {
  }
`;

export const GridItem = styled.div`
  color: black;
  margin-bottom 20px;
  padding: 30px;
  @media only screen and (min-width: 769px) {
    grid-column: span 3;
    overflow: hidden;
  }
  @media only screen and (max-width: 768px) {
    grid-column: span 12;
    order: 3;
  }
`;

export const Header = styled(GridItem)`
  @media only screen and (min-width: 769px) {
    grid-column: span 12;
    display: flex;
    flow-direction: row;
    align-items: baseline;
    padding: 60px;
    margin: 30px;
    align-content: center;
    align-items: center;
  }
  @media only screen and (max-width: 768px) {
    order: 1;
    grid-column: span 12;
  }
`;

export const Footer = styled(GridItem)`
  grid-column: span 12;
  order: 5;
`;

export const Title = styled.h1`
  margin-right: 50px;
`;

export const Subtitle = styled.h3``;

export const Img = styled.img`
  margin-right: 50px;
`;

export default ({ drizzle, drizzleState }) => {
  return (
    <div className="App">
      <Grid>
        <Header>
          <Img src={viLogo} alt="value-instrument-logo" />
          <Title>VI Currency Admin</Title>
          <Subtitle>
            Admin interface for adjusting parameters of a Value Instrument
            currency.
          </Subtitle>
        </Header>
        <GridItem>
          <div className="section">
            <h2>Balances</h2>
            <p>
              <strong>Decayed balance: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="VICoin"
                method="getDecayedBalance"
                methodArgs={[drizzleState.accounts[0]]}
              />
            </p>
            <p>
              <strong>Balance of: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="VICoin"
                method="balanceOf"
                methodArgs={[drizzleState.accounts[0]]}
              />
            </p>
            <p>
              <strong>Live balance of: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="VICoin"
                method="liveBalanceOf"
                methodArgs={[drizzleState.accounts[0]]}
              />
            </p>
            <strong>Trigger onchain balance update: </strong>
            <ContractForm
              drizzle={drizzle}
              drizzleState={drizzleState}
              contract="VICoin"
              method="triggerOnchainBalanceUpdate"
              methodArgs={[drizzleState.accounts[0]]}
            />
          </div>
        </GridItem>
        <GridItem>
          <div className="section">
            <h2>Simulate passing of time</h2>
            <p>Mine blocks to simulate the passing of time.</p>
            <p>
              <strong>Block: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="VICoin"
                method="getBlockNumber"
              />
            </p>
            <ContractForm drizzle={drizzle} contract="VICoin" method="mine" />
          </div>
        </GridItem>
        <GridItem>
          <EconomicParameters drizzle={drizzle} drizzleState={drizzleState} />
        </GridItem>
        <GridItem>
          <div className="section">
            <h2>Transfer:</h2>
            <p>Transfer value.</p>
            <strong>Transfer: </strong>
            <ContractForm
              drizzle={drizzle}
              contract="VICoin"
              method="transfer"
              labels={["Recipient", "Amount in VALUE"]}
            />
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
          </div>
        </GridItem>
        <GridItem>
          <ContributionAndFees drizzle={drizzle} drizzleState={drizzleState} />
        </GridItem>
        <GridItem>
          <div className="section">
            <h2>Verify an account:</h2>
            <p>Verify a new account.</p>
            <strong>Account to verify: </strong>
            <ContractForm
              drizzle={drizzle}
              contract="VICoin"
              method="verifyAccount"
              sendArgs={{ gas: 600000, gasPrice: 40000000000 }}
            />
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
        </GridItem>
        <GridItem>
          <div className="section">
            <h2>Your account in detail:</h2>
            <p>Details of your account.</p>
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
        </GridItem>
        <Footer>
          <h2>Active account</h2>
          <AccountData
            drizzle={drizzle}
            drizzleState={drizzleState}
            accountIndex={0}
            units="ether"
            precision={3}
          />
        </Footer>
      </Grid>
    </div>
  );
};
