/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import {
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core'
import { UserContext } from '../Helpers/UserContext'
import ChooseCatalogSponsorDialog from '../Components/ChooseCatalogSponsorDialog'
import CartDialog from '../Components/CartDialog'
import LoadingIcon from '../Components/LoadingIcon'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import apis from '../Helpers/api_endpoints'

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

const ProductCatalogBrowsingPage = (props) => {
  const classes = useStyles()

  let userData = useContext(UserContext).user
  // TODO: use this prop to let a sponsor browse a driver's catalog.
  if (props.activeDriver) userData = props.activeDriver

  const [pageUpdate, setPageUpdate] = useState(0)
  const [
    sponsorSelectionDialogIsOpen,
    setSponsorSelectionDialogIsOpen,
  ] = useState(true)
  function setSponsorSelectionDialogIsOpenState(state, refresh) {
    setSponsorSelectionDialogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [catalogItems, setCatalogItems] = useState(null)
  const [activeSponsor, setActiveSponsor] = useState(false)

  const [cart, setCart] = useState([])
  const [cartDialogIsOpen, setCartDialogIsOpen] = useState(null)
  function setCartDialogIsOpenState(state, refresh) {
    setCartDialogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  function addItemToCart(item, quantity) {
    let original_cart = [...cart]
    let search_result = original_cart.find((element) => {
      return element.ProductID === item.ProductID
    })

    // if item already exists in the cart, just change the quantity
    if (!search_result) {
      original_cart.push({
        ProductID: item.ProductID,
        Quantity: quantity,
        FullItemDetails: item,
      })
      setCart(original_cart)
    } else {
      // update cart
      let updated_cart = cart.map((element) => {
        if (
          element.ProductID === item.ProductID &&
          element.Quantity < item.Stock
        ) {
          return {
            ...element,
            Quantity: element.Quantity + quantity,
          }
        } else {
          return {
            ...element,
          }
        }
      })
      setCart(updated_cart)
    }
  }

  function changeItemQuantity(item, newQuantity) {
    let updated_cart = cart.map((element) => {
      if (element.ProductID === item.ProductID) {
        return {
          ...element,
          Quantity: newQuantity,
        }
      } else {
        return {
          ...element,
        }
      }
    })

    setCart(updated_cart)
  }

  function removeItem(item) {
    let updated_cart = cart.filter((element) => {
      return element.ProductID !== item.ProductID
    })

    setCart(updated_cart)
  }

  const [registeredSponsors, setRegisteredSponsors] = useState(null)

  async function setActiveSponsorState(state) {
    setIsLoading(true)
    setActiveSponsor(state)

    let catalog_items_raw = await fetch(apis.GetCatalogItems + state.SponsorID)
    let catalog_items_json = await catalog_items_raw.json()
    let catalog_items_array = await JSON.parse(
      catalog_items_json.body.toString(),
    )
    let catalog_items_parsed = await catalog_items_array.Items[0].ProductIDs.L
    let catalog_items_formatted = catalog_items_parsed.map(
      (element) => element.S,
    )

    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ProductIDs: catalog_items_formatted,
      }),
    }
    let item_data_raw = await fetch(apis.GetEbayItemsByIDs, requestOptions)
    let item_data_json = await item_data_raw.json()
    let item_data_parsed = JSON.parse(item_data_json.body)

    let item_data_array = item_data_parsed.Item.map((element) => {
      return {
        ProductID: element.ItemID,
        Name: element.Title,
        PhotoURL: element.PictureURL[0],
        Stock: element.Quantity - element.QuantitySold,
        Description: element.Description.slice(0, 550),
        Price: element.ConvertedCurrentPrice.Value,
        Location: element.Location,
      }
    }).filter((element) => element.Stock > 0)

    setCatalogItems(item_data_array)
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      let partnered_sponsors_response = await fetch(
        apis.GetSponsorshipDetails + '?DriverID=' + userData.Username,
      )
      let partnered_sponsors_data = await partnered_sponsors_response.json()
      let partnered_sponsors_array = await JSON.parse(
        partnered_sponsors_data.body.toString(),
      ).Items

      let active_sponsors_array = partnered_sponsors_array.filter(
        (element) =>
          parseInt(element.Status.N) === 2 &&
          parseInt(element.AccountStatus.N) === 1,
      )

      let active_sponsors_formatted = active_sponsors_array.map((element) => {
        return {
          SponsorID: element.SponsorID.S,
          SponsorName: element.FirstName.S + ' ' + element.LastName.S,
          Points: parseInt(element.Points.N),
          SponsorOrganization: element.Organization.S,
          PointToDollarRatio: parseFloat(element.PointDollarRatio.N),
        }
      })

      setRegisteredSponsors(active_sponsors_formatted)
    })().then(() => {
      setIsLoading(false)
    })
  }, [])

  let cart_count = cart.reduce((prev, curr) => {
    let item_count = parseInt(prev) + parseInt(curr.Quantity)

    return item_count
  }, 0)

  if (!isLoading) {
    return (
      <div className={classes.root}>
        <ChooseCatalogSponsorDialog
          dialogProps={{
            dialogIsOpen: sponsorSelectionDialogIsOpen,
            setDialogIsOpenState: setSponsorSelectionDialogIsOpenState,
            activeSponsor: activeSponsor,
            setActiveSponsor: setActiveSponsorState,
          }}
        />

        <CartDialog
          dialogProps={{
            dialogIsOpen: cartDialogIsOpen,
            setDialogIsOpenState: setCartDialogIsOpenState,
            activeSponsor: activeSponsor,
            setActiveSponsor: setActiveSponsorState,
            activeDriver: userData,
            cart: cart,
            changeItemQuantity: changeItemQuantity,
            removeItem: removeItem,
          }}
        />

        {/* layout stuff */}
        <TopAppBar
          pageTitle="Product catalog"
          customItem={
            <Grid item xs={12} container justify="space-between">
              <Grid item xs={2} align="left">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={activeSponsor.SponsorID}
                  variant="standard"
                  color="primary"
                  style={{
                    color: 'white',
                    borderBottom: '1px solid white',
                    margin: '2',
                  }}
                  fullWidth
                >
                  {registeredSponsors
                    ? registeredSponsors.map((element) => (
                        <MenuItem
                          onClick={() => {
                            setCart([])
                            setActiveSponsorState(element)
                          }}
                          value={element.SponsorID}
                        >
                          {element.SponsorOrganization +
                            ': ' +
                            element.SponsorName}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </Grid>
              <Grid
                item
                xs={4}
                container
                spacing={1}
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>
                  {activeSponsor.Points ? activeSponsor.Points : 0} points
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      setCartDialogIsOpenState(true)
                    }}
                  >
                    <ShoppingCartIcon style={{ color: 'white' }} />
                  </IconButton>
                  {cart_count}
                </Grid>
              </Grid>
            </Grid>
          }
        ></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />

        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Grid container>
            {!isLoading ? (
              <div>
                {!activeSponsor ||
                !catalogItems ||
                catalogItems.length > 0 ? null : (
                  <Grid item xs={12}>
                    <Typography>This sponsor has no catalog items</Typography>
                  </Grid>
                )}
                {activeSponsor ? (
                  <Grid item xs={12} container justify="flex-start">
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                      {catalogItems.map((element) => {
                        return (
                          <Grid
                            item
                            container
                            xs={12}
                            justify="flex-start"
                            spacing={4}
                          >
                            <Grid item>
                              <img
                                src={element.PhotoURL}
                                alt="product"
                                style={{
                                  maxWidth: '250px',
                                  maxHeight: '275px',
                                  minWidth: '250px',
                                }}
                              />
                            </Grid>
                            <Grid item container xs={7}>
                              <Grid item xs={12}>
                                <Typography>
                                  <b style={{ color: '#444444' }}>
                                    {element.Name}
                                  </b>
                                </Typography>
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                container
                                justify="flex-end"
                                // component={Paper}
                              >
                                <Grid
                                  item
                                  xs={3}
                                  container
                                  justify="center"
                                  alignItems="center"
                                  // component={Paper}
                                >
                                  <Grid item container spacing={1}>
                                    <Grid item xs={12} align="right">
                                      <Typography>
                                        {element.Stock} in stock
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} align="right">
                                      <Typography>
                                        {Math.ceil(
                                          element.Price /
                                            activeSponsor.PointToDollarRatio,
                                        )}{' '}
                                        Points
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={12} align="right">
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                          addItemToCart(element, 1)
                                        }}
                                      >
                                        Add to cart
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={10}>
                              <Divider />
                            </Grid>
                          </Grid>
                        )
                      })}
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                  </Grid>
                ) : (
                  <p>choose a sponsor to view their dialog</p>
                )}
              </div>
            ) : (
              <LoadingIcon />
            )}
          </Grid>
        </main>
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar
          pageTitle="Product catalog"
          customItem={
            <Grid item xs={12} container justify="space-between">
              <Grid item xs={2} align="left">
                <Select
                  variant="standard"
                  color="primary"
                  fullWidth
                  style={{
                    color: 'white',
                    borderBottom: '1px solid white',
                    margin: '2',
                  }}
                ></Select>
              </Grid>
              <Grid
                item
                xs={4}
                container
                spacing={1}
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>0 points</Grid>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      setCartDialogIsOpenState(true)
                    }}
                  >
                    <ShoppingCartIcon style={{ color: 'white' }} />
                  </IconButton>
                  {cart_count}
                </Grid>
              </Grid>
            </Grid>
          }
        ></TopAppBar>
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

export default ProductCatalogBrowsingPage
