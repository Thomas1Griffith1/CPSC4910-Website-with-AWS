/* eslint-disable*/
import { Auth } from 'aws-amplify'

export default async function getUserDetails(username) {
  let user_email = null
  if (username) {
    user_email = username
  } else {
    const user = await Auth.currentAuthenticatedUser()
    user_email = user.attributes.email
  }

  // get user's data
  let GET_USERDATA_URL = `https://esqgp2f0t8.execute-api.us-east-1.amazonaws.com/dev/getuserdetails?Username=${user_email}`
  const response = await fetch(GET_USERDATA_URL)
  const data = await response.json()
  let parsed_details = JSON.parse(data.body)

  let profile_details = parsed_details.Items[0]
    ? {
        Username: parsed_details.Items[0].Username.S,
        FirstName: parsed_details.Items[0].FirstName.S,
        LastName: parsed_details.Items[0].LastName.S,
        Bio: parsed_details.Items[0].Bio.S,
        AccountType: parsed_details.Items[0].AccountType.S,
        AccountStatus: parseInt(parsed_details.Items[0].AccountStatus.N),
        Organization: parsed_details.Items[0].Organization
          ? parsed_details.Items[0].Organization.S
          : null,
      }
    : {
        Username: user_email,
        FirstName: null,
        LastName: null,
        Bio: null,
        AccountType: null,
        AccountStatus: 0,
        Organization: '',
      }

  return profile_details
}
