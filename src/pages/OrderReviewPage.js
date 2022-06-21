/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import LoadingIcon from '../Components/LoadingIcon'
import { UserContext } from '../Helpers/UserContext'
import { Grid, Paper } from '@material-ui/core'
import GenericTable from '../Components/GenericTable'
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

const currentOrdersTableHeadCells = [
  {
    id: 'Organization',
    label: 'Organization',
    isDate: false,
    width: 50,
  },
  {
    id: 'SponsorID',
    label: 'Sponsor',
    isDate: false,
    width: 50,
  },
  {
    id: 'Cost',
    label: 'Cost (points)',
    isDate: false,
    width: 50,
  },
  {
    id: 'OrderDate',
    label: 'Ordered on',
    isDate: false,
    width: 200,
  },
  {
    id: 'Status',
    label: 'Status',
    isDate: true,
    width: 50,
  },
  {
    id: 'ShippingAddress',
    label: 'Destination',
    isDate: false,
    width: 200,
  },
]

const previousOrdersTableHeadCells = [
  {
    id: 'Organization',
    label: 'Organization',
    isDate: false,
    width: 50,
  },
  {
    id: 'SponsorID',
    label: 'Sponsor',
    isDate: false,
    width: 50,
  },
  {
    id: 'Cost',
    label: 'Cost (points)',
    isDate: false,
    width: 100,
  },
  {
    id: 'OrderDate',
    label: 'Ordered on',
    isDate: false,
    width: 200,
  },
  {
    id: 'ShippingAddress',
    label: 'Destination',
    isDate: false,
    width: 200,
  },
]

export default function OrderReviewPage() {
  const classes = useStyles()
  const userData = useContext(UserContext).user

  const [isLoading, setIsLoading] = useState(true)

  const [allOrders, setAllOrders] = useState(null)
  // function setAllOrdersState(state) {
  //   setAllOrders(state)
  // }

  const [currentOrders, setCurrentOrders] = useState(null)
  // function setCurrentOrdersState(state) {
  //   setCurrentOrders(state)
  // }
  const [currentOrdersTableData, setCurrentOrdersTableData] = useState(null)
  function setCurrentOrdersTableDataState(state) {
    setCurrentOrdersTableData(state)
  }
  const [previousOrders, setPreviousOrders] = useState(null)
  // function setPreviousOrdersState(state) {
  //   setPreviousOrders(state)
  // }
  const [previousOrdersTableData, setPreviousOrdersTableData] = useState(null)
  function setPreviousOrdersTableDataState(state) {
    setPreviousOrdersTableData(state)
  }

  useEffect(() => {
    ;(async () => {
      // start loading animation
      setIsLoading(true)

      let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          DriverID: userData.Username.replaceAll("'", "''"),
        }),
      }

      let user_orders_resp = await fetch(apis.GetOrder, requestOptions)
      let user_orders_json = await user_orders_resp.json()
      let user_orders_obj = JSON.parse(user_orders_json.body)
      let user_orders_arr = user_orders_obj.Items

      let all_orders_parsed = user_orders_arr.map((element) => {
        return {
          OrderID: element.OrderID.S,
          DriverID: element.DriverID.S,
          SponsorID: element.SponsorID.S,
          Organization: element.Organization.S,
          Status: parseInt(element.Status.N),
          Cost: parseFloat(element.Cost.N),
          PointDollarRatio: parseFloat(element.CurrentPointDollarRatio.N),
          OrderDate: element.OrderSubmitted.S,
          ShippingAddress: element.ShippingAddress.S,
          Products: element.M
            ? element.ProductIDs.L.map((element) => {
                return {
                  ProductID: element.M.ProductID.S,
                  Quantity: parseInt(element.M.Quantity.N),
                  PricePerItem: parseFloat(element.M.CostPerItem.N).toFixed(2),
                }
              })
            : [],
        }
      })

      let current_orders = all_orders_parsed.filter(
        (element) => element.Status < 3,
      )

      let previous_orders = all_orders_parsed.filter(
        (element) => element.Status >= 3,
      )

      let current_orders_table_data = current_orders.map((element) => {
        return {
          OrderID: element.OrderID,
          Organization: element.Organization,
          SponsorID: element.SponsorID,
          Cost: element.Cost / element.PointDollarRatio,
          OrderDate: element.OrderDate,
          Status:
            element.Status === 1
              ? 'Processing'
              : element.Status === 2
              ? 'In transit'
              : element.Status === 3
              ? 'Delivered'
              : 'Unknown status',
          ShippingAddress: element.ShippingAddress,
        }
      })

      let previous_orders_table_data = previous_orders.map((element) => {
        return {
          OrderID: element.OrderID,
          Organization: element.Organization,
          SponsorID: element.SponsorID,
          Cost: element.Cost / element.PointDollarRatio,
          OrderDate: element.OrderDate,
          ShippingAddress: element.ShippingAddress,
        }
      })

      setAllOrders(all_orders_parsed)
      setPreviousOrders(previousOrders)
      setPreviousOrdersTableData(previous_orders_table_data)
      setCurrentOrders(currentOrders)
      setCurrentOrdersTableData(current_orders_table_data)

      setIsLoading(false)
    })()
  }, [])

  // show loading screen if data is still being fetched
  if (isLoading) {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Your orders"></TopAppBar>
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
        <TopAppBar pageTitle="Your orders"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />

        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Grid item container justify="flex-start">
            {/* <Grid item xs={12}> */}
            <Grid item xs={10} xl={6}>
              <Paper>
                <div style={{ padding: 20 }}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h6">Current orders</Typography>
                      <Typography>
                        Orders that have not been delivered yet
                      </Typography>
                    </Grid>
                  </Grid>
                  <br></br>
                  <GenericTable
                    headCells={currentOrdersTableHeadCells}
                    data={currentOrdersTableData}
                    setDataState={setCurrentOrdersTableDataState}
                    tableKey="OrderID"
                    showKey={false}
                    initialSortedColumn="OrderDate"
                    initialSortedDirection="desc"
                    //   selectedRow={selectedEntry}
                    //   setSelectedRow={setSelectedEntryState}
                    //   dialogIsOpen={dialogIsOpen}
                    //   setDialogIsOpenState={setDialogIsOpenState}
                  />
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <br />
            </Grid>

            <Grid item xs={10} xl={6}>
              <Paper>
                <div style={{ padding: 20 }}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h6">Previous orders</Typography>
                      <Typography>Orders that have been delivered</Typography>
                    </Grid>
                  </Grid>
                  <br></br>
                  <GenericTable
                    headCells={previousOrdersTableHeadCells}
                    data={previousOrdersTableData}
                    setDataState={setPreviousOrdersTableDataState}
                    tableKey="OrderID"
                    showKey={false}
                    initialSortedColumn="OrderDate"
                    initialSortedDirection="desc"
                    //   selectedRow={selectedEntry}
                    //   setSelectedRow={setSelectedEntryState}
                    //   dialogIsOpen={dialogIsOpen}
                    //   setDialogIsOpenState={setDialogIsOpenState}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>

          {/* </Grid> */}
        </main>
      </div>
    )
  }
}
