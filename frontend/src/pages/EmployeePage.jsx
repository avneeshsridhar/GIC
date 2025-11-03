import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Button } from 'antd';
import { getEmployees, deleteEmployee } from '../service/api';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cafeFilter = searchParams.get('cafe');

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees(cafeFilter);
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [cafeFilter]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) {
      deleteEmployee(id).then(() => {
        alert('Employee deleted!');
        fetchEmployees();
      }).catch(() => alert('Failed to delete'));
    }
  };

  const columnDefs = [
    { field: 'id', width: 120 },
    { field: 'name', width: 130 },
    { field: 'email_address', headerName: 'Email', width: 220 },
    { field: 'phone_number', headerName: 'Phone', width: 130 },
    { field: 'days_worked', headerName: 'Days Worked', width: 140 },
    { field: 'cafe', width: 150 },
    {
      headerName: 'Actions',
      width: 200,
      cellRenderer: (params) => (
        <div>
          <Button size="small" onClick={() => navigate(`/employees/edit/${params.data.id}`)} style={{ marginRight: 8 }}>Edit</Button>
          <Button size="small" danger onClick={() => handleDelete(params.data.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Employees {cafeFilter && `- ${cafeFilter}`}</h1>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => navigate('/employees/add')}>Add New Employee</Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact rowData={employees} columnDefs={columnDefs} />
      </div>
    </div>
  );
}

export default EmployeesPage;