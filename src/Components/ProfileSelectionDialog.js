/* eslint-disable*/

import React, { useContext, useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import { Grid, Paper } from '@material-ui/core'
import getUserDetails from '../Helpers/CommonFunctions'
import { UserContext } from '../Helpers/UserContext'
import LoadingIcon from './LoadingIcon'
import apis from '../Helpers/api_endpoints'

export default function ProfileSelectionDialog(props) {
  const userData = useContext(UserContext).user
  const setUserData = useContext(UserContext).setUser

  const handleClose = () => {
    props.dialogProps.setProfileSelectionDialogIsOpenState(false)
  }

  const [sponsorsInOrganization, setSponsorsInOrganization] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      let org_sponsors_raw = await fetch(
        apis.GetOrgSponsors + userData.Organization.replace(' ', '%20'),
      )
      let org_sponsors_json = await org_sponsors_raw.json()
      let org_sponsors_parsed = JSON.parse(org_sponsors_json.body.toString())
      let org_sponsors_formatted = org_sponsors_parsed.Items.filter(
        (element) => parseInt(element.AccountStatus.N) < 2,
      ).map((element) => {
        return {
          Username: element.Username.S,
          Name: element.FirstName.S + ' ' + element.LastName.S,
        }
      })

      setSponsorsInOrganization(org_sponsors_formatted)
    })()
    setIsLoading(false)
  }, [])

  return (
    <div>
      <Dialog
        onClose={null}
        aria-labelledby="customized-dialog-title"
        open={props.dialogProps.profileSelectionDialogIsOpen}
        fullWidth
        maxWidth="md"
      >
        <Grid container style={{ padding: 20 }}>
          <Grid item xs={12} container justify="flex-start" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h5" id="alert-dialog-title">
                Log in to a profile
              </Typography>
            </Grid>
          </Grid>

          <Grid item align="center" xs={12}>
            <br />
          </Grid>

          {isLoading || !sponsorsInOrganization ? (
            <LoadingIcon />
          ) : (
            <Grid container justify="center" spacing={3}>
              {sponsorsInOrganization.map((element) => {
                return (
                  <Grid
                    key={element.Username}
                    item
                    container
                    spacing={2}
                    xs={4}
                    component={Paper}
                    style={{ cursor: 'pointer', margin: 10 }}
                    onClick={(event) => {
                      getUserDetails(element.Username).then((chosen_user) => {
                        setUserData(chosen_user)
                        props.dialogProps.setActiveProfile(chosen_user)
                        handleClose()
                      })
                    }}
                  >
                    {/* <Paper style={{ padding: 20, cursor: 'pointer' }}> */}
                    <Grid item align="center" xs={12}>
                      <br />
                    </Grid>
                    <Grid item align="center" xs={12}>
                      {element.Name}
                    </Grid>
                    <Grid item align="center" xs={12}>
                      {element.Username && element.Username.includes('@') ? (
                        <b>{element.Username}</b>
                      ) : (
                        element.Username
                      )}
                    </Grid>
                    <Grid item align="center" xs={12}>
                      <br />
                    </Grid>
                    {/* </Paper> */}
                  </Grid>
                )
              })}
            </Grid>
          )}

          <Grid item align="center" xs={12}>
            <br />
          </Grid>
        </Grid>
      </Dialog>
    </div>
  )
}
