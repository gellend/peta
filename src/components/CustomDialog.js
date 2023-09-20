import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  DialogContent,
} from "@mui/material";
import { useState } from "react";

const CustomDialog = ({ open, title, onClose, onSubmit }) => {
  const [value, setValue] = useState("");

  if (!open) {
    return null;
  }

  const dialogProps = {
    open: true,
    onClose: onClose,
    maxWidth: "sm",
    fullWidth: true,
  };

  const handleSubmit = () => {
    onSubmit(value);
    handleClose();
  };

  const handleClose = () => {
    setValue("");
    onClose();
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Keterangan"
          variant="standard"
          fullWidth
          multiline
          rows={4}
          id="keterangan"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
