import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ResultPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('tripData');
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return <div className="text-center py-10 text-gray-600">Loading trip data...</div>;

  const coords = data.route.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-700">Trip Summary</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
        >
          Back to Trip Form
        </button>
      </div>

      {/* Map Section */}
      <div className="rounded-xl overflow-hidden shadow-lg border">
        <MapContainer center={coords[0]} zoom={5} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={coords} color="blue" />
          <Marker position={coords[0]}><Popup>Start</Popup></Marker>
          <Marker position={coords[coords.length - 1]}><Popup>End</Popup></Marker>
        </MapContainer>
      </div>

      {/* ELD Log Section */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">Generated ELD Log (Image)</h3>
        <img
          src={`http://localhost:8000/${data.image_url}`}
          alt="ELD Log"
          className="w-full border rounded shadow-lg"
        />

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-md mt-4">
          <h4 className="text-lg font-bold text-blue-700 mb-2">Daily Summary (Supplemental)</h4>
          <ul className="list-disc pl-5 text-gray-700 space-y-4">
            {data.logs.map((log, i) => (
              <li key={i} className="space-y-1">
                <div className="font-medium">{log.date}:</div>
                <div className="text-sm pl-4">
                  <p><strong>Total Miles:</strong> {log.totalMiles}</p>
                  <p><strong>Driver:</strong> {log.driverName} | <strong>Truck:</strong> {log.truckNumber} | <strong>Carrier:</strong> {log.carrierName}</p>
                  <p><strong>Activities:</strong> {log.activities.length} | <strong>Violations:</strong> {log.violations.length}</p>
                  <ul className="list-disc pl-5 text-gray-600">
                    {log.activities.map((act, j) => (
                      <li key={j}>
                        {act.status} from {act.startTime} to {act.endTime} at {act.location} ({act.duration}h)
                      </li>
                    ))}
                  </ul>
                  {log.violations.length > 0 && (
                    <div className="mt-2 text-red-600">
                      <strong>Violations:</strong>
                      <ul className="list-disc pl-5">
                        {log.violations.map((v, k) => (
                          <li key={k}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
