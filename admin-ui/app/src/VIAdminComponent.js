import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import viLogo from "./vi-logo.png";
import styled from "styled-components";
import EconomicParameters from "./components/EconomicParameters";
import ContributionAndFees from "./components/ContributionAndFees";
import ContractInteractions from "./components/ContractInteractions";
import ActiveAccountDetails from "./components/ActiveAccountDetails";

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
            Easily adjust the parameters of your Value Instrument currency
          </Subtitle>
        </Header>

        <GridItem>
          <ActiveAccountDetails drizzle={drizzle} drizzleState={drizzleState} />
        </GridItem>

        <GridItem>
          <EconomicParameters drizzle={drizzle} drizzleState={drizzleState} />
        </GridItem>

        <GridItem>
          <ContributionAndFees drizzle={drizzle} drizzleState={drizzleState} />
        </GridItem>

        <GridItem>
          <ContractInteractions drizzle={drizzle} drizzleState={drizzleState} />
        </GridItem>

        <Footer>
          <h2>Active address</h2>
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
