import React from 'react';
import { Card } from './ui/Card';
import { Wallet } from 'lucide-react';

const SmartCard = ({ balance }) => {
  return (
    <div className="px-4 py-6">
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white overflow-hidden relative h-48 flex flex-col justify-between p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
        {/* Декоративный элемент градиент на карте */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="flex justify-between items-start">
          <span className="text-xl font-bold tracking-tight">Accord</span>
          <Wallet className="text-zinc-400" size={24} />
        </div>

        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Доступный лимит</p>
          <h2 className="text-4xl font-bold tabular-nums">{balance.toLocaleString('ru-RU')} ₽</h2>
          <p className="text-xs text-zinc-400 mt-1">в этом месяце</p>
        </div>
        
        <div className="flex justify-between items-end">
          <p className="text-zinc-500 text-[10px] tracking-widest">•••• 4022</p>
          <div className="flex gap-1">
            <div className="w-6 h-4 bg-white/20 rounded-sm" />
            <div className="w-6 h-4 bg-white/10 rounded-sm" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SmartCard;