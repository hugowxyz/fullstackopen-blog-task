const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (accumulator, current) => accumulator + current
    
    return blogs.map(blog => blog.likes).reduce(reducer)
}

const favouriteBlog = (blogs) => {
    let max = { likes: 0 }

    for (let blog of blogs) {
        if (blog.likes >= max.likes) {
            max = blog
        }   
    }

    return { title: max.title, author: max.author, likes: max.likes }
}

const mostBlogs = (blogs) => {
    const authors = {}

    for (let blog of blogs) {
        authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1
    }

    let maxAuthor = { author: undefined, blogs: undefined } 
    let maxCount = 0

    for (let author in authors) {
        if (authors[author] >= maxCount) {
            maxAuthor['author'] = author
            maxAuthor['blogs'] = authors[author]
        }
    }

    return maxAuthor
}

module.exports = {
    dummy, totalLikes, favouriteBlog, mostBlogs
}