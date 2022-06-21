/* eslint-disable*/
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { UserContext } from '../Helpers/UserContext'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import { Typography } from '@material-ui/core'

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

function PageNotFoundPage() {
  const classes = useStyles()
  const userData = useContext(UserContext).user

  return (
    <div className={classes.root}>
      {/* layout stuff */}
      <TopAppBar pageTitle="Non-existant page"></TopAppBar>
      <LeftDrawer AccountType={userData.AccountType} />

      {/* page content (starts after first div) */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph>Nothing here :(</Typography>
      </main>
    </div>
  )
}

export default PageNotFoundPage
