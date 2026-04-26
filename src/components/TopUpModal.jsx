import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BANK_CONFIGS } from '../config/banks';
import { LOGO_LIBRARY } from '../constants/logos';

const STEPS = {
  BANK_SELECTION: 'bank_selection',
  AMOUNT_INPUT: 'amount_input',
  PROCESSING: 'processing',
  SUCCESS: 'success',
};

const TopUpModal = ({ isOpen, onClose, onTopUpComplete, recommendedAmount, onAutoPaymentDateSet }) => {
  const { t, formatCurrency, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(STEPS.BANK_SELECTION);
  const [selectedBank, setSelectedBank] = useState(null);
  const [amount, setAmount] = useState('');
  const [autoPaymentDate, setAutoPaymentDate] = useState('');
  const [progress, setProgress] = useState(0);

  const topUpBanks = BANK_CONFIGS.cis; // Банки для пополнения

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setCurrentStep(STEPS.BANK_SELECTION);
      setSelectedBank(null);
      setAmount('');
      setAutoPaymentDate('');
      setProgress(0);
    }
  }, [isOpen]);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setCurrentStep(STEPS.AMOUNT_INPUT);
  };

  const handleAmountSubmit = () => {
    if (amount && parseFloat(amount) > 0) {
      setCurrentStep(STEPS.PROCESSING);
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentStep(STEPS.SUCCESS);
        }, 500);
      }
    }, 30);
  };

  const handleSuccess = () => {
    onTopUpComplete(parseFloat(amount));
    
    // Если выбрана дата автопополнения, обновляем дату списания
    if (autoPaymentDate && onAutoPaymentDateSet) {
      const selectedDate = new Date(autoPaymentDate);
      const day = selectedDate.getDate();
      onAutoPaymentDateSet(day);
    }
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  useEffect(() => {
    if (currentStep === STEPS.SUCCESS) {
      const timer = setTimeout(handleSuccess, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={currentStep === STEPS.PROCESSING ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Close Button */}
        {currentStep !== STEPS.PROCESSING && currentStep !== STEPS.SUCCESS && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {currentStep === STEPS.BANK_SELECTION && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Выберите банк для пополнения
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {topUpBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank)}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-3xl p-8 aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border border-gray-200/50"
                  >
                    <div className="mb-4 w-20 h-20 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={LOGO_LIBRARY[bank.id]}
                        alt={bank.name[language]}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64?text=Logo';
                        }}
                      />
                    </div>
                    
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {bank.name[language]}
                    </div>
                    
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl"
                      style={{ background: bank.gradient }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === STEPS.AMOUNT_INPUT && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setCurrentStep(STEPS.BANK_SELECTION)}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  Сумма пополнения
                </h2>
              </div>

              {/* Selected Bank */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-2">
                  <img
                    src={LOGO_LIBRARY[selectedBank.id]}
                    alt={selectedBank.name[language]}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Пополнение с</div>
                  <div className="font-semibold text-gray-900">{selectedBank.name[language]}</div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Введите сумму
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₽</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-3">Быстрый выбор</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAmount('1000')}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-900 transition-colors"
                  >
                    1 000 ₽
                  </button>
                  <button
                    onClick={() => setAmount('5000')}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-900 transition-colors"
                  >
                    5 000 ₽
                  </button>
                  <button
                    onClick={() => setAmount('10000')}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-900 transition-colors"
                  >
                    10 000 ₽
                  </button>
                </div>
              </div>

              {/* Recommended Amount */}
              {recommendedAmount > 0 && (
                <button
                  onClick={() => setAmount(recommendedAmount.toString())}
                  className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl mb-6 hover:border-yellow-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={20} className="text-yellow-600" />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">Рекомендуемая сумма</div>
                        <div className="text-xs text-gray-600">Для покрытия активных подписок</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(recommendedAmount)}</div>
                  </div>
                </button>
              )}

              {/* Auto Payment Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Настроить автопополнение (опционально)
                </label>
                <input
                  type="date"
                  value={autoPaymentDate}
                  onChange={(e) => setAutoPaymentDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Средства будут автоматически пополняться в выбранную дату каждый месяц
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Пополнить {amount ? formatCurrency(parseFloat(amount)) : ''}
              </button>
            </div>
          )}

          {currentStep === STEPS.PROCESSING && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <div className="mb-8 w-28 h-28 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center p-4 animate-pulse">
                <img
                  src={LOGO_LIBRARY[selectedBank.id]}
                  alt={selectedBank.name[language]}
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Обработка платежа...
              </h3>

              <div className="w-full max-w-sm mb-6">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 ease-out rounded-full"
                    style={{ 
                      width: `${progress}%`,
                      background: selectedBank.gradient
                    }}
                  />
                </div>
              </div>

              <p className="text-center text-gray-600 text-sm animate-pulse mb-2">
                Подключение к {selectedBank.name[language]}...
              </p>

              <div className="mt-2 text-2xl font-bold text-gray-900">
                {Math.round(progress)}%
              </div>
            </div>
          )}

          {currentStep === STEPS.SUCCESS && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check size={40} className="text-green-600" strokeWidth={3} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Успешно!
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Средства зачислены на карту
              </p>

              <div className="text-4xl font-bold text-gray-900 mb-2">
                {formatCurrency(parseFloat(amount))}
              </div>

              {autoPaymentDate && (
                <div className="mt-4 p-4 bg-blue-50 rounded-2xl">
                  <p className="text-sm text-blue-900">
                    ✓ Автопополнение настроено на {new Date(autoPaymentDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;
