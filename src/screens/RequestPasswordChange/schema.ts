import { object, string } from 'yup'

export const RequestPasswordSchema = object().shape({
	resetEmail: string().required('Required Field').email('Invalid Email'),
})
