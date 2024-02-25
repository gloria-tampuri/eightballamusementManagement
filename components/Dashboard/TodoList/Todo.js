import React, { useState } from 'react';
import classes from './Todo.module.css';
import useSWR from 'swr';
import { IoIosClose } from 'react-icons/io';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Todo = () => {
  const [task, setTask] = useState('');
  const { data, error, mutate } = useSWR(`/api/todo`, fetcher, { refreshInterval: 1000 });

  const formSubmit = async (e) => {
    e.preventDefault();
    const postTask = {
      task: task,
    };

    try {
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postTask),
      });

      if (res.ok) {
        setTask('');
        // Trigger a re-fetch after adding a task to update the list
        mutate();
      } else {
        // Handle non-ok response, maybe log the error
        console.error('Error adding task');
      }
    } catch (error) {
      // Handle fetch error
      console.error('Network error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/todo/${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Trigger a re-fetch after deleting a task to update the list
        mutate();
      } else {
        console.error('Error deleting task');
      }
    } catch (error) {
      console.error('Network error');
    }
    console.log(taskId);
  };

  return (
    <div className={classes.todo}>
      <h1 className={classes.head}>Todo List</h1>
      <form className={classes.form} onSubmit={formSubmit}>
        <div className={classes.addTask}>
          <input
            type='text'
            placeholder='Enter task'
            value={task}
            required
            onChange={(e) => setTask(e.target.value)}
          />
          <button>Add Task</button>
        </div>
      </form>

      <div className={classes.list}>
        <ul className={classes.listContainer}>
          {data?.todo.map((tsk) => (
            <li key={tsk._id}>
              <p>{tsk.task}</p>
              <span >
                <IoIosClose onClick={() => deleteTask(tsk._id)} style={{fontSize:'1.2rem'}}/>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
