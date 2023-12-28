import { object, string, ref } from 'yup'

export const ResetPasswordSchema = object().shape({
	newPassword: string().required('Required Field'),
	confirmPassword: string()
		.required('Required Field')
		.oneOf([ref('newPassword')], 'Password should match above password'),
})
