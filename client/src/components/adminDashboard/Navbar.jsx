import React from 'react';
import { Users, Home, FileText } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, setEditingAuctionId }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-800">Auction Manager</span>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home size={20} />
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingAuctionId(null);
                setCurrentPage('dashboard');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'dashboard' || currentPage === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} />
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
