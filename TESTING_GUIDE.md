# Testing Guide for Forum Discussion App

## Running Tests

### Prerequisites
Make sure all dependencies are installed:
```bash
npm install --legacy-peer-deps
```

### Unit/Integration Tests
Run all unit and integration tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test:ui
```

Run tests once (CI mode):
```bash
npm test:run
```

### E2E Tests with Cypress
Run E2E tests headlessly:
```bash
npm run e2e
```

Open Cypress interactive mode:
```bash
npm run e2e:open
```

## Test Coverage

### Reducer Tests (3 files, 10+ tests)
- `authUserReducer.test.js` - Tests for authentication state management
- `threadsReducer.test.js` - Tests for threads state management  
- `detailThreadReducer.test.js` - Tests for thread detail state management

### Thunk Tests (2 files, 10+ tests)
- `authUserThunk.test.js` - Tests for authentication async actions
- `threadsThunk.test.js` - Tests for threads async actions

### Component Tests (4 files, 10+ tests)
- `ThreadFilter.test.jsx` - Tests for thread filter component
- `Loading.test.jsx` - Tests for loading component
- `Navigation.test.jsx` - Tests for navigation component
- More component tests can be added as needed

### E2E Tests (1 file, 8+ scenarios)
- `login.cy.js` - Complete login flow testing including:
  - Login page rendering
  - Form validation
  - Registration flow
  - Login with valid credentials
  - Login persistence after reload
  - Logout functionality
  - Navigation to create thread page

## Test Scenarios

### Reducer Test Scenarios
1. **authUser Reducer:**
   - Returns initial state correctly
   - Handles setAuthUser action
   - Handles unsetAuthUser action
   - Updates authUser with new user data
   - Handles user with complete profile data
   - Handles user with minimal data

2. **threads Reducer:**
   - Returns initial state correctly
   - Handles receiveThreads action
   - Handles addThread action
   - Handles upVoteThread action
   - Handles downVoteThread action
   - Handles neutralizeThreadVote action
   - Handles multiple votes on same thread
   - Handles switching vote from up to down

3. **detailThread Reducer:**
   - Returns initial state correctly
   - Handles receiveDetailThread action
   - Handles clearDetailThread action
   - Handles addComment action
   - Handles upVoteComment action
   - Handles downVoteComment action
   - Handles neutralizeCommentVote action

### Thunk Test Scenarios
1. **authUser Thunk:**
   - Sets authUser when login is successful
   - Handles login failure
   - Throws error when user not found in users list
   - Handles empty users list response
   - Unsets authUser and removes token
   - Handles unsetting when no user is logged in
   - Restores authUser when token exists and API call succeeds
   - Unsets authUser when token does not exist
   - Unsets authUser and removes token when API call fails
   - Handles network errors during restore

2. **threads Thunk:**
   - Receives threads when API call is successful
   - Handles API failure gracefully
   - Adds thread when API call is successful
   - Handles API failure when adding thread
   - Upvotes thread when user is authenticated
   - Does not upvote when user is not authenticated
   - Downvotes thread when user is authenticated
   - Handles API failure and neutralizes vote

### Component Test Scenarios
1. **ThreadFilter Component:**
   - Renders filter label and select element
   - Renders "All Categories" as default option
   - Renders all category options
   - Calls setFilter when category is selected
   - Displays selected category as current value
   - Handles empty categories array
   - Handles single category
   - Maintains accessibility with proper label association

2. **Loading Component:**
   - Renders loading container
   - Renders loading spinner
   - Renders loading text
   - Has correct CSS classes
   - Is accessible with proper structure
   - Has spinner with animation class
   - Renders with proper semantic structure

3. **Navigation Component:**
   - Renders navigation with brand name
   - Renders login and register links when user is not authenticated
   - Renders user info and create thread link when user is authenticated
   - Renders navigation links
   - Has proper navigation styling
   - Renders brand link pointing to home

### E2E Test Scenarios
1. **Login Flow:**
   - Displays login page when accessing /login route
   - Shows validation error when submitting empty form
   - Navigates to register page when clicking register link
   - Allows user to register new account
   - Displays error message for invalid credentials
   - Successfully logs in with valid credentials
   - Persists login after page reload
   - Logs out successfully
   - Navigates to create thread page when logged in

## Troubleshooting

### Common Issues
1. **"Cannot find package 'jsdom'" error:**
   ```bash
   npm install --save-dev jsdom --legacy-peer-deps
   ```

2. **"Cannot find package '@testing-library/dom'" error:**
   ```bash
   npm install --save-dev @testing-library/dom --legacy-peer-deps
   ```

3. **Cypress timeout issues:**
   - Make sure the dev server is running on port 5173
   - Increase timeout in cypress.config.js if needed

4. **Vitest worker timeout:**
   - Adjust testTimeout in vitest.config.js
   - Simplify complex tests that might be hanging
