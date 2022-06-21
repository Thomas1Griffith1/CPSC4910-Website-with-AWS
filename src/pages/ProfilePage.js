/* eslint-disable*/
import React, { useState, useContext } from 'react'
import { UserContext } from '../Helpers/UserContext'
import { makeStyles } from '@material-ui/core/styles'

import TopAppBar from '../Components/TopAppBar'
import UserProfileCard from '../Components/UserProfileCard'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import LeftDrawer from '../Components/LeftDrawer'
import { Button, Grid, Paper, Typography } from '@material-ui/core'
import EditAccountCard from '../Components/EditAccountCard'
import LoadingIcon from '../Components/LoadingIcon'
import Amplify from 'aws-amplify'
import aws_exports from '../aws-exports'
import apis from '../Helpers/api_endpoints'

Amplify.configure(aws_exports)

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
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

function ProfilePageContent(props) {
  const classes = useStyles()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newData, setNewData] = useState({
    Username: props.userProfile.Username,
    FirstName: props.userProfile.FirstName,
    LastName: props.userProfile.LastName,
    Bio: props.userProfile.Bio,
    AccountType: props.userProfile.AccountType,
    // SponsorEmailID: 'need to retrieve this',
    // TotalPoints: 'need to retrieve this',
    // ProfilePicture: 'need to retrieve this',
  })
  function setNewDataState(state) {
    setNewData(state)
  }

  if (!isEditing) {
    return (
      <Grid container direction="row" xs={12} justify="center">
        <Grid
          item
          container
          direction="column"
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={3}
        >
          <Paper className={classes.paper}>
            <Grid item container justify="flex-end">
              {/* edit button */}
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setIsEditing(!isEditing)
                }}
              >
                <Typography>Edit</Typography>
              </Button>
            </Grid>

            <Grid item>
              <UserProfileCard userProfile={props.userProfile} />
            </Grid>

            <Grid item>
              <br />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  } else {
    return (
      <div className={classes.root}>
        <Grid container justify="center">
          <Grid item container xs={12} sm={8} md={6} lg={4} xl={3}>
            <Paper className={classes.paper}>
              <Grid container justify="flex-end">
                {/* cancel button */}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    ;(async () => {
                      setNewData({
                        Username: props.userProfile.Username,
                        FirstName: props.userProfile.FirstName,
                        LastName: props.userProfile.LastName,
                        Bio: props.userProfile.Bio,
                        AccountType: props.userProfile.AccountType,
                      })
                      setIsEditing(!isEditing)
                    })()
                  }}
                >
                  <Typography>Cancel</Typography>
                </Button>

                {/* submit button */}
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    setIsLoading(true)
                    ;(async () => {
                      // save the profile information
                      props.setProfileState({
                        Username: newData.Username,
                        FirstName: newData.FirstName,
                        LastName: newData.LastName,
                        Bio: newData.Bio,
                        AccountType: newData.AccountType,
                        Organization: props.userProfile.Organization
                          ? props.userProfile.Organization
                          : ' ',
                      })

                      let requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          Username: newData.Username.replaceAll("'", "''"),
                          FirstName: newData.FirstName.replaceAll("'", "''"),
                          LastName: newData.LastName.replaceAll("'", "''"),
                          Bio: newData.Bio.replaceAll("'", "''"),
                          AccountType: newData.AccountType,
                        }),
                      }
                      fetch(apis.ChangeUserInfo, requestOptions).then(() => {
                        setIsLoading(false)
                        setIsEditing(!isEditing)
                      })
                    })()
                  }}
                >
                  <Typography>Save</Typography>
                </Button>
              </Grid>
              <br></br>

              {/* account info form */}
              <Grid item>
                <EditAccountCard
                  userProfile={newData}
                  setNewDataState={setNewDataState}
                />
              </Grid>

              <br></br>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

function ProfilePage() {
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(false)
  const userData = useContext(UserContext).user
  const setUserData = useContext(UserContext).setUser

  function setProfileState(state) {
    setUserData(state)
  }

  return (
    <div className={classes.root}>
      {/* layout stuff */}
      <LeftDrawer AccountType={userData.AccountType} />
      <TopAppBar pageTitle="Your profile" />

      {/* content (starts after first div) */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {isLoading ? (
          <LoadingIcon />
        ) : (
          <ProfilePageContent
            userProfile={userData}
            setProfileState={setProfileState}
          />
        )}
      </main>
    </div>
  )
}

export default ProfilePage
