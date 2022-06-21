/* eslint-disable*/
import { CircularProgress, Grid } from '@material-ui/core'
import React from 'react'

const LoadingIcon = () => {
  return (
    <Grid container justify="center">
      <Grid item align="center">
        <CircularProgress></CircularProgress>
      </Grid>
    </Grid>
  )
}

export default LoadingIcon
