import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Home from "../pages/Home";
import profileImage from '../assets/design.jpg'
import Analysis from "../pages/analysis";
// import Logo from "../assets/logo.png"


const Navbar = () => {
    const [totalSum, setTotalSum] = useState(0);

    useEffect(() => {
        const fetchTotalSum = async () => {
            try {
                const response = await axios.get("http://localhost:8000/transactions/total_sum");
                setTotalSum(response.data.total_sum);
            } catch (error) {
                console.error("Error fetching total sum:", error);
            }
        };

        fetchTotalSum();
    }, []);
    return (
        <header className="navbar">
            <div className="profile">
                <div className="profile-img">
                    <img src={profileImage}  class="profile-image"/>
                </div>
                <div className="profile-name">
                    ACHANTA BADRINATH
                </div>
            </div>
            <ul className="nav no-bullets">
                <li>
                    <Link to="/" className="nav-link">
                        <i class="fa-solid fa-house"></i> 
                        <div class="to">Home</div>
                    </Link>
                </li>
                <li>
                    <Link to="/expenses" className="nav-link">
                        <i class="fa-solid fa-hand-holding-dollar"></i>
                        {/* <i class="fa-solid fa-dollar-sign"></i> */}
                        <div class="to">Expenses</div>
                    </Link>
                </li>
                {/* <li>
                    <Link to="/" className="nav-link">
                        <i class="fa-solid fa-hand-holding-dollar"></i>
                        <div class="to">Income</div>
                    </Link>
                </li> */}
                <li>
                    <Link to="/" className="nav-link">
                    <i class="fa-solid fa-bullseye"></i>
                        <div class="to">Goals</div>
                    </Link>
                </li>
                <li>
                    <Link to="/analysis" className="nav-link">
                    <i class="fa-solid fa-chart-line"></i>
                        <div class="to">Analysis</div>
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Navbar;