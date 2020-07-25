import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default ({ notifMessage, notifMessageType, setNotifMessage }) => {
  return (
    <Snackbar
      open={!!notifMessage}
      autoHideDuration={10000}
      onClose={() => setNotifMessage("")}
    >
      <Alert
        variant="filled"
        onClose={() => setNotifMessage("")}
        severity={notifMessageType}
      >
        {notifMessage}
      </Alert>
    </Snackbar>
  );
};
