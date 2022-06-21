/* eslint-disable*/
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import { AppBar, Grid, Paper, Toolbar, Typography } from '@material-ui/core'
import OrganizationSetupCard from '../Components/OrganizationSetupCard'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const OrganizationSetupPage = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {/* layout stuff */}
      {/* app bar */}
      <AppBar position="fixed">
        <Toolbar>
          <Grid container justify="space-evenly" spacing={10}>
            <Grid item>
              <Typography variant="h6">Set up your organization</Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* page content (starts after first div) */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container justify="center">
          <Grid item container xs={4} component={Paper} justify="center">
            <Grid item xs={12} align="center">
              <br />
            </Grid>
            <Grid item xs={10} align="center">
              <OrganizationSetupCard />
            </Grid>
            <Grid item xs={12} align="center">
              <br />
            </Grid>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}

export default OrganizationSetupPage
