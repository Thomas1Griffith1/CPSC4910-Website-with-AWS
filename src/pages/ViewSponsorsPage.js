/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import { Button, Grid, Paper, Typography } from '@material-ui/core'
import { UserContext } from '../Helpers/UserContext'
import LoadingIcon from '../Components/LoadingIcon'
import GenericTable from '../Components/GenericTable'
import { useHistory } from 'react-router'
import ViewSponsorAsDriverDialog from '../Components/ViewSponsorAsDriverDialog'
import apis from '../Helpers/api_endpoints'

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

let table2HeadCells = [
  {
    id: 'Organization',
    label: 'Organization',
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
    id: 'ApplicationDate',
    label: 'Submitted on',
    isDate: false,
    width: 200,
  },
]

const ViewSponsorsPage = () => {
  const classes = useStyles()
  let history = useHistory()

  const userData = useContext(UserContext).user
  const [isLoading, setIsLoading] = useState(true)
  const [pageUpdate, setPageUpdate] = useState(0)

  // dialog control
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  function setDialogIsOpenState(state, refresh) {
    setDialogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  const [table1HeadCells, setTable1HeadCells] = useState(null)

  const [table1Data, setTable1Data] = useState(null)
  function setTable1DataState(state) {
    setTable1Data(state)
  }

  const [table2Data, setTable2Data] = useState(null)
  function setTable2DataState(state) {
    setTable2Data(state)
  }

  const [selectedEntry, setSelectedEntry] = useState(null)
  function setSelectedEntryState(state) {
    setSelectedEntry(state)
  }

  const [allSponsorshipsData, setAllSponsorshipsData] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      // get the sponsors that the driver is partnered to
      let partnered_sponsors_response = await fetch(
        apis.GetSponsorshipDetails + '?DriverID=' + userData.Username,
      )
      let partnered_sponsors_data = await partnered_sponsors_response.json()
      let partnered_sponsors_array = JSON.parse(
        partnered_sponsors_data.body.toString(),
      ).Items

      let partnered_sponsors_formatted = partnered_sponsors_array
        .map((element) => {
          return {
            SponsorshipID: element.SponsorshipID.S,
            SponsorID: element.SponsorID.S,
            DriverID: element.DriverID.S,
            AppDecisionDate: element.AppDecisionDate.S,
            Points: parseInt(element.Points.N),
            PointDollarRatio: parseFloat(element.PointDollarRatio.N),
            FirstName: element.FirstName.S,
            LastName: element.LastName.S,
            Organization: element.Organization.S,
            Status: parseInt(element.Status.N),
            SponsorStatus: parseInt(element.AccountStatus.N),
            AppSubmissionDate: element.AppSubmissionDate.S,
            AppComments: element.AppComments.S,
            AppDecisionReason: element.AppDecisionReason.S,
            Bio: element.Bio.S,
          }
        })
        .filter((element) => element.SponsorStatus === 1)

      let active_sponsors_data = partnered_sponsors_formatted.filter(
        (element) => element.Status === 2,
      )

      let active_sponsors_table_data = active_sponsors_data
        .filter((element) => element)
        .map((element) => {
          return {
            SponsorID: element.SponsorID,
            Organization: element.Organization,
            FirstName: element.FirstName,
            LastName: element.LastName,
            TotalPoints: parseInt(element.Points),
            StartDate: element.AppDecisionDate,
          }
        })

      let applied_sponsors_data = partnered_sponsors_formatted
        .filter((element) => element.Status === 0)
        .map((element) => {
          return {
            SponsorID: element.SponsorID,
            Organization: element.Organization,
            FirstName: element.FirstName,
            LastName: element.LastName,
            AppSubmissionDate: element.AppSubmissionDate,
          }
        })

      let applied_sponsors_table_data = applied_sponsors_data
        .filter((element) => element)
        .map((element) => {
          return {
            SponsorID: element.SponsorID,
            Organization: element.Organization,
            FirstName: element.FirstName,
            LastName: element.LastName,
            StartDate: element.AppSubmissionDate,
          }
        })

      setTable1Data(active_sponsors_table_data)
      setTable2Data(applied_sponsors_table_data)
      setAllSponsorshipsData(partnered_sponsors_formatted)
    })().then(() => {
      setIsLoading(false)
    })

    setTable1HeadCells([
      {
        id: 'Organization',
        label: 'Organization',
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
        id: 'TotalPoints',
        label: 'Total Points',
        isDate: false,
        width: 50,
      },
      {
        id: 'StartDate',
        label: 'Sponsored since',
        isDate: true,
        width: 150,
      },
    ])
  }, [pageUpdate])

  if (!isLoading) {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Sponsors"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />

        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />

          {allSponsorshipsData && selectedEntry ? (
            <ViewSponsorAsDriverDialog
              dialogProps={{
                dialogIsOpen: dialogIsOpen,
                setDialogIsOpen: setDialogIsOpenState,
                selectedEntry: selectedEntry,
                allSponsorshipsData: allSponsorshipsData,
              }}
            />
          ) : null}

          <Grid
            container
            justify="flex-start"
            alignContent="center"
            direction="row"
            spacing={4}
          >
            <Grid item xs={10} xl={6}>
              <Paper>
                <div style={{ padding: 20 }}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h6">Your sponsors</Typography>
                      <Typography>A list of your sponsors</Typography>
                    </Grid>
                  </Grid>
                  <br></br>
                  <GenericTable
                    headCells={table1HeadCells}
                    data={table1Data}
                    setDataState={setTable1DataState}
                    tableKey="SponsorID"
                    showKey={false}
                    initialSortedColumn="Organization"
                    initialSortedDirection="asc"
                    selectedRow={selectedEntry}
                    setSelectedRow={setSelectedEntryState}
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpenState={setDialogIsOpenState}
                  />
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12}></Grid>
            <Grid item xs={10} xl={6}>
              <Paper>
                <div style={{ padding: 20 }}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h6">Pending applications</Typography>
                      <Typography>
                        Sponsors who have not responded to your application
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          history.push('/application')
                        }}
                      >
                        Apply to more
                      </Button>
                    </Grid>
                  </Grid>
                  <br></br>
                  <GenericTable
                    headCells={table2HeadCells}
                    data={table2Data}
                    setDataState={setTable2DataState}
                    tableKey="SponsorID"
                    showKey={false}
                    initialSortedColumn="ApplicationDate"
                    initialSortedDirection="desc"
                    selectedRow={selectedEntry}
                    setSelectedRow={setSelectedEntryState}
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpenState={setDialogIsOpenState}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </main>
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Sponsors"></TopAppBar>
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
  }
}

export default ViewSponsorsPage
