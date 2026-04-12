import React from 'react';
import { Card } from './ui/Card';
import { Plus, Cloud, Building2, Box, PenTool, LayoutTemplate, FileText, CreditCard, Utensils, ShoppingBag, Car, Home, Smartphone, Gamepad2, Music, Film, Briefcase, Heart } from 'lucide-react';

// Маппинг строковых имен иконок на компоненты lucide-react
const ICON_MAP = {
  default: CreditCard,
  cloud: Cloud,
  building: Building2,
  box: Box,
  pen: PenTool,
  layout: LayoutTemplate,
  file: FileText,
  utensils: Utensils,
  shopping: ShoppingBag,
  car: Car,
  home: Home,
  smartphone: Smartphone,
  gamepad: Gamepad2,
  music: Music,
  film: Film,
  briefcase: Briefcase,
  heart: Heart,
};

const getIconComponent = (iconName) => {
  return ICON_MAP[iconName] || ICON_MAP.default;
};

const SubscriptionsPanel = ({ subscriptions, onToggle, onEdit, onAdd }) => {
  return (
    <div className="px-4 mb-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-gray-900 font-semibold text-lg">Ваши подписки</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {subscriptions.filter(s => s.active).length} активных
          </span>
          <button
            onClick={onAdd}
            className="p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors shadow-lg"
            aria-label="Добавить подписку"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-400 mb-4">У вас пока нет подписок</p>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Добавить первую подписку
          </button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {subscriptions.map((sub) => (
            <Card
              key={sub.id}
              className="p-4 transition-all duration-200 hover:shadow-lg hover:border-zinc-200 group cursor-pointer"
              onClick={() => onEdit(sub)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    {React.createElement(getIconComponent(sub.iconName), { size: 20, className: 'text-gray-500' })}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 group-hover:text-zinc-700 transition-colors">
                      {sub.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {sub.price.toLocaleString('ru-RU')} ₽ / мес
                    </p>
                    <p className={`text-[10px] mt-1 ${sub.active ? 'text-gray-400' : 'text-red-500'}`}>
                      {sub.active ? 'Активна' : 'Списания запрещены'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(sub.id);
                    }}
                    className={`w-12 h-7 rounded-full p-1 transition-all duration-200 cursor-pointer hover:opacity-80 ${
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPanel;
