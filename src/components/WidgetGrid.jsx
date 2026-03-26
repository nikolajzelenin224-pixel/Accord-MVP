import React from 'react';
import { Card } from './ui/Card';
import { Activity, TrendingDown, Calendar } from 'lucide-react';

const WIDGETS = [
  {
    title: 'История',
    description: 'Траты за 30 дней',
    icon: Activity,
    value: '12 400 ₽'
  },
  {
    title: 'Экономия',
    description: 'Анализ тарифов',
    icon: TrendingDown,
    value: '3 200 ₽'
  },
  {
    title: 'Списания',
    description: 'Ближайшие',
    icon: Calendar,
    value: 'через 3 дня'
  }
];

const WidgetGrid = () => {
  return (
    <div className="px-4 pb-8">
      <h3 className="text-gray-900 font-semibold mb-4 px-2">Быстрые действия</h3>
      <div className="grid grid-cols-3 gap-3">
        {WIDGETS.map((widget, index) => {
          const Icon = widget.icon;
          return (
            <Card
              key={index}
              className="p-3 flex flex-col items-center justify-center text-center hover:shadow-lg hover:border-zinc-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center mb-2 group-hover:bg-zinc-100 transition-colors">
                <Icon className="text-zinc-700" size={20} />
              </div>
              <h4 className="text-[11px] font-semibold text-gray-900 leading-tight mb-1">{widget.title}</h4>
              <p className="text-[10px] font-bold text-zinc-700 mb-1">{widget.value}</p>
              <p className="text-[9px] text-gray-400 leading-tight">{widget.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetGrid;