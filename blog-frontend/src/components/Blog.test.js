import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'


describe('<Blog />', () => {
    let component

    beforeEach(() => {
        const blog = {
            title: 'title',
            author: 'author',
            user: {
                username: 'username'
            }
        }
        component = render(<Blog baseBlog={blog} />)
    })

    test('blog renders author and title and does not render likes or url by default', () => {
        const title = component.container.querySelector('.title')
        expect(title).toBeDefined()

        const author = component.container.querySelector('.author')
        expect(author).toBeDefined()

        const likes = component.container.querySelector('.likes')
        expect(likes).toHaveTextContent('')

        const url = component.container.querySelector('.url')
        expect(url).toHaveTextContent('')
    })

    test('likes is shown when like button is pressed', () => {
        const likeButton = component.getByText('like')
        fireEvent.click(likeButton)

        const likes = component.container.querySelector('.likes')
        expect(likes).toBeDefined()
    })

    test('when like button is clicked twice', () => {
        const likeButton = component.getByText('like')

        fireEvent.click(likeButton)
        fireEvent.click(likeButton)
    })
})