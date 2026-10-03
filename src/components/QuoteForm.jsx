// src/components/QuoteForm.jsx
import React, { useState } from 'react';

export default function QuoteForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    const formData = new FormData(e.target);
    // Inject your Web3Forms key securely from env variables
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);

    const response = await fetch("https://web3forms.com", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setStatus("Quote Request Submitted Successfully!");
      e.target.reset();
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto space-y-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold">Describe Your Print Project</h2>
      
      <div>
        <label className="block text-sm font-medium">Project Description</label>
        <textarea name="description" required placeholder="Describe dimensions, quantity, finishes..." className="w-full mt-1 p-2 border rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium">Your Email</label>
        <input type="email" name="email" required className="w-full mt-1 p-2 border rounded-md" />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Submit Request
      </button>
      
      {status && <p className="text-center text-sm font-semibold mt-2">{status}</p>}
    </form>
  );
}
