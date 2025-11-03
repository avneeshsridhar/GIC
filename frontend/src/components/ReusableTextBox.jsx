import React from 'react';
import { Input } from 'antd';

function ReusableTextBox({ label, value, onChange, required, minLength, maxLength, type = "text", pattern }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ display: 'block', marginBottom: 5 }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default ReusableTextBox;