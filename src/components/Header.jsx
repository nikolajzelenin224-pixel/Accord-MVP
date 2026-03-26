import React from 'react';
import { Search, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      {/* Поисковый инпут */}
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Поиск"
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-200 transition-colors"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Иконка профиля */}
      <button 
        className="p-2 rounded-full hover:bg-gray-50 transition-colors"
        aria-label="Профиль"
      >
        <UserCircle className="text-gray-900" size={24} />
      </button>
    </div>
  );
};

export default Header;