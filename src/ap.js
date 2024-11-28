import React, {useState, useEffect} from 'react'
import api from  './api'

const App = () => {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        amount:'',
        category:'',
        description:'',
        is_income:false,
        date:''
    });
    const fetchTransactions = async () =>{
        const response = await api.get('/transactions/');
        setTransactions(response.data)
    };

    useEffect( () => {
        fetchTransactions();
    }, []);
}