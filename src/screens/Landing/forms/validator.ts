import _ from 'lodash'

export const isFormValid = (state, isLoggingIn) =>
	_.every(
		_.pick(
			state,
			isLoggingIn
				? ['email', 'password']
				: ['alias', 'email', 'password'],
		),
		(value, index, coll) => value.validator.test(value.value),
	)
