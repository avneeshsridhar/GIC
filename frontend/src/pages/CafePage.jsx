import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Button, Input } from 'antd';
import { getCafes, deleteCafe } from '../service/api';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function CafesPage() {
  const [cafes, setCafes] = useState([]);
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const fetchCafes = async () => {
    try {
      const response = await getCafes(location);
      setCafes(response.data);
    } catch (error) {
      alert('Failed to fetch cafes');
    }
  };

  useEffect(() => {
    fetchCafes();
  }, [location]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this cafe? All employees will be removed.')) {
      deleteCafe(id).then(() => {
        alert('Cafe deleted!');
        fetchCafes();
      }).catch(() => alert('Failed to delete'));
    }
  };

  const columnDefs = [
    { field: 'logo', width: 100 },
    { field: 'name', width: 150 },
    { field: 'description', width: 300 },
    { 
      field: 'employees', 
      width: 120,
      cellRenderer: (params) => (
        <span 
          onClick={() => navigate(`/employees?cafe=${params.data.name}`)} 
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {params.value}
        </span>
      )
    },
    { field: 'location', width: 150 },
    {
      headerName: 'Actions',
      width: 200,
      cellRenderer: (params) => (
        <div>
          <Button size="small" onClick={() => navigate(`/cafes/edit/${params.data.id}`)} style={{ marginRight: 8 }}>Edit</Button>
          <Button size="small" danger onClick={() => handleDelete(params.data.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Cafes</h1>
      <div style={{ marginBottom: 20 }}>
        <Input placeholder="Filter by location" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: 200, marginRight: 10 }} />
        <Button type="primary" onClick={() => navigate('/cafes/add')}>Add New Cafe</Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact rowData={cafes} columnDefs={columnDefs} />
      </div>
    </div>
  );
}

export default CafesPage;