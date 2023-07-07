describe("Akses", () => {
  it("Berhasil mengakses halaman profil", () => {
    // Login
    // Klik tombol profil
    // Diarahkan ke profil
    // Tabel profil berisi data profil
  });

  it("Berhasil mengakses halaman pengajuan", () => {
    // Login
    // Diarahkan ke dashboard
    // Ketik url /pengajuan
    // Tabel pengajuan berisi data pengajuan
  });

  it("Tidak bisa mengakses halaman pengajuan/create", () => {
    // Login
    // Diarahkan ke dashboard
    // Ketik url /pengajuan/create
    // Diarahkan ke pengajuan
  });

  it("Berhasil mengakses halaman pengajuan/detail", () => {
    // Login
    // Diarahkan ke dashboard
    // Diarahkan ke pengajuan
    // Klik tombol detail
    // Diarahkan ke pengajuan/detail
    // Tabel detail berisi data pengajuan
  });

  it("Berhasil menyetujui pengajuan", () => {
    // Login
    // Diarahkan ke dashboard
    // Diarahkan ke pengajuan
    // Klik pengajuan/detail
    // Klik tombol setujui
    // muncul modal catatan
    // Muncul modal konfirmasi
    // Diarahkan ke pengajuan/detail
  });

  it("Berhasil menolak pengajuan", () => {
    // Login
    // Diarahkan ke dashboard
    // Diarahkan ke pengajuan
    // Klik pengajuan/detail
    // Klik tombol tolak
    // muncul modal catatan
    // Muncul modal konfirmasi
    // Diarahkan ke pengajuan/detail
  });

  it("Berhasil mengakses halaman dashboard", () => {
    // Login
    // Diarahkan ke dashboard
  });

  it("Tidak bisa mengakses halaman verifikasi", () => {
    // Login
    // Diarahkan ke pengajuan
    // Ketik url /verifikasi
    // Diarahkan ke pengajuan
  });

  it("Tidak bisa mengakses halaman verifikasi/detail", () => {
    // Login
    // Diarahkan ke pengajuan
    // Ketik url /verifikasi/detail
    // Diarahkan ke pengajuan
  });

  it("Tidak bisa mengakses halaman verifikasi/edit", () => {
    // Login
    // Diarahkan ke pengajuan
    // Ketik url /verifikasi/edit
    // Diarahkan ke pengajuan
  });

  it("Tidak bisa mengakses halaman verifikasi/create", () => {
    // Login
    // Diarahkan ke pengajuan
    // Ketik url /verifikasi/create
    // Diarahkan ke pengajuan
  });
});
