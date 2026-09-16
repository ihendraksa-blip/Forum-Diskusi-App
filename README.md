# Forum Discussion App

A modern forum discussion application built with React, Redux Toolkit, and the Dicoding Forum API. This is a submission project for the "Menjadi React Web Developer Expert" class at Dicoding Academy.

## Features

- **User Authentication:** Register, login, and logout functionality
- **Thread Management:** Create, view, and discuss threads
- **Voting System:** Upvote/downvote threads and comments
- **Category Filtering:** Filter threads by category
- **Leaderboard:** View top users by score
- **Real-time Updates:** Optimistic updates for voting
- **Responsive Design:** Mobile-friendly interface
- **Performance Optimized:** Lazy loading and code splitting

## Tech Stack

- **Frontend:** React 19 with Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **API:** Dicoding Forum API
- **Testing:** Vitest, React Testing Library, Cypress
- **Animations:** Framer Motion
- **Styling:** CSS with modern practices
- **Code Quality:** ESLint with Dicoding Style Guide

## Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── states/             # Redux state management
│   ├── authUser/       # Authentication state
│   ├── isPreload/      # Preloading state
│   ├── users/          # Users data
│   ├── threads/        # Threads state
│   ├── detailThread/   # Thread detail state
│   ├── leaderboards/   # Leaderboard state
│   └── shared/         # Shared actions
├── utils/              # Utility functions
│   └── api/           # API service
├── test/               # Test files
│   ├── __tests__/     # Unit and integration tests
│   └── setup.js      # Test configuration
└── hooks/              # Custom hooks
```

## Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing instructions and scenarios.

## CI/CD

See [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) for CI/CD setup and deployment instructions.

## Performance Optimizations

- **Lazy Loading:** Routes use React.lazy() for code splitting
- **Suspense Boundaries:** Loading states during component loading
- **Optimistic Updates:** Immediate UI feedback for voting
- **Efficient State Management:** Modular Redux structure

## License

This project is for educational purposes as part of Dicoding Academy curriculum.
