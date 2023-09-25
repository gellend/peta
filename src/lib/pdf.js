import { PDFDocument } from "pdf-lib";
import { uploadFile } from "./upload";
import getCurrentTimestamp from "../helper/date";

const generatePdf = async (values) => {
  const formUrl = process.env.NEXT_PUBLIC_PENGAJUAN_TEMPLATE;
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();
  const page2 = pdfDoc.getPages()[1];

  // Page 1
  const nrpField = form.getTextField("nrp");
  const namaField = form.getTextField("nama");
  const emailField = form.getTextField("email");
  const sksLulusField = form.getTextField("sksLulus");
  const sksAmbilField = form.getTextField("sksAmbil");
  const ipkField = form.getTextField("ipk");
  const sksMengulangField = form.getTextField("sksMengulang");
  const judulField = form.getTextField("judul");
  const deskripsiField = form.getTextField("deskripsi");

  // Page 2
  const dosenPembimbing1Field = form.getTextField("dosenPembimbing1");
  const dosenPembimbing2Field = form.getTextField("dosenPembimbing2");
  const dosenPembimbing3Field = form.getTextField("dosenPembimbing3");
  const tanggalDibuatField = form.getTextField("tanggalDibuat");
  const namaDosenLabField = form.getTextField("namaDosenLab");
  const namaMahasiswaField = form.getTextField("namaMahasiswa");
  const prodiField = form.getTextField("prodi");
  const namaKaprodiField = form.getTextField("namaKaprodi");

  // Fill page 1
  nrpField.setText(values.id);
  namaField.setText(values.nama);
  emailField.setText(values.email);
  sksLulusField.setText(values.totalSksLulus);
  sksAmbilField.setText(values.sksAmbil);
  ipkField.setText(values.ipk);
  sksMengulangField.setText(values.sksMengulang);
  judulField.setText(values.judul);
  deskripsiField.setText(values.deskripsi);

  // Fill page 2
  dosenPembimbing1Field.setText(values.dosenPembimbing1.nama);
  dosenPembimbing2Field.setText(values.dosenPembimbing2.nama);
  dosenPembimbing3Field.setText(values.dosenPembimbing3.nama);
  tanggalDibuatField.setText(values.tanggalDibuat);
  namaDosenLabField.setText(values.dosenLab.nama);
  namaMahasiswaField.setText(values.nama);
  prodiField.setText(values.prodi);
  namaKaprodiField.setText(values?.kepalaProdi?.nama);

  // change to this format: dd month yyyy
  const date = new Date(values.timestamp.seconds * 1000);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("id-ID", options);
  tanggalDibuatField.setText(formattedDate);

  // Signatures dosen pembimbing 1
  if (values.dosenPembimbing1.signature) {
    const signatureImage = await pdfDoc.embedPng(
      values.dosenPembimbing1.signature
    );
    const imageSize = { width: 100, height: 100 };
    page2.drawImage(signatureImage, {
      x: 350,
      y: 600,
      width: imageSize.width,
      height: imageSize.height,
    });
  }

  // Signatures dosen pembimbing 2
  if (values.dosenPembimbing2.signature) {
    const signatureImage = await pdfDoc.embedPng(
      values.dosenPembimbing2.signature
    );
    const imageSize = { width: 100, height: 100 };
    page2.drawImage(signatureImage, {
      x: 350,
      y: 520,
      width: imageSize.width,
      height: imageSize.height,
    });
  }

  // Signatures dosen pembimbing 3
  if (values.dosenPembimbing3.signature) {
    const signatureImage = await pdfDoc.embedPng(
      values.dosenPembimbing3.signature
    );
    const imageSize = { width: 100, height: 100 };
    page2.drawImage(signatureImage, {
      x: 350,
      y: 440,
      width: imageSize.width,
      height: imageSize.height,
    });
  }

  // Signatures dosen lab
  if (values.dosenLab.signature) {
    const signatureImage = await pdfDoc.embedPng(values.dosenLab.signature);
    const imageSize = { width: 100, height: 100 };
    page2.drawImage(signatureImage, {
      x: 50,
      y: 250,
      width: imageSize.width,
      height: imageSize.height,
    });
  }

  // Signatures mahasiswa
  if (values.signature) {
    const signatureImage = await pdfDoc.embedPng(values.signature);
    const imageSize = { width: 100, height: 100 };
    page2.drawImage(signatureImage, {
      x: 370,
      y: 250,
      width: imageSize.width,
      height: imageSize.height,
    });
  }

  // signatur kepala prodi
  if (values?.kepalaProdi?.signature) {
    const signatureImage = await pdfDoc.embedPng(values.kepalaProdi.signature);
    const imageSize = { width: 100, height: 100 };
    page2.drawImage(signatureImage, {
      x: 220,
      y: 90,
      width: imageSize.width,
      height: imageSize.height,
    });
  }

  // Save the PDF to a blob
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};

export const generateAndUploadPdf = async (values) => {
  const formPdfBlob = await generatePdf(values);
  const currentTimestamp = getCurrentTimestamp();
  const pdfPath = `user/${values.uid}/raw/pengajuan-${currentTimestamp}.pdf`;

  try {
    await uploadFile(formPdfBlob, pdfPath);
    return pdfPath;
  } catch (error) {
    console.error(`Failed to upload file ${pdfPath}, ${error}`);
    return "";
  }
};
