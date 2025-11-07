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
    { field: 'logo', flex: 0.5 },
    { field: 'name', flex: 1 },
    { field: 'description', flex: 2 },
    { 
      field: 'employees', 
      flex: 0.7,
      cellRenderer: (params) => (
        <span 
          onClick={() => navigate(`/employees?cafe=${params.data.name}`)} 
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {params.value}
        </span>
      )
    },
    { field: 'location', flex: 1 },
    {
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params) => (
        <div>
          <Button size="small" onClick={() => navigate(`/cafes/edit/${params.data.id}`)} style={{ marginRight: 8 }}>Edit</Button>
          <Button size="small" danger onClick={() => handleDelete(params.data.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
      <h1>Cafes</h1>
      <div style={{ marginBottom: 20 }}>
        <Input placeholder="Filter by location" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: 200, marginRight: 10 }} />
        <Button type="primary" onClick={() => navigate('/cafes/add')}>Add New Cafe</Button>
      </div>
      {cafes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          <h3>No cafes found</h3>
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact rowData={cafes} columnDefs={columnDefs} />
        </div>
      )}
    </div>
  );
}

export default CafesPage;