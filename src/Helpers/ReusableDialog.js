/* eslint-disable*/
import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core'

// reqquired props:
// props.dialogprops.SetDialogIsOpen()
//

export default function ReusableDialog(props) {
  const handleClose = () => {
    props.dialogProps.setDialogIsOpen(false)
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={props.dialogProps.dialogIsOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Dialog title'}</DialogTitle>
        <DialogContent>
          {props.dialogProps ? (
            <Grid
              container
              spacing={1}
              style={{ padding: 20 }}
              justify="center"
              //   component={Paper}
            >
              <Grid item xs={12} container>
                <Grid item container xs={12} justify="center" spacing={2}>
                  <p>some content</p>
                </Grid>

                {/* action section */}
                <Grid
                  item
                  container
                  xs={12}
                  justify="flex-end"
                  spacing={2}
                  style={{ padding: 20 }}
                >
                  {props.dialogProps.action}

                  <Grid item>
                    <Button variant="contained" color="primary">
                      do something
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Action button */}
            </Grid>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
