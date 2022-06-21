/* eslint-disable*/

import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'
import { makeStyles } from '@material-ui/core/styles'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import { Auth } from 'aws-amplify'
import { DRAWER_WIDTH } from '../Helpers/Constants'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import StorefrontIcon from '@material-ui/icons/Storefront'
import StorageIcon from '@material-ui/icons/Storage'
import GroupIcon from '@material-ui/icons/Group'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import ReceiptIcon from '@material-ui/icons/Receipt'
import PaymentIcon from '@material-ui/icons/Payment'

import { UserContext } from '../Helpers/UserContext'

// pages to show on the upper part of the drawer

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
}))

const LeftDrawer = (props) => {
  const setActiveProfile = useContext(UserContext).setActiveProfile

  let history = useHistory()
  const classes = useStyles()

  const top_pages = [
    {
      name: 'Home',
      route: '/',
      icon: <HomeIcon />,
      reqAccTypes: ['Admin', 'Driver', 'Sponsor'],
    },
    {
      name: 'My drivers',
      route: '/drivers',
      icon: <LocalShippingIcon />,
      reqAccTypes: ['Sponsor'],
    },
    {
      name: 'My applicants',
      route: '/applicants',
      icon: <PersonAddIcon />,
      reqAccTypes: ['Sponsor'],
    },
    {
      name: 'My sponsors',
      route: '/sponsors',
      icon: <SupervisorAccountIcon />,
      reqAccTypes: ['Driver'],
    },
    {
      name: 'My organization',
      route: '/organization',
      icon: <GroupIcon />,
      reqAccTypes: ['Sponsor'],
    },
    {
      name: 'My catalog',
      route: '/manage-catalog',
      icon: <StorefrontIcon />,
      reqAccTypes: ['Sponsor'],
    },

    {
      name: 'Catalog',
      route: '/browse-catalog',
      icon: <StorefrontIcon />,
      reqAccTypes: ['Driver'],
    },
    {
      name: 'My orders',
      route: '/orders',
      icon: <ReceiptIcon />,
      reqAccTypes: ['Driver'],
    },
    {
      name: 'Users',
      route: '/user-management',
      icon: <GroupIcon />,
      reqAccTypes: ['Admin'],
    },
    {
      name: 'Sponsorships',
      route: '/sponsorship-management',
      icon: <LocalShippingIcon />,
      reqAccTypes: ['Admin'],
    },
    {
      name: 'My invoices',
      route: '/sponsor-invoice',
      icon: <PaymentIcon />,
      reqAccTypes: ['Sponsor'],
    },
    {
      name: 'Invoices',
      route: '/invoices',
      icon: <PaymentIcon />,
      reqAccTypes: ['Admin'],
    },

    // {
    //   name: 'My logs',
    //   route: '/logs',
    //   icon: <StorageIcon />,
    //   reqAccTypes: ['Admin', 'Driver', 'Sponsor'],
    // },
  ]

  let bottom_pages = [
    {
      name: 'My profile',
      route: '/profile',
      icon: <PersonIcon />,
      reqAccTypes: ['Admin', 'Driver', 'Sponsor'],
    },
    {
      name: 'Switch profile',
      route: null,
      icon: <SwapHorizIcon />,
      reqAccTypes: ['Sponsor'],
      onClick: () => {
        setActiveProfile(null)
        if (
          history.location.pathname === '/' ||
          history.location.pathname === ''
        ) {
          window.location.reload()
        } else {
          history.push('/')
        }
      },
    },
    {
      name: 'Sign out',
      route: null,
      icon: <MeetingRoomIcon />,
      reqAccTypes: ['Admin', 'Driver', 'Sponsor'],
      onClick: () => {
        Auth.signOut()
        history.push('/')
      },
    },
    // {
    //   name: 'Settings',
    //   route: '/settings',
    //   icon: <SettingsIcon />,
    //   reqAccTypes: ['Admin', 'Driver', 'Sponsor'],
    // },
  ]

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />

      <Divider />

      {/* top pages */}
      <List>
        {top_pages.map((page, index) => {
          if (page.reqAccTypes.includes(props.AccountType)) {
            return (
              <ListItem
                button
                key={page.name}
                onClick={() => {
                  history.push(page.route)
                }}
              >
                <ListItemIcon>{page.icon}</ListItemIcon>
                <ListItemText primary={page.name} />
              </ListItem>
            )
          } else {
            return null
          }
        })}
        <Divider />
      </List>

      {/* bottom pages */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Divider />
        <List>
          {bottom_pages.map((page, index) => {
            if (page.reqAccTypes.includes(props.AccountType)) {
              return (
                <ListItem
                  button
                  key={page.name}
                  onClick={() => {
                    if (!page.onClick) {
                      history.push(page.route)
                    } else {
                      page.onClick()
                    }
                  }}
                >
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.name} />
                </ListItem>
              )
            } else {
              return null
            }
          })}
        </List>
      </div>
    </Drawer>
  )
}

export default LeftDrawer
