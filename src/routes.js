import React from 'react'
import Completed from './views/pages/Completed'
import Pending from './views/pages/Pending'
import Failed from './views/pages/Failed'
import Settings from './views/pages/Settings'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', name: 'Dashboard', element: Dashboard },
  { path: '/completed', name: 'Completed', element: Completed },
  { path: '/pending', name: 'Pending', element: Pending },
  { path: '/failed', name: 'Failed', element: Failed },
  { path: '/settings', name: 'Settings', element: Settings },
]

export default routes
