import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Radio, Select } from 'antd';
import { getEmployees, createEmployee, updateEmployee, getCafes } from '../service/api';
import ReusableTextBox from '../components/ReusableTextBox';

function AddEditEmployeePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [cafeId, setCafeId] = useState('');
  const [cafes, setCafes] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getCafes().then(response => setCafes(response.data));
    if (id) {
      getEmployees().then(response => {
        const employee = response.data.find(e => e.id === id);
        if (employee) {
          setName(employee.name);
          setEmail(employee.email_address);
          setPhone(employee.phone_number);
          setGender(employee.gender);
          // Get the cafe from the cafes state or fetch it
          getCafes().then(cafesResponse => {
            const cafe = cafesResponse.data.find(c => c.name === employee.cafe);
            setCafeId(cafe ? cafe.id : '');
          });
        }
      });
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email_address: email, phone_number: phone, gender, cafe_id: cafeId || null };
    try {
      if (id) {
        await updateEmployee(id, data);
        alert('Employee updated!');
      } else {
        await createEmployee(data);
        alert('Employee created!');
      }
      setIsDirty(false);
      navigate('/employees');
    } catch (error) {
      alert('Error saving employee');
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    navigate('/employees');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <ReusableTextBox
          label="Name (6-10 chars)"
          value={name}
          onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
          required
          minLength={6}
          maxLength={10}
        />
        <ReusableTextBox
          label="Email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setIsDirty(true); }}
          required
        />
        <ReusableTextBox
          label="Phone (8 digits, starts with 8/9)"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setIsDirty(true); }}
          required
          pattern="[89]\d{7}"
        />
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Gender <span style={{ color: 'red' }}>*</span></label>
          <Radio.Group value={gender} onChange={(e) => { setGender(e.target.value); setIsDirty(true); }}>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Assign to Cafe</label>
          <Select value={cafeId} onChange={(value) => { setCafeId(value); setIsDirty(true); }} allowClear placeholder="-- None --" style={{ width: '100%' }}>
            {cafes.map(cafe => (
              <Select.Option key={cafe.id} value={cafe.id}>{cafe.name}</Select.Option>
            ))}
          </Select>
        </div>
        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>{id ? 'Update' : 'Create'}</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </form>
    </div>
  );
}

export default AddEditEmployeePage;