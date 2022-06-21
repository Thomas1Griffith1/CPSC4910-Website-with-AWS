/* eslint-disable*/
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { useContext } from 'react'
import { UserContext } from '../Helpers/UserContext'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
}))

function TopAppBar(props) {
  const classes = useStyles()
  const userData = useContext(UserContext).user

  if (!props.customItem) {
    return (
      <div>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Grid
              container
              justify="space-between"
              spacing={10}
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h6">{props.pageTitle}</Typography>
              </Grid>
              <Grid item>
                <Typography>{userData.Username.split('@')[0]}</Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    )
  } else {
    return (
      <div>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">{props.pageTitle}</Typography>
              </Grid>
              <Grid item>
                <Typography>{userData.Username.split('@')[0]}</Typography>
              </Grid>

              {props.customItem}
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default TopAppBar
