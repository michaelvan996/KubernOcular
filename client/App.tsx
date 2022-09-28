import React from 'react'
import './style.css';
import Nav from './Components/Nav';
import Sidebar from './Components/Sidebar'
import Dashboard from "./Components/Dashboard";
import PodsTab from "./Components/PodsTab";
import NodesTab from "./Components/NodesTab";
import { Routes, Route } from 'react-router-dom';
import PodDisplay from './Components/PodDisplay';

const App = () => {
  return (
    <div id="main-container">
    <Sidebar />

    <Routes>
      <Route path='/' element={<Dashboard/>} />
      <Route path='/pods' element={<PodsTab />} />
      <Route path='/nodes' element={<NodesTab />} />
      <Route path='/poddisplay' element={<PodDisplay />} />
    </Routes>
    </div>
  )
}

export default App;