import React from 'react'
import { CFooter } from '@coreui/react'
import { Link } from 'react-router-dom'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">All rights reserved &copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Created by: </span>
        <Link to="https://themksolution.com/" target="_blank" className="font-semibold">
          MK Solution
        </Link>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
