describe("Register", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("host")}/register`);
    cy.fixture("mahasiswa/user.json").as("mahasiswaData");
  });

  it("Berhasil register", () => {
    cy.get("@mahasiswaData").then((userData) => {
      cy.getByData("register-email").type(userData.email);
      cy.getByData("register-password").type(userData.password);
      cy.getByData("register-submit").click();
      cy.url().should("include", "/pengajuan");
    });
  });
});
