import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const ConfirmDialog = (props) => {
  const {
    cancelButton,
    children,
    confirmButton,
    onCancel,
    onConfirm,
    open,
    title,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onConfirm} color="default">
          {confirmButton}
        </Button>
        <Button variant="contained" onClick={onCancel} color="primary">
          {cancelButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  cancelButton: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  confirmButton: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default ConfirmDialog;
