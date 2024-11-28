import React, { useState, useEffect } from "react";
import api from "../api";

const Analysis = () => {
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
        <div className="analysis">
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

export default Analysis;
