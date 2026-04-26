import React, { useState, useMemo, useEffect } from 'react';
import SmartCard from './components/SmartCard';
import SubscriptionsPanel from './components/SubscriptionsPanel';
import WidgetGrid from './components/WidgetGrid';
import Header from './components/Header';
import SubscriptionModal from './components/SubscriptionModal';
import BNPLModal from './components/BNPLModal';
import ProfileTab from './components/ProfileTab';
import AddSubscriptionFlow from './components/AddSubscriptionFlow';
import TopUpModal from './components/TopUpModal';
import { Home, PieChart, User } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

const INITIAL_SUBS = [];


const STORAGE_KEY = 'accord_subscriptions';
const STORAGE_KEY_BALANCE = 'accord_balance';

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function App() {
  const { t, formatCurrency } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState(() => loadFromStorage(STORAGE_KEY_BALANCE, 0));
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState(() => loadFromStorage(STORAGE_KEY, INITIAL_SUBS));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [isBNPLModalOpen, setIsBNPLModalOpen] = useState(false);
  const [isAddFlowOpen, setIsAddFlowOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState(null); // День месяца для списания (null = не выбрана)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BALANCE, JSON.stringify(balance));
  }, [balance]);

  const NAV_ITEMS = useMemo(() => [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'analytics', icon: PieChart, label: t('nav.analytics') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ], [t]);

  // Shift+S триггер для демонстрации автодетекта
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.shiftKey && e.key === 'S') {
        // Проверяем, не добавлена ли уже эта подписка
        const yandexExists = subscriptions.some(sub => sub.id === 'yandex_plus');
        if (!yandexExists) {
          alert(t('autoDetect.detected'));
          const newSubscription = {
            id: 'yandex_plus',
            name: 'Яндекс Плюс',
            price: 490,
            active: true,
            iconName: 'music',
          };
          setSubscriptions(prev => [...prev, newSubscription]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [subscriptions, t]);

  const totalCommitments = useMemo(() => {
    return subscriptions
      .filter(sub => sub.active)
      .reduce((sum, sub) => sum + sub.price, 0);
  }, [subscriptions]);

  const shortfall = useMemo(() => {
    return Math.max(0, totalCommitments - balance);
  }, [totalCommitments, balance]);

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

  const handleAddClick = () => {
    setIsAddFlowOpen(true);
  };

  const handleAddClickOld = () => {
    setEditingSub(null);
    setModalOpen(true);
  };

  const handleEditClick = (sub) => {
    setEditingSub(sub);
    setModalOpen(true);
  };

  const handleSaveSubscription = (subData) => {
    if (editingSub) {
      setSubscriptions(prev =>
        prev.map(sub => sub.id === editingSub.id ? subData : sub)
      );
    } else {
      setSubscriptions(prev => [...prev, subData]);
    }
  };

  const handleDeleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const handlePayLater = () => {
    setIsBNPLModalOpen(true);
  };

  const handleBNPLConfirm = () => {
    setBalance(prev => prev + shortfall);
  };

  const handleFlowComplete = (newSubscriptions) => {
    setSubscriptions(prev => [...prev, ...newSubscriptions]);
    setIsAddFlowOpen(false);
  };

  const handleTopUp = () => {
    setIsTopUpModalOpen(true);
  };

  const handleTopUpComplete = (amount) => {
    setBalance(prev => prev + amount);
    setIsTopUpModalOpen(false);
  };

  const handleAutoPaymentDateSet = (day) => {
    setPaymentDate(day);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900 antialiased">
      <div className="max-w-md mx-auto">
        <Header />
        
        {activeTab === 'home' && (
          <>
            <SmartCard balance={balance} />

            {/* Top Up Button - compact and styled to match card */}
            <div className="px-4 pb-4 flex justify-center">
              <button
                onClick={handleTopUp}
                className="px-8 py-2.5 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-xl font-medium hover:from-zinc-800 hover:to-zinc-700 transition-all shadow-md hover:shadow-lg text-sm"
              >
                Пополнить
              </button>
            </div>

            {/* Payment Date Selector - clickable */}
            <div className="px-4 pb-4">
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 border border-gray-200 rounded-2xl transition-all hover:shadow-md"
              >
                {paymentDate === null ? (
                  <div className="text-sm text-gray-600 text-center">
                    Выберите дату оплаты
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      К списанию {paymentDate} {(() => {
                        const today = new Date();
                        const currentDay = today.getDate();
                        const targetMonth = paymentDate < currentDay ? today.getMonth() + 1 : today.getMonth();
                        return new Date(today.getFullYear(), targetMonth).toLocaleString('ru', { month: 'long' });
                      })()}:
                    </span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totalCommitments)}</span>
                  </div>
                )}
              </button>
              
              {/* Dynamic Date Picker Dropdown */}
              {isDatePickerOpen && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Выберите день списания</p>
                  {(() => {
                    const today = new Date();
                    const currentDay = today.getDate();
                    const currentMonth = today.getMonth();
                    const currentYear = today.getFullYear();
                    
                    // Дни текущего месяца (от сегодня до конца месяца)
                    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                    const currentMonthDays = [];
                    for (let day = currentDay; day <= daysInCurrentMonth; day++) {
                      currentMonthDays.push({
                        day,
                        month: currentMonth,
                        monthName: new Date(currentYear, currentMonth).toLocaleString('ru', { month: 'short' })
                      });
                    }
                    
                    // Дни следующего месяца (с 1 до текущего дня - 1)
                    const nextMonthDays = [];
                    for (let day = 1; day < currentDay; day++) {
                      nextMonthDays.push({
                        day,
                        month: currentMonth + 1,
                        monthName: new Date(currentYear, currentMonth + 1).toLocaleString('ru', { month: 'short' })
                      });
                    }
                    
                    const allDays = [...currentMonthDays, ...nextMonthDays];
                    
                    return (
                      <div className="grid grid-cols-7 gap-2 max-h-64 overflow-y-auto">
                        {allDays.map(({ day, month, monthName }) => (
                          <button
                            key={`${month}-${day}`}
                            onClick={() => {
                              setPaymentDate(day);
                              setIsDatePickerOpen(false);
                            }}
                            className={`p-2 rounded-lg text-xs font-medium transition-all ${
                              paymentDate === day
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                            title={`${day} ${monthName}`}
                          >
                            <div>{day}</div>
                            <div className="text-[10px] opacity-60">{monthName}</div>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {shortfall > 0 && (
              <div className="mx-4 mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-600">
                    {t('shortfall.notEnough')}
                  </p>
                  <button
                    onClick={handlePayLater}
                    className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    {t('shortfall.payLater')} {formatCurrency(shortfall)}
                  </button>
                </div>
              </div>
            )}

            <SubscriptionsPanel
              subscriptions={subscriptions}
              onToggle={toggleSubscription}
              onEdit={handleEditClick}
              onAdd={handleAddClick}
            />
            {/* WidgetGrid скрыт */}
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="px-4 py-8 text-center">
            <PieChart className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">{t('nav.analytics')}</p>
          </div>
        )}

        {activeTab === 'profile' && <ProfileTab />}
      </div>

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

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSubscription}
        onDelete={handleDeleteSubscription}
        subscription={editingSub}
      />

      <BNPLModal
        isOpen={isBNPLModalOpen}
        onClose={() => setIsBNPLModalOpen(false)}
        shortfall={shortfall}
        onConfirm={handleBNPLConfirm}
        paymentDate={paymentDate}
      />

      <AddSubscriptionFlow
        isOpen={isAddFlowOpen}
        onClose={() => setIsAddFlowOpen(false)}
        onComplete={handleFlowComplete}
      />

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onTopUpComplete={handleTopUpComplete}
        recommendedAmount={totalCommitments}
        onAutoPaymentDateSet={handleAutoPaymentDateSet}
      />
    </div>
  );
}

export default App;
