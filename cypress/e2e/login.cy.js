describe('Login Flow E2E Test', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should display login page when accessing /login route', () => {
    cy.visit('/login', { timeout: 10000 });
    cy.contains('h2', 'Login', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="login-form"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible');
  });

  it('should show validation error when submitting empty form', () => {
    cy.visit('/login', { timeout: 10000 });
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).click();

    // Browser should prevent form submission due to required attributes
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('have.attr', 'required');
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('have.attr', 'required');
  });

  it('should navigate to register page when clicking register link', () => {
    cy.visit('/login', { timeout: 10000 });
    cy.contains('Register', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/register');
    cy.contains('h2', 'Register', { timeout: 5000 }).should('be.visible');
  });

  it('should allow user to register new account', () => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.visit('/register', { timeout: 10000 });
    cy.wait(1000); // Wait for page to fully load
    cy.get('[data-testid="name-input"]', { timeout: 5000 }).should('be.visible').type(testUser.name);
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="register-button"]', { timeout: 5000 }).should('be.visible').click();

    // Should show success message and redirect to login
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Registration successful');
    });

    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('should display error message for invalid credentials', () => {
    cy.visit('/login', { timeout: 10000 });
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type('wrong@example.com');
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type('wrongpassword');
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('Login failed');
    });
  });

  it('should successfully login with valid credentials', () => {
    // Register a user first to ensure login credentials exist
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.visit('/register', { timeout: 10000 });
    cy.wait(1000);
    cy.get('[data-testid="name-input"]', { timeout: 5000 }).should('be.visible').type(testUser.name);
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="register-button"]', { timeout: 5000 }).should('be.visible').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('Registration successful');
    });

    cy.url({ timeout: 10000 }).should('include', '/login');

    // Now login with the registered user
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible').click();

    // After successful login, should redirect to home page
    cy.url({ timeout: 10000 }).should('not.include', '/login');
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/`);

    // Should show user's name in navigation
    cy.get('[data-testid="nav-user"]', { timeout: 5000 }).should('contain', 'Welcome');
  });

  it('should persist login after page reload', () => {
    // Register and login first
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.visit('/register', { timeout: 10000 });
    cy.wait(1000);
    cy.get('[data-testid="name-input"]', { timeout: 5000 }).should('be.visible').type(testUser.name);
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="register-button"]', { timeout: 5000 }).should('be.visible').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('Registration successful');
    });

    cy.url({ timeout: 10000 }).should('include', '/login');

    // Login
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible').click();

    // Wait for login to complete
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    // Reload the page
    cy.reload();

    // User should still be logged in
    cy.get('[data-testid="nav-user"]', { timeout: 5000 }).should('contain', 'Welcome');
  });

  it('should logout successfully', () => {
    // Register and login first
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.visit('/register', { timeout: 10000 });
    cy.wait(1000);
    cy.get('[data-testid="name-input"]', { timeout: 5000 }).should('be.visible').type(testUser.name);
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="register-button"]', { timeout: 5000 }).should('be.visible').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('Registration successful');
    });

    cy.url({ timeout: 10000 }).should('include', '/login');

    // Login
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible').click();

    // Wait for login to complete
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    // Logout
    cy.get('[data-testid="logout-button"]', { timeout: 5000 }).should('be.visible').click();

    // Should redirect to login page
    cy.url({ timeout: 10000 }).should('include', '/login');

    // Should not show user info in navigation
    cy.get('[data-testid="nav-user"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-testid="nav-login"]', { timeout: 5000 }).should('be.visible');
  });

  it('should navigate to create thread page when logged in', () => {
    // Register and login first
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.visit('/register', { timeout: 10000 });
    cy.wait(1000);
    cy.get('[data-testid="name-input"]', { timeout: 5000 }).should('be.visible').type(testUser.name);
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="register-button"]', { timeout: 5000 }).should('be.visible').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('Registration successful');
    });

    cy.url({ timeout: 10000 }).should('include', '/login');

    // Login
    cy.get('[data-testid="email-input"]', { timeout: 5000 }).should('be.visible').type(uniqueEmail);
    cy.get('[data-testid="password-input"]', { timeout: 5000 }).should('be.visible').type(testUser.password);
    cy.get('[data-testid="login-button"]', { timeout: 5000 }).should('be.visible').click();

    // Wait for login to complete
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    // Click create thread button
    cy.get('[data-testid="nav-create-thread"]', { timeout: 5000 }).should('be.visible').click();

    // Should navigate to create thread page
    cy.url({ timeout: 10000 }).should('include', '/create-thread');
    cy.contains('h2', 'Create New Thread', { timeout: 5000 }).should('be.visible');
  });
});
