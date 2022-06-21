/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Box, Divider, Grid, Paper, Typography } from '@material-ui/core'
import GenericTable from './GenericTable'
import LoadingIcon from './LoadingIcon'
import apis from '../Helpers/api_endpoints'
// point history table
const table1HeadCells = [
  {
    id: 'ChangeDate',
    label: 'Date',
    isDate: true,
    width: 150,
  },
  {
    id: 'ChangeReason',
    label: 'Reason',
    isDate: false,
    width: 200,
  },
  {
    id: 'ChangeAmount',
    label: 'Change',
    isDate: false,
    width: 50,
  },
  {
    id: 'TotalPoints',
    label: 'Total points',
    isDate: false,
    width: 50,
  },
]
export default function ViewSponsorAsDriverDialog(props) {
  const handleClose = () => {
    props.dialogProps.setDialogIsOpen(false)
  }

  let sponsorshipInfo =
    props.dialogProps.allSponsorshipsData && props.dialogProps.selectedEntry
      ? props.dialogProps.allSponsorshipsData.find(
          (element) =>
            element.SponsorID === props.dialogProps.selectedEntry.SponsorID,
        )
      : null

  const [isLoading, setIsLoading] = useState(true)
  const [table1Data, setTable1Data] = useState(null)
  let setTable1DataState = (state) => {
    setTable1Data(state)
  }
  const [pageUpdate, setPageUpdate] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      // point change api data
      let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SponsorID: sponsorshipInfo.SponsorID.replaceAll("'", "''"),
          DriverID: sponsorshipInfo.DriverID.replaceAll("'", "''"),
        }),
      }
      let point_history_resp = await fetch(
        apis.GetPointHistoryBySonsorship,
        requestOptions,
      )
      let point_history_json = await point_history_resp.json()

      let point_history_array = point_history_json.body.map((element) => {
        return {
          ChangeID: element.ChangeID.S,
          ChangeDate: element.TimeStamp.S.replace(' ', 'T').split('.')[0],
          ChangeReason: element.PointChangeReason.S,
          ChangeAmount: parseInt(element.PointDifference.N),
          TotalPoints: parseInt(element.TotalPoints.N),
        }
      })

      setTable1Data(point_history_array)
    })().then(() => {
      setIsLoading(false)
    })
  }, [pageUpdate, sponsorshipInfo])

  const left_col_width = 4
  const right_col_width = 6

  return (
    <div>
      <Dialog
        open={props.dialogProps.dialogIsOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {'Sponsorship information: ' +
            props.dialogProps.allSponsorshipsData &&
          props.dialogProps.selectedEntry
            ? sponsorshipInfo.Organization +
              ': ' +
              sponsorshipInfo.FirstName +
              ' ' +
              sponsorshipInfo.LastName
            : null}
        </DialogTitle>
        <DialogContent>
          {props.dialogProps.allSponsorshipsData &&
          props.dialogProps.selectedEntry ? (
            <Grid container>
              <Grid item container xs={12} justify="center" spacing={2}>
                <Grid item xs={left_col_width} align="right">
                  <Typography>
                    <Box fontWeight="bold">Sponsor Bio: </Box>
                  </Typography>
                </Grid>
                <Grid item xs={right_col_width} align="left">
                  <Typography>{sponsorshipInfo.Bio}</Typography>
                </Grid>
              </Grid>
              {/* sponsored since*/}
              {sponsorshipInfo.Status === 2 ? (
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">Sponsored since: </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={right_col_width} align="left">
                    <Typography>
                      {Date.parse(
                        sponsorshipInfo.AppDecisionDate,
                      ).toUTCString()}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">Applied on: </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={right_col_width} align="left">
                    <Typography>
                      {Date.parse(
                        sponsorshipInfo.AppSubmissionDate,
                      ).toUTCString()}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              <Grid item container xs={12} justify="center" spacing={2}>
                <Grid item xs={left_col_width} align="right">
                  <Typography>
                    <Box fontWeight="bold">App comments: </Box>
                  </Typography>
                </Grid>
                <Grid item xs={right_col_width} align="left">
                  <Typography>{sponsorshipInfo.AppComments}</Typography>
                </Grid>
              </Grid>

              {/* sponsored because */}
              {sponsorshipInfo.Status === 2 ? (
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">Sponsored because: </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={right_col_width} align="left">
                    <Typography>{sponsorshipInfo.AppDecisionReason}</Typography>
                  </Grid>
                </Grid>
              ) : null}
              {/* total points */}
              {sponsorshipInfo.Status === 2 ? (
                <Grid item container xs={12} justify="center" spacing={2}>
                  <Grid item xs={left_col_width} align="right">
                    <Typography>
                      <Box fontWeight="bold">Total points: </Box>
                    </Typography>
                  </Grid>

                  <Grid item xs={right_col_width} align="left">
                    <Typography>{sponsorshipInfo.Points}</Typography>
                  </Grid>
                </Grid>
              ) : null}

              {sponsorshipInfo.Status === 2 ? (
                <Grid item xs={12}>
                  <br />
                  <Divider />
                  <br />
                </Grid>
              ) : null}

              <Grid item container xs={12} alignItems="center">
                {sponsorshipInfo.Status === 2 ? (
                  <Grid item container justify="space-between">
                    <Grid item xs={12}>
                      <Typography variant="h6">Points</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {' '}
                      <Typography>View your point history</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">
                        {sponsorshipInfo.Points} points total
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}

                <Grid item xs={12}>
                  {/* <br /> */}
                </Grid>

                {sponsorshipInfo.Status === 2 && !isLoading ? (
                  <GenericTable
                    headCells={table1HeadCells}
                    data={table1Data}
                    setDataState={setTable1DataState}
                    tableKey="ChangeID"
                    showKey={false}
                    initialSortedColumn="ChangeDate"
                    initialSortedDirection="desc"
                    // selectedRow={selectedEntry}
                    // setSelectedRow={setSelectedEntryState}
                    // dialogIsOpen={props.dialogIsOpen}
                    // setDialogIsOpenState={props.setDialogIsOpenState}
                  ></GenericTable>
                ) : sponsorshipInfo.Status === 2 ? (
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <LoadingIcon />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>

                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
              {/* </Grid> */}
            </Grid>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
