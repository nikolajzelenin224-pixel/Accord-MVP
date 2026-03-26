import React from 'react';
import { Card } from './ui/Card';

const SubscriptionsPanel = ({ subscriptions, onToggle }) => {
  return (
    <div className="px-4 mb-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-gray-900 font-semibold text-lg">Ваши подписки</h3>
        <span className="text-xs text-gray-400">{subscriptions.filter(s => s.active).length} активных</span>
      </div>
      <div className="flex flex-col gap-3">
        {subscriptions.map((sub) => (
          <Card
            key={sub.id}
            className="p-4 flex justify-between items-center transition-all duration-200 hover:shadow-lg hover:border-zinc-200 group"
          >
            <div className="flex items-center gap-3">
              {/* Иконка сервиса */}
              <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                {React.createElement(sub.icon, { size: 18, className: 'text-gray-500' })}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900 group-hover:text-zinc-700 transition-colors">{sub.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub.price.toLocaleString('ru-RU')} ₽ / мес</p>
              </div>
            </div>
            {/* Стильный Switch (тумблер) */}
            <div
              onClick={() => onToggle(sub.id)}
              className={`w-12 h-7 rounded-full p-1 transition-all duration-200 cursor-pointer relative hover:opacity-80 ${
                sub.active
                  ? 'bg-zinc-900 shadow-lg shadow-zinc-900/30'
                  : 'bg-gray-200 group-hover:bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-200 ${
                  sub.active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPanel;