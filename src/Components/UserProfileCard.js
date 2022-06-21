/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
import LoadingIcon from './LoadingIcon'

const UserProfileCard = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  let userDetails = props.userProfile

  useEffect(() => {
    setIsLoading(false)
  }, [])

  // component that shows the user's profile details
  function ProfileDetails() {
    return (
      <Grid container spacing={1} justify="center" direction="column">
        <Grid item align="center">
          <Typography>
            <Box fontWeight="fontWeightBold">
              {userDetails.FirstName} {userDetails.LastName}
            </Box>
          </Typography>
        </Grid>

        <Grid item xs align="center">
          {/* <br /> */}
        </Grid>

        <Grid item align="center">
          <Typography align="center">{userDetails.Bio}</Typography>
        </Grid>
        <Grid item xs align="center">
          <br />
        </Grid>
      </Grid>
    )
  }

  function LoadingFiller() {
    return (
      <Grid container spacing={1} justify="center" direction="column">
        <Grid item xs align="center">
          <br />
        </Grid>
        <Grid item xs align="center">
          <br />
        </Grid>
        <Grid item xs align="center">
          <LoadingIcon />
        </Grid>
        <Grid item xs align="center">
          <br />
        </Grid>
        <Grid item xs align="center">
          <br />
        </Grid>
        <Grid item xs align="center">
          <br />
        </Grid>
        <Grid item xs align="center">
          <br />
        </Grid>
      </Grid>
    )
  }

  return isLoading ? <LoadingFiller /> : <ProfileDetails />
}

export default UserProfileCard
