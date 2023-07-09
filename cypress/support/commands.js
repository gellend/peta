Cypress.Commands.add("getByData", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add("login", (userType) => {
  cy.fixture(`${userType}/user.json`).as("user");
  cy.get("@user").then((user) => {
    cy.getByData("login-email").type(user.email);
    cy.getByData("login-password").type(user.password);
    cy.getByData("login-submit").click();
  });
});
