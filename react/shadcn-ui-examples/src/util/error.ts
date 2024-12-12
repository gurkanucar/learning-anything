import { AxiosError } from 'axios'

export const errorCatch = (error: AxiosError): string =>
	error.response && error.response.data
		? typeof error.response.data === 'object'
			? (error.response.data as { error: string }).error
			: (error.response.data as string)
		: error.message
