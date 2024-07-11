import React from 'react'
import { CFooter } from '@coreui/react'
import { Link } from 'react-router-dom'

const AppFooter = () => {
  return (
    <CFooter className="px-4 flex justify-center lg:justify-between ">
      <div className="hidden lg:block">
        <span className="ms-1">All rights reserved &copy; 2024</span>
      </div>
      <div className="hidden lg:block">
        <span className="me-1 text-center">
          Created by:
          <Link to="https://themksolution.com/" target="_blank" className="font-semibold">
            MK Solution
          </Link>
        </span>
      </div>
      <center className="flex lg:hidden flex-col items-center">
        <center>
          <span>All rights reserved &copy; 2024</span>
        </center>
        <center>
          <span>
            Created by:
            <Link to="https://themksolution.com/" target="_blank" className="font-semibold">
              MK Solution
            </Link>
          </span>
        </center>
      </center>
    </CFooter>
  )
}

export default React.memo(AppFooter)
