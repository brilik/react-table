import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data
      },
      useSortBy
    )

  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  )
}

function App() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    fetch(
      'https://eu-central-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-hpnga/service/Sample/incoming_webhook/webhook0'
    )
      .then(r => r.json())
      .then(r =>
        setRows(
          r.map(r => ({
            id: r.id,
            name: r.business_name,
            city: r.address.city,
            sector: r.sector,
            result: r.result,
            date: r.date
          }))
        )
      )
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID & Name',
        columns: [
          {
            Header: 'ID',
            accessor: 'id'
          },
          {
            Header: 'Business Name',
            accessor: 'name'
          }
        ]
      },
      {
        Header: 'Other info',
        columns: [
          {
            Header: 'City',
            accessor: 'city'
          },
          {
            Header: 'Sector',
            accessor: 'sector'
          },
          {
            Header: 'Result',
            accessor: 'result'
          },
          {
            Header: 'Date',
            accessor: 'date'
          }
        ]
      }
    ],
    []
  )

  if (rows.length === 0) return <div>Loading...</div>

  return (
    <Styles>
      <Table columns={columns} data={rows} />
    </Styles>
  )
}

export default App
