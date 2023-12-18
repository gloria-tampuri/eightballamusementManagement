import React from 'react'
import DashLayout from '../../../../components/Dashboard/DashboardLayout/DashLayout'
import Todo from '../../../../components/Dashboard/TodoList/Todo'

const ToDoPage = () => {
  return (
   <DashLayout>
    <Todo/>
   </DashLayout>
  )
}

export default ToDoPage