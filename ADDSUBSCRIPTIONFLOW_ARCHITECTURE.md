# AddSubscriptionFlow Component - Architectural Plan

## 📋 Overview
A multi-step modal component that provides two distinct paths for adding subscriptions:
- **Path A**: Bank synchronization with automatic subscription detection
- **Path B**: Manual V-Card issuance for specific services

## 🏗️ Architecture

### 1. State Management Strategy

#### State Machine Design
```javascript
const FLOW_STEPS = {
  METHOD_SELECTION: 'method_selection',    // Step 1: Choose path A or B
  BANK_SELECTION: 'bank_selection',        // Step 2A: Select bank
  BANK_SYNC: 'bank_sync',                  // Step 2A: Syncing animation
  BANK_RESULTS: 'bank_results',            // Step 2A: Show found subscriptions
  SERVICE_SEARCH: 'service_search',        // Step 2B: Search for service
  VCARD_ISSUE: 'vcard_issue',              // Step 2B: Show issued card
  SUCCESS: 'success'                       // Final: Success state
};
```

#### State Variables
```javascript
const [currentStep, setCurrentStep] = useState(FLOW_STEPS.METHOD_SELECTION);
const [selectedPath, setSelectedPath] = useState(null); // 'auto' | 'manual'
const [selectedBank, setSelectedBank] = useState(null);
const [syncProgress, setSyncProgress] = useState(0);
const [foundSubscriptions, setFoundSubscriptions] = useState([]);
const [selectedService, setSelectedService] = useState(null);
const [issuedCard, setIssuedCard] = useState(null);
```

### 2. Language-Driven Bank Configuration

#### Configuration Structure
```javascript
// src/config/banks.js
export const BANK_CONFIGS = {
  cis: [
    {
      id: 'sberbank',
      name: { ru: 'Сбербанк', en: 'Sberbank' },
      gradient: 'linear-gradient(135deg, #21a038 0%, #1a7d2e 100%)',
      logo: '💚', // Will use SVG/image in production
      textColor: '#ffffff',
      region: 'cis'
    },
    {
      id: 'tinkoff',
      name: { ru: 'Т-Банк', en: 'T-Bank' },
      gradient: 'linear-gradient(135deg, #ffdd2d 0%, #ffc700 100%)',
      logo: '⚡',
      textColor: '#000000',
      region: 'cis'
    },
    {
      id: 'kaspi',
      name: { ru: 'Kaspi.kz', en: 'Kaspi.kz' },
      gradient: 'linear-gradient(135deg, #f14635 0%, #d63a2d 100%)',
      logo: '🏦',
      textColor: '#ffffff',
      region: 'cis'
    }
  ],
  global: [
    {
      id: 'revolut',
      name: { ru: 'Revolut', en: 'Revolut' },
      gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      logo: '🌐',
      textColor: '#000000',
      region: 'global'
    },
    {
      id: 'mercury',
      name: { ru: 'Mercury', en: 'Mercury' },
      gradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      logo: '💼',
      textColor: '#ffffff',
      region: 'global'
    }
  ]
};

// Helper function to get banks by language
export const getBanksByLanguage = (language) => {
  return language === 'ru' ? BANK_CONFIGS.cis : BANK_CONFIGS.global;
};
```

### 3. Component Structure

```
AddSubscriptionFlow/
├── index.jsx                    # Main modal container
├── steps/
│   ├── MethodSelection.jsx      # Step 1: Choose path
│   ├── BankSelection.jsx        # Step 2A: Bank grid
│   ├── BankSync.jsx             # Step 2A: Sync animation
│   ├── BankResults.jsx          # Step 2A: Found subscriptions
│   ├── ServiceSearch.jsx        # Step 2B: Service search
│   └── VCardIssue.jsx           # Step 2B: Virtual card display
├── components/
│   ├── BankCard.jsx             # Individual bank card
│   ├── SubscriptionCard.jsx     # Found subscription item
│   ├── VirtualCard.jsx          # Black Accord card
│   └── ProgressIndicator.jsx    # Sync progress bar
└── config/
    ├── banks.js                 # Bank configurations
    └── mockServices.js          # Mock SaaS services
```

### 4. Step-by-Step Flow Logic

#### Step 1: Method Selection
- Display two large cards side-by-side
- Card A: "Синхронизировать данные банка" / "Sync bank data"
- Card B: "Выпустить карту под сервис" / "Issue card for service"
- On selection: `setSelectedPath('auto' | 'manual')` and navigate to next step

#### Step 2A: Bank Selection (Auto Path)
- Fetch banks using `getBanksByLanguage(language)` from LanguageContext
- Render 2-column grid of bank cards
- Each card shows: gradient background, logo, bank name
- On click: `setSelectedBank(bank)` → navigate to BANK_SYNC

#### Step 2A: Bank Sync Animation
- Show 3-stage animation:
  1. "Установка защищенного соединения с [Bank]..." (0-33%)
  2. "Анализ транзакций за последние 12 месяцев..." (34-66%)
  3. "Обработка данных..." (67-100%)
- Use `setTimeout` to simulate progress
- Duration: ~3 seconds total
- On complete: Generate mock subscriptions → navigate to BANK_RESULTS

#### Step 2A: Bank Results
- Display list of found subscriptions (3-5 mock items)
- Each item: logo, name, price, checkbox (all checked by default)
- "Добавить всё" / "Add all" button
- On confirm: Add selected subscriptions to App state → close modal

#### Step 2B: Service Search (Manual Path)
- Search input with icon
- Grid of popular SaaS services (Netflix, Spotify, ChatGPT, etc.)
- On service selection: `setSelectedService(service)` → navigate to VCARD_ISSUE

#### Step 2B: V-Card Issue
- Display black Accord virtual card with:
  - Card number (generated)
  - Expiry date
  - CVC (hidden by default)
  - Limit specific to service
- "Добавить в подписки" / "Add to subscriptions" button
- On confirm: Add subscription + card to App state → close modal

### 5. Animation Strategy

Since framer-motion is not installed, we'll use CSS transitions and React state:

```javascript
// Transition wrapper component
const StepTransition = ({ children, step }) => {
  return (
    <div 
      key={step}
      className="animate-fadeIn"
      style={{
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      {children}
    </div>
  );
};

// CSS in index.css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 6. Integration with Existing Code

#### App.jsx Integration
```javascript
// Add new state
const [isAddFlowOpen, setIsAddFlowOpen] = useState(false);

// Modify handleAddClick
const handleAddClick = () => {
  setIsAddFlowOpen(true); // Open new flow instead of old modal
};

// Add new handler
const handleFlowComplete = (newSubscriptions) => {
  setSubscriptions(prev => [...prev, ...newSubscriptions]);
  setIsAddFlowOpen(false);
};

// Render component
<AddSubscriptionFlow
  isOpen={isAddFlowOpen}
  onClose={() => setIsAddFlowOpen(false)}
  onComplete={handleFlowComplete}
/>
```

#### Translation Keys to Add
```javascript
// src/i18n/translations.js
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
  
  // Results
  foundSubscriptions: 'Найдено подписок',
  addAll: 'Добавить всё',
  addSelected: 'Добавить выбранные',
  
  // Manual flow
  searchService: 'Поиск сервиса',
  popularServices: 'Популярные сервисы',
  cardIssued: 'Карта выпущена',
  monthlyLimit: 'Месячный лимит',
  addToSubscriptions: 'Добавить в подписки'
}
```

### 7. Mock Data Strategy

#### Mock Subscriptions Generator
```javascript
// config/mockServices.js
export const generateMockSubscriptions = (bankId) => {
  const mockData = {
    sberbank: [
      { name: 'Яндекс Плюс', price: 490, iconName: 'music' },
      { name: 'Кинопоиск HD', price: 399, iconName: 'film' },
      { name: 'VK Музыка', price: 299, iconName: 'headphones' }
    ],
    revolut: [
      { name: 'Netflix', price: 15, iconName: 'tv' },
      { name: 'Spotify', price: 10, iconName: 'music' },
      { name: 'ChatGPT Plus', price: 20, iconName: 'bot' }
    ],
    // ... other banks
  };
  
  return mockData[bankId] || [];
};
```

### 8. Responsive Design
- Modal: max-w-lg, full height on mobile
- Bank grid: 2 columns on mobile, 3 on tablet
- Touch-friendly tap targets (min 44px)
- Smooth scrolling for long lists

### 9. Accessibility
- Proper ARIA labels for all interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus management between steps
- Screen reader announcements for step changes

### 10. Error Handling
- Network timeout simulation (if sync takes too long)
- Empty results state ("Подписки не найдены")
- Validation for manual card issuance
- Graceful fallback if language context unavailable

## 🎯 Implementation Checklist

1. ✅ Create bank configuration file
2. ✅ Create mock services data
3. ✅ Build main AddSubscriptionFlow container
4. ✅ Implement MethodSelection step
5. ✅ Implement BankSelection step with language logic
6. ✅ Implement BankSync animation
7. ✅ Implement BankResults step
8. ✅ Implement ServiceSearch step
9. ✅ Implement VCardIssue step
10. ✅ Add translation keys
11. ✅ Integrate with App.jsx
12. ✅ Add CSS animations
13. ✅ Test language switching
14. ✅ Test both paths end-to-end

## 🔄 State Flow Diagram

```
[OPEN MODAL]
     ↓
[METHOD_SELECTION] → Choose Path
     ↓                    ↓
  Path A              Path B
     ↓                    ↓
[BANK_SELECTION]    [SERVICE_SEARCH]
     ↓                    ↓
[BANK_SYNC]         [VCARD_ISSUE]
     ↓                    ↓
[BANK_RESULTS]           ↓
     ↓                    ↓
     └──→ [SUCCESS] ←────┘
              ↓
        [CLOSE MODAL]
```

## 🎨 Visual Design Notes

- Use existing Accord design system (zinc-900, rounded-xl, etc.)
- Bank cards: Hover scale effect (scale-105)
- Progress bar: Smooth width transition
- Virtual card: 3D shadow effect for premium feel
- Success state: Checkmark animation

## 📦 Dependencies

No new dependencies required! Using:
- React hooks (useState, useEffect, useMemo)
- Lucide React icons (already installed)
- Tailwind CSS (already configured)
- LanguageContext (already implemented)

---

**Ready to implement?** This architecture ensures:
✅ Clean separation of concerns
✅ Language-driven bank display
✅ Smooth user experience
✅ Easy maintenance and testing
✅ Scalable for future features
