import React from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Button, IconCheck, IconClock, IconExternal, LoadingRing, useTheme, useViewport, IconCross } from '@aragon/ui';

import Api from '../../lib/apiWrapper';
import { getJWS } from '../../redux/wallet/selectors';
import { MooniOrder, MooniOrderStatus } from '../../types/api';
import { truncateNumber } from '../../lib/numbers';
import { ShadowBox } from '../UI/StyledComponents';
import { getEtherscanTxURL } from '../../lib/eth';

// @ts-ignore
const CustomTableContainer = styled(ShadowBox)`
  padding: 0px 5px;
`;
const CellText = styled.span`
  font-size: 12px;
`;

interface OrderRowProps {
  order: MooniOrder;
}

function ExternalButton({ url, label }) {
  const theme = useTheme();

  let display = 'all';

  return (
    <Button href={url} size="mini" display={display} icon={<IconExternal style={{color: theme.accent}}/>} />
  )
}

const OrderRow: React.FC<OrderRowProps> = ({order}) => {
  const theme = useTheme();

  const date = new Date(order.createdAt);
  const now = new Date();
  const expired = order.status === MooniOrderStatus.PENDING && !order.txHash && ((+now - +date) > 10*60*1000);

  return (
    <TableRow>
      <TableCell component="th" scope="row" align="center">
        <Box display="flex" alignItems="center" justifyContent="center">
          {order.status === MooniOrderStatus.PENDING && !expired &&
          <IconClock size="medium" style={{ color: theme.disabledContent }}  />
          }
          {order.status === MooniOrderStatus.PENDING && expired &&
          <IconCross size="medium" style={{ color: theme.negative }}  />
          }
          {order.status === MooniOrderStatus.EXECUTED &&
          <IconCheck size="medium" style={{ color: theme.positive }}/>
          }
        </Box>
      </TableCell>
      <TableCell><CellText>{truncateNumber(order.inputAmount)} {order.inputCurrency}</CellText></TableCell>
      <TableCell><CellText>{truncateNumber(order.outputAmount)} {order.outputCurrency}</CellText></TableCell>
      <TableCell><CellText>{date.toLocaleDateString()} {date.toLocaleTimeString()}</CellText></TableCell>
      <TableCell>
        {order.txHash && <ExternalButton url={getEtherscanTxURL(order.txHash)} label="Transaction" />}
      </TableCell>
    </TableRow>
  );
};

export default function OrderHistory() {
  const jwsToken = useSelector(getJWS);
  const { below } = useViewport();
  const { data, error } = useSWR(jwsToken, Api.getOrders);

  if (error) return <Box>Failed to load orders</Box>;
  if (!data) return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <p>Loading orders...</p>
      <Box m={1}/>
      <LoadingRing mode="half-circle" />
    </Box>
  );

  const orders = data as MooniOrder[];

  return (
    <Box width={1} mx={2}>
      {orders.length > 0 ?
        <TableContainer component={CustomTableContainer}>
          <Table aria-label="order history" size={below('medium') ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Status</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>TX</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => <OrderRow order={order} key={order.id}/>)}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <Box textAlign="center">
          You didn't make any orders.
        </Box>
      }
    </Box>
  );
}
