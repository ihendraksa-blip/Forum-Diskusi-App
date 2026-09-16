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
    cy.visit('/login');
    cy.contains('h2', 'Login').should('be.visible');
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
  });

  it('should show validation error when submitting empty form', () => {
    cy.visit('/login');
    cy.get('[data-testid="login-button"]').click();

    // Browser should prevent form submission due to required attributes
    cy.get('[data-testid="email-input"]').should('have.attr', 'required');
    cy.get('[data-testid="password-input"]').should('have.attr', 'required');
  });

  it('should navigate to register page when clicking register link', () => {
    cy.visit('/login');
    cy.contains('Register').click();
    cy.url().should('include', '/register');
    cy.contains('h2', 'Register').should('be.visible');
  });

  it('should allow user to register new account', () => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.visit('/register');
    cy.get('[data-testid="name-input"]').type(testUser.name);
    cy.get('[data-testid="email-input"]').type(uniqueEmail);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="register-button"]').click();

    // Should show success message and redirect to login
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Registration successful');
    });

    cy.url().should('include', '/login');
  });

  it('should display error message for invalid credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('Login failed');
    });
  });

  it('should successfully login with valid credentials', () => {
    // Note: This test assumes there's a valid user in the system
    // In a real scenario, you might want to create a test user first
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="login-button"]').click();

    // After successful login, should redirect to home page
    cy.url().should('not.include', '/login');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Should show user's name in navigation
    cy.get('[data-testid="nav-user"]').should('contain', 'Welcome');
  });

  it('should persist login after page reload', () => {
    // First login
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="login-button"]').click();

    // Wait for login to complete
    cy.url().should('not.include', '/login');

    // Reload the page
    cy.reload();

    // User should still be logged in
    cy.get('[data-testid="nav-user"]').should('contain', 'Welcome');
  });

  it('should logout successfully', () => {
    // Login first
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="login-button"]').click();

    // Wait for login to complete
    cy.url().should('not.include', '/login');

    // Logout
    cy.get('[data-testid="logout-button"]').click();

    // Should redirect to login page
    cy.url().should('include', '/login');

    // Should not show user info in navigation
    cy.get('[data-testid="nav-user"]').should('not.exist');
    cy.get('[data-testid="nav-login"]').should('be.visible');
  });

  it('should navigate to create thread page when logged in', () => {
    // Login first
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="login-button"]').click();

    // Wait for login to complete
    cy.url().should('not.include', '/login');

    // Click create thread button
    cy.get('[data-testid="nav-create-thread"]').click();

    // Should navigate to create thread page
    cy.url().should('include', '/create-thread');
    cy.contains('h2', 'Create New Thread').should('be.visible');
  });
});
