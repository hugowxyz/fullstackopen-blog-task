import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggleable = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const toggleVisible = () => setVisible(!visible)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    useImperativeHandle(ref, () => {
        return {
            toggleVisible
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisible}> {props.buttonLabel} </button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisible}> cancel </button>
            </div>
        </div>
    )
})

Toggleable.displayName = 'Toggleable'

Toggleable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Toggleable