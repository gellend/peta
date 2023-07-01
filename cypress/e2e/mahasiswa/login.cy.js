describe("Login", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("host"));
  });

  it("Berhasil login", () => {
    cy.getByData("login-email").type("test.mahasiswa@gellen.page");
    cy.getByData("login-password").type("testing123");
    cy.getByData("login-submit").click();
    cy.url().should("include", "/pengajuan");
  });
});
