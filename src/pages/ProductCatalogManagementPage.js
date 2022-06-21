/* eslint-disable*/
import React, { useContext, useEffect, useState } from 'react'
import LeftDrawer from '../Components/LeftDrawer'
import TopAppBar from '../Components/TopAppBar'
import { makeStyles } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import { Button, Grid } from '@material-ui/core'
import { UserContext } from '../Helpers/UserContext'
import ChooseCatalogItemsPanel from '../Components/ChooseCatalogItemsPanel'
import CatalogItemDialog from '../Components/CatalogItemDialog'
import LoadingIcon from '../Components/LoadingIcon'
import AddCatalogItemDialog from '../Components/AddCatalogItemDialog'
import DeleteCatalogItemDialog from '../Components/DeleteCatalogItemDialog'
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

const ProductCatalogManagementPage = () => {
  const classes = useStyles()
  const userData = useContext(UserContext).user

  const [isLoading, setIsLoading] = useState(true)

  const [itemTableData, setItemTableData] = useState(null)
  function setItemTableDataState(state) {
    setItemTableData(state)
  }

  const [allCatalogData, setAllCatalogData] = useState(null)
  const setAllCatalogDataState = (state) => {
    setAllCatalogData(state)
  }

  // dialog control
  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState(false)
  function setAddItemDialogIsOpenState(state, refresh) {
    setAddItemDialogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  const [deleteItemCatalogIsOpen, setDeleteItemCatalogIsOpen] = useState(false)
  function setDeleteItemCatalogIsOpenState(state, refresh) {
    setDeleteItemCatalogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  const [itemManagementDialogIsOpen, setItemManagementDialogIsOpen] = useState(
    false,
  )
  function setItemManagementDialogIsOpenState(state, refresh) {
    setItemManagementDialogIsOpen(state)

    if (refresh) {
      setPageUpdate(pageUpdate + 1)
    }
  }

  const [pageUpdate, setPageUpdate] = useState(0)
  function fullPageUpdateState() {
    setPageUpdate(pageUpdate + 1)
  }

  const [selectedCatalogEntry, setSelectedCategoryEntry] = useState(null)
  function setSelectedCategoryEntryState(state) {
    setSelectedCategoryEntry(state)
  }

  const [checkedItems, setCheckedItems] = useState(null)
  function setCheckedItemsState(state) {
    setCheckedItems(state)
  }

  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      let catalog_items_raw = await fetch(
        apis.GetCatalogItems + userData.Username,
      )
      let catalog_items_json = await catalog_items_raw.json()
      let catalog_items_array = await JSON.parse(
        catalog_items_json.body.toString(),
      )
      let catalog_items_parsed = catalog_items_array.Items[0].ProductIDs.L
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
      let item_data_parsed = await JSON.parse(item_data_json.body)

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
      })

      let catalog_item_table_data = item_data_array.map((element) => {
        return {
          ProductID: element.ProductID,
          PhotoURL: element.PhotoURL,
          Name: element.Name,
          Price: element.Price,
          Stock: element.Stock,
        }
      })

      setAllCatalogData(item_data_array)
      setCheckedItems(
        catalog_item_table_data.map((element) => {
          return {
            key: element.ProductID,
            isChecked: false,
          }
        }),
      )
    })().then(() => {
      setIsLoading(false)
    })
  }, [pageUpdate])

  if (isLoading) {
    return (
      <div className={classes.root}>
        {/* layout stuff */}
        <TopAppBar pageTitle="Catalog management"></TopAppBar>
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
        <TopAppBar pageTitle="Catalog management"></TopAppBar>
        <LeftDrawer AccountType={userData.AccountType} />
        {/* page content (starts after first div) */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <CatalogItemDialog
            dialogProps={{
              itemDialogIsOpen: itemManagementDialogIsOpen,
              setItemDialogIsOpen: setItemManagementDialogIsOpenState,
              fullPageUpdateState: fullPageUpdateState,
              selectedCatalogEntry: selectedCatalogEntry
                ? allCatalogData.find((element) => {
                    return element.ProductID === selectedCatalogEntry.ProductID
                  })
                : null,
              ActionSection: () => {
                return (
                  <Grid item container xs={12} spacing={1}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        // style={{ backgroundColor: '#444444', color: 'White' }}
                        onClick={() => {
                          let new_checked_items = checkedItems.map(
                            (element) => {
                              if (
                                element.key === selectedCatalogEntry.ProductID
                              ) {
                                return {
                                  ...element,
                                  isChecked: true,
                                }
                              } else {
                                return element
                              }
                            },
                          )

                          setCheckedItems(new_checked_items)
                          setItemManagementDialogIsOpenState(false)
                        }}
                      >
                        Select item
                      </Button>
                    </Grid>
                  </Grid>
                )
              },
            }}
          />
          <AddCatalogItemDialog
            dialogProps={{
              addItemDialogIsOpen: addItemDialogIsOpen,
              setAddItemDialogIsOpenState: setAddItemDialogIsOpenState,
              fullPageUpdateState: fullPageUpdateState,
              allCatalogData: allCatalogData,
              setAllCatalogDataState: setAllCatalogDataState,
            }}
          />

          <DeleteCatalogItemDialog
            dialogProps={{
              deleteItemCatalogIsOpen: deleteItemCatalogIsOpen,
              setDeleteItemCatalogIsOpenState: setDeleteItemCatalogIsOpenState,
              fullPageUpdateState: fullPageUpdateState,
              allCatalogData: allCatalogData,
              setAllCatalogDataState: setAllCatalogDataState,
              checkedItems: checkedItems,
            }}
          />

          <Grid container justify="flex-start">
            <Grid item sm={12} md={11} lg={9} xl={7}>
              <ChooseCatalogItemsPanel
                tableProps={{
                  data: allCatalogData,
                  setDataState: setItemTableDataState,
                  selectedRow: selectedCatalogEntry,
                  setSelectedRow: setSelectedCategoryEntryState,
                  dialogIsOpen: itemManagementDialogIsOpen,
                  setDialogIsOpen: setItemManagementDialogIsOpenState,
                  setCheckedItemsState: setCheckedItemsState,
                  checkedItems: checkedItems,
                }}
                dialogProps={{
                  itemManagementDialogIsOpen: itemManagementDialogIsOpen,
                  setItemManagementDialogIsOpenState: setItemManagementDialogIsOpenState,
                  addItemDialogIsOpen: addItemDialogIsOpen,
                  setAddItemDialogIsOpenState: setAddItemDialogIsOpenState,
                  allCatalogData: allCatalogData,
                  setAllCatalogDataState: setAllCatalogDataState,
                  setDeleteItemCatalogIsOpenState: setDeleteItemCatalogIsOpenState,
                }}
              />
            </Grid>
          </Grid>
        </main>
      </div>
    )
  }
}

export default ProductCatalogManagementPage
