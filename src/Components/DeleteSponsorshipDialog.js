/* eslint-disable*/
import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Grid, Typography } from '@material-ui/core'
import apis from '../Helpers/api_endpoints'

export default function DeleteSponsorshipDialog(props) {
  const handleClose = () => {
    props.dialogProps.setDialogIsOpen(false)
  }

  return (
    <div>
      <Dialog
        open={props.dialogProps.dialogIsOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'End sponsorship?'}</DialogTitle>
        <DialogContent>
          <Grid container spacing="2">
            <Grid item xs={12}>
              <Typography>
                Are you sure you want to end this sponsorship? This <b>can</b>{' '}
                be undone in the future.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose()
              // props.parentProps.handleClose(true)
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  SponsorID: props.parentProps.selectedDriverData.SponsorID.replaceAll(
                    "'",
                    "''",
                  ),
                  DriverID: props.parentProps.selectedDriverData.DriverID.replaceAll(
                    "'",
                    "''",
                  ),
                  Status: 3,
                }),
              }
              fetch(apis.ChangeSponsorshipInfo, requestOptions)
                .then(() => {
                  let newDriverDataState = props.parentProps.allDriverData.map(
                    (element) => {
                      if (
                        element.Username ===
                        props.parentProps.selectedDriverData.DriverID
                      ) {
                        return {
                          ...element,
                          Status: 3,
                        }
                      } else {
                        return element
                      }
                    },
                  )
                  props.parentProps.setAllDriverDataState(newDriverDataState)
                })
                .then(() => {
                  handleClose()
                  props.parentProps.handleClose(true)
                })
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
