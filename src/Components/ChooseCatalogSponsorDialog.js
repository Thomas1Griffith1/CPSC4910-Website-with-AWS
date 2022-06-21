/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import { Grid, Paper } from '@material-ui/core'
import { UserContext } from '../Helpers/UserContext'
import LoadingIcon from './LoadingIcon'
import apis from '../Helpers/api_endpoints'

export default function ChooseCatalogSponsorDialog(props) {
  const userData = useContext(UserContext).user

  const handleClose = () => {
    props.dialogProps.setDialogIsOpenState(false)
  }

  const [registeredSponsors, setRegisteredSponsors] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      let partnered_sponsors_response = await fetch(
        apis.GetSponsorshipDetails + '?DriverID=' + userData.Username,
      )
      let partnered_sponsors_data = await partnered_sponsors_response.json()
      let partnered_sponsors_array = await JSON.parse(
        partnered_sponsors_data.body.toString(),
      ).Items

      let active_sponsors_array = partnered_sponsors_array.filter(
        (element) =>
          parseInt(element.Status.N) === 2 &&
          parseInt(element.AccountStatus.N) === 1,
      )

      let active_sponsors_formatted = active_sponsors_array.map((element) => {
        return {
          SponsorID: element.SponsorID.S,
          SponsorName: element.FirstName.S + ' ' + element.LastName.S,
          Points: parseInt(element.Points.N),
          SponsorOrganization: element.Organization.S,
          PointToDollarRatio: parseFloat(element.PointDollarRatio.N),
        }
      })

      setRegisteredSponsors(active_sponsors_formatted)
    })()
    setIsLoading(false)
  }, [])

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.dialogProps.dialogIsOpen}
        fullWidth
        maxWidth="md"
      >
        <Grid container style={{ padding: 20 }}>
          <Grid item xs={12} container justify="flex-start" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h5" id="alert-dialog-title">
                Which sponsor's catalog do you want to view?
              </Typography>
            </Grid>
          </Grid>

          <Grid item align="center" xs={12}>
            <br />
          </Grid>

          {isLoading || !registeredSponsors ? (
            <LoadingIcon />
          ) : (
            <Grid container justify="center" spacing={3}>
              {registeredSponsors.length > 0 ? (
                registeredSponsors.map((element) => {
                  return (
                    <Grid
                      key={element.SponsorID}
                      item
                      container
                      spacing={2}
                      xs={4}
                      component={Paper}
                      style={{ cursor: 'pointer', margin: 10 }}
                      onClick={(event) => {
                        props.dialogProps.setActiveSponsor({
                          ...element,
                        })

                        handleClose()
                      }}
                    >
                      {/* <Paper style={{ padding: 20, cursor: 'pointer' }}> */}
                      <Grid item align="center" xs={12}>
                        <br />
                      </Grid>
                      <Grid item align="center" xs={12}>
                        {element.SponsorID}
                      </Grid>
                      <Grid item align="center" xs={12}>
                        {element.SponsorName}
                      </Grid>
                      <Grid item align="center" xs={12}>
                        {element.SponsorOrganization}
                      </Grid>

                      <Grid item align="center" xs={12}>
                        {element.Points} points
                      </Grid>
                      <Grid item align="center" xs={12}>
                        <br />
                      </Grid>
                      {/* </Paper> */}
                    </Grid>
                  )
                })
              ) : (
                <p>You are not currently registered to any sponsors</p>
              )}
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
