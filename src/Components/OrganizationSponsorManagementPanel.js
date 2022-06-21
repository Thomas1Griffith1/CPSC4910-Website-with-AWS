/* eslint-disable*/

import { Button, Grid, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddSponsorProfileDialog from './AddSponsorProfileDialog'
import ViewSponsorProfileDialog from './ViewSponsorProfileDialog'
import GenericTable from './GenericTable'
import LoadingIcon from './LoadingIcon'
import apis from '../Helpers/api_endpoints'
require('datejs')

const OrganizationSponsorManagementPanel = (props) => {
  const [isLoading, setIsLoading] = useState(true)

  // dialog control
  const [
    addSponsorProfileDialogIsOpen,
    setAddSponsorProfileDialogIsOpen,
  ] = useState(false)

  const [pageUpdate, setPageUpdate] = useState(0)
  function fullPageUpdateState() {
    setPageUpdate(pageUpdate + 1)
  }
  function setAddSponsorProfileDialogIsOpenState(state, refresh) {
    setAddSponsorProfileDialogIsOpen(state)

    if (refresh) {
      props.parentProps.pageProps.updatePage()
    }
  }

  const [
    viewSponsorProfileDialogIsOpen,
    setViewSponsorProfileDialogIsOpen,
  ] = useState(false)
  function setViewSponsorProfileDialogIsOpenState(state, refresh) {
    setViewSponsorProfileDialogIsOpen(state)

    if (refresh) {
      props.parentProps.pageProps.updatePage()
    }
  }

  const [
    viewTerminatedProfileDialogIsOpen,
    setViewTerminatedProfileDialogIsOpen,
  ] = useState(false)
  function setViewTerminatedProfileDialogIsOpenState(state, refresh) {
    setViewTerminatedProfileDialogIsOpen(state)

    if (refresh) {
      props.parentProps.pageProps.updatePage()
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

  const orgProps = props.parentProps.orgProps

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      let org_sponsor_profiles = orgProps.organizationUsers.filter(
        (element) => {
          return element.AccountType === 'Sponsor'
        },
      )

      let active_sponsor_profiles = org_sponsor_profiles.filter((element) => {
        return element.AccountStatus === 1
      })

      let terminated_sonsor_profiles = org_sponsor_profiles.filter(
        (element) => {
          return element.AccountStatus === 2
        },
      )

      let active_profile_table_data = active_sponsor_profiles.map((element) => {
        return {
          Username: element.Username,
          FirstName: element.FirstName,
          LastName: element.LastName,
          CreatedDate: element.SignupDate,
        }
      })

      let terminated_profile_table_data = terminated_sonsor_profiles.map(
        (element) => {
          return {
            Username: element.Username,
            FirstName: element.FirstName,
            LastName: element.LastName,
            CreatedDate: element.SignupDate,
          }
        },
      )

      setTable1Data(active_profile_table_data)
      setTable2Data(terminated_profile_table_data)
    })().then(() => {
      setIsLoading(false)
    })

    setTable1HeadCells([
      {
        id: 'Username',
        label: 'Username',
        isDate: false,
        width: 150,
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
        id: 'CreatedDate',
        label: 'Member since',
        isDate: true,
        width: 200,
      },
    ])
  }, [pageUpdate])

  if (isLoading) {
    return <LoadingIcon />
  } else {
    return (
      <Grid container>
        <Grid item xs={12} container component={Paper} style={{ padding: 20 }}>
          <AddSponsorProfileDialog
            dialogProps={{
              parentProps: props,
              selectionDialogIsOpen: addSponsorProfileDialogIsOpen,
              setSelectionDialogIsOpenState: setAddSponsorProfileDialogIsOpenState,
              fullPageUpdateState: fullPageUpdateState,
            }}
          />
          {/* active sponsor dialog */}
          {!selectedEntry ? null : (
            <ViewSponsorProfileDialog
              dialogProps={{
                parentProps: props,
                selectionDialogIsOpen: viewSponsorProfileDialogIsOpen,
                setSelectionDialogIsOpenState: setViewSponsorProfileDialogIsOpenState,
                selectedEntry: selectedEntry,
                setSelectedEntryState: setSelectedEntryState,
                fullPageUpdateState: fullPageUpdateState,
                action: selectedEntry.Username.includes('@') ? null : (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#444444', color: 'white' }}
                    onClick={() => {
                      let requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          Username: selectedEntry.Username.replaceAll(
                            "'",
                            "''",
                          ),
                          AccountStatus: 2,
                        }),
                      }

                      fetch(apis.ChangeUserInfo, requestOptions).then(() => {
                        setViewSponsorProfileDialogIsOpenState(false, true)
                      })
                    }}
                  >
                    Delete profile
                  </Button>
                ),
              }}
            />
          )}

          {/* deleted sponsor dialog */}
          <ViewSponsorProfileDialog
            dialogProps={{
              parentProps: props,
              selectionDialogIsOpen: viewTerminatedProfileDialogIsOpen,
              setSelectionDialogIsOpenState: setViewTerminatedProfileDialogIsOpenState,
              selectedEntry: selectedEntry,
              setSelectedEntryState: setSelectedEntryState,
              fullPageUpdateState: fullPageUpdateState,
              action: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    let requestOptions = {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        Username: selectedEntry.Username.replaceAll("'", "''"),
                        AccountStatus: 1,
                      }),
                    }
                    fetch(apis.ChangeUserInfo, requestOptions).then(() => {
                      setViewTerminatedProfileDialogIsOpenState(false, true)
                    })
                  }}
                >
                  Reinstate profile
                </Button>
              ),
            }}
          />
          <Grid item xs={12}>
            <Typography variant="h6">Manage your sponsors</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Add, view, and remove your sponsor profiles</Typography>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid
            item
            xs={12}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item align="left">
              <Typography variant="h6">Active profiles</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setAddSponsorProfileDialogIsOpenState(true)
                }}
              >
                Create sponsor profile
              </Button>
            </Grid>
            <Grid item xs={12}>
              <br />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <GenericTable
              headCells={table1HeadCells}
              data={table1Data}
              setDataState={setTable1DataState}
              tableKey="Username"
              showKey={true}
              initialSortedColumn="CreatedDate"
              initialSortedDirection="desc"
              selectedRow={selectedEntry}
              setSelectedRow={setSelectedEntryState}
              dialogIsOpen={setViewSponsorProfileDialogIsOpen}
              setDialogIsOpenState={setViewSponsorProfileDialogIsOpenState}
            />
          </Grid>

          <Grid item xs={12}>
            <br></br>
          </Grid>
          <Grid item xs={12}>
            <br></br>
          </Grid>
        </Grid>

        <Grid item>
          <br />
        </Grid>

        {/* part 2 */}
        <Grid item xs={12} container component={Paper} style={{ padding: 20 }}>
          <Grid item xs={12}>
            <Typography variant="h6">Deleted sponsor profiles</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              View and reinstate the sponsor profiles you have deleted
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={12}>
              <br />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <GenericTable
              headCells={table1HeadCells}
              data={table2Data}
              setDataState={setTable2DataState}
              tableKey="Username"
              showKey={true}
              initialSortedColumn="CreatedDate"
              initialSortedDirection="desc"
              selectedRow={selectedEntry}
              setSelectedRow={setSelectedEntryState}
              dialogIsOpen={setViewTerminatedProfileDialogIsOpen}
              setDialogIsOpenState={setViewTerminatedProfileDialogIsOpenState}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default OrganizationSponsorManagementPanel
