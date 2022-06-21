/* eslint-disable*/
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

export default function CatalogItemDialog(props) {
  const handleClose = () => {
    props.dialogProps.setItemDialogIsOpen(false)
  }

  let left_col_width = 4
  let right_col_width = 7

  if (props.dialogProps.selectedCatalogEntry) {
    return (
      <div>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={props.dialogProps.itemDialogIsOpen}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {props.dialogProps.selectedCatalogEntry.Name}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} justify="flex-start">
              <Grid item container xs={12} spacing={2} justify="flex-start">
                <Grid item xs={left_col_width} align="center">
                  <img
                    src={props.dialogProps.selectedCatalogEntry.PhotoURL}
                    alt="alt text"
                    style={{ maxWidth: '250px', maxHeight: '250px' }}
                  />
                </Grid>
                <Grid
                  item
                  xs={right_col_width}
                  container
                  alignItems="flex-start"
                  direction="row"
                >
                  <Grid item xs={12} align="left">
                    {props.dialogProps.selectedCatalogEntry.Stock} in stock | $
                    {props.dialogProps.selectedCatalogEntry.Price.toFixed(2)}{' '}
                    each
                  </Grid>
                  <Grid item xs={12} align="left"></Grid>

                  <Grid item xs={12}>
                    <br />
                  </Grid>
                  <Grid item xs={12} align="left">
                    <Typography>
                      <b>Description</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="left">
                    {props.dialogProps.selectedCatalogEntry.Description}
                  </Grid>
                  <Grid item xs={12}>
                    <br />
                  </Grid>

                  {props.dialogProps.ActionSection ? (
                    <Grid item xs={12} align="left">
                      <props.dialogProps.ActionSection />
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    )
  } else {
    return null
  }
}
