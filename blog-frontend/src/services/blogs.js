import axios from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async obj => {
    const config = {
        headers: {
            Authorization: token
        }
    }

    const response = await axios.post(baseUrl, obj, config)
    return response.data
}

const update = async (id, obj) => {
    const url = `${baseUrl}/${id}`
    const response = await axios.put(url, obj)
    return response.data
}

const remove = async id => {
    const config = {
        headers: {
            Authorization: token
        }
    }
    const url = `${baseUrl}/${id}`
    const response = await axios.delete(url, config)

    return response.data
}

export default {
    getAll,
    setToken,
    create,
    update,
    remove
}