// src/components/AppointmentForm.js

import React, { useState } from 'react';

const AppointmentForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientDetails = {
      serviceId: 'health-checkup',  // Replace with actual service ID
      date: date,
      time: time,
      clientName: name,
      clientEmail: email,
    };

    // Direct API call to SimplyBook.me (be aware of the security risk here)
    try {
      const response = await fetch('https://healthifycom.simplybook.me/cbp/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-api-key',  // Replace with actual API key
        },
        body: JSON.stringify({
          service: clientDetails.serviceId,
          date: clientDetails.date,
          time: clientDetails.time,
          client_name: clientDetails.clientName,
          
          client_email: clientDetails.clientEmail,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Appointment Scheduled Successfully!');
      } else {
        alert('Error scheduling appointment.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="container">
      <h1>Schedule Appointment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <br /><br />

        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit" className="btn">Schedule Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
