/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import LoadingIcon from '../Components/LoadingIcon'
import { UserContext } from '../Helpers/UserContext'
import ProfileSelectionDialog from '../Components/ProfileSelectionDialog'
import { Auth } from 'aws-amplify'

// set up styling
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

function IndexPage() {
  const [isLoading, setIsLoading] = useState(true)
  const classes = useStyles()
  let history = useHistory()
  const userData = useContext(UserContext).user
  // const setUserData = useContext(UserContext).setUser
  const activeProfile = useContext(UserContext).activeProfile
  const setActiveProfile = useContext(UserContext).setActiveProfile

  const [pageUpdate, setPageUpdate] = useState(0)
  function fullPageUpdateState() {
    setPageUpdate(pageUpdate + 1)
  }

  const [
    profileSelectionDialogIsOpen,
    setProfileSelectionDialogIsOpen,
  ] = useState(false)
  function setProfileSelectionDialogIsOpenState(state, refresh) {
    setProfileSelectionDialogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  useEffect(() => {
    ;(async () => {
      // start loading animation
      setIsLoading(true)

      if (userData.AccountStatus === 0) {
        history.push('/account-setup')
      } else if (userData.AccountStatus === 2) {
        Auth.signOut()
      } else if (
        userData.AccountType === 'Sponsor' &&
        !userData.Organization &&
        !activeProfile
      ) {
        history.push('/organization-setup')
      } else if (
        userData.AccountType === 'Sponsor' &&
        userData.Organization &&
        !activeProfile
      ) {
        setProfileSelectionDialogIsOpenState(true)
      }
      setIsLoading(false)
    })()
  }, [])

  // show loading screen if data is still being fetched
  if (isLoading) {
    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <LoadingIcon />
        </main>
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Home"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />
        {userData.AccountType === 'Sponsor' ? (
          <ProfileSelectionDialog
            dialogProps={{
              profileSelectionDialogIsOpen: profileSelectionDialogIsOpen,
              setProfileSelectionDialogIsOpenState: setProfileSelectionDialogIsOpenState,
              fullPageUpdateState: fullPageUpdateState,
              activeProfile: activeProfile,
              setActiveProfile: setActiveProfile,
            }}
          />
        ) : null}

        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Typography paragraph>
            Welcome to Better Truckers. Click on a tab to use the app.
          </Typography>
        </main>
      </div>
    )
  }
}

export default IndexPage
