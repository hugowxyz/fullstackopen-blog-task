import React, { useState, useEffect } from 'react'

import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')

  const blogFormRef = React.createRef()

  const dataHook = () => {
    blogService.getAll()
      .then(returnedBlogs => {
        returnedBlogs
          .sort((a, b) => { 
            console.log()
            if ( a.likes < b.likes ) {
              return 1;
            } else if ( a.likes > b.likes ) {
              return -1;
            } else {
              return 0;
            }
          })

        console.log(returnedBlogs)
        setBlogs(returnedBlogs)
      })
  }
  useEffect(dataHook, [])

  const loginHook = () => {
    const userJSON = window.localStorage.getItem('loggedUser')
    if ( !userJSON ) return
    const parsedUser = JSON.parse(userJSON)
    
    setUser(parsedUser)
    blogService.setToken(parsedUser.token)
  }
  useEffect(loginHook, [])

  const handleLogin = async obj => {
    try {
      const returnedUser = await loginService.login(obj)
      
      blogService.setToken(returnedUser.token)

      window.localStorage.setItem('loggedUser', JSON.stringify(returnedUser))

      setUser(returnedUser)

    } catch(exception) {
      setNotification('Failed to login, incorrect credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = event => {
    window.localStorage.removeItem('loggedUser')
    
    setUser(null)
  }

  const handleRemoveBlog = id => {
    const newBlogs = blogs.filter(blog => blog.id !== id)
    setBlogs(newBlogs)
  }

  const createBlog = async newBlogObj => {
    try {
      const returnedBlog = await blogService.create(newBlogObj)

      blogFormRef.current.toggleVisible()

      setBlogs(blogs.concat(returnedBlog))
      setNotification(`Successfully created '${returnedBlog.title}'`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch(exception) {
      setNotification('Error creating blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <Toggleable buttonLabel='login'>
        <LoginForm 
          addUser={handleLogin}
        />
    </Toggleable>
    )
  }

  const blogForm = () => {
    return (
      <Toggleable buttonLabel='create blog' ref={blogFormRef}>
        <BlogForm addBlog={createBlog} />
      </Toggleable>
    )
  }

  return (
    <div>
      <Notification message={notification} />

      { user === null ? loginForm() : 
      <div>
        logged in as <strong>{user.username}  </strong>
        <button onClick={handleLogout}>logout</button>
        {blogForm()}
      </div>
      }

      <h2>blogs</h2>
      {
        blogs.map(blog => 
        <Blog 
          key={blog.id} 
          baseBlog={blog} 
          handleRemoveBlog={handleRemoveBlog}  
        />)
      }
    </div>
  )

}

export default App