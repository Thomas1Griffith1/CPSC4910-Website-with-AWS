/* eslint-disable*/
import email_validator from 'email-validator'
//import { Auth } from "aws-amplify";

import {
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { useState } from 'react'

import { useHistory } from 'react-router-dom'

function AdminDelUser() {
  let userDetailObj = {
    Email_ID: '',
    IsSuspended: '',
    AdminNotes: '',
  }
  const [userDetails, setUserDetails] = useState(userDetailObj)

  let history = useHistory()

  return (
    <div>
      <form>
        <TextField
          id="Email_ID"
          label="Email"
          onChange={(event) => {
            // update first name in state
            let newUserDetails = userDetails
            newUserDetails.Email_ID = event.target.value
            setUserDetails(newUserDetails)
          }}
        />
        <br />
        <TextField
          id="IsSuspended"
          label="true or false"
          onChange={(event) => {
            // update last name in state
            let newUserDetails = userDetails
            newUserDetails.IsSuspended = event.target.value
            setUserDetails(newUserDetails)
          }}
        />
        <br />
        <TextField
          id="AdminNotes"
          label="AdminNotes"
          onChange={(event) => {
            // update email in state
            let newUserDetails = userDetails
            newUserDetails.AdminNotes = event.target.value
            setUserDetails(newUserDetails)
          }}
        />

        <br />
        <br />
        <Button
          variant="outlined"
          onClick={() => {
            // set up fetch request -> create new user entry in driver detail database
            let CREATE_USER_URL =
              'https://70z2mvkobk.execute-api.us-east-1.amazonaws.com/dev/savechanges'
            let requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                Email_id: userDetails.Email_ID.replaceAll("'", "''"),
                IsSuspended: userDetails.IsSuspended.replaceAll("'", "''"),
                AdminNotes: userDetails.AdminNotes.replaceAll("'", "''"),
              }),
            }
          }}
        >
          Submit
        </Button>
      </form>
      <br />
    </div>
  )
}

export default AdminDelUser
