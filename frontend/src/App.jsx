import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CafesPage from './pages/CafePage';
import EmployeesPage from './pages/EmployeePage';
import AddEditCafePage from './pages/AddEditCafe';
import AddEditEmployeePage from './pages/AddEditEmployee';
import 'antd/dist/reset.css';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ background: '#001529', padding: '20px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'white', marginRight: 30, textDecoration: 'none', fontSize: '18px', fontWeight: '500' }}>
            Cafes
          </Link>
          <Link to="/employees" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: '500' }}>
            Employees
          </Link>
        </div>
      </div>
      <div style={{ padding: 20, flex: 1 }}>
        <Routes>
          <Route path="/" element={<CafesPage />} />
          <Route path="/cafes/add" element={<AddEditCafePage />} />
          <Route path="/cafes/edit/:id" element={<AddEditCafePage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/add" element={<AddEditEmployeePage />} />
          <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;