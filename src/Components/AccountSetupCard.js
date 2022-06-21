/* eslint-disable*/
import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { UserContext } from '../Helpers/UserContext'

import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core'
import apis from '../Helpers/api_endpoints'

const AccountSetupCard = (props) => {
  const userData = useContext(UserContext).user
  const setUserData = useContext(UserContext).setUser
  const isSponsorProfile = userData.Username.includes('@') ? false : true

  let history = useHistory()
  const [userDetails, setUserDetails] = useState({
    Username: userData.Username,
    FirstName: '',
    LastName: '',
    AccountType: '',
    AccountStatus: '',
    Bio: '',
  })

  const [accTypeHelperText, setAccTypeHelperText] = useState(null)
  const [fnameHelperText, setFnameHelperText] = useState(null)
  const [lnameHelperText, setLnameHelperText] = useState(null)
  const [bioHelperText, setBioHelperText] = useState(null)

  return (
    <Grid
      item
      container
      justify="center"
      direct="row"
      alignItems="center"
      spacing={2}
    >
      {!userData.Username.includes('@') ? null : (
        <Grid item container justify="center">
          {/* account type */}
          <Grid item xs={12} md={8} lg={6}>
            <InputLabel id="AccountTypeLabel">Account Type</InputLabel>
            <Select
              labelId="AccountTypeLabel"
              id="AccountType"
              fullWidth
              variant="filled"
              error={accTypeHelperText}
              helperText={accTypeHelperText}
              onChange={(event) => {
                setAccTypeHelperText(null)
                // update account type in state
                let newUserDetails = userDetails
                newUserDetails.AccountType = event.target.value
                setUserDetails(newUserDetails)
              }}
            >
              <MenuItem value="Driver">Driver</MenuItem>
              <MenuItem value="Sponsor">Sponsor</MenuItem>
            </Select>
          </Grid>
        </Grid>
      )}

      {/* name row */}
      <Grid
        item
        container
        xs={12}
        md={8}
        lg={6}
        spacing={1}
        justify="space-between"
        direction="row"
        // component={Paper}
      >
        {/* first name */}
        <Grid item xs={6}>
          <TextField
            id="FirstName"
            label="First name"
            fullWidth
            variant="filled"
            error={fnameHelperText}
            helperText={fnameHelperText}
            onChange={(event) => {
              setFnameHelperText(null)
              // update first name in state
              let newUserDetails = userDetails
              newUserDetails.FirstName = event.target.value
              setUserDetails(newUserDetails)
            }}
          />
        </Grid>

        {/* last name */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            variant="filled"
            id="LastName"
            label="Last name"
            align="right"
            error={lnameHelperText}
            helperText={lnameHelperText}
            onChange={(event) => {
              setLnameHelperText(null)
              // update last name in state
              let newUserDetails = userDetails
              newUserDetails.LastName = event.target.value
              setUserDetails(newUserDetails)
            }}
          />
        </Grid>
      </Grid>

      <Grid container></Grid>

      {/* bio */}
      <Grid item xs={12} md={8} lg={6} align="center">
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
            let newUserDetails = userDetails
            newUserDetails.Bio = event.target.value
            setUserDetails(newUserDetails)
          }}
        />
      </Grid>

      {/* submit button */}
      <Grid item container justify="center">
        <Grid item xs={12} md={8} lg={6} align="center">
          <br></br>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              // validate input
              let exit = false
              if (!userDetails.FirstName) {
                setFnameHelperText('Required')
                exit = true
              }
              if (!userDetails.LastName) {
                setLnameHelperText('Required')
                exit = true
              }
              if (!userDetails.AccountType && !userData.Organization) {
                setAccTypeHelperText('Required')
                exit = true
              }
              if (!userDetails.Bio) {
                setBioHelperText('Required')
                exit = true
              }
              if (exit) return

              setUserData({
                ...userData,
                Username: userDetails.Username,
                FirstName: userDetails.FirstName,
                LastName: userDetails.LastName,
                AccountType: !userData.Organization
                  ? userDetails.AccountType
                  : 'Sponsor',
                AccountStatus: 1,
                Bio: userDetails.Bio,
              })

              // save the profile information
              let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  Username: userDetails.Username.replaceAll("'", "''"),
                  FirstName: userDetails.FirstName.replaceAll("'", "''"),
                  LastName: userDetails.LastName.replaceAll("'", "''"),
                  AccountType: !userData.Organization
                    ? userDetails.AccountType
                    : 'Sponsor',
                  AccountStatus: 1,
                  Bio: userDetails.Bio.replaceAll("'", "''"),
                  IsInitialSignup: true,
                }),
              }
              fetch(apis.UserSignup, requestOptions).then(() => {
                // route user to appropriate page
                if (userDetails.AccountType === 'Driver') {
                  history.push('/application')
                } else if (
                  userDetails.AccountType === 'Sponsor' &&
                  !isSponsorProfile
                ) {
                  history.push('organization-setup')
                } else {
                  history.push('/')
                }
              })
            }}
          >
            Save account details
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AccountSetupCard
