import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Button } from 'antd';
import { getEmployees, deleteEmployee } from '../service/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employeeId: null });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cafeFilter = searchParams.get('cafe');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees(cafeFilter);
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [cafeFilter]);

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, employeeId: id });
  };

  const confirmDelete = () => {
    deleteEmployee(deleteModal.employeeId).then(() => {
      fetchEmployees();
      setDeleteModal({ isOpen: false, employeeId: null });
    }).catch(() => {
      alert('Failed to delete');
      setDeleteModal({ isOpen: false, employeeId: null });
    });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, employeeId: null });
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#000',
              margin: 0,
              textAlign: 'left'
            }}>
              Employees Management
            </h1>
            {cafeFilter && (
              <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
                Filtered by cafe: <strong>{cafeFilter}</strong>
              </p>
            )}
          </div>
          <Button
            type="primary"
            onClick={() => navigate('/employees/add')}
            style={{ height: 40, borderRadius: '6px', fontWeight: '500' }}
          >
            + Add New Employee
          </Button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#000', fontSize: 16 }}>
            <div>Loading employees...</div>
          </div>
        ) : employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <h3 style={{ margin: 0, color: '#000' }}>No employees found</h3>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#666' }}>
              {cafeFilter ? 'This cafe has no employees yet' : 'Add your first employee to get started'}
            </p>
          </div>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 500, width: '100%', borderRadius: '8px' }}>
            <AgGridReact rowData={employees} columnDefs={columnDefs} />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        message="Delete this employee? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default EmployeesPage;