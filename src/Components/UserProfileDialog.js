/* eslint-disable*/
import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core'
import EditUserDialog from './EditUserDialog'

export default function UserProfileDialog(props) {
  let user_username = props.dialogProps.selectedUser.Username

  const handleClose = () => {
    props.dialogProps.setDialogIsOpen(false)
  }

  const [editUserDialogIsOpen, setEditUserDialogIsOpen] = useState(false)
  let setEditUserDialogIsOpenState = (state) => {
    setEditUserDialogIsOpen(state)
  }

  const left_col_width = 4
  const right_col_width = 6

  let active_profile = props.dialogProps.allUsers
    ? props.dialogProps.allUsers.find(
        (element) => element.Username === user_username,
      )
    : null

  return (
    <div>
      <EditUserDialog
        dialogProps={{
          dialogIsOpen: editUserDialogIsOpen,
          setDialogIsOpen: setEditUserDialogIsOpenState,
          data: {
            allUserData: props.dialogProps.allUsers,
            selectedUserData: active_profile,
          },
          dataSetters: {
            setAllUserData: props.dialogProps.setAllUserData,
          },
        }}
      />
      <Dialog
        fullWidth
        maxWidth="sm"
        open={props.dialogProps.dialogIsOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'User profile'}</DialogTitle>
        <DialogContent>
          {props.dialogProps.allUsers && props.dialogProps.selectedUser ? (
            <Grid
              container
              spacing={1}
              style={{ padding: 20 }}
              justify="center"
              //   component={Paper}
            >
              <Grid item xs={12} container>
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">Username: </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={right_col_width} align="left">
                    <Typography>{active_profile.Username}</Typography>
                  </Grid>
                </Grid>

                {/* name */}
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">Name: </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={right_col_width} align="left">
                    <Typography>
                      {active_profile.FirstName + ' ' + active_profile.LastName}
                    </Typography>
                  </Grid>
                </Grid>

                {/* bio */}
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">User Bio: </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={right_col_width} align="left">
                    <Typography>{active_profile.Bio}</Typography>
                  </Grid>
                </Grid>

                {/* bio */}
                <Grid item xs={12}>
                  <br />
                </Grid>

                {/* Role */}
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">Role: </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={right_col_width} align="left">
                    <Typography>{active_profile.AccountType}</Typography>
                  </Grid>
                </Grid>

                {/* registered since */}
                {active_profile.SignupDate.length > 1 ? (
                  <Grid item container xs={12} justify="center" spacing={2}>
                    <Grid item xs={left_col_width} align="right">
                      <Typography>
                        <Box fontWeight="bold">Registered since: </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={right_col_width} align="left">
                      <Typography>
                        {Date.parse(active_profile.SignupDate).toUTCString()}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}

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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setEditUserDialogIsOpen(true)
                      }}
                    >
                      edit user
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
