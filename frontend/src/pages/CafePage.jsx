import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Input, Modal, Form } from 'antd';
import { getCafes, createCafe, updateCafe, deleteCafe } from '../services/api';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const { TextArea } = Input;

function CafesPage() {
  const [cafes, setCafes] = useState([]);
  const [location, setLocation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

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

  const handleSubmit = async (values) => {
    try {
      if (editId) {
        await updateCafe(editId, values);
        alert('Cafe updated!');
      } else {
        await createCafe(values);
        alert('Cafe created!');
      }
      setIsModalOpen(false);
      setEditId(null);
      form.resetFields();
      fetchCafes();
    } catch (error) {
      alert('Error saving cafe');
    }
  };

  const handleEdit = (cafe) => {
    setEditId(cafe.id);
    form.setFieldsValue(cafe);
    setIsModalOpen(true);
  };

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
    { field: 'employees', width: 120 },
    { field: 'location', width: 150 },
    {
      headerName: 'Actions',
      width: 200,
      cellRenderer: (params) => (
        <div>
          <Button size="small" onClick={() => handleEdit(params.data)} style={{ marginRight: 8 }}>Edit</Button>
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
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Add New Cafe</Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact rowData={cafes} columnDefs={columnDefs} />
      </div>
      <Modal title={editId ? 'Edit Cafe' : 'Add Cafe'} open={isModalOpen} onCancel={() => { setIsModalOpen(false); setEditId(null); form.resetFields(); }} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, min: 6, max: 10 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, max: 256 }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Logo URL" name="logo">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>{editId ? 'Update' : 'Create'}</Button>
            <Button onClick={() => { setIsModalOpen(false); setEditId(null); form.resetFields(); }}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CafesPage;