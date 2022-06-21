/* eslint-disable*/
import React, { useEffect, useState, useContext } from 'react'
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import { Grid, Paper, Typography } from '@material-ui/core'
import LoadingIcon from '../Components/LoadingIcon'
import ApplicationManagementDialog from '../Components/ApplicationManagementDialog'
import { UserContext } from '../Helpers/UserContext'
import GenericTable from '../Components/GenericTable'
import apis from '../Helpers/api_endpoints'
require('datejs')

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

const ApplicantManagementPage = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  function setDialogIsOpenState(state, refresh) {
    setDialogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  const [driverProfiles, setDriverProfiles] = useState(null)
  const [applicantData, setApplicantData] = useState(null)

  const [applicants, setApplicants] = useState(null)
  function setApplicantState(state) {
    setApplicants(state)
  }

  const [oldApplicants, setOldApplicants] = useState(null)

  const [selectedApplicant, setSelectedApplicant] = useState(null)
  function setSelectedApplicantState(state) {
    setSelectedApplicant(state)
  }

  const [isLoading, setIsLoading] = useState(true)
  const [pageUpdate, setPageUpdate] = useState(0)

  const userData = useContext(UserContext).user

  const table1HeadCells = [
    {
      id: 'Username',
      label: 'Username',
      isDate: false,
      width: 215,
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
      id: 'SubmissionDate',
      label: 'Submission date',
      isDate: true,
      width: 50,
    },
  ]

  const table2HeadCells = [
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
      id: 'Response',
      label: 'Decision',
      isDate: true,
      width: 50,
    },
    {
      id: 'SubmissionDate',
      label: 'Submission date',
      isDate: true,
      width: 50,
    },
    {
      id: 'ResponseDate',
      label: 'Response date',
      isDate: true,
      width: 50,
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      // fetch and parse sponsor's driver's profiles

      const driverdata_response = await fetch(
        apis.GetDriverDataBySponsor + userData.Username,
      )
      const driverdata_json = await driverdata_response.json()
      const driverdata_parsed = JSON.parse(driverdata_json.body.toString())
      const driverdata_reformatted = driverdata_parsed.map((val) => {
        if (val) {
          return {
            Username: val.Username.S,
            FirstName: val.FirstName.S,
            LastName: val.LastName.S,
            AccountType: val.AccountType.S,
            AccountStatus: parseInt(val.AccountStatus.N),
            Bio: val.Bio.S,
          }
        } else {
          return null
        }
      })

      //  fetch applicant list
      const sponsorship_response = await fetch(
        apis.GetApplicationsBySponsor + userData.Username,
      )
      const sponsorship_json = await sponsorship_response.json()

      // parse the applicant data
      let allApplicants_ugly = JSON.parse(sponsorship_json.body.toString())
        .Items
      let allApplicants = allApplicants_ugly.map((val) => {
        return {
          SponsorshipID: val.SponsorshipID ? val.SponsorshipID.S : null,
          SponsorID: val.SponsorID ? val.SponsorID.S : null,
          DriverID: val.DriverID ? val.DriverID.S : null,
          Status: val.Status ? parseInt(val.Status.N) : null,
          Points: val.Points ? parseInt(val.Points.N) : null,
          PointDollarRatio: val.PointDollarRatio
            ? parseFloat(val.PointDollarRatio.N)
            : null,

          AppSubmissionDate: val.AppSubmissionDate
            ? val.AppSubmissionDate.S.split('.')[0].replace(' ', 'T')
            : null,
          AppComments: val.AppComments ? val.AppComments.S : null,
          AppDecisionDate:
            parseInt(val.Status.N) > 0 && val.AppDecisionDate
              ? val.AppDecisionDate.S.split('.')[0].replace(' ', 'T')
              : null,
          AppDecisionReason:
            parseInt(val.Status.N) && val.AppDecisionReason
              ? val.AppDecisionReason.S
              : null,
        }
      })

      // format applicant data into table-friendly format
      let applicantTableData = allApplicants.map((val) => {
        if (val.Status > 0) {
          let user_profile = driverdata_reformatted.find((val2) => {
            return val2.Username === val.DriverID
          })
          return {
            Username: val.DriverID,
            FirstName: user_profile.FirstName,
            LastName: user_profile.LastName,
            Response:
              val.Status === 1
                ? 'Denied'
                : val.Status === 2 || val.Status === 3
                ? 'Accepted'
                : null,
            SubmissionDate: val.AppSubmissionDate,
            ResponseDate: val.AppDecisionDate,
          }
        } else {
          let user_profile = driverdata_reformatted.find((val2) => {
            return val2.Username === val.DriverID
          })

          return {
            Username: val.DriverID,
            // Name: user_profile.FirstName + ' ' + user_profile.LastName,
            FirstName: user_profile.FirstName,
            LastName: user_profile.LastName,
            SubmissionDate: val.AppSubmissionDate,
          }
        }
      })

      let pendingApplicants = applicantTableData.filter((item) => {
        return !item.Response
      })

      let processedApplicants = applicantTableData.filter((item) => {
        return item.Response === 'Accepted' || item.Response === 'Denied'
      })

      setApplicantData(allApplicants)
      setDriverProfiles(driverdata_reformatted)
      setApplicants(pendingApplicants)
      setOldApplicants(processedApplicants)
      setIsLoading(false)
    })()
  }, [pageUpdate])

  const classes = useStyles()

  if (!isLoading) {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Applicants"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />

        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {selectedApplicant ? (
            <ApplicationManagementDialog
              applicationDetails={applicantData.find((val) => {
                return val.DriverID === selectedApplicant.Username
              })}
              driverDetails={driverProfiles}
              dialogIsOpen={dialogIsOpen}
              setDialogIsOpenState={setDialogIsOpenState}
            />
          ) : null}
          <Grid
            container
            justify="flex-start"
            alignContent="center"
            direction="row"
            spacing={4}
          >
            {/* pending applicant table */}
            <Grid item xs={10} xl={6}>
              <Paper>
                <div style={{ padding: 20 }}>
                  <Typography variant="h6">Pending applications</Typography>
                  <Typography>
                    Click on an applicant to view and respond to their
                    application.
                  </Typography>
                  <br></br>

                  <GenericTable
                    headCells={table1HeadCells}
                    data={applicants}
                    setDataState={setApplicantState}
                    tableKey="Username"
                    showKey={true}
                    initialSortedColumn="SubmissionDate"
                    initialSortedDirection="desc"
                    selectedRow={selectedApplicant}
                    setSelectedRow={setSelectedApplicantState}
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpenState={setDialogIsOpenState}
                  />
                </div>
              </Paper>
            </Grid>

            {/* applicant history table */}
            <Grid item xs={10} xl={6}>
              <Paper>
                <div style={{ padding: 20 }}>
                  <Typography variant="h6">Applicant history</Typography>
                  <Typography>
                    Click on a previous applicant to view their application and
                    your decision.
                  </Typography>
                  <br></br>

                  <GenericTable
                    headCells={table2HeadCells}
                    data={oldApplicants}
                    setDataState={setApplicantState}
                    tableKey="Username"
                    showKey={true}
                    initialSortedColumn="ResponseDate"
                    initialSortedDirection="desc"
                    selectedRow={selectedApplicant}
                    setSelectedRow={setSelectedApplicantState}
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
        <TopAppBar pageTitle="Applicants"></TopAppBar>
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

export default ApplicantManagementPage
