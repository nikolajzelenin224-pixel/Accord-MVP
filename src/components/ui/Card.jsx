import React from 'react';

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);