import React, { useState, useEffect } from "react";
import api from "../api";

const Expense = () => {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        is_income: false,
        date: ''
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); 
    const [netMoney, setNetMoney] = useState(0); 
    const [chartUrl, setChartUrl] = useState(""); 

    const fetchTransactionsAndChart = async (limit = 500, skip = 0) => {
        const response = await api.get("/transactions/combined", {
            params: { limit, skip },
        });
        const fetchedTransactions = response.data.transactions.reverse();
        setTransactions(fetchedTransactions);
        setChartUrl(`data:image/png;base64,${response.data.chart_image}`); 
        calculateNetMoney(fetchedTransactions); 
    };

    useEffect(() => {
        fetchTransactionsAndChart();
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (editingId) {
            await api.put(`/transactions/${editingId}`, formData);
        } else {
            await api.post('/transactions', formData);
        }
        resetForm();
        fetchTransactionsAndChart(); 
    };

    const handleEditClick = (transaction) => {
        setEditingId(transaction.id);
        setFormData({
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            is_income: transaction.is_income,
            date: transaction.date
        });
        setIsPopupOpen(true); 
    };

    const handleDeleteClick = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(prevTransactions =>
                prevTransactions.filter(transaction => transaction.id !== id)
            );
            calculateNetMoney(transactions.filter(transaction => transaction.id !== id));
        } catch (error) {
            console.error("Failed to delete transaction:", error);
        }
    };

    const calculateNetMoney = (transactionsList) => {
        let net = 0;
        transactionsList.forEach(transaction => {
            if (transaction.is_income) {
                net += parseFloat(transaction.amount);
            } else {
                net -= parseFloat(transaction.amount);
            }
        });
        setNetMoney(net);
    };

    const resetForm = () => {
        setFormData({
            amount: '',
            category: '',
            description: '',
            is_income: false,
            date: ''
        });
        setEditingId(null); 
        setIsPopupOpen(false); 
    };

    const EditPopup = () => (
        <div className="popup">
            <div className="popup-inner">
                <h2>Edit Transaction</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="group">
                        <div className="input-group">
                            <label htmlFor="amount">Amount:</label>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                onChange={handleInputChange}
                                value={formData.amount}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="category">Category:</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                onChange={handleInputChange}
                                value={formData.category}
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <div className="input-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                onChange={handleInputChange}
                                value={formData.description}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                onChange={handleInputChange}
                                value={formData.date}
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <div className="input-group">
                            <label htmlFor="is_income">Income:</label>
                            <input
                                type="checkbox"
                                id="is_income"
                                name="is_income"
                                onChange={handleInputChange}
                                checked={formData.is_income} 
                            />
                        </div>
                    </div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsPopupOpen(false)}>Close</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="expenses">
            <h2>Net Money: {netMoney}</h2>
            <div className="form-container">
                <h2>New Expense</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="group">
                        <div className="input-group">
                            <label htmlFor="amount">Amount:</label>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                onChange={handleInputChange}
                                value={formData.amount}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="category">Category:</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                onChange={handleInputChange}
                                value={formData.category}
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <div className="input-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                onChange={handleInputChange}
                                value={formData.description}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                onChange={handleInputChange}
                                value={formData.date}
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <div className="input-group">
                            <label htmlFor="is_income">Income:</label>
                            <input
                                type="checkbox"
                                id="is_income"
                                name="is_income"
                                onChange={handleInputChange}
                                checked={formData.is_income} 
                            />
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="card-container">
                {transactions.map((transaction) => (
                    <div className="card" key={transaction.id}>
                        <div className="card-body">
                            <div className="card-item">
                                <div className="label">Amount:</div>
                                <div className="value">{transaction.amount}</div>
                            </div>
                            <div className="card-item">
                                <div className="label">Category:</div>
                                <div className="value">{transaction.category}</div>
                            </div>
                            <div className="card-item">
                                <div className="label">Type:</div>
                                <div className="value">{transaction.is_income ? 'Income' : 'Expense'}</div>
                            </div>
                            <div className="card-item">
                                <div className="label">Date:</div>
                                <div className="value">{transaction.date}</div>
                            </div>
                            <div className="card-item">
                                <div className="label">Description:</div>
                                <div className="value">{transaction.description}</div>
                            </div>
                            <div className="edit-container">
                                <button className="edit-card" onClick={() => handleEditClick(transaction)}>Edit</button>
                                <button className="delete-card" onClick={() => handleDeleteClick(transaction.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isPopupOpen && <EditPopup />}
        </div>
    );
};

export default Expense;




// import React, { useState, useEffect } from "react";
// import api from "../api";

// const Expense = () => {
//     const [transactions, setTransactions] = useState([]);
//     const [formData, setFormData] = useState({
//         amount: '',
//         category: '',
//         description: '',
//         is_income: false,
//         date: ''
//     });
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [editingId, setEditingId] = useState(null); 
//     const [netMoney, setNetMoney] = useState(0); 
//     const [chartUrl, setChartUrl] = useState(""); 

//     const fetchTransactionsAndChart = async (limit = 500, skip = 0) => {
//         const response = await api.get("/transactions/combined", {
//             params: { limit, skip },
//         });
//         const fetchedTransactions = response.data.transactions.reverse();
//         setTransactions(fetchedTransactions);
//         setChartUrl(`data:image/png;base64,${response.data.chart_image}`); 
//         calculateNetMoney(fetchedTransactions); 
//     };

//     useEffect(() => {
//         fetchTransactionsAndChart();
//     }, []);

//     const handleInputChange = (event) => {
//         const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
//         setFormData({
//             ...formData,
//             [event.target.name]: value,
//         });
//     };

//     const handleFormSubmit = async (event) => {
//         event.preventDefault();
//         if (editingId) {
//             await api.put(`/transactions/${editingId}`, formData);
//         } else {
//             await api.post('/transactions', formData);
//         }
//         resetForm();
//         fetchTransactionsAndChart(); 
//     };

//     const handleEditClick = (transaction) => {
//         setEditingId(transaction.id);
//         setFormData({
//             amount: transaction.amount,
//             category: transaction.category,
//             description: transaction.description,
//             is_income: transaction.is_income,
//             date: transaction.date
//         });
//         setIsPopupOpen(true); 
//     };

//     const handleDeleteClick = async (id) => {
//         try {
//             console.log(id)
//             await api.delete(`/transactions/${id}`);
//             // fetchTransactionsAndChart(); 
//             setTransactions(transactions.filter(transaction => transaction.id !== id));
//         } catch (error) {
//             console.error("Failed to delete transaction:", error);
//         }
//     };

//     const calculateNetMoney = (transactionsList) => {
//         let net = 0;
//         transactionsList.forEach(transaction => {
//             if (transaction.is_income) {
//                 net += parseFloat(transaction.amount);
//             } else {
//                 net -= parseFloat(transaction.amount);
//             }
//         });
//         setNetMoney(net);
//     };

//     const resetForm = () => {
//         setFormData({
//             amount: '',
//             category: '',
//             description: '',
//             is_income: false,
//             date: ''
//         });
//         setEditingId(null); 
//         setIsPopupOpen(false); 
//     };

//     const EditPopup = () => (
//         <div className="popup">
//             <div className="popup-inner">
//                 <h2>Edit Transaction</h2>
//                 <form onSubmit={handleFormSubmit}>
//                     <div className="group">
//                         <div className="input-group">
//                             <label htmlFor="amount">Amount:</label>
//                             <input
//                                 type="text"
//                                 id="amount"
//                                 name="amount"
//                                 onChange={handleInputChange}
//                                 value={formData.amount}
//                                 required
//                             />
//                         </div>
//                         <div className="input-group">
//                             <label htmlFor="category">Category:</label>
//                             <input
//                                 type="text"
//                                 id="category"
//                                 name="category"
//                                 onChange={handleInputChange}
//                                 value={formData.category}
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className="group">
//                         <div className="input-group">
//                             <label htmlFor="description">Description:</label>
//                             <input
//                                 type="text"
//                                 id="description"
//                                 name="description"
//                                 onChange={handleInputChange}
//                                 value={formData.description}
//                                 required
//                             />
//                         </div>
//                         <div className="input-group">
//                             <label htmlFor="date">Date:</label>
//                             <input
//                                 type="date"
//                                 id="date"
//                                 name="date"
//                                 onChange={handleInputChange}
//                                 value={formData.date}
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className="group">
//                         <div className="input-group">
//                             <label htmlFor="is_income">Income:</label>
//                             <input
//                                 type="checkbox"
//                                 id="is_income"
//                                 name="is_income"
//                                 onChange={handleInputChange}
//                                 checked={formData.is_income} 
//                             />
//                         </div>
//                     </div>
//                     <button type="submit">Save Changes</button>
//                     <button type="button" onClick={() => setIsPopupOpen(false)}>Close</button>
//                 </form>
//             </div>
//         </div>
//     );

//     return (
//         <div className="expenses">
//             <h2>Net Money: {netMoney}</h2>
//             <div className="form-container">
//                 <h2>New Expense</h2>
//                 <form onSubmit={handleFormSubmit}>
//                     <div className="group">
//                         <div className="input-group">
//                             <label htmlFor="amount">Amount:</label>
//                             <input
//                                 type="text"
//                                 id="amount"
//                                 name="amount"
//                                 onChange={handleInputChange}
//                                 value={formData.amount}
//                                 required
//                             />
//                         </div>
//                         <div className="input-group">
//                             <label htmlFor="category">Category:</label>
//                             <input
//                                 type="text"
//                                 id="category"
//                                 name="category"
//                                 onChange={handleInputChange}
//                                 value={formData.category}
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className="group">
//                         <div className="input-group">
//                             <label htmlFor="description">Description:</label>
//                             <input
//                                 type="text"
//                                 id="description"
//                                 name="description"
//                                 onChange={handleInputChange}
//                                 value={formData.description}
//                                 required
//                             />
//                         </div>
//                         <div className="input-group">
//                             <label htmlFor="date">Date:</label>
//                             <input
//                                 type="date"
//                                 id="date"
//                                 name="date"
//                                 onChange={handleInputChange}
//                                 value={formData.date}
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className="group">
//                         <div className="input-group">
//                             <label htmlFor="is_income">Income:</label>
//                             <input
//                                 type="checkbox"
//                                 id="is_income"
//                                 name="is_income"
//                                 onChange={handleInputChange}
//                                 checked={formData.is_income} 
//                             />
//                         </div>
//                     </div>
//                     <button type="submit">Submit</button>
//                 </form>
//             </div>
//             <div className="card-container">
//                 {transactions.map((transaction) => (
//                     <div className="card" key={transaction.id}>
//                         <div className="card-body">
//                             <div className="card-item">
//                                 <div className="label">Amount:</div>
//                                 <div className="value">{transaction.amount}</div>
//                             </div>
//                             <div className="card-item">
//                                 <div className="label">Category:</div>
//                                 <div className="value">{transaction.category}</div>
//                             </div>
//                             <div className="card-item">
//                                 <div className="label">Type:</div>
//                                 <div className="value">{transaction.is_income ? 'Income' : 'Expense'}</div>
//                             </div>
//                             <div className="card-item">
//                                 <div className="label">Date:</div>
//                                 <div className="value">{transaction.date}</div>
//                             </div>
//                             <div className="card-item">
//                                 <div className="label">Description:</div>
//                                 <div className="value">{transaction.description}</div>
//                             </div>
//                             <div className="edit-container">
//                                 <button className="edit-card" onClick={() => handleEditClick(transaction)}>Edit</button>
//                                 <button className="delete-card" onClick={() => handleDeleteClick(transaction.id)}>Delete</button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {isPopupOpen && <EditPopup />}
//         </div>
//     );
// };

// export default Expense;
