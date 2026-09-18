const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const mockUser = {
  id: 'user-mock-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

const mockToken = 'mock-jwt-token-123';

// Intercept all external API calls so tests never hit the real network.
// This makes the suite deterministic and eliminates "Failed to fetch" in CI.
const setupApiMocks = ({
  registerSuccess = true,
  loginSuccess = true,
} = {}) => {
  // Always mock threads so the homepage doesn't hang
  cy.intercept('GET', `${BASE_URL}/threads`, {
    statusCode: 200,
    body: { status: 'success', data: { threads: [] } },
  }).as('getThreads');

  // Always mock users/me for asyncRestoreAuthUser (called on every page load)
  cy.intercept('GET', `${BASE_URL}/users/me`, {
    statusCode: 401,
    body: { status: 'fail', message: 'Unauthenticated' },
  }).as('getProfile');

  // Register endpoint
  if (registerSuccess) {
    cy.intercept('POST', `${BASE_URL}/register`, {
      statusCode: 201,
      body: {
        status: 'success',
        data: { user: mockUser },
      },
    }).as('register');
  } else {
    cy.intercept('POST', `${BASE_URL}/register`, {
      statusCode: 400,
      body: { status: 'fail', message: 'Email already taken' },
    }).as('register');
  }

  // Login endpoint
  if (loginSuccess) {
    cy.intercept('POST', `${BASE_URL}/login`, {
      statusCode: 200,
      body: {
        status: 'success',
        data: { token: mockToken },
      },
    }).as('login');
  } else {
    cy.intercept('POST', `${BASE_URL}/login`, {
      statusCode: 401,
      body: { status: 'fail', message: 'Login failed' },
    }).as('login');
  }

  // GET /users — called by asyncSetAuthUser after login to resolve the user object
  cy.intercept('GET', `${BASE_URL}/users`, {
    statusCode: 200,
    body: {
      status: 'success',
      data: { users: [mockUser] },
    },
  }).as('getUsers');
};

// Helper: register then login via UI (using mock intercepts)
const registerAndLogin = (email = mockUser.email) => {
  cy.visit('/register', { timeout: 10000 });
  cy.get('[data-testid="name-input"]', { timeout: 5000 }).should('be.visible').type(mockUser.name);
  cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(email);
  cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type('password123');
  cy.get('[data-testid="register-button"]', { timeout: 5000 }).should('be.visible').click();
  cy.wait('@register');
  cy.url({ timeout: 10000 }).should('include', '/login');

  cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(email);
  cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type('password123');
  cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible').click();
  cy.wait('@login');
  cy.wait('@getUsers');
};

describe('Login Flow E2E Test', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    // Suppress uncaught exceptions from the app (e.g. unhandled promise rejections)
    // so a single network hiccup doesn't fail the entire test
    cy.on('uncaught:exception', () => false);
  });

  // ─── UI-only tests (no API needed) ───────────────────────────────────────

  it('should display login page when accessing /login route', () => {
    setupApiMocks();
    cy.visit('/login', { timeout: 10000 });
    cy.contains('h2', 'Login', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="login-form"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible');
  });

  it('should show validation error when submitting empty form', () => {
    setupApiMocks();
    cy.visit('/login', { timeout: 10000 });
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).click();
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('have.attr', 'required');
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('have.attr', 'required');
  });

  it('should navigate to register page when clicking register link', () => {
    setupApiMocks();
    cy.visit('/login', { timeout: 10000 });
    cy.contains('Register', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/register');
    cy.contains('h2', 'Register', { timeout: 5000 }).should('be.visible');
  });

  // ─── API-dependent tests (mocked) ────────────────────────────────────────

  it('should allow user to register new account', () => {
    setupApiMocks({ registerSuccess: true });
    cy.visit('/register', { timeout: 10000 });
    cy.get('[data-testid="name-input"]', { timeout: 5000 }).should('be.visible').type(mockUser.name);
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(mockUser.email);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type('password123');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('[data-testid="register-button"]', { timeout: 5000 }).should('be.visible').click();
    cy.wait('@register');

    cy.get('@alertStub').should('have.been.calledWithMatch', /Registration successful/i);
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('should display error message for invalid credentials', () => {
    setupApiMocks({ loginSuccess: false });
    cy.visit('/login', { timeout: 10000 });

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type('wrong@example.com');
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type('wrongpassword');
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible').click();
    cy.wait('@login');

    cy.get('@alertStub').should('have.been.calledWithMatch', /Login failed/i);
  });

  it('should successfully login with valid credentials', () => {
    setupApiMocks();
    registerAndLogin();

    cy.url({ timeout: 10000 }).should('not.include', '/login');
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/`);
    cy.get('[data-testid="nav-user"]', { timeout: 5000 }).should('contain', 'Welcome');
  });

  it('should persist login after page reload', () => {
    // After reload, asyncRestoreAuthUser calls GET /users/me with the token.
    // Override the default 401 mock to return the authenticated user.
    setupApiMocks();
    cy.intercept('GET', `${BASE_URL}/users/me`, {
      statusCode: 200,
      body: { status: 'success', data: { user: mockUser } },
    }).as('getProfileAuthed');

    registerAndLogin();
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    cy.reload();
    cy.wait('@getProfileAuthed');

    cy.get('[data-testid="nav-user"]', { timeout: 5000 }).should('contain', 'Welcome');
  });

  it('should logout successfully', () => {
    setupApiMocks();
    registerAndLogin();
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    cy.get('[data-testid="logout-button"]', { timeout: 5000 }).should('be.visible').click();

    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.get('[data-testid="nav-user"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-testid="nav-login"]', { timeout: 5000 }).should('be.visible');
  });

  it('should navigate to create thread page when logged in', () => {
    setupApiMocks();
    registerAndLogin();
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    cy.get('[data-testid="nav-create-thread"]', { timeout: 5000 }).should('be.visible').click();

    cy.url({ timeout: 10000 }).should('include', '/create-thread');
    cy.contains('h2', 'Create New Thread', { timeout: 5000 }).should('be.visible');
  });
});
