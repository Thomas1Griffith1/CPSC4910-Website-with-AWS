const { Grid, Paper, Typography, Button } = require('@material-ui/core')
const { useEffect } = require('react')
const { default: GenericTable } = require('../Components/GenericTable')
const [allUsers, setAllUsers] = useState(null)

let func = () => {
  let setAllUserState = (state) => {
    setAllUsers(state)
  }

  const [selectedUser, setSelectedUser] = useState(null)
  let setSelectedUserState = (state) => {
    setSelectedUser(state)
  }

  const [userDialogIsOpen, setUserDialogIsOpen] = useState(null)
  let setUserDialogIsOpenState = (state) => {
    setUserDialogIsOpen(state)
  }
  useEffect(() => {
    ;(async () => {
      // start loading animation
      setIsLoading(true)

      let mock_data = [
        {
          Username: {
            S: 'demo_driver_8@gmail.com',
          },
          AccountStatus: {
            N: '1',
          },
          Bio: {
            S:
              'Amateur social media nerd. Web enthusiast. Avid zombie geek. Certified pop cultureaholic.',
          },
          Sponsors: {
            L: [],
          },
          Organization: {
            S: '',
          },
          SignupDate: {
            S: '2021-03-10T02:15:05.245Z',
          },
          FirstName: {
            S: 'Beth',
          },
          LastSignin: {
            S: '',
          },
          LastName: {
            S: 'Contreras',
          },
          AccountType: {
            S: 'Driver',
          },
        },
        {
          Username: {
            S: 'sponsor_profile_jtblack_2',
          },
          AccountStatus: {
            N: '1',
          },
          Bio: {
            S: 'I also work under jeff.',
          },
          Organization: {
            S: 'the autobots',
          },
          Sponsors: {
            L: [],
          },
          SignupDate: {
            S: '2021-03-17 19:28:47.381974',
          },
          FirstName: {
            S: 'Mickey',
          },
          AccountType: {
            S: 'Sponsor',
          },
          LastName: {
            S: 'Mouse',
          },
          LastSignin: {
            S: '',
          },
        },
        {
          Username: {
            S: 'sponsor_profile_demo_1',
          },
          AccountStatus: {
            N: '2',
          },
          Bio: {
            S: 'o-o',
          },
          Organization: {
            S: 'Alamo Delivery',
          },
          Sponsors: {
            L: [],
          },
          SignupDate: {
            S: '2021-03-17 19:28:47.381974',
          },
          FirstName: {
            S: 'Cool',
          },
          AccountType: {
            S: 'Sponsor',
          },
          LastName: {
            S: 'Guy',
          },
          LastSignin: {
            S: '',
          },
        },
        {
          Username: {
            S: 'realspeedydrivers@gmail.com',
          },
          AccountStatus: {
            N: '1',
          },
          Bio: {
            S: "We'll get it there fast. No other promises.",
          },
          Organization: {
            S: '2fast',
          },
          Sponsors: {
            L: [],
          },
          SignupDate: {
            S: '2021-03-06 01:10:47.381974',
          },
          FirstName: {
            S: 'Commercial',
          },
          AccountType: {
            S: 'Sponsor',
          },
          LastName: {
            S: 'Guy',
          },
          LastSignin: {
            S: '',
          },
        },
        {
          Username: {
            S: 'macky863@gmail.com',
          },
          AccountStatus: {
            N: '1',
          },
          Bio: {
            S: 'testing',
          },
          Organization: {
            S: '',
          },
          Sponsors: {
            L: [],
          },
          SignupDate: {
            S: '2021-04-05T15:28:29.258Z',
          },
          FirstName: {
            S: 'Millon',
          },
          AccountType: {
            S: 'Driver',
          },
          LastName: {
            S: 'McLendon',
          },
          LastSignin: {
            S: '',
          },
        },
        {
          Username: {
            S: 'reyare2719@yncyjs.com',
          },
          AccountStatus: {
            N: '1',
          },
          Bio: {
            S: 'Cool bio',
          },
          Organization: {
            S: '',
          },
          Sponsors: {
            L: [],
          },
          SignupDate: {
            S: '2021-04-06T12:50:42.656Z',
          },
          FirstName: {
            S: 'Jeff',
          },
          AccountType: {
            S: 'Driver',
          },
          LastName: {
            S: 'Black',
          },
          LastSignin: {
            S: '',
          },
        },
      ]

      let user_data_formatted = mock_data.map((element) => {
        return {
          Username: element.Username.S,
          AccountStatus: parseInt(element.AccountStatus.N),
          Bio: element.Bio.S,
          Organization: element.Organization.S,
          SignupDate: element.SignupDate.S,
          FirstName: element.FirstName.S,
          AccountType: element.AccountType.S,
          LastName: element.LastName.S,
          //   LastSignIn: element.LastSignIn.S,
        }
      })

      setAllUsers(user_data_formatted)
      setIsLoading(false)
    })()
  }, [])

  // active users
  let activeUsersHeadCells = [
    {
      id: 'Username',
      label: 'Username',
      isDate: false,
      width: 50,
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
      isDate: false,
      width: 50,
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
            SignupDate: element.SignupDate,
          }
        })
    : null
  return (
    <Grid
      item
      xs={10}
      xl={6}
      container
      component={Paper}
      justify="center"
      style={{ padding: 20 }}
    >
      <Grid item xs={12} container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6">Active users</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          Accounts that are active (i.e., account created and not deleted or
          banned). Click on a user to view more information.
        </Typography>
      </Grid>

      <Grid item xs={12} align="right">
        <Button variant="contained" color="primary">
          {' '}
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
  )
}
