/* eslint-disable*/

import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Box, TableSortLabel } from '@material-ui/core'

import orderBy from 'lodash/orderBy'
import LoadingIcon from './LoadingIcon'

require('datejs')

const headCells = [
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email',
    width: 125,
  },
  {
    id: 'firstName',
    numeric: false,
    disablePadding: false,
    label: 'First name',
    width: 100,
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: false,
    label: 'Last name',
    width: 100,
  },
  {
    id: 'response',
    numeric: true,
    disablePadding: false,
    label: 'Response',
    width: 100,
  },
  {
    id: 'submissionDate',
    numeric: true,
    disablePadding: false,
    label: 'Submitted on',
    width: 225,
  },
  {
    id: 'responseDate',
    numeric: true,
    disablePadding: false,
    label: 'Responded on',
    width: 225,
  },
]

export default function ProcessedApplicantTable(props) {
  const [rows, setRows] = useState(null)

  const [columnToSort, setColumnToSort] = useState('responseDate')
  const [sortDirection, setSortDirection] = useState('desc')
  function handleSort(columnName) {
    if (columnName === columnToSort) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setSortDirection('desc')
    }

    setColumnToSort(columnName)
  }

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    let applicationList = props.applicants.map((applicant) => {
      return {
        firstName: applicant.applicantFirstName,
        lastName: applicant.applicantLastName,
        email: applicant.applicantEmail,
        submissionDate: applicant.submissionDate,
        responseDate: applicant.responseDate,
        response: applicant.response,
        responseReason: applicant.responseReason,
      }
    })
    setRows(applicationList)
    setIsLoading(false)
  }, [])

  if (!isLoading) {
    return (
      <TableContainer
        style={{ maxHeight: 370, minHeight: 370 }}
        component={Paper}
      >
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  width={headCell.width}
                  key={headCell.id}
                  sortDirection={
                    columnToSort === headCell.id ? sortDirection : false
                  }
                  // align={headCell.disablePadding ? 'left' : 'right'}
                >
                  <TableSortLabel
                    active={columnToSort === headCell.id}
                    direction={
                      columnToSort === headCell.id ? sortDirection : 'asc'
                    }
                    hideSortIcon={columnToSort === headCell.id ? false : true}
                    onClick={() => {
                      handleSort(headCell.id)
                    }}
                  >
                    <Box fontWeight="fontWeightBold">{headCell.label}</Box>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(rows, columnToSort, sortDirection).map((row) => (
              <TableRow
                hover={true}
                key={row.email}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  let selectedUserData = props.applicants.find((element) => {
                    return element.applicantEmail === row.email
                  })

                  props.setSelectedApplicantState(selectedUserData)
                  props.setDialogIsOpenState(true)
                }}
              >
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.response}</TableCell>
                <TableCell>
                  {Date.parse(row.submissionDate).toUTCString()}
                </TableCell>
                <TableCell>
                  {Date.parse(row.responseDate).toUTCString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  } else {
    return <LoadingIcon />
  }
}
