import { Alert } from "@mui/material";
import useAppStore from "../store/global";
import Link from "next/link";

const SignatureAlert = () => {
  const { currentUser } = useAppStore((state) => state);

  if (!currentUser) return <></>;

  if (currentUser.signature) return <></>;

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      Anda belum menambahkan tanda tangan. Silahkan{" "}
      <Link href="/profile/update">update disini</Link>
    </Alert>
  );
};

export default SignatureAlert;
