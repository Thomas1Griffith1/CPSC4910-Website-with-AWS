import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import apis from '../Helpers/api_endpoints'

const CreateNewSponsorshipCard = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  // const [currentSponsorships, setCurrentSponsorships] = useState(null)
  const [validDriverChoices, setValidDriverChoices] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)

  // i'll spit out

  useEffect(() => {
    ;(async () => {
      // start loading animation
      setIsLoading(true)

      // get all of the active sponsor's drivers

      let sponsorships_response = await fetch(
        apis.GetDriverDataBySponsor + props.SponsorID,
      )
      let sponsorships_json = await sponsorships_response.json()
      let sponsorships_array = JSON.parse(sponsorships_json.body).map(
        (element) => {
          return element.Username.S
        },
      )

      // get all drivers, filter out any invalid entries (anyone not e adriver, inactive accounts, pre-existing sponsorships)

      let userdata_response = await fetch(apis.GetAllUserData)
      let userdata_json = await userdata_response.json()
      let userdata_array = userdata_json.body.Items

      let mock_data = userdata_array
      let user_data_formatted = mock_data
        .map((element) => {
          return {
            Username: element.Username.S,
            AccountStatus: parseInt(element.AccountStatus.N),
            Bio: element.Bio.S,
            Organization: element.Organization ? element.Organization.S : null,
            SignupDate: element.SignupDate.S,
            FirstName: element.FirstName.S,
            AccountType: element.AccountType.S,
            LastName: element.LastName.S,
            LastSignIn: element.LastSignIn ? element.LastSignIn.S : null,
          }
        })
        .filter(
          (element) =>
            element.AccountStatus === 1 &&
            element.AccountType === 'Driver' &&
            !sponsorships_array.find(
              (spons_element) => spons_element === element.Username,
            ),
        )
      setValidDriverChoices(user_data_formatted)
    })().then(() => {
      setIsLoading(false)
    })
  }, [props.SponsorID, props.updatePage.updateCount])

  return (
    <Grid item container component={Paper} style={{ padding: 20 }}>
      <Grid item xs={12}>
        <Typography variant="h6">Add new drivers</Typography>
      </Grid>

      <Grid item xs={12}>
        {/* <p>hello</p> */}
        Add new drivers to the sponsor.
      </Grid>

      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid
        item
        container
        xs={12}
        spacing={2}
        // justify="flex-"
        alignItems="center"
      >
        <Grid item xs={6}>
          <InputLabel id="AccountTypeLabel">Driver</InputLabel>
          <Select
            labelId="AccountTypeLabel"
            id="AccountType"
            fullWidth
            variant="filled"
            // error={accTypeHelperText}
            // helperText={accTypeHelperText}
            onChange={(event) => {
              // setAccTypeHelperText(null)
              // update account type in state
              // let newUserDetails = selectedDriver
              // newUserDetails.AccountType = event.target.value
              setSelectedDriver(event.target.value)
            }}
          >
            {validDriverChoices
              ? _.sortBy(validDriverChoices, ['Username', 'Name'], ['asc']).map(
                  (element) => {
                    return (
                      <MenuItem value={element.Username}>
                        {element.Username}: {element.FirstName}{' '}
                        {element.LastName}
                      </MenuItem>
                    )
                  },
                )
              : null}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  DriverID: selectedDriver,
                  SponsorID: props.SponsorID,
                  AppComments: 'CREATED BY ADMIN',
                  AppDecisionReason: 'ACCEPTED BY ADMIN',
                }),
              }
              fetch(apis.CreateNewSponsorship, requestOptions).then(() => {
                props.updatePage.setPageUpdate(props.updatePage.updateCount + 1)
              })
            }}
          >
            Register driver
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={12}></Grid>
    </Grid>
  )
}

export default CreateNewSponsorshipCard
