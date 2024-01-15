# Pengajuan Judul Tugas Akhir (PETA)

Sistem informasi yang memungkinkan mahasiswa untuk melakukan pengajuan judul untuk tugas akhir, dan mendapatkan realtime update terkait pengajuan tersebut.

_The information system that allows students to submit their final project titles and receive real-time updates related to their submissions._

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Docker](#docker)
- [License](#license)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)

## Introduction

Mahasiswa di STIKI Malang perlu melakukan beberapa hal saat ingin mengajukan judul tugas akhirnya.
Antara lain:

1. Mengunduh dokumen di website yang telah disediakan
2. Mengisi dokumen tersebut
3. Mengupload kembali dokumen ke form yang telah disediakan

Sistem informasi ini dibuat untuk membantu memudahkan pengajuan tersebut, dimana Mahasiswa hanya perlu mengisi form. Dan nantinya akan mendapatkan update pengajuan tersebut.

Selain itu, Dosen Pembimbing dan Kaprodi juga akan terbantu. Karena tidak perlu membubuhkan tanda tangan satu persatu, serta kemudahan untuk menyetujui atau memberikan revisi terhadap pengajuan yang dilakukan Mahasiswa.

Terakhir, terdapat fitur konsultasi yang memudahkan interaksi antara Mahasiswa dan Calon Dosen Pembimbing saat berdiskusi mengenai judul tugas akhir nantinya.

_Students at STIKI Malang need to perform several tasks when they want to submit their final project titles. These tasks include:_

1. _Downloading documents from the provided website._
2. _Filling out these documents._
3. _Uploading the completed documents using the provided form._

_This information system is created to facilitate and simplify this submission process. Students will only need to fill out a form and will subsequently receive updates regarding their submissions._

_Furthermore, this system will benefit the supervising professors and program coordinators. They will no longer need to individually sign documents, and it will be easier to approve or provide revisions for student submissions._

_Lastly, there is a consultation feature that makes it easier for students to interact with potential project advisors when discussing their final project titles._

## Getting Started

Untuk memulai dengan proyek ini, pastikan Anda telah menginstal Node.js. Kemudian, ikuti langkah-langkah berikut:

1. Clone repositori ini.
2. Navigasi ke direktori proyek.
3. Jalankan perintah-perintah berikut:

   `npm install`

   `npm run build`

   `npm run start`

_To get started with this project, make sure you have Node.js installed. Then, follow these steps:_

1. _Clone the repository._
2. _Navigate to the project directory._
3. _Run the following commands:_

   `npm install`

   `npm run build`

   `npm run start`

## Docker

_Or you can easily utilize the Dockerfile by running the command below_

`docker build -t peta-app .`

`docker run -p 3000:3000 -d peta-app`

### Prerequisites

Sebelum menjalankan proyek, konfigurasikan variabel lingkungan dengan membuat file `.env`. Anda dapat menggunakan file `.env.example` sebagai template dan menggantikan nilai-nilai yang sesuai.

_Before running the project, configure the environment variables by creating a `.env` file. You can use the `.env.example` file as a template and replace the placeholders with your specific values._

## License

This project is licensed under the MIT License with Attribution - see the [LICENSE](LICENSE) file for details.

## Authors

- [Gellen Dewanta](https://github.com/gellend) (hi@gellen.page)

## Acknowledgments

- STIKI Malang, current implementation
- Pak Adnan, for the advice
