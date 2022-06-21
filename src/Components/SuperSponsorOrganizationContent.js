/* eslint-disable*/
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import { toLower } from 'lodash'
import { useContext, useState } from 'react'
import apis from '../Helpers/api_endpoints'
import { UserContext } from '../Helpers/UserContext'
import LoadingIcon from './LoadingIcon'
import OrganizationSponsorManagementPanel from './OrganizationSponsorManagementPanel'

function RenameOrganizationPanel(props) {
  const userData = useContext(UserContext).user
  const setUserData = useContext(UserContext).setUser
  const setActiveProfile = useContext(UserContext).setActiveProfile

  const [organizationName, setOrganizationName] = useState(
    userData.Organization,
  )
  const [organizationNameHelperText, setOrganizationNameHelperText] = useState(
    null,
  )

  return (
    // header
    <Grid
      item
      container
      justify="space-between"
      xs={12}
      component={Paper}
      style={{ padding: 20 }}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Rename your organization</Typography>
      </Grid>
      {/* <Grid item xs={6} align="right">
          <Typography>(only super sponsors should see this panel)</Typography>
        </Grid> */}
      <Grid item xs={12}>
        <Typography>
          Change the name of your organization. Changes affect all of your
          sponsors.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <br />
      </Grid>

      {/* organization name form */}
      <Grid item container xs={12} alignItems="center" spacing={2}>
        <Grid item xs={7} md={5}>
          <TextField
            fullWidth
            variant="filled"
            size="small"
            label="Organization name"
            error={organizationNameHelperText}
            defaultValue={organizationName}
            helperText={organizationNameHelperText}
            onChange={(event) => {
              setOrganizationNameHelperText(null)
              setOrganizationName(event.target.value)
            }}
          ></TextField>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              //   get list of sponsors
              fetch(apis.GetAllSponsorData)
                .then((response) => response.json())
                .then((data) => {
                  let clean_sonsor_list = []
                  let sponsor_array = JSON.parse(data.body.toString()).Items
                  sponsor_array.forEach((val) => {
                    clean_sonsor_list.push(toLower(val.Organization.S))
                  })

                  if (!organizationName) {
                    setOrganizationNameHelperText('Required')
                    return
                  }

                  if (clean_sonsor_list.includes(toLower(organizationName))) {
                    setOrganizationNameHelperText('Must be unique')
                    return
                  }

                  let requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      Org: userData.Organization.replaceAll("'", "''"),
                      NewOrgName: organizationName.replaceAll("'", "''"),
                    }),
                  }
                  fetch(apis.UpdateOrgName, requestOptions).then(() => {
                    // window.location.reload()
                  })
                  setUserData({ ...userData, Organization: organizationName })
                  setActiveProfile({
                    ...userData,
                    Organization: organizationName,
                  })
                })
            }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default function SuperSponsorContent(props) {
  if (!props.orgProps.organizationUsers[0]) {
    return null
  } else {
    return (
      <Grid item xs={12} container justify="center">
        <Grid item xs={12}>
          <RenameOrganizationPanel />
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>

        <Grid item container justify="center" xs={12}>
          <OrganizationSponsorManagementPanel parentProps={props} />
        </Grid>
      </Grid>
    )
  }
}
