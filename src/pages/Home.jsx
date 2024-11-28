import React, { useState, useEffect } from "react";
import api from "../api";

const Home = () => {
    const [transactions, setTransactions] = useState([]);
    const [chartUrl, setChartUrl] = useState("");
    const [chartUrl2, setChartUrl2] = useState("");

    const fetchData = async () => {
        try {
            const response = await api.get("/transactions/combined", {
                params: { limit: 5, skip: 0 },
                responseType: "json",
            });
            setTransactions(response.data.transactions);
            setChartUrl(`data:image/png;base64,${response.data.chart_image}`);
            setChartUrl2(`data:image/png;base64,${response.data.chart_image2}`); // Corrected here
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="home">
            <div className="top">
                <div className="top-left">
                    <h5>Pending Tasks</h5>
                    <hr className="pale" />
                    <p><i className="fa-regular fa-credit-card"></i> Pending Approvals</p>
                    <p><i className="fa-regular fa-credit-card"></i> New Trips Registered</p>
                    <p><i className="fa-regular fa-clock"></i> Unreported Expenses</p>
                    <p><i className="fa-regular fa-clock"></i> Upcoming Expenses</p>
                    <p><i className="fa-regular fa-credit-card"></i> Unreported Advances</p>
                </div>
                <div className="top-right">
                    <h5>Recent Expenses</h5>
                    <hr />
                    <table className="recent-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Transaction</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.is_income ? 'Income' : 'Expense'}</td>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="middle">
                <h5>Quick Access</h5>
                <hr />
                <div className="quickaccess">
                    <button className="quick"><i className="fa-regular fa-credit-card access"></i> + New Expense</button>
                    <button className="quick"><i className="fa-solid fa-bullseye access goals"></i> + New Goals</button>
                    <button className="quick"><i className="fa-solid fa-file-lines access"></i> + New Report</button>
                </div>
            </div>
            <div className="bottom">
                <div className="bar-chart">
                    <h2>Income Chart</h2>
                    {chartUrl && <img src={chartUrl} alt="Income Chart" />}
                </div>
                <div className="bar-chart">
                    <h2>Expense Chart</h2>
                    {chartUrl2 && <img src={chartUrl2} alt="Expense Chart" />}
                </div>
            </div>
        </div>
    );
};

export default Home;
