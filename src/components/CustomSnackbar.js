import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, message, type, onClose }) => {
  if (!open) {
    return null;
  }

  const snackbarProps = {
    open: true,
    autoHideDuration: 2000,
    onClose: onClose,
  };

  if (type) {
    return (
      <Snackbar {...snackbarProps}>
        <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    );
  } else {
    return <Snackbar {...snackbarProps} message={message} />;
  }
};

export default CustomSnackbar;
