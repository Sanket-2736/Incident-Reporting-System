import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IncidentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    attachments: null,
    username: localStorage.getItem('username') || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'attachments' ? files : value,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'attachments' && !value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
      }
    });
    // Check if at least one file is uploaded
    if (!formData.attachments || formData.attachments.length === 0) {
      newErrors.attachments = 'At least one attachment is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFields()) {
      toast.error('Please fill all the required fields.', { position: 'top-center', autoClose: 3000 });
      return;
    }
  
    // Navigate to login if username is missing
    if (!formData.username) {
      navigate('/login');
      return;
    }
  
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'attachments' && value) {
        for (let i = 0; i < value.length; i++) {
          form.append(key, value[i]);
        }
      } else {
        form.append(key, value);
      }
    });
  
    try {
      const response = await fetch('http://localhost:5000/api/incidents/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // Do not set Content-Type header when using FormData
        },
        body: form, // Send FormData directly
      });
  
      const data = await response.json();
      if (data.success) {
        toast.success('Incident reported successfully!', { position: 'top-center', autoClose: 3000 });
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          attachments: null,
          username: localStorage.getItem('username') || '',
        });
      } else {
        toast.error(data.error || 'Failed to report the incident.', { position: 'top-center', autoClose: 3000 });
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('An error occurred. Please try again.', { position: 'top-center', autoClose: 3000 });
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Report an Incident</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {['title', 'description', 'category', 'location'].map((field) => (
          <div key={field} className="relative">
            <label className="block text-gray-700 font-medium mb-1" htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === 'description' ? (
              <textarea
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className={`w-full px-4 py-2 border ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring ${
                  errors[field] ? 'focus:ring-red-300' : 'focus:ring-blue-200'
                }`}
                rows="4"
              />
            ) : (
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className={`w-full px-4 py-2 border ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring ${
                  errors[field] ? 'focus:ring-red-300' : 'focus:ring-blue-200'
                }`}
              />
            )}
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        <div className="relative">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="attachments">
            Attachments
          </label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            multiple
          />
          {formData.attachments &&
            Array.from(formData.attachments).map((file, index) => (
              <p key={index} className="text-gray-600 text-sm">
                {file.name}
              </p>
            ))}
          {errors.attachments && <p className="text-red-500 text-sm">{errors.attachments}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-medium transition-transform transform hover:scale-105 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default IncidentForm;
