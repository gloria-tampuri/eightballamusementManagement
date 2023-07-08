import React from 'react'
import DashLayout from '../../../components/Dashboard/DashboardLayout/DashLayout'
import DashboardMain from '../../../components/Dashboard/DashboardMain/DashboardMain'

const Dashboard = () => {
  return (
    <div>
        <DashLayout>
            <DashboardMain/>
        </DashLayout>
    </div>
  )
}

export default Dashboard