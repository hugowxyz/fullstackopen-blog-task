/* eslint-disable linebreak-style */
import React, { useState } from 'react'

import blogService from '../services/blogs'

const Blog = ({ baseBlog, handleRemoveBlog }) => {
    const [blog, setBlog] = useState(baseBlog)
    const [viewAll, setViewAll] = useState(true)


    const blogStyles = {
        border: '1px solid black',
        padding: '10px',
        margin: '5px auto',
        maxWidth: '80%',
        backgroundColor: 'pink'
    }

    const handleLike = async () => {
        const newBlog = {
            ...blog,
            likes: blog.likes + 1
        }
        const returnedBlog = await blogService.update(newBlog.id, newBlog)
        setBlog(returnedBlog)
    }

    const handleRemove = async () => {
        if ( window.confirm('Are you sure you want to delete blog?') ) {
            try {
                await blogService.remove(blog.id)
                handleRemoveBlog(blog.id)
            } catch(exception) {
                alert('Failed to remove blog. Are you sure you\'re the creator?')
            }

        }
    }

    const toggleView = () => setViewAll(!viewAll)

    if ( viewAll ) {
        return (
            <div style={blogStyles} className='blogDiv'>
                <p>
                    <span className='title'> {blog.title} </span> by <em className='author'>{blog.author} </em>
                    <button onClick={toggleView}>show less</button>
                </p>
                <p className='url'>{blog.url}</p>
                <p> <span className='likes'>{blog.likes}</span> <button onClick={handleLike}>like</button></p>
                <p className='username'>{blog.user.username}</p>

                <button onClick={handleRemove}>delete</button>
            </div>
        )
    }

    return (
        <div style={blogStyles} className='blogDiv'>
            <p>
                {blog.title} by <em>{blog.author}</em>
                <button onClick={toggleView}>show more</button>
            </p>
        </div>
    )


}
export default Blog
