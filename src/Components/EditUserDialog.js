/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'

export default function EditUserDialog(props) {
  const handleClose = () => {
    props.dialogProps.setDialogIsOpen(false)
  }

  let userDetails = props.dialogProps.data.selectedUserData

  const [editedProfileState, setEditedProfileState] = useState(null)

  useEffect(() => {
    setEditedProfileState(props.dialogProps.data.selectedUserData)
  }, [props.dialogProps.data])

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
        <DialogTitle id="alert-dialog-title">{'Edit user profile'}</DialogTitle>
        <DialogContent>
          {props.dialogProps && editedProfileState ? (
            <Grid
              container
              spacing={1}
              style={{ padding: 20 }}
              justify="center"
              //   component={Paper}
            >
              <Grid
                container
                justify="center"
                direct="column"
                alignItems="center"
                spacing={2}
              >
                {/* name row */}
                <Grid
                  item
                  container
                  xs={8}
                  spacing={2}
                  justify="space-between"
                  direction="row"
                >
                  {/* first name */}
                  <Grid item xs={6} align="center">
                    <TextField
                      id="FirstName"
                      variant="filled"
                      label="First name"
                      defaultValue={editedProfileState.FirstName}
                      onChange={(event) => {
                        // update first name in state
                        let newUserDetails = {
                          ...editedProfileState,
                          FirstName: event.target.value,
                        }
                        setEditedProfileState(newUserDetails)
                      }}
                    />
                  </Grid>

                  {/* last name */}
                  <Grid item xs={6} align="center">
                    <TextField
                      id="LastName"
                      variant="filled"
                      label="Last name"
                      defaultValue={editedProfileState.LastName}
                      onChange={(event) => {
                        // update state
                        let newUserDetails = {
                          ...editedProfileState,
                          LastName: event.target.value,
                        }
                        setEditedProfileState(newUserDetails)
                      }}
                    />
                  </Grid>
                </Grid>

                {/* bio */}
                <Grid item xs={8} align="center">
                  {/* <br></br> */}
                  <TextField
                    id="user-bio"
                    label="Bio"
                    type="text"
                    placeholder="Write a short bio"
                    variant="filled"
                    multiline
                    fullWidth
                    rows={4}
                    defaultValue={editedProfileState.Bio}
                    onChange={(event) => {
                      // update state
                      let newUserDetails = {
                        ...editedProfileState,
                        Bio: event.target.value,
                      }
                      setEditedProfileState(newUserDetails)
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                {' '}
                <br />
              </Grid>

              {/* action section */}
              <Grid item container xs={8} justify="flex-end">
                {props.dialogProps.action}
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      let new_users = props.dialogProps.data.allUserData.map(
                        (element) => {
                          if (
                            element.Username ===
                            props.dialogProps.data.selectedUserData.Username
                          ) {
                            return editedProfileState
                          } else {
                            return element
                          }
                        },
                      )
                      props.dialogProps.dataSetters.setAllUserData(new_users)

                      // update user profile in database
                      let UPDATE_PROFILE_URL = `https://u902s79wa3.execute-api.us-east-1.amazonaws.com/dev/saveuserdetails`
                      let requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          Username:
                            props.dialogProps.data.selectedUserData.Username,
                          FirstName: editedProfileState.FirstName.replaceAll(
                            "'",
                            "''",
                          ),
                          LastName: editedProfileState.LastName.replaceAll(
                            "'",
                            "''",
                          ),
                          Bio: editedProfileState.Bio.replaceAll("'", "''"),
                        }),
                      }
                      fetch(UPDATE_PROFILE_URL, requestOptions).then(() => {
                        props.dialogProps.setDialogIsOpen(false)
                      })
                    }}
                  >
                    Save changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
