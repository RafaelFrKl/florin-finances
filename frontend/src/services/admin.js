import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const deleteUser = async (id) => {
    const newURL = baseUrl + '/' + id
    const response = await axios.delete(newURL)
    return response.status
}
export default { getAll, deleteUser }