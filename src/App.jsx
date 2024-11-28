import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Expense from './pages/Expenses';
import Navbar from './components/Navbar';
import Analysis from './pages/analysis';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Expenses" element={<Expense/>} />
        <Route path="/Analysis" element={<Analysis/>}/>
      </Routes>
      
    </Router>
  )
}

export default App;
