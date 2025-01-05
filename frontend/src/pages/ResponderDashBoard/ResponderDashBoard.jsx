import React, { useState } from 'react';

function ResponderDashBoard() {
  const [cases, setCases] = useState([
    {
      id: 1,
      title: 'Broken Traffic Light',
      description: 'The traffic light at 5th Avenue is not functioning.',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Pothole on Main Street',
      description: 'A large pothole is causing accidents.',
      status: 'In Progress',
    },
  ]);

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleStatusUpdate = () => {
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === selectedCaseId ? { ...c, status: newStatus } : c
      )
    );
    setSelectedCaseId(null);
    setNewStatus('');
    alert('Status updated successfully!');
  };

  const generateReport = () => {
    const report = cases
      .map(
        (c) => `Case ID: ${c.id}\nTitle: ${c.title}\nStatus: ${c.status}\n\n`
      )
      .join('');
    alert(`Generated Report:\n\n${report}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Responder Dashboard
      </h1>

      {/* View Cases */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          View Cases
        </h2>
        {cases.length === 0 ? (
          <p className="text-gray-500">No cases to display.</p>
        ) : (
          <ul className="space-y-4">
            {cases.map((c) => (
              <li
                key={c.id}
                className="p-4 bg-gray-50 border rounded-md shadow-sm hover:bg-gray-100"
              >
                <strong className="text-lg font-semibold text-gray-800">
                  {c.title}
                </strong>{' '}
                <p className="text-gray-600">{c.description}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                    c.status === 'Pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : c.status === 'In Progress'
                      ? 'bg-blue-200 text-blue-800'
                      : c.status === 'Resolved'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Update Resolution Status */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Update Resolution Status
        </h2>
        <div className="flex space-x-4">
          <select
            value={selectedCaseId || ''}
            onChange={(e) => setSelectedCaseId(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-lg bg-gray-50"
          >
            <option value="" disabled>
              Select a Case
            </option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            disabled={!selectedCaseId}
            className="w-1/2 p-2 border rounded-lg bg-gray-50"
          >
            <option value="" disabled>
              Select New Status
            </option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          onClick={handleStatusUpdate}
          disabled={!selectedCaseId || !newStatus}
          className={`mt-4 px-6 py-2 text-white font-semibold rounded-lg ${
            !selectedCaseId || !newStatus
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Update Status
        </button>
      </div>

      {/* Generate Report */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Generate Report
        </h2>
        <button
          onClick={generateReport}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}

export default ResponderDashBoard;
