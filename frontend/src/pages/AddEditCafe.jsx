import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input } from 'antd';
import { getCafes, createCafe, updateCafe } from '../service/api';
import ReusableTextBox from '../components/ReusableTextBox';

const { TextArea } = Input;

function AddEditCafePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getCafes().then(response => {
        const cafe = response.data.find(c => c.id === id);
        if (cafe) {
          setName(cafe.name);
          setDescription(cafe.description);
          setLocation(cafe.location);
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
    const data = { name, description, location, logo: logo ? 'uploaded' : '' };
    try {
      if (id) {
        await updateCafe(id, data);
        alert('Cafe updated!');
      } else {
        await createCafe(data);
        alert('Cafe created!');
      }
      setIsDirty(false);
      navigate('/');
    } catch (error) {
      alert('Error saving cafe');
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    navigate('/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      e.target.value = '';
      return;
    }
    setLogo(file);
    setIsDirty(true);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>{id ? 'Edit Cafe' : 'Add Cafe'}</h2>
      <form onSubmit={handleSubmit}>
        <ReusableTextBox
          label="Name (6-10 chars)"
          value={name}
          onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
          required
          minLength={6}
          maxLength={10}
        />
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Description (max 256) <span style={{ color: 'red' }}>*</span></label>
          <TextArea
            rows={4}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
            required
            maxLength={256}
          />
        </div>
        <ReusableTextBox
          label="Location"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setIsDirty(true); }}
          required
        />
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Logo (max 2MB)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>{id ? 'Update' : 'Create'}</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </form>
    </div>
  );
}

export default AddEditCafePage;