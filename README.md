# Finance Flow - Frontend

Nowoczesny interfejs użytkownika dla aplikacji Personal Finance Tracker. Zbudowany w **React.js** z wykorzystaniem **Tailwind CSS** i **Recharts** do wizualizacji danych finansowych.


## **Dashboard Preview**

<img width="1895" height="898" alt="image" src="https://github.com/user-attachments/assets/3267fa8a-d292-4ea1-8932-ea3e50b5facb" />

## 📋 Spis Treści

- [O Projekcie](#o-projekcie)
- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie](#uruchomienie)
- [Struktura Projektu](#struktura-projektu)
- [Dostępne Skrypty](#dostępne-skrypty)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Licencja](#licencja)

***

## 🎯 O Projekcie

Frontend aplikacji Personal Finance Tracker to responsywna aplikacja webowa umożliwiająca użytkownikom zarządzanie finansami osobistymi. Aplikacja oferuje intuicyjny interfejs do śledzenia wydatków i przychodów, tworzenia budżetów oraz wizualizacji danych finansowych.

**Status projektu:** 🚧 W trakcie rozwoju

***

## ✨ Funkcjonalności

- 🔐 **Autentykacja użytkownika** - Rejestracja, logowanie, zarządzanie sesją (JWT)
- 💰 **Zarządzanie transakcjami** - Dodawanie, edycja, usuwanie przychodów i wydatków
- 📊 **Dashboard z wykresami** - Wizualizacja danych za pomocą Recharts (pie charts, line charts, bar charts)
- 💳 **Budżety miesięczne** - Tworzenie i monitorowanie budżetów z alertami
- 🎯 **Cele oszczędnościowe** - Śledzenie postępów w osiąganiu celów finansowych
- 📱 **Responsive design** - Pełne wsparcie dla urządzeń mobilnych i tabletów
- 🌓 **Dark mode** - Przełącznik między jasnym a ciemnym motywem
- 🔍 **Filtry i wyszukiwanie** - Zaawansowane filtrowanie transakcji
- 📈 **Analityka** - Szczegółowe raporty i trendy wydatków

***

## 🛠 Technologie

Projekt został zbudowany z wykorzystaniem następujących technologii:

- **React.js** 18+ - Biblioteka UI
- **Vite** - Build tool i dev server
- **React Router** v6 - Routing
- **Tailwind CSS** - Style i responsive design
- **Recharts** - Wykresy i wizualizacje
- **Axios** - HTTP client dla API calls
- **React Context API** - State management (autentykacja, theme)
- **Redux Toolkit** - State management (transakcje, budżety)
- **React Hook Form** - Zarządzanie formularzami
- **date-fns** - Manipulacja datami
- **React Icons** - Ikony

***

## 📦 Wymagania

Przed rozpoczęciem upewnij się, że masz zainstalowane:

- **Node.js** (wersja 16.x lub wyższa)
- **npm** (wersja 8.x lub wyższa) lub **yarn**
- **Git**

Opcjonalnie:
- **VS Code** z rozszerzeniami: ESLint, Prettier, Tailwind CSS IntelliSense

***

## 🚀 Instalacja

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/twoj-username/personal-finance-tracker-frontend.git
cd personal-finance-tracker-frontend
```

### 2. Zainstaluj zależności

```bash
npm install
# lub
yarn install
```

***

## ⚙️ Konfiguracja

### Zmienne środowiskowe

Utwórz plik `.env` w głównym katalogu projektu i dodaj następujące zmienne:

```env
# API URL (backend)
VITE_API_URL=http://localhost:8080/api/v1

# Environment
VITE_ENV=development

# Optional: Analytics, etc.
# VITE_ANALYTICS_ID=your-analytics-id
```

### Development mode

```bash
npm run dev
# lub
yarn dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:5173**

### Build produkcyjny

```bash
npm run build
# lub
yarn build
```

Zbudowane pliki znajdziesz w katalogu `dist/`.

### Preview buildu

```bash
npm run preview
# lub
yarn preview
```

***

## 📁 Struktura Projektu

```
frontend/
├── public/                 # Pliki statyczne
│   └── favicon.ico
├── src/
│   ├── assets/            # Obrazy, fonty, etc.
│   ├── components/        # Komponenty React
│   │   ├── common/        # Reużywalne komponenty (Button, Modal, Input)
│   │   ├── layout/        # Layout komponenty (Header, Sidebar, Footer)
│   │   ├── dashboard/     # Komponenty Dashboard
│   │   ├── transactions/  # Komponenty Transakcji
│   │   ├── budgets/       # Komponenty Budżetów
│   │   └── analytics/     # Komponenty Analityki
│   ├── pages/             # Strony aplikacji
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── Analytics.jsx
│   │   ├── SavingsGoals.jsx
│   │   ├── Settings.jsx
│   │   └── Auth/
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── hooks/             # Custom React hooks
│   ├── context/           # Context API (AuthContext, ThemeContext)
│   ├── store/             # Redux store i slices
│   ├── services/          # API services (axios instances)
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles (Tailwind config)
│   ├── App.jsx            # Główny komponent App
│   ├── main.jsx           # Entry point
│   └── routes.jsx         # Definicje routingu
├── .env.example           # Przykładowa konfiguracja env
├── .gitignore
├── package.json
├── tailwind.config.js     # Konfiguracja Tailwind CSS
├── vite.config.js         # Konfiguracja Vite
└── README.md
```

***

## 📜 Dostępne Skrypty

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchomienie dev servera |
| `npm run build` | Build produkcyjny |
| `npm run preview` | Preview buildu |
| `npm run lint` | Uruchomienie ESLint |
| `npm run format` | Formatowanie kodu (Prettier) |

***

## 🔗 Backend API

Ten frontend wymaga działającego backend API. Backend znajdziesz tutaj:
- **Repository:** [personal-finance-tracker-backend](https://github.com/twoj-username/personal-finance-tracker-backend)
- **Dokumentacja API:** [Swagger UI](http://localhost:8080/swagger-ui.html) (local)

***


## 📝 Konwencje Kodu

- Używaj **ESLint** i **Prettier** do formatowania
- Nazewnictwo komponentów: **PascalCase** (np. `TransactionList.jsx`)
- Nazewnictwo plików utility: **camelCase** (np. `formatCurrency.js`)
- CSS classes: **Tailwind utility classes**
- Commits: używaj **Conventional Commits** (np. `feat:`, `fix:`, `docs:`)


***

## 📄 Licencja

Projekt jest dostępny na licencji **MIT**. Zobacz plik [LICENSE](LICENSE) dla szczegółów.

***

## 👨‍💻 Autor

**Macijke**
- GitHub: [@Macijke](https://github.com/macijke)
- Email: macijke@gmail.com

---

## 🙏 Podziękowania

- [React Icons](https://react-icons.github.io/react-icons/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) za darmowy hosting
