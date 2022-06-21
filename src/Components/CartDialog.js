/* eslint-disable*/
import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import { Divider, Grid, Paper, TextField } from '@material-ui/core'
import LoadingIcon from './LoadingIcon'
import { useHistory } from 'react-router'
import apis from '../Helpers/api_endpoints'

export default function CartDialog(props) {
  let history = useHistory()

  const handleClose = () => {
    props.dialogProps.setDialogIsOpenState(false)
  }

  const [isLoading, setIsLoading] = useState(false)

  const [shippingAddress, setShippingAddress] = useState(null)
  const [shippingAddressHelperText, setShippingAddressHelperText] = useState(
    null,
  )

  useEffect(() => {}, [])

  let cart_cost = props.dialogProps.cart.reduce((prev, curr) => {
    return (
      prev +
      Math.ceil(
        (curr.FullItemDetails.Price * curr.Quantity) /
          props.dialogProps.activeSponsor.PointToDollarRatio,
      )
    )
  }, 0)

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.dialogProps.dialogIsOpen}
        fullWidth
        maxWidth="sm"
      >
        <Grid container style={{ padding: 20 }}>
          <Grid item xs={12} container justify="flex-start" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h5" id="alert-dialog-title">
                Your cart
              </Typography>
            </Grid>
          </Grid>

          <Grid item align="center" xs={12}>
            <br />
          </Grid>

          {isLoading ? (
            <LoadingIcon />
          ) : (
            <Grid container justify="center" spacing={3}>
              {/* {JSON.stringify(props.dialogProps.cart)} */}
              {props.dialogProps.cart.map((element) => {
                return (
                  <Grid
                    item
                    xs={12}
                    container
                    spacing={2}
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
                      <b> {element.FullItemDetails.Name}</b>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={12}
                      justify="space-between"
                      alignItems="flex-end"
                      spacing={2}
                    >
                      <Grid>
                        <img
                          src={element.FullItemDetails.PhotoURL}
                          alt="alt text"
                          style={{ maxWidth: '125px', maxHeight: '125px' }}
                        />
                      </Grid>

                      <Grid
                        item
                        container
                        justify="flex-end"
                        // component={Paper}
                        xs={5}
                      >
                        <Grid item>
                          <TextField
                            type="number"
                            variant="filled"
                            size="small"
                            label="Quantity"
                            value={element.Quantity}
                            onChange={(event) => {
                              if (
                                event.target.value >= 0 &&
                                event.target.value <=
                                  element.FullItemDetails.Stock
                              )
                                props.dialogProps.changeItemQuantity(
                                  element,
                                  event.target.value,
                                )
                            }}
                          ></TextField>
                        </Grid>
                        <Grid item>
                          {Math.ceil(
                            element.FullItemDetails.Price /
                              props.dialogProps.activeSponsor
                                .PointToDollarRatio,
                          )}{' '}
                          pts x {element.Quantity} ={' '}
                          {Math.ceil(
                            element.FullItemDetails.Price /
                              props.dialogProps.activeSponsor
                                .PointToDollarRatio,
                          ) * element.Quantity}{' '}
                          pts
                        </Grid>

                        <Grid item xs={12}>
                          <br />
                        </Grid>

                        <Grid item>
                          <Button
                            variant="contained"
                            style={{
                              color: 'white',
                              backgroundColor: '#444444',
                            }}
                            onClick={() => {
                              props.dialogProps.removeItem(element)
                            }}
                          >
                            Remove from cart
                          </Button>
                        </Grid>

                        {/* <p>Quantity: {element.Quantity}</p> */}
                      </Grid>
                      <Grid item xs={12}>
                        <br />
                      </Grid>
                      <Grid item xs={12}>
                        {' '}
                        <Divider />{' '}
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })}
              {cart_cost > 0 &&
              cart_cost < props.dialogProps.activeSponsor.Points ? (
                <Grid item container xs={11} justify="space-between">
                  <Grid item xs={8}>
                    <TextField
                      id="user-bio"
                      label="Address"
                      type="text"
                      error={shippingAddressHelperText}
                      helperText={shippingAddressHelperText}
                      placeholder="Enter the shipping address"
                      variant="filled"
                      fullWidth
                      onChange={(event) => {
                        setShippingAddressHelperText(null)
                        // update state
                        setShippingAddress(event.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item container align="right" justify="flex-end" xs={4}>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (!shippingAddress || shippingAddress === '') {
                            setShippingAddressHelperText('Required')
                            return
                          }

                          if (
                            cart_cost > 0 &&
                            cart_cost < props.dialogProps.activeSponsor.Points
                          ) {
                            let ordered_products = props.dialogProps.cart
                              .filter((element) => element.Quantity > 0)
                              .map((element) => {
                                return {
                                  ProductID: element.ProductID,
                                  Quantity: parseInt(element.Quantity),
                                  CostPerItem: parseFloat(
                                    element.FullItemDetails.Price,
                                  ),
                                }
                              })

                            let requestOptions = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                SponsorID: props.dialogProps.activeSponsor.SponsorID.replaceAll(
                                  "'",
                                  "''",
                                ),
                                DriverID: props.dialogProps.activeDriver.Username.replaceAll(
                                  "'",
                                  "''",
                                ),
                                ProductIDs: ordered_products,
                                Cost:
                                  cart_cost *
                                  props.dialogProps.activeSponsor
                                    .PointToDollarRatio,

                                ShippingAddress: shippingAddress.replaceAll(
                                  "'",
                                  "''",
                                ),
                              }),
                            }

                            fetch(apis.CreateOrder, requestOptions).then(() => {
                              history.push('/orders')
                            })

                            // send checkout email
                            let user_email = props.dialogProps.activeDriver.Username.replaceAll(
                              "'",
                              "''",
                            )

                            let product_id_list = ordered_products.map(
                              (element) => {
                                return element.ProductID
                              },
                            )

                            let product_quantity_list = ordered_products.map(
                              (element) => {
                                return element.Quantity
                              },
                            )

                            let requestOptions2 = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                products: product_id_list,
                                quantities: product_quantity_list,
                                userEmail: user_email,
                              }),
                            }
                            fetch(apis.SendCheckoutEmail, requestOptions2)
                          }
                        }}
                      >
                        Check out
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      {cart_cost} points
                    </Grid>
                  </Grid>
                </Grid>
              ) : cart_cost > props.dialogProps.activeSponsor.Points ? (
                <p>
                  Not enough points {cart_cost} required, but you only have{' '}
                  {props.dialogProps.activeSponsor.Points}
                </p>
              ) : (
                <p>Your cart is empty</p>
              )}
            </Grid>
          )}
          {/* 
          <Grid item align="center" xs={12}>
            <br />
          </Grid> */}
        </Grid>
      </Dialog>
    </div>
  )
}
