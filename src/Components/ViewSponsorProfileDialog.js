/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Box, Divider, Grid, Typography } from '@material-ui/core'
import LoadingIcon from './LoadingIcon'
import GenericTable from './GenericTable'
import apis from '../Helpers/api_endpoints'

export default function ViewSponsorProfileDialog(props) {
  const orgProps = props.dialogProps.parentProps.parentProps.orgProps
  const [isLoading, setIsLoading] = useState(false)

  const [table1HeadCells, setTable1HeadCells] = useState(null)
  const [table1Data, setTable1Data] = useState(null)
  function setsetTable1DataState(state) {
    setTable1Data(state)
  }

  const handleClose = () => {
    props.dialogProps.setSelectionDialogIsOpenState(false)
  }

  let selectedEntryData = null
  if (props.dialogProps.selectedEntry) {
    selectedEntryData = orgProps.organizationUsers.find((element) => {
      return element.Username === props.dialogProps.selectedEntry.Username
    })
  }

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      setTable1HeadCells([
        {
          id: 'Username',
          label: 'Username',
          isDate: false,
          width: 120,
        },
        {
          id: 'FirstName',
          label: 'First name',
          isDate: false,
          width: 80,
        },
        {
          id: 'LastName',
          label: 'Last name',
          isDate: false,
          width: 80,
        },
        {
          id: 'SponsoredDate',
          label: 'Sponsored since',
          isDate: false,
          width: 250,
        },
      ])

      // fetch and parse sponsor's driver's profiles
      if (props.dialogProps.selectedEntry) {
        const driverdata_response = await fetch(
          apis.GetDriverDataBySponsor +
            props.dialogProps.selectedEntry.Username,
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
              AppDecisionDate: val.AppDecisionDate.S,
              Status: parseInt(val.Status.N),
            }
          } else {
            return null
          }
        })

        let driverdata_table_data = driverdata_reformatted
          .filter((element) => element.Status === 2)
          .map((element) => {
            return {
              Username: element.Username,
              FirstName: element.FirstName,
              LastName: element.LastName,
              SponsoredDate: element.AppDecisionDate,
            }
          })

        setTable1Data(driverdata_table_data)
      }
    })().then(() => {
      setIsLoading(false)
    })
  }, [props.dialogProps.selectedEntry])

  const left_col_width = 4
  const right_col_width = 7

  return (
    <Grid container spacing={2}>
      <Dialog
        fullWidth
        maxWidth="md"
        open={props.dialogProps.selectionDialogIsOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Sponsor profile'}</DialogTitle>
        <DialogContent>
          {!props.dialogProps.selectedEntry || isLoading ? (
            <LoadingIcon />
          ) : (
            <div>
              <Grid item>
                <Typography variant="h6">User details</Typography>
              </Grid>
              {/* account creation date */}
              <Grid item container xs={12} spacing={2} justify="center">
                <Grid item xs={left_col_width} align="right">
                  <Typography>
                    <Box fontWeight="fontWeightBold">Account created:</Box>
                  </Typography>
                </Grid>
                <Grid item xs={right_col_width} align="left">
                  <Typography>
                    {Date.parse(selectedEntryData.SignupDate).toUTCString()}
                  </Typography>
                </Grid>
              </Grid>

              <Grid item xs={12} justify="center">
                <br />
              </Grid>

              {/* username */}
              <Grid item container xs={12} spacing={2} justify="center">
                <Grid item xs={left_col_width} align="right">
                  <Typography>
                    <Box fontWeight="fontWeightBold">Username:</Box>
                  </Typography>
                </Grid>
                <Grid item xs={right_col_width} align="left">
                  <Typography>{selectedEntryData.Username}</Typography>
                </Grid>
              </Grid>

              {/* name */}
              <Grid item container xs={12} spacing={2} justify="center">
                <Grid item xs={left_col_width} align="right">
                  <Typography>
                    <Box fontWeight="fontWeightBold">Name:</Box>
                  </Typography>
                </Grid>
                <Grid item xs={right_col_width} align="left">
                  <Typography>
                    {selectedEntryData.FirstName +
                      ' ' +
                      selectedEntryData.LastName}
                  </Typography>
                </Grid>
              </Grid>

              {/* Bio */}
              <Grid item container xs={12} spacing={2} justify="center">
                <Grid item xs={left_col_width} align="right">
                  <Typography>
                    <Box fontWeight="fontWeightBold">Bio:</Box>
                  </Typography>
                </Grid>
                <Grid item xs={right_col_width} align="left">
                  <Typography>{selectedEntryData.Bio}</Typography>
                </Grid>
              </Grid>

              {/* action button */}
              <Grid item container xs={12} spacing={2} justify="center">
                <Grid item align="right">
                  {props.dialogProps.action}
                </Grid>
              </Grid>

              <Grid item xs={12} justify="center">
                <br />
              </Grid>
              <Grid item xs={12} justify="center">
                <Divider />
              </Grid>
              <Grid item xs={12} justify="center">
                <br />
              </Grid>

              {/* driver table */}
              <Grid item>
                <Typography variant="h6">
                  {selectedEntryData.FirstName}'s drivers
                </Typography>
              </Grid>
              <Grid item container xs={12} spacing={2} justify="center">
                <Grid item xs={12}>
                  <GenericTable
                    headCells={table1HeadCells}
                    data={table1Data}
                    setDataState={setsetTable1DataState}
                    tableKey="Username"
                    showKey={true}
                    initialSortedColumn="SponsoredDate"
                    initialSortedDirection="desc"
                  />
                </Grid>
              </Grid>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
