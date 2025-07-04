import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function InputForm() {
  const [form, setForm] = useState({
    driver_name: '', carrier_name: '', truck_number: '', current_location: '', pickup_location: '', dropoff_location: '', current_cycle: 0,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:8000/api/plan-trip/', form);
    localStorage.setItem('tripData', JSON.stringify(res.data));
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-tight text-center mb-6 drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ELD Trip Planner
          </span>
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Enter Trip Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Driver Name</label>
            <input
              type="text"
              placeholder="e.g., Abrham Berie"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.driver_name}
              onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Carrier Name</label>
            <input
              type="text"
              placeholder="e.g., ABC Logistics"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.carrier_name}
              onChange={e => setForm({ ...form, carrier_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Truck Number</label>
            <input
              type="text"
              placeholder="e.g., TRK1234"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.truck_number}
              onChange={e => setForm({ ...form, truck_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Current Location</label>
            <input
              type="text"
              placeholder="e.g., Chicago, IL or 123 Main St, Chicago, IL"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.current_location}
              onChange={e => setForm({ ...form, current_location: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Pickup Location</label>
            <input
              type="text"
              placeholder="e.g., Detroit, MI or 456 Industrial Blvd, Detroit, MI"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.pickup_location}
              onChange={e => setForm({ ...form, pickup_location: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Drop-off Location</label>
            <input
              type="text"
              placeholder="e.g., Atlanta, GA or 789 Warehouse Dr, Atlanta, GA"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.dropoff_location}
              onChange={e => setForm({ ...form, dropoff_location: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Current Cycle Used (Hours)</label>
            <input
              type="number"
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.current_cycle}
              min={0}
              max={70}
              onChange={e => setForm({ ...form, current_cycle: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Hours already used in your current 8-day cycle (max 70 hours)</p>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition">Generate Route &amp; ELD Logs</button>
        </form>

        {/* Assumptions Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-700 mb-2">Assumptions</h3>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Property-carrying driver (70hrs/8days cycle)</li>
            <li>No adverse driving conditions</li>
            <li>Fueling required every 1,000 miles</li>
            <li>1 hour allocated for pickup and drop-off</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InputForm;