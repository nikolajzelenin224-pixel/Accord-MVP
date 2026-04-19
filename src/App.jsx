import React, { useState, useMemo, useEffect } from 'react';
import SmartCard from './components/SmartCard';
import SubscriptionsPanel from './components/SubscriptionsPanel';
import WidgetGrid from './components/WidgetGrid';
import Header from './components/Header';
import SubscriptionModal from './components/SubscriptionModal';
import BNPLModal from './components/BNPLModal';
import ProfileTab from './components/ProfileTab';
import { Home, PieChart, User } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

const INITIAL_SUBS = [
  { id: 'moysklad', name: 'МойСклад', price: 2400, active: true, iconName: 'cloud' },
  { id: 'bitrix24', name: 'Битрикс24', price: 4500, active: true, iconName: 'building' },
  { id: '1c', name: '1С:Предприятие', price: 3800, active: false, iconName: 'box' },
  { id: 'adobe', name: 'Adobe Creative Cloud', price: 6200, active: true, iconName: 'pen' },
  { id: 'tilda', name: 'Tilda Publishing', price: 1200, active: true, iconName: 'layout' },
  { id: 'sbis', name: 'СБИС', price: 4900, active: false, iconName: 'file' },
];


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
  const [subscriptions, setSubscriptions] = useState(() => loadFromStorage(STORAGE_KEY, INITIAL_SUBS));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [isBNPLModalOpen, setIsBNPLModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900 antialiased">
      <div className="max-w-md mx-auto">
        <Header />
        
        {activeTab === 'home' && (
          <>
            <SmartCard balance={balance} />

            <div className="px-6 py-2 mb-3">
              <p className="text-sm text-gray-500">
                {t('subscriptions.toCharge')} <span className="font-medium text-gray-900">{formatCurrency(totalCommitments)}</span>
              </p>
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
            <WidgetGrid />
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
      />
    </div>
  );
}

export default App;
