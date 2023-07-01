Cypress.Commands.add("getByData", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});
