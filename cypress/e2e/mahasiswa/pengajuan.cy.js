describe("Pengajuan", () => {
  it("Berhasil mengajukan proposal", () => {
    // Login
    // Klik tombol Ajukan Judul
    // Diarahkan ke pengajuan/create
    // Isi form
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
