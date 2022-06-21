/* eslint-disable*/
import Grid from '@material-ui/core/Grid'
import { data } from 'browserslist'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import { ListItem } from '@material-ui/core'
import React, { useEffect } from 'react'
import '../App.css'
import addEntryData from './AdminSponsorTable'
import withListLoading1 from './sposor_loading'

function SponsortableMod(props) {
  const ListLoading1 = withListLoading1(addEntryData)
  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  })

  var tableinfo = {
    title: 'Sponsors',
    column1: 'Email',
    column2: 'Account Type',
    column3: 'Application Status',
    column4: 'Fist Name',
    column5: 'Last Name',
    column6: 'IsSuspended',
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
        <ListLoading1
          isLoading={appState.loading}
          repos={appState.repos}
          tableinfo={tableinfo}
        />
      </div>
    </div>
  )
}

export default SponsortableMod
