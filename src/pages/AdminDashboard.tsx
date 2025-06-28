// src/pages/AdminDashboard.tsx
import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-semibold mb-2">User Analytics</h2>
                    <p>View user activity, usage stats, etc.</p>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-semibold mb-2">Manage Trips</h2>
                    <p>Add/edit trips, destinations, packages.</p>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-semibold mb-2">Support Requests</h2>
                    <p>View and resolve customer messages.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
