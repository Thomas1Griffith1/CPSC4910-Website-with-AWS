/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import Typography from '@material-ui/core/Typography'
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import LoadingIcon from '../Components/LoadingIcon'
import { UserContext } from '../Helpers/UserContext'
import getUserDetails from '../Helpers/CommonFunctions'
import { Button, Grid, Paper } from '@material-ui/core'
import GenericTable from '../Components/GenericTable'
import UserProfileDialog from '../Components/UserProfileDialog'
import AddUserDialog from '../Components/AddUserDialog/AddUserDialog'
import apis from '../Helpers/api_endpoints'

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

export default function UserManagementPage() {
  const classes = useStyles()
  const userData = useContext(UserContext).user

  const [isLoading, setIsLoading] = useState(true)
  const [pageUpdate, setPageUpdate] = useState(0)
  function fullPageUpdateState() {
    setPageUpdate(pageUpdate + 1)
  }

  const [allUsers, setAllUsers] = useState(null)
  let setAllUserState = (state) => {
    setAllUsers(state)
  }

  const [selectedUser, setSelectedUser] = useState(null)
  let setSelectedUserState = (state) => {
    setSelectedUser(state)
  }

  const [userDialogIsOpen, setUserDialogIsOpen] = useState(false)
  let setUserDialogIsOpenState = (state) => {
    setUserDialogIsOpen(state)
  }

  const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(null)
  let setAddUserDialogIsOpenState = (state) => {
    setAddUserDialogIsOpen(state)
  }

  useEffect(() => {
    ;(async () => {
      // start loading animation
      setIsLoading(true)

      let userdata_response = await fetch(apis.GetAllUserData)
      let userdata_json = await userdata_response.json()
      let userdata_array = userdata_json.body.Items

      let mock_data = userdata_array

      let user_data_formatted = mock_data.map((element) => {
        return {
          Username: element.Username.S,
          AccountStatus: element.AccountStatus
            ? parseInt(element.AccountStatus.N)
            : 5,
          Bio: element.Bio.S,
          Organization: element.Organization ? element.Organization.S : null,
          SignupDate: element.SignupDate.S,
          FirstName: element.FirstName.S,
          AccountType: element.AccountType.S,
          LastName: element.LastName.S,
          //   LastSignIn: element.LastSignIn.S,
        }
      })

      setAllUsers(user_data_formatted)
    })().then(() => {
      setIsLoading(false)
    })
  }, [])

  // active users
  let activeUsersHeadCells = [
    {
      id: 'Username',
      label: 'Username',
      isDate: false,
      width: 100,
    },
    {
      id: 'FirstName',
      label: 'First name',
      isDate: false,
      width: 50,
    },
    {
      id: 'LastName',
      label: 'Last name',
      isDate: false,
      width: 50,
    },
    {
      id: 'AccType',
      label: 'Role',
      isDate: false,
      width: 50,
    },
    {
      id: 'SignupDate',
      label: 'Member since',
      isDate: true,
      width: 200,
    },
  ]
  let activeUsersTableData = allUsers
    ? allUsers
        .filter((element) => element.AccountStatus === 1)
        .map((element) => {
          return {
            Username: element.Username,
            FirstName: element.FirstName,
            LastName: element.LastName,
            AccType: element.AccountType,
            SignupDate: element.SignupDate.replace(' ', 'T').split('.')[0],
          }
        })
    : null

  // inactive users
  let inactiveUsersHeadCells = [
    {
      id: 'Username',
      label: 'Username',
      isDate: false,
      width: 100,
    },
    {
      id: 'FirstName',
      label: 'First name',
      isDate: false,
      width: 50,
    },
    {
      id: 'LastName',
      label: 'Last name',
      isDate: false,
      width: 50,
    },
    {
      id: 'AccType',
      label: 'Role',
      isDate: false,
      width: 50,
    },
    {
      id: 'AccStatus',
      label: 'Account status',
      isDate: false,
      width: 150,
    },
    // {
    //   id: 'InactiveDate',
    //   label: 'Inactive since',
    //   isDate: false,
    //   width: 50,
    // },
  ]
  let inactiveUsersTableData = allUsers
    ? allUsers
        .filter((element) => element.AccountStatus != 1)
        .map((element) => {
          return {
            Username: element.Username,
            FirstName: element.FirstName,
            LastName: element.LastName,
            AccType: element.AccountType,
            AccStatus:
              element.AccountStatus === 2
                ? 'Deleted'
                : element.AccountStatus === 0
                ? 'Pending setup'
                : element.AccountStatus,
            // SignupDate: element.SignupDate,
          }
        })
    : null

  // show loading screen if data is still being fetched
  if (isLoading) {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Users"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Grid container justify="center">
            <Grid item xs={12}>
              <LoadingIcon />
            </Grid>
          </Grid>
        </main>
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Users"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />
        <AddUserDialog
          dialogProps={{
            dialogIsOpen: addUserDialogIsOpen,
            setDialogIsOpen: setAddUserDialogIsOpenState,
            data: {
              allUsers: allUsers,
            },
            dataSetters: {
              setAllUsers: setAllUserState,
            },
          }}
        />

        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {!isLoading ? (
            <Grid
              container
              justify="flex-start"
              alignContent="center"
              direction="row"
              spacing={4}
            >
              {selectedUser ? (
                <UserProfileDialog
                  dialogProps={{
                    dialogIsOpen: userDialogIsOpen,
                    setDialogIsOpen: setUserDialogIsOpenState,
                    allUsers: allUsers,
                    selectedUser: selectedUser,
                    setAllUserData: setAllUserState,
                    action: !selectedUser.AccStatus ? (
                      <Grid item>
                        <Button
                          variant="contained"
                          style={{
                            color: 'white',
                            backgroundColor: '#444444',
                          }}
                          onClick={() => {
                            // update local state
                            let new_users = allUsers.map((element) => {
                              if (element.Username === selectedUser.Username) {
                                return {
                                  ...element,
                                  AccountStatus: 2,
                                }
                              } else {
                                return element
                              }
                            })
                            setAllUsers(new_users)

                            // update user profile in database
                            let UPDATE_PROFILE_URL = `https://u902s79wa3.execute-api.us-east-1.amazonaws.com/dev/saveuserdetails`
                            let requestOptions = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                Username: selectedUser.Username.replaceAll(
                                  "'",
                                  "''",
                                ),
                                AccountStatus: 2,
                              }),
                            }
                            fetch(UPDATE_PROFILE_URL, requestOptions).then(
                              () => {
                                setUserDialogIsOpen(false)
                              },
                            )
                          }}
                        >
                          delete user
                        </Button>
                      </Grid>
                    ) : selectedUser.AccStatus === 'Deleted' ? (
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            // update local state
                            let new_users = allUsers.map((element) => {
                              if (element.Username === selectedUser.Username) {
                                return {
                                  ...element,
                                  AccountStatus: 1,
                                }
                              } else {
                                return element
                              }
                            })
                            setAllUsers(new_users)

                            // update user profile in database
                            let UPDATE_PROFILE_URL = `https://u902s79wa3.execute-api.us-east-1.amazonaws.com/dev/saveuserdetails`
                            let requestOptions = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                Username: selectedUser.Username.replaceAll(
                                  "'",
                                  "''",
                                ),
                                AccountStatus: 1,
                              }),
                            }
                            fetch(UPDATE_PROFILE_URL, requestOptions).then(
                              () => {
                                setUserDialogIsOpen(false)
                              },
                            )
                          }}
                        >
                          Reinstate user
                        </Button>
                      </Grid>
                    ) : null,
                  }}
                />
              ) : null}

              {/* active users table */}
              <Grid
                item
                xs={10}
                xl={6}
                container
                component={Paper}
                justify="center"
                style={{ padding: 20 }}
              >
                <Grid
                  item
                  xs={12}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="h6">Active users</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Accounts that are active (i.e., account created and not
                    deleted or banned). Click on a user to view more
                    information.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <br />
                </Grid>
                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setAddUserDialogIsOpen(true)
                    }}
                  >
                    Add user
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <br></br>
                </Grid>

                <Grid item xs={12} component={Paper}>
                  <GenericTable
                    headCells={activeUsersHeadCells}
                    data={activeUsersTableData}
                    allData={allUsers}
                    setDataState={setAllUserState}
                    tableKey="Username"
                    showKey={true}
                    initialSortedColumn="SignupDate"
                    initialSortedDirection="desc"
                    selectedRow={selectedUser}
                    setSelectedRow={setSelectedUserState}
                    dialogIsOpen={userDialogIsOpen}
                    setDialogIsOpenState={setUserDialogIsOpenState}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <br />
              </Grid>

              <Grid
                item
                xs={10}
                xl={6}
                container
                justify="center"
                component={Paper}
                style={{ padding: 20 }}
              >
                <Grid
                  item
                  xs={12}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="h6">Inactive users</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Users that have not set up their account or have had their
                    account deleted.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <br />
                </Grid>

                <Grid item xs={12} component={Paper}>
                  <GenericTable
                    headCells={inactiveUsersHeadCells}
                    data={inactiveUsersTableData}
                    allData={allUsers}
                    setDataState={setAllUserState}
                    tableKey="Username"
                    showKey={true}
                    initialSortedColumn="LastName"
                    initialSortedDirection="asc"
                    selectedRow={selectedUser}
                    setSelectedRow={setSelectedUserState}
                    dialogIsOpen={userDialogIsOpen}
                    setDialogIsOpenState={setUserDialogIsOpenState}
                  />
                </Grid>

                {/* </Paper> */}
              </Grid>
            </Grid>
          ) : (
            <LoadingIcon />
          )}
        </main>
      </div>
    )
  }
}
