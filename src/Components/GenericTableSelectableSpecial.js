/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Box, Checkbox, TableSortLabel } from '@material-ui/core'

import orderBy from 'lodash/orderBy'
import LoadingIcon from './LoadingIcon'

require('datejs')

export default function GenericTableSelectable(props) {
  const [rows, setRows] = useState(null)

  const [columnToSort, setColumnToSort] = useState(props.initialSortedColumn)
  const [allSelected, setAllSelected] = useState(false)
  const [sortDirection, setSortDirection] = useState(
    props.initialSortedDirection,
  )
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
    let dataList = props.data
    setRows(dataList)
    setIsLoading(false)
  }, [])

  function onSelectAllClick(curr_state) {
    let updated_items = props.checkedItems.map((element) => {
      return {
        ...element,
        isChecked: !curr_state,
      }
    })

    props.setCheckedItems(updated_items)
  }

  // returns whether or not a row is marked as 'checked' in program state. true if yes. false if no.
  function isSelected(row_key) {
    let selectedItem = props.checkedItems.find((element) => {
      return element.key === row_key
    })
    return selectedItem ? selectedItem.isChecked : false
  }

  function setIsSelected(row_key, state) {
    let updated_items = props.checkedItems.map((element) => {
      if (element.key === row_key) {
        return { ...element, isChecked: !element.isChecked }
      } else {
        return element
      }
    })

    props.setCheckedItems(updated_items)
  }

  if (!isLoading) {
    return (
      <TableContainer
        style={{ maxHeight: 370, minHeight: 370 }}
        component={Paper}
      >
        <Table stickyHeader aria-label="simple table">
          {/* Table header */}
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  // onChange={onSelectAllClick}
                  onClick={(event) => {
                    event.stopPropagation()
                    setAllSelected(!allSelected)
                    onSelectAllClick(allSelected)
                  }}
                />
              </TableCell>

              {/* map the head cells to the table header */}
              {props.headCells.map((headCell) => (
                <TableCell
                  width={headCell.width}
                  key={headCell.id}
                  sortDirection={
                    columnToSort === headCell.id ? sortDirection : false
                  }
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

          {/* Table content */}
          <TableBody>
            {/* map the data to the table rows */}
            {orderBy(rows, columnToSort, sortDirection).map((row) => (
              <TableRow
                hover={true}
                key={row[props.tableKey]}
                style={props.setSelectedRow ? { cursor: 'pointer' } : null}
                onClick={
                  props.setSelectedRow
                    ? () => {
                        let selectedRow = rows.find((element) => {
                          return element[props.tableKey] === row[props.tableKey]
                        })

                        if (props.setSelectedRow)
                          props.setSelectedRow(selectedRow)

                        if (props.setDialogIsOpenState) {
                          props.setDialogIsOpenState(true)
                        }
                      }
                    : null
                }
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      props.checkedItems.find((element) => {
                        return (
                          element.isChecked === true &&
                          element.key === row[props.tableKey]
                        )
                      })
                        ? true
                        : false
                    }
                    onClick={(event) => {
                      event.stopPropagation()
                      setIsSelected(
                        row[props.tableKey],
                        !isSelected(row[props.tableKey]),
                      )
                    }}
                  />
                </TableCell>

                {/* display the row key if requested */}
                {props.showKey ? (
                  <TableCell>{row[props.tableKey]}</TableCell>
                ) : null}

                {/* display the row cells */}
                {Object.entries(row).map((cell) => {
                  if (cell[0].toUpperCase().includes('DATE') && cell[1]) {
                    return (
                      <TableCell>{Date.parse(cell[1]).toUTCString()}</TableCell>
                    )
                  } else if (cell[0] !== props.tableKey) {
                    return <TableCell>{cell[1]}</TableCell>
                  } else {
                    return null
                  }
                })}
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
