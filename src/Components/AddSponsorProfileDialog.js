/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Grid, TextField, Typography } from '@material-ui/core'
import { UserContext } from '../Helpers/UserContext'
import apis from '../Helpers/api_endpoints'

export default function AddSponsorProfileDialog(props) {
  const handleClose = () => {
    props.dialogProps.setSelectionDialogIsOpenState(false)
  }
  const userData = useContext(UserContext).user
  const [username, setUsername] = useState(null)
  const [usernameHelperText, setUsernameHelperText] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [firstNameHelperText, setFirstNameHelperText] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [lastNameHelperText, setLastNameHelperText] = useState(null)
  const [bio, setBio] = useState(null)
  const [bioHelperText, setBioHelperText] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [usernameList, setUsernameList] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      let usernames_raw = await fetch(apis.GetUsernames)
      let usernames_json = await usernames_raw.json()
      let username_array = usernames_json.body
      setUsernameList(username_array)
    })().then(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <div>
      <Dialog
        open={props.dialogProps.selectionDialogIsOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add a sponsor?'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12}>
              <Typography>
                Enter the profile details of the sponsor you would like to
                create
              </Typography>
            </Grid>
            <Grid item container xs={6} justify="center">
              <TextField
                fullWidth
                label="Username"
                helperText={usernameHelperText}
                error={usernameHelperText}
                variant="filled"
                onChange={(event) => {
                  setUsernameHelperText(null)
                  setUsername(event.target.value)
                }}
              />
            </Grid>
            <Grid item container xs={12} spacing={2} justify="center">
              <Grid item xs={3}>
                <TextField
                  fullwidth
                  label="First name"
                  helperText={firstNameHelperText}
                  error={firstNameHelperText}
                  variant="filled"
                  onChange={(event) => {
                    setFirstNameHelperText(null)
                    setFirstName(event.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullwidth
                  label="Last name"
                  helperText={lastNameHelperText}
                  error={lastNameHelperText}
                  variant="filled"
                  onChange={(event) => {
                    setLastNameHelperText(null)
                    setLastName(event.target.value)
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container xs={6}>
              <TextField
                label="Bio"
                multiline
                rows={4}
                variant="filled"
                fullWidth
                helperText={bioHelperText}
                error={bioHelperText}
                onChange={(event) => {
                  setBioHelperText(null)
                  setBio(event.target.value)
                }}
              />
            </Grid>

            <Grid item container xs={12} justify="center">
              <Grid item container justify="flex-end" xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // username validation
                    let validationFailed = false
                    if (!username) {
                      setUsernameHelperText('Required')
                      validationFailed = true
                    } else if (
                      username.includes("'") ||
                      username.includes(' ') ||
                      username.includes('"') ||
                      username.includes('@')
                    ) {
                      setUsernameHelperText(
                        'Avoid special characters (\', ", @, etc)',
                      )
                      validationFailed = true
                    } else if (
                      usernameList.find((element) => {
                        return element === username
                      })
                    ) {
                      setUsernameHelperText('Choose a unique name')
                      validationFailed = true
                    }

                    // first name validation
                    if (!firstName) {
                      setFirstNameHelperText('Required')
                      validationFailed = true
                    }

                    // last name validation
                    if (!lastName) {
                      setLastNameHelperText('Required')
                      validationFailed = true
                    }

                    // bio validation
                    if (!bio) {
                      setBioHelperText('Required')
                      validationFailed = true
                    }

                    if (validationFailed) return

                    let requestOptions = {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        Username: username.replaceAll("'", "''"),
                        Organization: userData.Organization.replaceAll(
                          "'",
                          "''",
                        ),
                        FirstName: firstName.replaceAll("'", "''"),
                        LastName: lastName.replaceAll("'", "''"),
                        Bio: bio.replaceAll("'", "''"),
                        AccountType: 'Sponsor',
                        AccountStatus: 1,
                      }),
                    }
                    fetch(apis.UserSignup, requestOptions).then(() => {
                      props.dialogProps.setSelectionDialogIsOpenState(
                        false,
                        true,
                      )
                    })
                  }}
                >
                  Create profile
                </Button>
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <br />
            </Grid>
            <Grid item container xs={12}>
              <br />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}
