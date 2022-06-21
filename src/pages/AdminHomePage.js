/* eslint-disable*/
import Grid from '@material-ui/core/Grid'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import AdminUserModPage from '../Components/AdminUserModPage'
import SponsortableMod from '../Components/sponsortableMod'
import AdminDelUser from '../Components/AdminDelUser'
import TopAppBar from '../Components/TopAppBar'
import ReactDataGrid from 'react-data-grid'
import { grid } from '@material-ui/system'

function AdminHomePage() {
  let history = useHistory()

  return (
    <div>
      <TopAppBar pageTitle="Admin Settings" />

      <Grid container justify="space-evenly">
        <Grid item xs={12}>
          <p id="test">Welcome to the admin's home page</p>
        </Grid>

        <Grid item xs={8}>
          <div>
            <AdminUserModPage link="https://wn0wfce7a3.execute-api.us-east-1.amazonaws.com/dev/entries"></AdminUserModPage>
          </div>
        </Grid>

        <Grid item xs={4}>
          <div>
            <AdminDelUser></AdminDelUser>
          </div>
        </Grid>

        <Grid item xs={8}>
          <div>
            <SponsortableMod link="https://wn0wfce7a3.execute-api.us-east-1.amazonaws.com/dev/entries"></SponsortableMod>
          </div>
        </Grid>

        {/* <Button id="butt" variant="contained" color="primary" onClick={<div><AdminUserModPage></AdminUserModPage></div>}></Button> */}
        {/* <div><AdminUserModPage></AdminUserModPage></div> */}
        {/* <AdminUserTable></AdminUserTable> */}
        {/* </Button> */}
      </Grid>
    </div>
  )
}

export default AdminHomePage
