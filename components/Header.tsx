
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { LogoIcon, SearchIcon, BellIcon } from './IconComponents';

interface HeaderProps {
  // Make search a controlled component
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSearchVisible?: boolean;
}

const Header: React.FC<HeaderProps> = ({ searchValue, onSearchChange, isSearchVisible = true }) => {
  const { user } = useAppContext();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2 text-blue-600">
              <LogoIcon className="h-7 w-7" />
              <span className="font-bold text-xl text-gray-800 dark:text-white">AI Tutor</span>
            </Link>
          </div>
          
          {isSearchVisible && (
            <div className="flex-1 flex justify-center px-8 lg:px-16">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search subjects or topics..."
                  value={searchValue}
                  onChange={onSearchChange}
                  className="block w-full bg-gray-100 dark:bg-gray-800 border-transparent rounded-full py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
            {user && (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full ring-2 ring-offset-2 ring-blue-500"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
