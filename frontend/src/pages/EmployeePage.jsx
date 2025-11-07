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
    { field: 'id', flex: 1 },
    { field: 'name', flex: 1 },
    { field: 'email_address', headerName: 'Email', flex: 1.5 },
    { field: 'phone_number', headerName: 'Phone', flex: 1 },
    { field: 'days_worked', headerName: 'Days Worked', flex: 1 },
    { field: 'cafe', flex: 1 },
    {
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params) => (
        <div>
          <Button size="small" onClick={() => navigate(`/employees/edit/${params.data.id}`)} style={{ marginRight: 8 }}>Edit</Button>
          <Button size="small" danger onClick={() => handleDelete(params.data.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
      <h1>Employees {cafeFilter && `- ${cafeFilter}`}</h1>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => navigate('/employees/add')}>Add New Employee</Button>
      </div>
      {employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          <h3>No employees found</h3>
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact rowData={employees} columnDefs={columnDefs} />
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;