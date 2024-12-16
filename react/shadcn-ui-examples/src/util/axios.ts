import axios, { AxiosError } from 'axios'
import { TokenEnum } from './types'

export const API_URL = `${import.meta.env.VITE_BASE_URL}`

const options = {
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	}
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = sessionStorage.getItem(TokenEnum.ACCESS_TOKEN)
	if (config.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}
	return config
})

axiosWithAuth.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		return Promise.reject(error)
	}
)

export { axiosClassic, axiosWithAuth }
