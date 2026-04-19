import React, { useState, useEffect } from 'react';
import { X, Cloud, Building2, Box, PenTool, LayoutTemplate, FileText, CreditCard, Utensils, ShoppingBag, Car, Home, Smartphone, Gamepad2, Music, Film, Briefcase, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ICONS = [
  { id: 'default', icon: CreditCard },
  { id: 'cloud', icon: Cloud },
  { id: 'building', icon: Building2 },
  { id: 'box', icon: Box },
  { id: 'pen', icon: PenTool },
  { id: 'layout', icon: LayoutTemplate },
  { id: 'file', icon: FileText },
  { id: 'utensils', icon: Utensils },
  { id: 'shopping', icon: ShoppingBag },
  { id: 'car', icon: Car },
  { id: 'home', icon: Home },
  { id: 'smartphone', icon: Smartphone },
  { id: 'gamepad', icon: Gamepad2 },
  { id: 'music', icon: Music },
  { id: 'film', icon: Film },
  { id: 'briefcase', icon: Briefcase },
  { id: 'heart', icon: Heart },
];

const SubscriptionModal = ({ isOpen, onClose, onSave, onDelete, subscription }) => {
  const { t, getCurrency, language, convertToRub, convertFromRub } = useLanguage();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('default');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      // Convert stored RUB price to display currency
      const displayPrice = convertFromRub(subscription.price);
      setPrice(displayPrice.toString());
      setSelectedIcon(subscription.iconName || 'default');
    } else {
      setName('');
      setPrice('');
      setSelectedIcon('default');
    }
    setErrors({});
  }, [subscription, isOpen, convertFromRub]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = t('modal.nameError');
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = t('modal.priceError');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Convert displayed price to RUB before saving
    const priceInRub = convertToRub(parseFloat(price));
    
    onSave({
      id: subscription?.id || `sub_${Date.now()}`,
      name: name.trim(),
      price: priceInRub,
      active: subscription?.active ?? true,
      iconName: selectedIcon,
    });
    onClose();
  };

  const handleDelete = () => {
    if (subscription && onDelete) {
      onDelete(subscription.id);
      onClose();
    }
  };

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
            {subscription ? t('modal.editSubscription') : t('modal.newSubscription')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('modal.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('modal.namePlaceholder')}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all ${
                errors.name ? 'border-red-400' : 'border-transparent'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('modal.price')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all ${
                  errors.price ? 'border-red-400' : 'border-transparent'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {language === 'en' ? '$' : '₽'}
              </span>
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('modal.icon')}
            </label>
            <div className="grid grid-cols-9 gap-2">
              {ICONS.map((iconData) => {
                const Icon = iconData.icon;
                const isSelected = selectedIcon === iconData.id;
                return (
                  <button
                    key={iconData.id}
                    type="button"
                    onClick={() => setSelectedIcon(iconData.id)}
                    className={`p-2.5 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors"
            >
              {subscription ? t('modal.save') : t('modal.add')}
            </button>
            {subscription && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full text-red-500 font-medium hover:text-red-600 transition-colors py-2"
              >
                {t('modal.delete')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionModal;
