/* eslint-disable*/
import React, { useContext } from 'react'
import { AppBar, Grid, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DriverApplicationCard from '../Components/DriverApplicationCard'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import { UserContext } from '../Helpers/UserContext'
import TopAppBar from '../Components/TopAppBar'
import LeftDrawer from '../Components/LeftDrawer'

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

function ApplicationPage() {
  const classes = useStyles()
  const userData = useContext(UserContext).user

  function InitialAppBar() {
    return (
      <AppBar position="fixed">
        <Toolbar>
          <Grid container justify="space-evenly" spacing={10}>
            <Grid item>
              <Typography variant="h6">Apply to a sponsor</Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }

  function NormalAppBar() {
    return (
      <div>
        <TopAppBar pageTitle="Apply to a sponsor"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      {/* app bar */}

      {userData.AccountType === 0 ? <InitialAppBar /> : <NormalAppBar />}

      {/* page content (starts after first div) */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container justify="space-evenly">
          <Grid item>
            <DriverApplicationCard accountEmail={userData.Email_ID} />
          </Grid>
        </Grid>
      </main>
    </div>
  )
}

export default ApplicationPage
