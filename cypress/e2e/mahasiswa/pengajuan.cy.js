describe("Pengajuan", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("host"));
  });

  it.only("Berhasil mengajukan proposal", () => {
    cy.fixture("pengajuan.json").as("pengajuan");
    cy.get("@pengajuan").then((pengajuan) => {
      cy.login("mahasiswa");
      // cy.getByData("btn-ajukan-judul").click();
      cy.visit(Cypress.env("host") + "/pengajuan/create");
      cy.url().should("include", "/pengajuan/create");
      cy.getByData("pengajuan-judul").type(pengajuan.judul);
      cy.getByData("sks-lulus").type(pengajuan.sksLulus);
      cy.getByData("sks-ambil").type(pengajuan.sksAmbil);
      cy.getByData("sks-mengulang").type(pengajuan.sksMengulang);
      cy.getByData("deskripsi").type(pengajuan.deskripsi);
    });

    // Klik tombol Submit
    // Muncul snackbar berhasil
    // Diarahkan ke pengajuan
    // Tabel pengajuan berisi judul yang diajukan
    // Klik tombol detail
    // Diarahkan ke pengajuan/detail
    // Tabel detail berisi data pengajuan
  });

  it("Gagal mengajukan proposal", () => {
    // Login
    // Klik tombol Ajukan Judul
    // Diarahkan ke pengajuan/create
    // Isi form dengan data yang tidak valid
    // Klik tombol Submit
    // Muncul snackbar gagal
    // Diarahkan ke pengajuan/create
    // Tabel pengajuan kosong
  });

  it("Berhasil mengubah proposal", () => {
    // Login
    // Klik tombol detail
    // Diarahkan ke pengajuan/detail
    // Klik tombol ubah
    // Diarahkan ke pengajuan/edit
    // Isi form
    // Klik tombol Submit
    // Muncul snackbar berhasil
    // Diarahkan ke pengajuan
    // Tabel pengajuan berisi judul yang diajukan
    // Klik tombol detail
    // Diarahkan ke pengajuan/detail
    // Tabel detail berisi data pengajuan
  });

  it("Gagal mengubah proposal", () => {
    // Login
    // Klik tombol detail
    // Diarahkan ke pengajuan/detail
    // Klik tombol ubah
    // Diarahkan ke pengajuan/edit
    // Isi form dengan data yang tidak valid
    // Klik tombol Submit
    // Muncul snackbar gagal
    // Diarahkan ke pengajuan/edit
    // Tabel pengajuan kosong
  });
});
