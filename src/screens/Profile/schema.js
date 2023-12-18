import { mixed, object, string } from 'yup'

export const ProfileSchema = object().shape({
	alias: string().required('Required Field'),
	email: string().required('Required Field').email('Invalid Email'),
	profileImage: mixed(),
})
