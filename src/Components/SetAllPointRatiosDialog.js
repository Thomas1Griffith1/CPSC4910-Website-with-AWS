/* eslint-disable*/
import React, { useContext, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import DialogContentText from '@material-ui/core/DialogContentText'

import {
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import { UserContext } from '../Helpers/UserContext'

import CloseIcon from '@material-ui/icons/Close'
import apis from '../Helpers/api_endpoints'

export default function SetAllPointRatiosDialog(props) {
  const [newPointDollarRatio, setNewPointDollarRatio] = useState(null)
  const [pointDollarRatio, setPointDollarRatio] = useState(null)
  const [helperText, setHelperText] = useState(null)

  // const userData = useContext(UserContext).user
  const userData = { Username: props.SponsorID }

  const handleClose = (resp) => {
    props.setDialogIsOpen(false)
  }

  return (
    <div>
      <Dialog
        open={props.dialogIsOpen}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid container style={{ padding: 20 }} component={Paper}>
          <Grid
            item
            container
            xs={12}
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={10}>
              <Typography variant="h5" id="alert-dialog-title">
                Set all drivers' point to USD conversion
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() => {
                  handleClose(false)
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <DialogContentText id="alert-dialog-description">
              Set the point to dollar conversion for all of your drivers. .005
              would mean that 1 point is worth .005 USD.
            </DialogContentText>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid
            item
            container
            spacing={3}
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Point value (USD)"
                variant="filled"
                defaultValue={pointDollarRatio}
                helperText={helperText}
                error={helperText}
                onChange={(event) => {
                  setNewPointDollarRatio(event.target.value)
                }}
                size="small"
              ></TextField>
            </Grid>

            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  if (!newPointDollarRatio) {
                    setHelperText('Need to provide a value')
                    return
                  } else if (!parseFloat(newPointDollarRatio)) {
                    setHelperText('Must enter a number')
                    return
                  } else if (newPointDollarRatio <= 0) {
                    setHelperText('Must be greater than 0')
                    return
                  } else {
                    setHelperText(null)
                  }

                  let requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      SponsorID: userData.Username.replaceAll("'", "''"),
                      PointDollarRatio: parseFloat(newPointDollarRatio),
                    }),
                  }
                  fetch(apis.UpdateSponsorshipPDR, requestOptions).then(() => {
                    props.setDialogIsOpen(false, true)
                  })
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  )
}
