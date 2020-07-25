import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const DashboardHeader = (props) => {

  const {
    dialogAction, dialogMessage, setDialogOpen, dialogOpen,
  } = props;

  return (
    <Dialog
      className="mx-4 my-2"
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Please review carefully before proceeding</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)} color="primary">
          No, go back
        </Button>
        <Button onClick={() => { dialogAction(); setDialogOpen(false); }} color="primary" autoFocus>
          Yes, I'm sure
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardHeader;
