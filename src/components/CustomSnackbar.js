import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, message, type, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
      {type ? (
        <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      ) : (
        <>{message}</>
      )}
    </Snackbar>
  );
};

export default CustomSnackbar;
