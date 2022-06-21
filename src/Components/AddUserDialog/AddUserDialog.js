/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import email_validator from 'email-validator'
import awsconfig from '../../aws-exports'
import Amplify, { Auth, API } from 'aws-amplify'
Amplify.configure(awsconfig)
import AWS from 'aws-sdk'
import apis from '../../Helpers/api_endpoints'
require('datejs')

if (!AWS.config.region || !AWS.config.credenetials) {
}
AWS.config.region = 'us-east-1'
AWS.config.update({
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1_FWuyNmWFi',
  }),
})

// reqquired props:
// props.dialogprops.SetDialogIsOpen()
//

export default function AddUserDialog(props) {
  const handleClose = () => {
    setCreatedUserDetails({
      AccountType: '',
      Username: '',
      FirstName: '',
      LastName: '',
      Bio: '',
      AccountStatus: '',
      Organization: null,
    })
    props.dialogProps.setDialogIsOpen(false)

    setAccTypeHelperText(null)
    setUnameHelperText(null)
    setFnameHelperText(null)
    setLnameHelperText(null)
    setBioHelperText(null)
    setOrgHelperText(null)
    setIsNewOrganization(null)
  }

  const [createdUserDetails, setCreatedUserDetails] = useState({
    AccountType: '',
    Username: '',
    FirstName: '',
    LastName: '',
    Bio: '',
    AccountStatus: '',
    Organization: null,
  })

  const [isNewOrganization, setIsNewOrganization] = useState('true')

  const [accTypeHelperText, setAccTypeHelperText] = useState(null)
  const [unameHelperText, setUnameHelperText] = useState(null)
  const [fnameHelperText, setFnameHelperText] = useState(null)
  const [lnameHelperText, setLnameHelperText] = useState(null)
  const [bioHelperText, setBioHelperText] = useState(null)
  const [orgHelperText, setOrgHelperText] = useState(null)

  let set_of_taken_usernames = new Set(
    props.dialogProps.data.allUsers.map((element) => element.Username),
  )
  let set_of_taken_usernames_lc = new Set(
    props.dialogProps.data.allUsers.map((element) =>
      element.Username.toLowerCase(),
    ),
  )

  let set_of_taken_organizations = new Set(
    props.dialogProps.data.allUsers
      .filter((element) => {
        return element.Organization != null
      })
      .map((element) => element.Organization),
  )

  let set_of_taken_organizations_lc = new Set(
    props.dialogProps.data.allUsers
      .filter((element) => {
        return element.Organization != null
      })
      .map((element) => element.Organization.toLowerCase()),
  )

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
        <DialogTitle id="alert-dialog-title">{'User info'}</DialogTitle>
        <DialogContent>
          {props.dialogProps ? (
            <Grid
              container
              spacing={1}
              style={{ padding: 20 }}
              justify="center"
              //   component={Paper}
            >
              {/* username */}
              <Grid item xs={12} container>
                <Grid item container fullWidth justify="center">
                  <Grid item xs={8} align="center">
                    <TextField
                      id="Username"
                      label="Username"
                      fullWidth
                      error={unameHelperText}
                      helperText={unameHelperText}
                      variant="filled"
                      onChange={(event) => {
                        setUnameHelperText(null)
                        // update last name in state
                        let newUserDetails = { ...createdUserDetails }
                        newUserDetails.Username = event.target.value
                        setCreatedUserDetails(newUserDetails)
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {' '}
                    <br />
                  </Grid>

                  {/* account type */}
                  <Grid item xs={8}>
                    <InputLabel id="AccountTypeLabel">Account Type</InputLabel>
                    <Select
                      labelId="AccountTypeLabel"
                      id="AccountType"
                      fullWidth
                      value={createdUserDetails.AccountType}
                      variant="filled"
                      error={accTypeHelperText}
                      helperText={accTypeHelperText}
                      onChange={(event) => {
                        setAccTypeHelperText(null)
                        setIsNewOrganization(false)
                        createdUserDetails.Organization = null
                        // update account type in state
                        let newUserDetails = { ...createdUserDetails }
                        newUserDetails.AccountType = event.target.value
                        setCreatedUserDetails(newUserDetails)
                      }}
                    >
                      <MenuItem value="Driver">Driver</MenuItem>
                      <MenuItem value="Sponsor">Sponsor</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </Grid>

                  {/* new organization? */}
                  {createdUserDetails.AccountType === 'Sponsor' ? (
                    <Grid item xs={8}>
                      <FormLabel component="legend">
                        New organization?
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-label="New organization?"
                        name="isNewOrganization"
                        value={isNewOrganization}
                        // defaultChecked="true"
                        onChange={(event) => {
                          setUnameHelperText(null)
                          setIsNewOrganization(event.target.value)
                        }}
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                  ) : null}

                  {/* create new organization */}
                  {createdUserDetails.AccountType === 'Sponsor' &&
                  isNewOrganization === 'true' ? (
                    <Grid container justify="center">
                      <Grid item xs={8} align="center">
                        <TextField
                          fullWidth
                          id="OrganizationName"
                          error={orgHelperText}
                          helperText={orgHelperText}
                          variant="filled"
                          label="Organization name"
                          onChange={(event) => {
                            setOrgHelperText(null)
                            let newUserDetails = { ...createdUserDetails }
                            newUserDetails.Organization = event.target.value
                            setCreatedUserDetails(newUserDetails)
                          }}
                        />
                      </Grid>
                      <Grid item xs={8} align="center">
                        <br />
                      </Grid>
                    </Grid>
                  ) : createdUserDetails.AccountType === 'Sponsor' &&
                    isNewOrganization === 'false' ? (
                    <Grid item xs={8}>
                      {/* account type */}

                      <InputLabel id="Org choice label">
                        Organization
                      </InputLabel>
                      <Select
                        labelId="orgchoicelabel"
                        id="OrgChoice"
                        fullWidth
                        variant="filled"
                        error={orgHelperText}
                        helperText={orgHelperText}
                        onChange={(event) => {
                          setOrgHelperText(null)
                          //   setIsNewOrganization(null)
                          // update account type in state
                          let newUserDetails = { ...createdUserDetails }
                          newUserDetails.Organization = event.target.value
                          setCreatedUserDetails(newUserDetails)
                        }}
                      >
                        {set_of_taken_organizations &&
                          [...set_of_taken_organizations]
                            .filter((element) => element != '')
                            .map((element) => {
                              return (
                                <MenuItem value={element}>{element}</MenuItem>
                              )
                            })}
                      </Select>
                    </Grid>
                  ) : null}

                  {/* name row */}
                  <Grid
                    item
                    container
                    xs={8}
                    spacing={1}
                    justify="space-between"
                  >
                    {/* first name */}
                    <Grid item xs={6} align="center">
                      <TextField
                        id="FirstName"
                        label="First name"
                        error={fnameHelperText}
                        helperText={fnameHelperText}
                        variant="filled"
                        onChange={(event) => {
                          setFnameHelperText(null)
                          let newUserDetails = { ...createdUserDetails }
                          newUserDetails.FirstName = event.target.value
                          setCreatedUserDetails(newUserDetails)
                        }}
                      />
                    </Grid>

                    {/* last name */}
                    <Grid item xs={6} align="center">
                      <TextField
                        id="LastName"
                        label="Last name"
                        error={lnameHelperText}
                        helperText={lnameHelperText}
                        variant="filled"
                        onChange={(event) => {
                          setLnameHelperText(null)
                          // update last name in state
                          let newUserDetails = { ...createdUserDetails }
                          newUserDetails.LastName = event.target.value
                          setCreatedUserDetails(newUserDetails)
                        }}
                      />
                    </Grid>
                  </Grid>
                  {/* bio */}
                  <Grid item xs={8} align="center">
                    <br></br>
                    <TextField
                      id="user-bio"
                      label="Bio"
                      type="text"
                      placeholder="Write a short bio"
                      variant="filled"
                      multiline
                      fullWidth
                      rows={4}
                      error={bioHelperText}
                      helperText={bioHelperText}
                      onChange={(event) => {
                        setBioHelperText(null)
                        // update UserBio in state
                        let newUserDetails = { ...createdUserDetails }
                        newUserDetails.Bio = event.target.value
                        setCreatedUserDetails(newUserDetails)
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <br />
                  </Grid>

                  {/* action section */}
                  <Grid
                    item
                    container
                    xs={8}
                    justify="flex-end"
                    // spacing={2}
                    // style={{ padding: 20 }}
                    // component={Paper}
                  >
                    {props.dialogProps.action}

                    <Grid item xs={8} align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          let invalid_flag = false
                          //   validate account type (existence)
                          if (createdUserDetails.AccountType.length < 2) {
                            setAccTypeHelperText('required')
                            invalid_flag = true
                          }

                          //   sponsor-specific checks
                          if (createdUserDetails.AccountType === 'Sponsor') {
                            // existence check
                            if (!createdUserDetails.Organization) {
                              setOrgHelperText('Required')
                              invalid_flag = true
                              //   uniquity checks
                            } else if (isNewOrganization === 'true') {
                              if (
                                set_of_taken_organizations_lc.has(
                                  createdUserDetails.Organization.toLowerCase(),
                                )
                              ) {
                                setOrgHelperText('must be unique')
                                invalid_flag = true
                              }
                            }
                          }

                          //   make sure username exists
                          if (!createdUserDetails.Username) {
                            setUnameHelperText('Required')
                            invalid_flag = true
                          } else {
                            //   make sure username is unique
                            if (
                              set_of_taken_usernames_lc.has(
                                createdUserDetails.Username.toLowerCase(),
                              )
                            ) {
                              setUnameHelperText('Must be unique')
                              invalid_flag = true
                            }

                            //   if the user is a sponsor profile, make sure their username is not an email
                            if (
                              createdUserDetails.AccountType === 'Sponsor' &&
                              isNewOrganization === 'false'
                            ) {
                              if (createdUserDetails.Username.includes('@')) {
                                setUnameHelperText(
                                  'Sponsor profiles must not use an email',
                                )
                                invalid_flag = true
                              }
                            }
                            // if the user is not a sponsor profile, make sure they have a valid email
                            else {
                              if (
                                !email_validator.validate(
                                  createdUserDetails.Username,
                                )
                              ) {
                                setUnameHelperText('Must be a valid email')
                                invalid_flag = true
                              }
                            }
                          }

                          // validate first name
                          if (!createdUserDetails.FirstName) {
                            setFnameHelperText('required')
                            invalid_flag = true
                          }

                          // validate last name
                          if (!createdUserDetails.LastName) {
                            setLnameHelperText('required')
                            invalid_flag = true
                          }

                          // validate last name
                          if (!createdUserDetails.LastName) {
                            setLnameHelperText('required')
                            invalid_flag = true
                          }

                          // validate bio
                          if (!createdUserDetails.Bio) {
                            setBioHelperText('required')
                            invalid_flag = true
                          }

                          if (invalid_flag) return

                          // update local state
                          let new_users = [...props.dialogProps.data.allUsers]
                          new_users.push({
                            Username: createdUserDetails.Username,
                            AccountStatus: 1,
                            AccountType: createdUserDetails.AccountType,
                            Bio: createdUserDetails.Bio,
                            FirstName: createdUserDetails.FirstName,
                            LastName: createdUserDetails.LastName,
                            Organization: createdUserDetails.Organization,
                            SignupDate: new Date(Date.now()).toISOString(),
                          })

                          props.dialogProps.dataSetters.setAllUsers(new_users)

                          //   create user table entry
                          let requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              Username: createdUserDetails.Username.replaceAll(
                                "'",
                                "''",
                              ),
                              AccountStatus: 1,
                              AccountType: createdUserDetails.AccountType,
                              Bio: createdUserDetails.Bio.replaceAll("'", "''"),
                              FirstName: createdUserDetails.FirstName.replaceAll(
                                "'",
                                "''",
                              ),
                              LastName: createdUserDetails.LastName.replaceAll(
                                "'",
                                "''",
                              ),
                              Organization: createdUserDetails.Organization
                                ? createdUserDetails.Organization.replaceAll(
                                    "'",
                                    "''",
                                  )
                                : null,
                            }),
                          }

                          fetch(apis.UserSignup, requestOptions).then(() => {
                            handleClose()
                          })

                          // create cognito identity
                          if (createdUserDetails.Username.includes('@')) {
                            let requestOptions = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                Username: createdUserDetails.Username.replaceAll(
                                  "'",
                                  "''",
                                ),
                              }),
                            }
                            fetch(apis.CreateCognitoIdentity, requestOptions)
                          }
                        }}
                      >
                        Create user
                      </Button>
                    </Grid>
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
