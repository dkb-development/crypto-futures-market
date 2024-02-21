// src/Volatility.js
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";
import SocketService from '../services/SocketService';
import { backendRestEndpoint, Futures_Symbols } from '../common/Constants.js';

import '../styles/volatility.css';
import Table from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { updateInitialVolatilityAction } from '../state/volatilityAction';

function Volatility() {

    const dispatch = useDispatch();
    const symbolVolatilityState = useSelector((state) => state.volatility);
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const [volatilityData, setVolatilityData] = useState([]);
    const memoizedData = useMemo(() => Object.values(symbolVolatilityState), [symbolVolatilityState]);

    const headers = {
        symbol: "symbol", 
        avg_mov: "avg mov(%)", 
        curr_mov: "curr mov(%)",
        avg_vol: "avg vol(k)",
        curr_vol: "curr vol(k)"
    };
    const data = [
        {
            symbol: "BTCUSDT",
            avg_mov: 0.14,
            curr_mov: 0.29,
            avg_vol: 248,
            curr_vol: 178
        },
        {
            symbol: "ETHUSDT",
            avg_mov: 0.24,
            curr_mov: 0.89,
            avg_vol: 148,
            curr_vol: 278
        },
        {
            symbol: "SOLUSDT",
            avg_mov: 0.34,
            curr_mov: 0.29,
            avg_vol: 248,
            curr_vol: 178
        },
        {
            symbol: "ETCUSDT",
            avg_mov: 0.44,
            curr_mov: 0.89,
            avg_vol: 148,
            curr_vol: 278
        },
        {
            symbol: "WLDUSDT",
            avg_mov: 0.54,
            curr_mov: 0.29,
            avg_vol: 248,
            curr_vol: 178
        },
        {
            symbol: "TRBUSDT",
            avg_mov: 0.64,
            curr_mov: 0.89,
            avg_vol: 148,
            curr_vol: 278
        }
    ]

    const fetchInitialVolatility = async () => {
        try {
            // Make a POST request using axios
            const response = await axios.post(backendRestEndpoint+'/fetchInitialVolatility', {symbol: Futures_Symbols});
      
            // Handle the response
            console.log('Response:', response.data);
          } catch (error) {
            // Handle errors
            console.error('Error:', error.message);
          }
    }

    const updateInitialVolatilityCallback = (symbolDetails) => {
        dispatch(updateInitialVolatilityAction(symbolDetails));
        console.log(symbolDetails);
    }

    useEffect(() => {
        SocketService.setUpdateVolatilityCallback(updateInitialVolatilityCallback);
        SocketService.fetchInitialVolatility(Futures_Symbols);

        return () => {
            SocketService.disconnect();
        };
    }, []);

    useEffect(() => {
        // setVolatilityData(Object.values(symbolVolatilityState));
        // console.log(Object.values(symbolVolatilityState).length);
    }, [symbolVolatilityState])

    return (
    <div className='volatilityPageContainer'>
        <h2>Volatility Page</h2>
        <div className='tableContainer'>
        <Table data={volatilityData} itemsPerPage={30} headers={headers} />
        </div>
    </div>
    );
}

export default Volatility;
