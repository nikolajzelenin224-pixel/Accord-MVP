import React, { useState, useMemo } from 'react';
import SmartCard from './components/SmartCard';
import SubscriptionsPanel from './components/SubscriptionsPanel';
import WidgetGrid from './components/WidgetGrid';
import Header from './components/Header';
import { Home, PieChart, User, Cloud, Building2, Box, PenTool, LayoutTemplate, FileText } from 'lucide-react';

// Начальные данные подписок
const INITIAL_SUBS = [
  { id: 'moysklad', name: 'МойСклад', price: 2400, active: true, icon: Cloud },
  { id: 'bitrix24', name: 'Битрикс24', price: 4500, active: true, icon: Building2 },
  { id: '1c', name: '1С:Предприятие', price: 3800, active: false, icon: Box },
  { id: 'adobe', name: 'Adobe Creative Cloud', price: 6200, active: true, icon: PenTool },
  { id: 'tilda', name: 'Tilda Publishing', price: 1200, active: true, icon: LayoutTemplate },
  { id: 'sbis', name: 'СБИС', price: 4900, active: false, icon: FileText },
];

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Главная' },
  { id: 'analytics', icon: PieChart, label: 'Аналитика' },
  { id: 'profile', icon: User, label: 'Профиль' },
];

function App() {
  // Состояния
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState(21000);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBS);

  // Вычисляемые значения
  const totalCommitments = useMemo(() => {
    return subscriptions
      .filter(sub => sub.active)
      .reduce((sum, sub) => sum + sub.price, 0);
  }, [subscriptions]);

  const shortfall = useMemo(() => {
    return Math.max(0, totalCommitments - balance);
  }, [totalCommitments, balance]);

  // Функция переключения статуса подписки
  const toggleSubscription = (id) => {
    setSubscriptions(prevSubs => {
      return prevSubs.map(sub => {
        if (sub.id === id) {
          return { ...sub, active: !sub.active };
        }
        return sub;
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900 antialiased">
      {/* Контент */}
      <div className="max-w-md mx-auto overflow-hidden">
        <Header />
        <SmartCard balance={balance} />
        
        {/* Блок с информацией о списании */}
        <div className="px-6 py-3 mb-2">
          <p className="text-sm text-gray-500">
            К списанию 15 мая: <span className="font-medium text-gray-900">{totalCommitments.toLocaleString('ru-RU')} ₽</span>
          </p>
        </div>

        {/* BNPL Alert при нехватке средств */}
        {shortfall > 0 && (
          <div className="mx-4 mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-600">
                Не хватает средств для списания
              </p>
              <button
                className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Оплатить позже {shortfall.toLocaleString('ru-RU')} ₽
              </button>
            </div>
          </div>
        )}

        <SubscriptionsPanel
          subscriptions={subscriptions}
          onToggle={toggleSubscription}
          totalCommitments={totalCommitments}
        />
        <WidgetGrid />
      </div>

      {/* Нижняя навигация */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 px-6 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                  isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={item.label}
              >
                <div className={`p-2 rounded-full transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/30'
                    : 'text-gray-500 hover:text-zinc-700'
                }`}>
                  <Icon size={22} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-zinc-900' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;