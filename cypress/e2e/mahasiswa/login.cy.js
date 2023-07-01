describe("Login", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("host"));
  });

  it("Menampilkan error jika Email kosong", () => {
    cy.getByData("login-submit").click();
    cy.getByData("login-email-helper-text").should(
      "contain.text",
      "Alamat Email is required"
    );
  });

  it("Menampilkan error jika Email tidak valid", () => {
    cy.getByData("login-email").type("invalid-email");
    cy.getByData("login-submit").click();
    cy.getByData("login-email-helper-text").should(
      "contain.text",
      "Invalid email format"
    );
  });

  it("Menampilkan error jika Kata Sandi kosong", () => {
    cy.getByData("login-email").type("john.doe@example.com");
    cy.getByData("login-submit").click();
    cy.getByData("login-password-helper-text").should(
      "contain.text",
      "Kata Sandi is required"
    );
  });

  it("Berhasil login", () => {
    cy.fixture("mahasiswa/user.json").as("userMahasiswa");
    cy.get("@userMahasiswa").then((user) => {
      cy.getByData("login-email").type(user.email);
      cy.getByData("login-password").type(user.password);
      cy.getByData("login-submit").click();
      cy.url().should("include", "/pengajuan");
    });
  });
});
