/* eslint-disable*/
import React, { useContext } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Divider, Grid, Typography } from '@material-ui/core'
import { UserContext } from '../Helpers/UserContext'
import apis from '../Helpers/api_endpoints'

export default function DeleteCatalogItemDialog(props) {
  const userData = useContext(UserContext).user

  const handleClickOpen = () => {
    props.dialogProps.setDeleteItemCatalogIsOpenState(true)
  }

  const handleClose = () => {
    props.dialogProps.setDeleteItemCatalogIsOpenState(false)
  }

  if (
    props.dialogProps.checkedItems &&
    props.dialogProps.deleteItemCatalogIsOpen
  ) {
    let new_item_list = props.dialogProps.checkedItems
      .filter((element) => !element.isChecked)
      .map((element) => element.key)

    return (
      <div>
        <Dialog
          open={props.dialogProps.deleteItemCatalogIsOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Delete items?'}</DialogTitle>
          <DialogContent>
            <Grid container spacing="2">
              <Grid item xs={12}>
                <Typography>
                  Are you sure you want to remove{' '}
                  {props.dialogProps.checkedItems.length - new_item_list.length}{' '}
                  items from your catalog?
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button
              onClick={() => {
                let requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    SponsorID: userData.Username.replaceAll("'", "''"),
                    ProductIDs: new_item_list,
                  }),
                }

                fetch(apis.SetCatalogItems, requestOptions).then(() => {
                  props.dialogProps.setDeleteItemCatalogIsOpenState(false, true)
                })
              }}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  } else {
    return null
  }
}
