import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Button, Input } from 'antd';
import { getCafes, deleteCafe } from '../service/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function CafesPage() {
  const [cafes, setCafes] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, cafeId: null });
  const navigate = useNavigate();

  // Load cafes data from API
  const fetchCafes = async () => {
    setLoading(true);
    try {
      const response = await getCafes(location);
      setCafes(response.data);
    } catch (err) {
      console.error('Error loading cafes:', err);
      alert('Failed to fetch cafes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, [location]);

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, cafeId: id });
  };

  // Handle cafe deletion confirmation
  const confirmDelete = () => {
    deleteCafe(deleteModal.cafeId)
      .then(() => {
        fetchCafes(); // Refresh list
        setDeleteModal({ isOpen: false, cafeId: null });
      })
      .catch((err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete cafe');
        setDeleteModal({ isOpen: false, cafeId: null });
      });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, cafeId: null });
  };

  // Column configuration for the cafes grid
  const columnDefs = [
    {
      field: 'logo',
      flex: 0.5,
      cellRenderer: (params) => {
        // Show logo image if exists, otherwise placeholder text
        if (params.value) {
          return <img src={params.value} alt="Cafe logo" style={{ width: 40, height: 40, borderRadius: 4 }} />;
        }
        return 'No logo';
      }
    },
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
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '32px 24px',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#000',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          Cafes Management
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          gap: '12px'
        }}>
          <Input
            placeholder="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: 280,
              height: 40,
              borderRadius: '6px'
            }}
          />
          <Button
            type="primary"
            onClick={() => navigate('/cafes/add')}
            style={{ height: 40, borderRadius: '6px', fontWeight: '500' }}
          >
            + Add New Cafe
          </Button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#000', fontSize: 16 }}>
            <div>Loading cafes...</div>
          </div>
        ) : cafes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <h3 style={{ margin: 0, color: '#000' }}>No cafes found</h3>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#666' }}>Try adjusting your filter or add a new cafe</p>
          </div>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 500, width: '100%', borderRadius: '8px' }}>
            <AgGridReact rowData={cafes} columnDefs={columnDefs} />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        message="Delete this cafe? All employees will be removed."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default CafesPage;