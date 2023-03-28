import axios from 'axios'

const baseUrl = '/api/member-service/login'

export function login (loginData) {
  return axios.post(`${baseUrl}/login`, loginData)
}
