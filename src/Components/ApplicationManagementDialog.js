/* eslint-disable*/
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Box, Divider, Grid, IconButton, Paper } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import apis from '../Helpers/api_endpoints'
require('datejs')

export default function ApplicationManagementDialog(props) {
  const handleClose = (refresh) => {
    props.setDialogIsOpenState(false, refresh)
    setHelperText(null)
  }

  let applicantProfile = props.driverDetails.find((val) => {
    return val.Username === props.applicationDetails.DriverID
  })

  let applicationFields = [
    {
      name: 'Username',
      prop: applicantProfile.Username,
    },
    {
      name: 'Name',
      prop: applicantProfile.FirstName + ' ' + applicantProfile.LastName,
    },
    {
      name: 'Bio',
      prop: applicantProfile.Bio,
    },
    {
      name: 'Comments',
      prop: props.applicationDetails.AppComments,
    },
    {
      name: 'Submission date',
      prop: Date.parse(
        props.applicationDetails.AppSubmissionDate,
      ).toUTCString(),
    },
  ]

  const [helperText, setHelperText] = useState(null)

  const [decisionReason, setDecisionReason] = useState(null)
  let initial_response_fields = [
    {
      name: 'Response',
      prop:
        props.applicationDetails.Status === 1
          ? 'Denied'
          : (props.applicationDetails.Status === 2) |
            (props.applicationDetails.Status === 3)
          ? 'Accepted'
          : null,
    },

    {
      name: 'Response reason',
      prop: props.applicationDetails.AppDecisionReason,
    },
    {
      name: 'Response date',
      prop: props.applicationDetails.AppDecisionDate
        ? Date.parse(props.applicationDetails.AppDecisionDate).toUTCString()
        : null,
    },
    {
      name: 'Status',
      prop:
        props.applicationDetails.Status === 1
          ? 'Rejected'
          : props.applicationDetails.Status === 2
          ? 'Active'
          : props.applicationDetails.Status === 3
          ? 'Terminated'
          : null,
    },
  ]

  let LEFT_COL_WIDTH = 4
  let RIGHT_COL_WIDTH = 7
  let COLUMN_SPACING = 1

  function ResponseForm() {
    return (
      <Grid
        container
        direction="row"
        spacing={COLUMN_SPACING}
        justify="space-evenly"
      >
        <Grid item xs={7} align="right">
          <Grid container item xs={12} justify="flex-end">
            <Grid item xs={3}>
              <Button
                style={{ backgroundColor: '#ED4337', color: 'white' }}
                variant="contained"
                size="small"
                onClick={() => {
                  if (!decisionReason) {
                    setHelperText('Must provide a decision reason')
                    return
                  } else {
                    setHelperText(null)
                  }

                  let requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      SponsorID: props.applicationDetails.SponsorID.replaceAll(
                        "'",
                        "''",
                      ),
                      DriverID: props.applicationDetails.DriverID.replaceAll(
                        "'",
                        "''",
                      ),
                      AppDecisionReason: decisionReason.replaceAll("'", "''"),
                      Status: 1,
                      PointDollarRatio: 0.01,
                      Points: 0,
                    }),
                  }

                  fetch(apis.ChangeSponsorshipInfo, requestOptions).then(() => {
                    handleClose(true)
                  })
                }}
              >
                Reject
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Button
                style={{ backgroundColor: 'green', color: 'white' }}
                variant="contained"
                size="small"
                onClick={() => {
                  if (!decisionReason) {
                    setHelperText('Must provide a decision reason')
                    return
                  } else {
                    setHelperText(null)
                  }

                  let requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      SponsorID: props.applicationDetails.SponsorID.replaceAll(
                        "'",
                        "''",
                      ),
                      DriverID: props.applicationDetails.DriverID.replaceAll(
                        "'",
                        "''",
                      ),
                      AppDecisionReason: decisionReason.replaceAll("'", "''"),
                      Status: 2,
                      PointDollarRatio: 0.01,
                      Points: 0,
                    }),
                  }
                  fetch(apis.ChangeSponsorshipInfo, requestOptions).then(() => {
                    handleClose(true)
                  })
                }}
              >
                Accept
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <div>
      <Dialog
        open={props.dialogIsOpen}
        onClose={() => {
          handleClose(false)
        }}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <Grid
          container
          item
          xs={12}
          justify="space-between"
          alignItems="center"
          direction="row"
        >
          <Grid item>
            <DialogTitle id="form-dialog-title">
              Driver's Application
            </DialogTitle>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                handleClose(false)
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container item component={Paper} xs={12}>
          <DialogContent>
            <Grid
              item
              container
              direction="row"
              spacing={COLUMN_SPACING}
              justify="space-evenly"
            >
              {applicationFields.map((field) => {
                return (
                  <Grid
                    container
                    direction="row"
                    spacing={COLUMN_SPACING}
                    justify="space-evenly"
                  >
                    <Grid item xs={LEFT_COL_WIDTH}>
                      <DialogContentText>
                        <Box textAlign="right" fontWeight="fontWeightBold">
                          {field.name}:
                        </Box>
                      </DialogContentText>
                    </Grid>
                    <Grid item xs={RIGHT_COL_WIDTH}>
                      <DialogContentText>
                        <Box textAlign="left">{field.prop}</Box>
                      </DialogContentText>
                    </Grid>
                  </Grid>
                )
              })}

              {/* divider */}
              <Grid item xs={12}>
                <br />
                <Divider />

                <br />
                <br />
              </Grid>
              {/* bottom half */}

              {props.applicationDetails.Status > 0 ? (
                initial_response_fields.map((field) => {
                  return (
                    <Grid
                      container
                      direction="row"
                      spacing={COLUMN_SPACING}
                      justify="space-evenly"
                    >
                      <Grid item xs={LEFT_COL_WIDTH}>
                        <DialogContentText>
                          <Box textAlign="right" fontWeight="fontWeightBold">
                            {field.name}:
                          </Box>
                        </DialogContentText>
                      </Grid>
                      <Grid item xs={RIGHT_COL_WIDTH}>
                        <DialogContentText>
                          <Box textAlign="left">{field.prop}</Box>
                        </DialogContentText>
                      </Grid>
                    </Grid>
                  )
                })
              ) : (
                <Grid
                  container
                  direction="row"
                  spacing={COLUMN_SPACING}
                  justify="space-evenly"
                >
                  <Grid item xs={7} align="center">
                    <TextField
                      variant="filled"
                      label="Decision reason"
                      placeholder="Provide a reason for your decision"
                      multiline
                      rows={3}
                      autoFocus
                      fullWidth
                      helperText={helperText}
                      error={helperText}
                      onChange={(event) => {
                        setDecisionReason(event.target.value)
                        setHelperText(null)
                      }}
                    />
                  </Grid>

                  <Grid xs={12} item></Grid>

                  <ResponseForm />
                </Grid>
              )}

              <Grid item xs={12}>
                {' '}
                <br />
              </Grid>
            </Grid>
          </DialogContent>
        </Grid>
      </Dialog>
    </div>
  )
}
