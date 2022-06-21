/* eslint-disable*/
import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { useHistory } from 'react-router-dom'

export default function ApplyAgainDialog(props) {
  let history = useHistory()

  const handleClose = (resp) => {
    props.setDialogIsOpen(false)
    props.setDialogResponse(resp)
    if (resp === true) {
      window.location.reload()
    } else {
      history.push('/')
    }
  }

  return (
    <div>
      <Dialog
        open={props.dialogIsOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Would you like to apply to another sponsor?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your application went through, but you're allowed to have more than
            one sponsor! Would you like to apply to another sponsor right now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false)
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleClose(true)
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
