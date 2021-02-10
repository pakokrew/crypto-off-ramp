import React from 'react';
import styled from 'styled-components';

import AccountBadge from './Account/AccountBadge';
import { NavLink } from './UI/StyledComponents';
import { getWalletStatus } from "../redux/wallet/selectors";
import { useSelector } from 'react-redux';
import { WalletStatus } from "../redux/wallet/state";

const HeaderRoot = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
`;

const HeaderSubRoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  z-index: 2;
  background-color: ${props => props.theme.surface};

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    padding: 0px 0.5rem;
    width: calc(100%);
    position: relative;
  }
`;

const MainHeader = styled.div`
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  display: flex;
  padding: 0px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  width: fit-content;
  @media (max-width: 960px) {
    width: 100%;
  }
`;

const SecondaryHeader = styled.div`
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  justify-self: flex-end;
  @media (max-width: 960px) {
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    justify-self: center;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0px 0px;
    background-color: ${props => props.theme.surface};
  }
`;

const RoutesContainer = styled.div`
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  width: 100%;
  display: flex;
  padding: 0px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  @media (max-width: 960px) {
    padding: 1rem 0px 1rem 1rem;
    -webkit-box-pack: end;
    justify-content: flex-end;
  }
`;

const RouteLink = styled(NavLink)`
  display: flex;
  flex-flow: row nowrap;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  width: fit-content;
  margin: 0px 12px;
  color: ${props => props.theme.surfaceContentSecondary};
  font-weight: 500;
  &.active {
    border-radius: 12px;
    font-weight: 600;
    color: ${props => props.theme.surfaceContent};
  }
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  > img {
    margin-right: 8px;
    height: 30px;
  }
  > h1 {
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    font-size: 24px;
    line-height: 1;
    font-weight: 400;
    letter-spacing: 1px;
    color: black;
    text-decoration: none;
  }
  > span {
    text-transform: uppercase;
    position: relative;
    color: #18b37b;
    font-size: 9px;
    top: -11px;
    right: -2px;
  }
`;

export default function Header() {
  const walletStatus = useSelector(getWalletStatus);
  return (
    <HeaderRoot>
      <HeaderSubRoot>
        <MainHeader>
          <NavLink to="/">
            <LogoBox>
              <img src="logo192.png" alt="mooni-logo" />
              <h1>
                MOONI
              </h1>
              <span>
                beta
              </span>
            </LogoBox>
          </NavLink>
          <RoutesContainer>
            {walletStatus === WalletStatus.CONNECTED &&
              <>
                <RouteLink to="/exchange" activeClassName="active">Exchange</RouteLink>
                <RouteLink to="/account" activeClassName="active">Account</RouteLink>
              </>
            }
            <RouteLink to="/stats" activeClassName="active">Stats</RouteLink>
          </RoutesContainer>
        </MainHeader>

        <SecondaryHeader>
          <AccountBadge />
        </SecondaryHeader>
      </HeaderSubRoot>
    </HeaderRoot>
  );
}

