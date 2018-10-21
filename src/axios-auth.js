import axios from 'axios'

const instance = axios.create({
    //firebase auth rest api:
    baseURL : 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
})

// instance.defaults.headers.common[]
export default instance