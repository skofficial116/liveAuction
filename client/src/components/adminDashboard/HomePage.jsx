import React from 'react';
import { Users, Clock, FileText } from 'lucide-react';

const HomePage = ({ auctions }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Auction Manager</h1>
        <p className="text-lg text-blue-100">
          Create, manage, and run professional auctions with ease. Perfect for sports leagues, fantasy drafts, and team selections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Users size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Management</h3>
          <p className="text-gray-600">
            Create and customize teams with budgets, colors, and rosters. Track player acquisitions in real-time.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Clock size={24} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Auctions</h3>
          <p className="text-gray-600">
            Run timed auctions with customizable bidding controls. Keep everyone engaged with real-time updates.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FileText size={24} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Player Database</h3>
          <p className="text-gray-600">
            Organize players with custom attributes. Create auction sets and manage player pools efficiently.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{auctions.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Auctions</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {auctions.filter(a => a.status === 'in-progress').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Active</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {auctions.reduce((sum, a) => sum + (a.teams?.length || 0), 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Teams</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">
              {auctions.reduce((sum, a) => sum + (a.players?.length || 0), 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Players</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
