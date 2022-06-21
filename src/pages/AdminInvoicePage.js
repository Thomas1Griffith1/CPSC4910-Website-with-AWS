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
import { Divider, Grid, MenuItem, Paper, Select } from '@material-ui/core'
import SponsorInvoiceView from '../Components/InvoicePages/SponsorInvoiceView'
import OrganizationInvoiceView from '../Components/InvoicePages/OrganizationInvoiceView'
import OrganizationInvoiceContent from '../Components/InvoicePages/OrganizationInvoiceContent'
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

export default function AdminInvoicePage() {
  const classes = useStyles()
  const userData = useContext(UserContext).activeProfile
    ? useContext(UserContext).activeProfile
    : useContext(UserContext).user

  const [isLoading, setIsLoading] = useState(true)
  const [pageUpdate, setPageUpdate] = useState(0)
  function fullPageUpdateState() {
    setPageUpdate(pageUpdate + 1)
  }

  const [allOrganizations, setAllOrganizations] = useState(null)
  const [currentOrganization, setCurrentOrganization] = useState(null)

  useEffect(() => {
    ;(async () => {
      // start loading animation
      setIsLoading(true)
      let org_names_response = await fetch(apis.GetOrganizationNames)
      let org_names_json = await org_names_response.json()
      let org_names = org_names_json.body
      setAllOrganizations(org_names)
    })().then(() => {
      setIsLoading(false)
    })
  }, [])

  // show loading screen if data is still being fetched
  if (isLoading) {
    return (
      <div className={classes.root}>
        <TopAppBar
          pageTitle="Invoices"
          customItem={
            <Grid item xs={12} container justify="space-between">
              <Grid item xs={4} align="left" style={{ paddingBottom: 10 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentOrganization ? currentOrganization : null}
                  variant="standard"
                  color="primary"
                  style={{
                    color: 'white',
                    borderBottom: '1px solid white',
                    margin: '2',
                  }}
                  fullWidth
                ></Select>
              </Grid>
            </Grid>
          }
        ></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <LoadingIcon />
        </main>
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar
          pageTitle="Invoices"
          customItem={
            <Grid item xs={12} container justify="space-between">
              <Grid item xs={4} align="left" style={{ paddingBottom: 10 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentOrganization ? currentOrganization : null}
                  variant="standard"
                  color="primary"
                  style={{
                    color: 'white',
                    borderBottom: '1px solid white',
                    margin: '2',
                  }}
                  fullWidth
                >
                  {allOrganizations
                    ? _.sortBy(allOrganizations).map((element) => (
                        <MenuItem
                          onClick={() => {
                            setCurrentOrganization(element)
                          }}
                          value={element}
                        >
                          {element}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </Grid>
            </Grid>
          }
        ></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />

        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {!isLoading && currentOrganization ? (
            <Grid container justify="flex-start">
              {userData.Username.includes('@') ? (
                <Grid item container>
                  <OrganizationInvoiceContent
                    Organization={currentOrganization}
                    // SponsorID={userData.Username}
                  />
                </Grid>
              ) : (
                <Grid container>
                  <SponsorInvoiceView SponsorID={userData.Username} />
                </Grid>
              )}
            </Grid>
          ) : !isLoading ? (
            <p>Select an organization to view their invoices</p>
          ) : (
            <LoadingIcon />
          )}
        </main>
      </div>
    )
  }
}
