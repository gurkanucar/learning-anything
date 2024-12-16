import { useNavigate } from 'react-router'

export const useRoute = () => {
	const route = useNavigate()

	return {
		route
	}
}
