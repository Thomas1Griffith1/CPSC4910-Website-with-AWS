/* eslint-disable*/
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import { AppBar, Grid, Toolbar } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import LoadingIcon from './LoadingIcon'

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

const WaitingForApplicationAprovalScreen = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar position="fixed">
        <Toolbar>
          <Grid container justify="space-evenly" spacing={24}>
            <Grid item>
              <Typography variant="h6">
                Waiting for driver application approval
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* loading screen */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <LoadingIcon />
      </main>
    </div>
  )
}

export default WaitingForApplicationAprovalScreen
