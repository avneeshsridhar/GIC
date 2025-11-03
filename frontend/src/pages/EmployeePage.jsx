import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Input, Modal, Form, Radio, Select } from 'antd';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getCafes } from '../services/api';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to fetch employees');
    }
  };

  const fetchCafes = async () => {
    try {
      const response = await getCafes();
      setCafes(response.data);
    } catch (error) {
      alert('Failed to fetch cafes');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchCafes();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const data = { ...values, email_address: values.email, phone_number: values.phone };
      delete data.email;
      delete data.phone;
      if (editId) {
        await updateEmployee(editId, data);
        alert('Employee updated!');
      } else {
        await createEmployee(data);
        alert('Employee created!');
      }
      setIsModalOpen(false);
      setEditId(null);
      form.resetFields();
      fetchEmployees();
    } catch (error) {
      alert('Error saving employee');
    }
  };

  const handleEdit = (employee) => {
    setEditId(employee.id);
    const cafe = cafes.find(c => c.name === employee.cafe);
    form.setFieldsValue({
      name: employee.name,
      email: employee.email_address,
      phone: employee.phone_number,
      gender: employee.gender,
      cafe_id: cafe ? cafe.id : undefined
    });
    setIsModalOpen(true);
  };

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
          <Button size="small" onClick={() => handleEdit(params.data)} style={{ marginRight: 8 }}>Edit</Button>
          <Button size="small" danger onClick={() => handleDelete(params.data.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Employees</h1>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Add New Employee</Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact rowData={employees} columnDefs={columnDefs} />
      </div>
      <Modal title={editId ? 'Edit Employee' : 'Add Employee'} open={isModalOpen} onCancel={() => { setIsModalOpen(false); setEditId(null); form.resetFields(); }} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={{ gender: 'Male' }}>
          <Form.Item label="Name" name="name" rules={[{ required: true, min: 6, max: 10 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, pattern: /^[89]\d{7}$/, message: 'Must start with 8 or 9 and have 8 digits' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Assign to Cafe" name="cafe_id">
            <Select allowClear placeholder="-- None --">
              {cafes.map(cafe => (
                <Select.Option key={cafe.id} value={cafe.id}>{cafe.name}</Select.Option>
              ))}
            </Select>
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

export default EmployeesPage;