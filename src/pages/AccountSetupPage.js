/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { AppBar, Grid, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AccountSetupCard from '../Components/AccountSetupCard'
import { Auth } from 'aws-amplify'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import LoadingIcon from '../Components/LoadingIcon'

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

function AccountSetupPage() {
  const classes = useStyles()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // fetch the current user's email address
    Auth.currentAuthenticatedUser().then((user) => {
      setCurrentUser(user.attributes.email)
    })
  }, [])

  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar position="fixed">
        <Toolbar>
          <Grid container justify="space-evenly" spacing={10}>
            <Grid item>
              <Typography variant="h6">Set up your account</Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* page content (starts after first div) */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container justify="center">
          <Grid item container xs={8}>
            {currentUser ? (
              <AccountSetupCard accountEmail={currentUser} />
            ) : (
              <div>
                <Grid item xs={12}>
                  <br />
                </Grid>
                <Grid item xs={12}>
                  <LoadingIcon />
                </Grid>
              </div>
            )}
          </Grid>
        </Grid>
      </main>
    </div>
  )
}

export default AccountSetupPage
