// src/Volatility.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import SocketService from '../services/SocketService';
import { Futures_Symbols } from '../common/Constants';

import '../styles/volatility.css';
import Table from './Table';

function Volatility() {

    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const headers = {
        symbol: "symbol", 
        avg_mov: "avg mov", 
        curr_mov: "curr mov",
        avg_vol: "avg vol",
        curr_vol: "curr vol"
    };
    const data = [
        {
            id: 1,
            symbol: "BTCUSDT",
            avg_mov: 0.14,
            curr_mov: 0.29,
            avg_vol: 248,
            curr_vol: 178
        },
        {
            id: 2,
            symbol: "ETHUSDT",
            avg_mov: 0.24,
            curr_mov: 0.89,
            avg_vol: 148,
            curr_vol: 278
        },
        {
            id: 3,
            symbol: "SOLUSDT",
            avg_mov: 0.34,
            curr_mov: 0.29,
            avg_vol: 248,
            curr_vol: 178
        },
        {
            id: 4,
            symbol: "ETCUSDT",
            avg_mov: 0.44,
            curr_mov: 0.89,
            avg_vol: 148,
            curr_vol: 278
        },
        {
            id: 5,
            symbol: "WLDUSDT",
            avg_mov: 0.54,
            curr_mov: 0.29,
            avg_vol: 248,
            curr_vol: 178
        },
        {
            id: 6,
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
            const response = await axios.post('http://localhost:8080/api/fetchInitialVolatility', {symbol: Futures_Symbols});
      
            // Handle the response
            console.log('Response:', response.data);
          } catch (error) {
            // Handle errors
            console.error('Error:', error.message);
          }
    }

    useEffect(() => {
        SocketService.connect('ws://localhost:5000/');
        fetchInitialVolatility()

        return () => {
            SocketService.disconnect();
        };
    }, []);

    return (
    <div className='volatilityPageContainer'>
        <h2>Volatility Page</h2>
        <div className='tableContainer'>
        <Table data={data} itemsPerPage={2} headers={headers} />
        </div>
    </div>
    );
}

export default Volatility;
