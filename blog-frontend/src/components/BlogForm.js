import React, { useState } from 'react'

const BlogForm = ({ addBlog }) => {
    const [blogTitle, setBlogTitle] = useState('')
    const [blogAuthor, setBlogAuthor] = useState('')
    const [blogUrl, setBlogUrl] = useState('')

    const createBlog = event => {
        event.preventDefault()

        const newBlogObj = {
            title: blogTitle,
            author: blogAuthor,
            url: blogUrl
        }

        addBlog(newBlogObj)

        setBlogTitle('')
        setBlogAuthor('')
        setBlogUrl('')
    }

    return (
        <div>
            <form onSubmit={createBlog}>
                <div>
                    title
                    <input
                        id='title'
                        value={blogTitle}
                        name='Title'
                        onChange={({ target }) => setBlogTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        id='author'
                        value={blogAuthor}
                        name='Author'
                        onChange={({ target }) => setBlogAuthor(target.value)}
                    />
                </div>
                <div>
                    url
                    <input
                        id='url'
                        value={blogUrl}
                        name='Url'
                        onChange={({ target }) => setBlogUrl(target.value)}
                    />
                </div>
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}

export default BlogForm