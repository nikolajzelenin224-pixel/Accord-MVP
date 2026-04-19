import React, { useState, useEffect } from 'react';
import { Wallet, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SmartCard = ({ balance }) => {
  const { t, formatCurrency } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCVC, setShowCVC] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedCVC, setCopiedCVC] = useState(false);
  const [isCardNumberRevealed, setIsCardNumberRevealed] = useState(false);

  const cardNumber = '5536 1234 5678 4022';
  const cardNumberMasked = '**** **** **** 4022';
  const expiryDate = '12/28';
  const cvc = '123';

  // Автоматическое скрытие номера карты через 5 секунд
  useEffect(() => {
    if (isCardNumberRevealed) {
      const timer = setTimeout(() => {
        setIsCardNumberRevealed(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isCardNumberRevealed]);

  const handleCopyCard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    setIsCardNumberRevealed(true);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleCopyCVC = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cvc);
    setCopiedCVC(true);
    setTimeout(() => setCopiedCVC(false), 2000);
  };

  const toggleCVC = (e) => {
    e.stopPropagation();
    setShowCVC(!showCVC);
  };

  return (
    <div className="px-4 pt-2 pb-8" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full h-auto min-h-[220px]"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Лицевая сторона */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
          onClick={() => setIsFlipped(true)}
        >
          <div className="h-full flex flex-col justify-between p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="flex justify-between items-start relative z-10">
              <span className="text-xl font-bold tracking-tight">Accord</span>
              <Wallet className="text-zinc-400" size={24} />
            </div>

            <div className="relative z-10">
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">{t('card.availableLimit')}</p>
              <h2 className="text-4xl font-bold tabular-nums">{formatCurrency(balance)}</h2>
              <p className="text-xs text-zinc-400 mt-1">{t('card.thisMonth')}</p>
            </div>
            
            <div className="flex justify-between items-end relative z-10">
              <p className="text-zinc-500 text-[10px] tracking-widest">•••• 4022</p>
              <div className="flex gap-1">
                <div className="w-6 h-4 bg-white/20 rounded-sm" />
                <div className="w-6 h-4 bg-white/10 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Обратная сторона */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900 text-white rounded-2xl shadow-2xl cursor-pointer"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            pointerEvents: isFlipped ? 'auto' : 'none',
            minHeight: '220px',
          }}
          onClick={() => setIsFlipped(false)}
        >
          <div className="h-full flex flex-col gap-4 p-5 relative">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mt-20 blur-3xl" />
            
            {/* Ряд 1: Плашка номера карты */}
            <div className="relative z-10 bg-zinc-800/80 rounded-xl p-3.5 flex justify-between items-center">
              <span className="text-base font-mono tracking-wider">
                {isCardNumberRevealed ? cardNumber : cardNumberMasked}
              </span>
              <button
                onClick={handleCopyCard}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer relative z-20"
                aria-label={t('card.copyCard')}
              >
                {copiedCard ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>

            {/* Ряд 2: CVC и текст в строку */}
            <div className="relative z-10 flex flex-row items-center gap-4">
              {/* Левая часть: Плашка CVC */}
              <div className="bg-zinc-800/80 rounded-xl p-3 flex items-center gap-3 w-fit">
                <span className="text-base font-mono tracking-wide">{showCVC ? cvc : '***'}</span>
                <button
                  onClick={toggleCVC}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer relative z-20"
                  aria-label={showCVC ? t('card.hideCVC') : t('card.showCVC')}
                >
                  {showCVC ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={handleCopyCVC}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer relative z-20"
                  aria-label={t('card.copyCVC')}
                >
                  {copiedCVC ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
              
              {/* Правая часть: Текст про CVC */}
              <div className="text-[11px] text-gray-500 leading-tight flex-1">
                {t('card.cvcWarning')}
              </div>
            </div>

            {/* Ряд 3: Срок действия (внизу) */}
            <div className="relative z-10 flex flex-col mt-auto pt-2">
              <p className="text-white text-sm font-medium">{t('card.validUntil')} {expiryDate}</p>
              <p className="text-[11px] text-gray-500 mt-1">{t('card.anyName')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCard;
