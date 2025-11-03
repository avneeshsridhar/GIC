import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import CafesPage from './pages/CafePage';
import EmployeesPage from './pages/EmployeePage';
import AddEditCafePage from './pages/AddEditCafe';
import AddEditEmployeePage from './pages/AddEditEmployee';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['cafes']}>
            <Menu.Item key="cafes">
              <Link to="/">Cafes</Link>
            </Menu.Item>
            <Menu.Item key="employees">
              <Link to="/employees">Employees</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<CafesPage />} />
            <Route path="/cafes/add" element={<AddEditCafePage />} />
            <Route path="/cafes/edit/:id" element={<AddEditCafePage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/add" element={<AddEditEmployeePage />} />
            <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;