import React,{useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const ValidityDate = (props) => {

  const {
    dialogAction, dialogMessage, setDialogOpen, dialogOpen
  } = props;
  console.log(dialogOpen, 'dialogOpen dialogOpen');

  const [date ,setDate] = useState(dialogOpen != null ? dialogOpen.validUpTo : null)

  useEffect(()=>{
    if(dialogOpen != null){
      // alert(dialogOpen.validUpTo)
      setDate(dialogOpen.validUpTo)
    }

  }, [props.dialogOpen])

  return (
    <Dialog
      className="mx-4 my-2"
      open={dialogOpen && dialogOpen != null ? true : false}
      onClose={() => setDialogOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Enrollment Valid Upto</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date"
          format="dd-MM-yyyy"
          value={date}
          onChange={setDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(null)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => { dialogAction(date);}} color="primary" autoFocus>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidityDate;
