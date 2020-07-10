import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
    test('adding to blogs', () => {
        const mockHandler = jest.fn()

        const component = render(<BlogForm addBlog={mockHandler} />)

        const title = component.container.querySelector('#title')
        const author = component.container.querySelector('#author')
        const url = component.container.querySelector('#url')
        const form = component.container.querySelector('form')

        fireEvent.change(title, {
            target: { value: 'title' }
        })
        fireEvent.change(author, {
            target: { value: 'author' }
        })
        fireEvent.change(url, {
            target: { value: 'url' }
        })

        fireEvent.submit(form)
        expect(mockHandler.mock.calls).toHaveLength(1)
    })
})