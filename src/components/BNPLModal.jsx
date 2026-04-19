import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BNPLModal = ({ isOpen, onClose, shortfall, onConfirm }) => {
  const { t, language, formatCurrency } = useLanguage();
  const [paymentOption, setPaymentOption] = useState('scheduled'); // 'scheduled' или 'custom'
  const [customDate, setCustomDate] = useState('');

  // Рассчитываем дату ближайшего 15-го числа следующего месяца
  const getNext15th = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let targetMonth = currentMonth;
    let targetYear = currentYear;

    // Если сегодня 15-е или позже, берем 15-е следующего месяца
    if (currentDay >= 15) {
      targetMonth += 1;
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }
    }

    return new Date(targetYear, targetMonth, 15);
  };

  const scheduledDate = useMemo(() => getNext15th(), []);

  // Минимальная дата для выбора (завтра)
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // Рассчитываем количество дней и комиссию
  const calculation = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let targetDate;
    if (paymentOption === 'scheduled') {
      targetDate = scheduledDate;
    } else {
      if (!customDate) return null;
      targetDate = new Date(customDate);
    }

    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 1) return null;

    const commission = Math.round(shortfall * 0.04 * (days / 30));
    const total = shortfall + commission;

    // Determine correct plural form for days
    let daysText;
    if (days === 1) {
      daysText = t('bnpl.day');
    } else if (days >= 2 && days <= 4) {
      daysText = t('bnpl.days2');
    } else {
      daysText = t('bnpl.days');
    }

    return { days, commission, total, daysText };
  }, [paymentOption, customDate, scheduledDate, shortfall, t]);

  // Форматирование даты для отображения
  const formatDate = (date) => {
    const locale = language === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
  };

  const handleConfirm = () => {
    if (!calculation) return;
    onConfirm();
    onClose();
  };

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setPaymentOption('scheduled');
      setCustomDate('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('bnpl.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Сумма покрытия */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-2">{t('bnpl.coverageAmount')}</p>
            <p className="text-4xl font-bold text-zinc-900">
              {formatCurrency(shortfall)}
            </p>
          </div>

          {/* Выбор сценария возврата */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('bnpl.returnPeriod')}
            </label>
            <div className="space-y-3">
              {/* Вариант А: До планового пополнения */}
              <div
                onClick={() => setPaymentOption('scheduled')}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentOption === 'scheduled'
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    paymentOption === 'scheduled'
                      ? 'border-zinc-900 bg-zinc-900'
                      : 'border-gray-300'
                  }`}>
                    {paymentOption === 'scheduled' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      {t('bnpl.scheduledPayment')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(scheduledDate)} {t('bnpl.on15th')}
                    </p>
                  </div>
                  <Calendar size={20} className="text-gray-400 mt-1" />
                </div>
              </div>

              {/* Вариант Б: Выбрать удобную дату */}
              <div
                onClick={() => setPaymentOption('custom')}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentOption === 'custom'
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    paymentOption === 'custom'
                      ? 'border-zinc-900 bg-zinc-900'
                      : 'border-gray-300'
                  }`}>
                    {paymentOption === 'custom' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      {t('bnpl.customDate')}
                    </p>
                    {paymentOption === 'custom' && (
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        min={minDate}
                        className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                  <Clock size={20} className="text-gray-400 mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Блок детализации */}
          {calculation && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-medium text-gray-900 mb-3">{t('bnpl.details')}</h3>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('bnpl.amount')}</span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(shortfall)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('bnpl.period')}</span>
                <span className="text-gray-900 font-medium">
                  {calculation.days} {calculation.daysText}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('bnpl.commission')}</span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(calculation.commission)}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">{t('bnpl.totalCharge')}</span>
                  <span className="font-bold text-zinc-900 text-lg">
                    {formatCurrency(calculation.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Предупреждение если дата не выбрана */}
          {paymentOption === 'custom' && !customDate && (
            <div className="text-center text-sm text-gray-500 py-2">
              {t('bnpl.selectDate')}
            </div>
          )}

          {/* Кнопка действия */}
          <button
            onClick={handleConfirm}
            disabled={!calculation}
            className={`w-full px-4 py-4 font-semibold rounded-xl transition-all ${
              calculation
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('bnpl.confirm')}
          </button>

          <p className="text-xs text-center text-gray-400 leading-relaxed">
            {t('bnpl.notice')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BNPLModal;
