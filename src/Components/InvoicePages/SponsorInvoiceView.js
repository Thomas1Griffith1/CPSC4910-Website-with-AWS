import { Grid, Paper, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import apis from '../../Helpers/api_endpoints'
import { UserContext } from '../../Helpers/UserContext'
import GenericTable from '../GenericTable'
require('datejs')

const SponsorInvoiceView = (props) => {
  let sponsorData = useContext(UserContext).user

  if (props.SponsorID) {
    sponsorData = { Username: props.SponsorID }
  }

  const [isLoading, setIsLoading] = useState(true)
  const [pageUpdate, setPageUpdate] = useState(0)
  function fullPageUpdateState() {
    setPageUpdate(pageUpdate + 1)
  }

  const [driverOrders, setDriverOrders] = useState([])

  useEffect(() => {
    ;(async () => {
      // start loading animation
      setIsLoading(true)
      //   TODO: get all the orders for the sponsor

      let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SponsorID: sponsorData.Username,
        }),
      }
      let sponsor_orders_response = await fetch(apis.GetOrder, requestOptions)
      let sponsor_orders_json = await sponsor_orders_response.json()
      let sponsor_orders = JSON.parse(sponsor_orders_json.body).Items
      let sponsor_orders_parsed = sponsor_orders.map((element) => {
        return {
          OrderID: element.OrderID.S,
          SponsorID: element.SponsorID.S,
          DriverID: element.DriverID.S,
          Cost: parseFloat(element.Cost.N),
          InvoicePeriod: Date.parse(
            element.OrderSubmitted.S.replace(' ', 'T').split('.')[0],
          )
            .addMonths(1)
            .moveToFirstDayOfMonth()
            .toDateString(),
          Status: parseInt(element.Status.N),
        }
      })

      setDriverOrders(sponsor_orders_parsed)
    })().then(() => {
      setIsLoading(false)
    })
  }, [sponsorData.Username])

  let monthly_invoices =
    driverOrders.length > 0
      ? driverOrders.reduce((prev, curr) => {
          let invoice_period = curr.InvoicePeriod
          let cost = curr.Cost

          if (prev[invoice_period]) {
            prev[invoice_period] += cost
          } else {
            prev[invoice_period] = cost
          }

          return prev
        }, {})
      : []

  let this_month_invoice_due_date = Date.today()
    .addMonths(1)
    .moveToFirstDayOfMonth()
    .toDateString()
    .split(' ')
    .slice(1, 3)
    .join(' ')

  let this_month_invoice_total =
    driverOrders.length > 0 && monthly_invoices
      ? monthly_invoices[
          Date.today().moveToFirstDayOfMonth().addMonths(1).toDateString()
        ].toFixed(2)
      : 0.0

  let monthly_invoice_table_data = []
  if (monthly_invoices) {
    for (const [key, value] of Object.entries(monthly_invoices)) {
      monthly_invoice_table_data.push({
        InvoicePeriodDate: Date.parse(key),
        Cost: value,
      })
    }
  }

  let monthly_invoice_head_cells = [
    {
      id: 'InvoicePeriodDate',
      label: 'Date due',
      isDate: true,
      width: 50,
    },
    {
      id: 'Cost',
      label: 'Invoice total (USD)',
      isDate: false,
      width: 50,
    },
  ]

  if (props.SponsorID) {
    return (
      <Grid item xs={10} xl={6} container>
        <Grid item xs={12}></Grid>
        <Grid xs={12} item container component={Paper} style={{ padding: 20 }}>
          <Grid item xs={12} align="center">
            <Typography variant="h6">
              Total due on {this_month_invoice_due_date}: $
              {this_month_invoice_total}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <br />
        </Grid>

        <Grid
          item
          xs={12}
          container
          component={Paper}
          justify="center"
          style={{ padding: 20 }}
        >
          <Grid
            item
            xs={12}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h6">Invoices by month (sponsor)</Typography>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <br></br>
          </Grid>

          <Grid item xs={12} component={Paper}>
            <GenericTable
              headCells={monthly_invoice_head_cells}
              data={monthly_invoice_table_data}
              tableKey="InvoicePeriodDate"
              showKey={false}
              initialSortedColumn="InvoicePeriodDate"
              initialSortedDirection="desc"
              // selectedRow={selectedUser}
              // setSelectedRow={setSelectedUserState}
              // dialogIsOpen={userDialogIsOpen}
              // setDialogIsOpenState={setUserDialogIsOpenState}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default SponsorInvoiceView
