import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LOGO_LIBRARY } from '../../constants/logos';

const BankSync = ({ bank, onComplete }) => {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  // Sberbank-specific stages for СНГ region
  const isSberbank = bank.id === 'sberbank';
  
  const stages = isSberbank ? [
    { text: t('addFlow.secureConnection'), duration: 1000 },
    { text: t('addFlow.scanningTransactions'), duration: 1200 },
    { text: t('addFlow.recognizingSubscriptions'), duration: 800 }
  ] : [
    { text: `${t('addFlow.connecting')} ${bank.name[language]}...`, duration: 1000 },
    { text: t('addFlow.analyzing'), duration: 1200 },
    { text: t('addFlow.processing'), duration: 800 }
  ];

  useEffect(() => {
    let currentProgress = 0;
    let currentStage = 0;
    const totalDuration = isSberbank ? 3000 : 3000;
    const interval = 30;
    const increment = (100 / totalDuration) * interval;

    const timer = setInterval(() => {
      currentProgress += increment;
      
      if (currentProgress >= 33 && currentStage === 0) {
        setStage(1);
        currentStage = 1;
      } else if (currentProgress >= 66 && currentStage === 1) {
        setStage(2);
        currentStage = 2;
      }

      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 500);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, bank, language, isSberbank]);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
      {/* Real bank logo with soft container and animation */}
      <div className="mb-8 w-28 h-28 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center p-4 animate-pulse">
        <img
          src={LOGO_LIBRARY[bank.id]}
          alt={bank.name[language]}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/96?text=Logo';
          }}
        />
      </div>

      {/* Title for Sberbank */}
      {isSberbank && (
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {t('addFlow.syncWithSberBusiness')}
        </h3>
      )}

      {/* Modern progress bar */}
      <div className="w-full max-w-sm mb-6">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 ease-out rounded-full"
            style={{
              width: `${progress}%`,
              background: bank.gradient
            }}
          />
        </div>
      </div>

      {/* Status text with animation */}
      <p className="text-center text-gray-600 text-sm animate-pulse mb-2">
        {stages[stage].text}
      </p>

      {/* Progress percentage */}
      <div className="mt-2 text-2xl font-bold text-gray-900">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default BankSync;
