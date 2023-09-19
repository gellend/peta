describe("Pengajuan", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("host"));
  });

  it.only("Berhasil mendaftarkan user", () => {
    cy.login("admin");
    cy.getByData("btn-nav-sidebar-2").click();
    cy.url().should("include", "/verifikasi");
    cy.getByData("btn-tambah-pengguna").click();
    cy.url().should("include", "/verifikasi/create");
    cy.fixture("mahasiswa/user.json").as("userMahasiswa");
    cy.get("@userMahasiswa").then((user) => {
      cy.getByData("verifikasi-create-id").type(user.id);
      cy.getByData("verifikasi-create-id-input").should("have.value", user.id);
      cy.getByData("verifikasi-create-prodi").click();
      cy.getByData("verifikasi-create-prodi-option-0").click();
      cy.getByData("verifikasi-create-nama").type(user.nama);
      cy.getByData("verifikasi-create-nama-input").should(
        "have.value",
        user.nama
      );
      cy.getByData("verifikasi-create-email").type(user.email);
      cy.getByData("verifikasi-create-email-input").should(
        "have.value",
        user.email
      );
      cy.getByData("verifikasi-create-role").click();
      cy.getByData("verifikasi-create-role-option-0").click();
      cy.getByData("verifikasi-create-password").type(user.password);
      cy.getByData("verifikasi-create-password-input").should(
        "have.value",
        user.password
      );
      cy.getByData("verifikasi-create-submit").click();
      cy.url().should("include", "/verifikasi");
    });
  });
});
