describe("Register", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("host")}/register`);
  });

  it("Menampilkan error jika NRP kosong", () => {
    cy.getByData("register-submit").click();
    cy.getByData("register-id-helper-text").should(
      "contain.text",
      "NRP is required"
    );
  });

  it("Menampilkan error jika Nama Lengkap kosong", () => {
    cy.getByData("register-id").type("12345");
    cy.getByData("register-submit").click();
    cy.getByData("register-nama-helper-text").should(
      "contain.text",
      "Nama Lengkap is required"
    );
  });

  it("Menampilkan error jika Alamat Email kosong", () => {
    cy.getByData("register-id").type("12345");
    cy.getByData("register-nama").type("John Doe");
    cy.getByData("register-submit").click();
    cy.getByData("register-email-helper-text").should(
      "contain.text",
      "Alamat Email is required"
    );
  });

  it("Menampilkan error jika Alamat Email tidak valid", () => {
    cy.getByData("register-id").type("12345");
    cy.getByData("register-nama").type("John Doe");
    cy.getByData("register-email").type("invalid-email");
    cy.getByData("register-submit").click();
    cy.getByData("register-email-helper-text").should(
      "contain.text",
      "Invalid email format"
    );
  });

  it("Menampilkan error jika Kata Sandi kosong", () => {
    cy.getByData("register-id").type("12345");
    cy.getByData("register-nama").type("John Doe");
    cy.getByData("register-email").type("john.doe@example.com");
    cy.getByData("register-submit").click();
    cy.getByData("register-password-helper-text").should(
      "contain.text",
      "Kata Sandi is required"
    );
  });

  it("Berhasil register", () => {
    cy.fixture("mahasiswa/user.json").as("userMahasiswa");
    cy.get("@userMahasiswa").then((user) => {
      cy.getByData("register-id").type(user.id);
      cy.getByData("register-id-input").should("have.value", user.id);
      cy.getByData("register-nama").type(user.nama);
      cy.getByData("register-nama-input").should("have.value", user.nama);
      cy.getByData("register-email").type(user.email);
      cy.getByData("register-email-input").should("have.value", user.email);
      cy.getByData("register-password").type(user.password);
      cy.getByData("register-password-input").should(
        "have.value",
        user.password
      );
      cy.getByData("register-submit").click();
      cy.url().should("include", "/pengajuan");
    });
  });
});
