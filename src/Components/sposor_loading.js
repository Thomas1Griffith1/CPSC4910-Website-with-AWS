/* eslint-disable*/
import React from 'react'

function WithListLoading1(Component) {
  return function WihLoadingComponent1({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />

    return (
      <p style={{ textAlign: 'center', fontSize: '30px' }}>
        Hold on, fetching data may take some time :)
      </p>
    )
  }
}
export default WithListLoading1
