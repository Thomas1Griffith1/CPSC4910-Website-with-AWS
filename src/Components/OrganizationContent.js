/* eslint-disable*/
import { Box, Grid, Paper, Typography } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Helpers/UserContext'
import LoadingIcon from './LoadingIcon'

function OrganizationInfoPanel(props) {
  useEffect(() => {
    ;(async () => {
      let sponsor_count = props.parentProps.orgProps.organizationUsers.reduce(
        (count, element) => {
          if (element.AccountStatus === 1 && element.AccountType === 'Sponsor')
            return count + 1
          else return count
        },
        0,
      )

      let driver_count = props.parentProps.orgProps.organizationUsers.reduce(
        (count, element) => {
          if (
            element.AccountStatus === 1 &&
            element.AccountType === 'Driver' &&
            element.Status === 2
          )
            return count + 1
          else return count
        },
        0,
      )

      let leader = props.parentProps.orgProps.organizationUsers.find(
        (element) => {
          return (
            element.Username.includes('@') && element.AccountType === 'Sponsor'
          )
        },
      )

      setSponsorCount(sponsor_count)
      setDriverCount(driver_count)
      setOrgLeader(leader.Username)
    })()
  })

  const userData = useContext(UserContext).user
  const [isLoading, setIsLoading] = useState(false)
  const [sponsorCount, setSponsorCount] = useState(null)
  const [driverCount, setDriverCount] = useState(null)
  const [orgLeader, setOrgLeader] = useState(null)

  if (isLoading) {
    return <LoadingIcon></LoadingIcon>
  } else {
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
          <Typography variant="h6">Organization info</Typography>
        </Grid>

        <Grid item xs={12}>
          <br />
        </Grid>

        {/* organization data */}
        <Grid
          item
          container
          xs={12}
          alignItems="center"
          spacing={1}
          justify="center"
        >
          <Grid item container xs={12} md={12} spacing={2}>
            <Grid item xs={6} align="right">
              <Typography>
                <Box fontWeight="fontWeightBold">Organization name:</Box>
              </Typography>
            </Grid>
            <Grid item xs={6} align="left">
              {userData.Organization}
            </Grid>
          </Grid>

          <Grid item container xs={12} md={12} spacing={2}>
            <Grid item xs={6} align="right">
              <Typography>
                <Box fontWeight="fontWeightBold">Leader:</Box>
              </Typography>
            </Grid>
            <Grid item xs={6} align="left">
              {orgLeader}
            </Grid>
          </Grid>

          <Grid item container xs={12} md={12} spacing={2}>
            <Grid item xs={6} align="right">
              <Typography>
                <Box fontWeight="fontWeightBold">Total sponsors:</Box>
              </Typography>
            </Grid>
            <Grid item xs={6} align="left">
              {sponsorCount}
            </Grid>
          </Grid>

          <Grid item container xs={12} md={12} spacing={2}>
            <Grid item xs={6} align="right">
              <Typography>
                <Box fontWeight="fontWeightBold">Total drivers:</Box>
              </Typography>
            </Grid>
            <Grid item xs={6} align="left">
              {driverCount}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default function OrganizationContent(props) {
  return (
    <Grid item xs={12} container justify="center">
      <Grid item xs={12}>
        <OrganizationInfoPanel parentProps={props} />
      </Grid>
    </Grid>
  )
}
