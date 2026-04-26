export const translations = {
  ru: {
    // Navigation
    nav: {
      home: 'Главная',
      analytics: 'Аналитика',
      profile: 'Профиль',
    },
    // Header
    header: {
      search: 'Поиск',
      profile: 'Профиль',
    },
    // Smart Card
    card: {
      availableLimit: 'Доступный лимит',
      thisMonth: 'в этом месяце',
      cvcWarning: 'Это CVC-код. Никому его не сообщайте.',
      validUntil: 'До',
      anyName: 'При оплате можно указать любое имя',
      copyCard: 'Копировать номер карты',
      copyCVC: 'Копировать CVC',
      showCVC: 'Показать CVC',
      hideCVC: 'Скрыть CVC',
    },
    // Subscriptions
    subscriptions: {
      title: 'Ваши подписки',
      active: 'активных',
      add: 'Добавить подписку',
      noSubscriptions: 'У вас пока нет подписок',
      addFirst: 'Добавить первую подписку',
      isActive: 'Активна',
      paymentsBlocked: 'Списания запрещены',
      perMonth: 'мес',
      toCharge: 'К списанию 15 мая:',
    },
    // Widgets
    widgets: {
      title: 'Быстрые действия',
      history: 'История',
      historyDesc: 'Траты за 30 дней',
      savings: 'Экономия',
      savingsDesc: 'Анализ тарифов',
      charges: 'Списания',
      chargesDesc: 'Ближайшие',
      in3Days: 'через 3 дня',
    },
    // Shortfall
    shortfall: {
      notEnough: 'Не хватает средств для списания',
      payLater: 'Оплатить позже',
    },
    // Subscription Modal
    modal: {
      editSubscription: 'Редактировать подписку',
      newSubscription: 'Новая подписка',
      name: 'Название',
      namePlaceholder: 'Например: Netflix',
      nameError: 'Введите название подписки',
      price: 'Цена (₽/мес)',
      priceError: 'Введите корректную цену',
      icon: 'Иконка',
      save: 'Сохранить',
      add: 'Добавить',
      delete: 'Удалить подписку',
    },
    // BNPL Modal
    bnpl: {
      title: 'Оформление отсрочки',
      coverageAmount: 'Сумма покрытия',
      returnPeriod: 'Срок возврата',
      scheduledPayment: 'До планового пополнения',
      on15th: '(15 числа)',
      customDate: 'Выбрать удобную дату',
      details: 'Детализация',
      amount: 'Сумма',
      period: 'Срок',
      commission: 'Комиссия (4% за 30 дней)',
      totalCharge: 'Итого к списанию',
      selectDate: 'Выберите дату возврата',
      confirm: 'Оформить отсрочку',
      notice: 'Средства будут зачислены на баланс. Списание произойдет автоматически в выбранную дату.',
      day: 'день',
      days2: 'дня',
      days: 'дней',
    },
    // Profile
    profile: {
      title: 'Профиль',
      language: 'Язык интерфейса',
      russian: 'Русский',
      english: 'English',
      settings: 'Настройки',
      account: 'Аккаунт',
      notifications: 'Уведомления',
      security: 'Безопасность',
      about: 'О приложении',
    },
    // Auto-detect
    autoDetect: {
      detected: 'Обнаружена транзакция: Сервисы Яндекса',
    },
    // Add Subscription Flow
    addFlow: {
      // Method selection
      methodTitle: 'Как добавить подписку?',
      autoSync: 'Синхронизировать данные банка',
      autoSyncDesc: 'Автоматический поиск подписок',
      manualCard: 'Выпустить карту под сервис',
      manualCardDesc: 'Создать виртуальную карту',
      
      // Bank sync
      connecting: 'Установка защищенного соединения с',
      analyzing: 'Анализ транзакций за последние 12 месяцев...',
      processing: 'Обработка данных...',
      secureConnection: 'Установка защищенного соединения...',
      scanningTransactions: 'Сканирование транзакций...',
      recognizingSubscriptions: 'Распознавание подписок...',
      syncWithSberBusiness: 'Синхронизация с API СберБизнес...',
      
      // Results
      foundSubscriptions: 'Найдено подписок',
      weFoundSubscriptions: 'Мы нашли следующие подписки!',
      foundCount: 'Найдено',
      addAll: 'Добавить всё',
      addSelected: 'Добавить выбранные',
      selectBank: 'Выберите банк',
      
      // Manual flow
      searchService: 'Поиск сервиса',
      popularServices: 'Популярные сервисы',
      cardIssued: 'Карта выпущена',
      monthlyLimit: 'Месячный лимит',
      addToSubscriptions: 'Добавить в подписки',
      
      // Common
      back: 'Назад',
      close: 'Закрыть',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      analytics: 'Analytics',
      profile: 'Profile',
    },
    // Header
    header: {
      search: 'Search',
      profile: 'Profile',
    },
    // Smart Card
    card: {
      availableLimit: 'Available Limit',
      thisMonth: 'this month',
      cvcWarning: 'This is CVC code. Do not share it with anyone.',
      validUntil: 'Valid until',
      anyName: 'You can use any name for payment',
      copyCard: 'Copy card number',
      copyCVC: 'Copy CVC',
      showCVC: 'Show CVC',
      hideCVC: 'Hide CVC',
    },
    // Subscriptions
    subscriptions: {
      title: 'Your Subscriptions',
      active: 'active',
      add: 'Add subscription',
      noSubscriptions: 'You have no subscriptions yet',
      addFirst: 'Add first subscription',
      isActive: 'Active',
      paymentsBlocked: 'Payments blocked',
      perMonth: '₽ / month',
      toCharge: 'To be charged on May 15:',
    },
    // Widgets
    widgets: {
      title: 'Quick Actions',
      history: 'History',
      historyDesc: 'Spending for 30 days',
      savings: 'Savings',
      savingsDesc: 'Tariff analysis',
      charges: 'Charges',
      chargesDesc: 'Upcoming',
      in3Days: 'in 3 days',
    },
    // Shortfall
    shortfall: {
      notEnough: 'Insufficient funds for charge',
      payLater: 'Pay later',
    },
    // Subscription Modal
    modal: {
      editSubscription: 'Edit Subscription',
      newSubscription: 'New Subscription',
      name: 'Name',
      namePlaceholder: 'For example: Netflix',
      nameError: 'Enter subscription name',
      price: 'Price (₽/month)',
      priceError: 'Enter valid price',
      icon: 'Icon',
      save: 'Save',
      add: 'Add',
      delete: 'Delete subscription',
    },
    // BNPL Modal
    bnpl: {
      title: 'Deferred Payment',
      coverageAmount: 'Coverage Amount',
      returnPeriod: 'Return Period',
      scheduledPayment: 'Until scheduled replenishment',
      on15th: '(15th day)',
      customDate: 'Choose convenient date',
      details: 'Details',
      amount: 'Amount',
      period: 'Period',
      commission: 'Commission (4% per 30 days)',
      totalCharge: 'Total to charge',
      selectDate: 'Select return date',
      confirm: 'Confirm deferral',
      notice: 'Funds will be credited to balance. Charge will occur automatically on selected date.',
      day: 'day',
      days2: 'days',
      days: 'days',
    },
    // Profile
    profile: {
      title: 'Profile',
      language: 'Interface Language',
      russian: 'Русский',
      english: 'English',
      settings: 'Settings',
      account: 'Account',
      notifications: 'Notifications',
      security: 'Security',
      about: 'About',
    },
    // Auto-detect
    autoDetect: {
      detected: 'Transaction detected: Yandex Services',
    },
    // Add Subscription Flow
    addFlow: {
      // Method selection
      methodTitle: 'How to add subscription?',
      autoSync: 'Sync bank data',
      autoSyncDesc: 'Automatic subscription search',
      manualCard: 'Issue card for service',
      manualCardDesc: 'Create virtual card',
      
      // Bank sync
      connecting: 'Establishing secure connection with',
      analyzing: 'Analyzing transactions for the last 12 months...',
      processing: 'Processing data...',
      secureConnection: 'Establishing secure connection...',
      scanningTransactions: 'Scanning transactions...',
      recognizingSubscriptions: 'Recognizing subscriptions...',
      syncWithSberBusiness: 'Syncing with SberBusiness API...',
      
      // Results
      foundSubscriptions: 'Found subscriptions',
      weFoundSubscriptions: 'We found the following subscriptions!',
      foundCount: 'Found',
      addAll: 'Add all',
      addSelected: 'Add selected',
      selectBank: 'Select bank',
      
      // Manual flow
      searchService: 'Search service',
      popularServices: 'Popular services',
      cardIssued: 'Card issued',
      monthlyLimit: 'Monthly limit',
      addToSubscriptions: 'Add to subscriptions',
      
      // Common
      back: 'Back',
      close: 'Close',
    },
  },
};
