/* eslint-disable*/
import Grid from '@material-ui/core/Grid'
import { data } from 'browserslist'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import { ListItem } from '@material-ui/core'
import React, { useEffect } from 'react'
import '../App.css'
import addEntryData from './User_List'
import withListLoading from './with_List_Loading'

function AdminUserModPage(props) {
  const ListLoading = withListLoading(addEntryData)
  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  })

  var tableinfo = {
    title: 'All Users',
    column1: 'Email',
    column2: 'Account Type',
    column3: 'Fist Name',
    column4: 'Last Name',
    column5: 'Total Points',
    column6: 'Last Login',
    column7: 'Last Login',
  }

  useEffect(() => {
    setAppState({ loading: true })
    var apiUrl = props.link
    // 'https://wn0wfce7a3.execute-api.us-east-1.amazonaws.com/dev/entries'
    fetch(apiUrl)
      .then((res) => res.json())
      .then((repos) => {
        // addEntryData(repos)
        setAppState({ loading: false, repos: repos })
      })
  }, [setAppState])

  return (
    <div className="App">
      <div className="container"></div>
      <div className="repo-container">
        <ListLoading
          isLoading={appState.loading}
          repos={appState.repos}
          tableinfo={tableinfo}
        />
      </div>
    </div>
  )
}

export default AdminUserModPage
