import _ from 'lodash'

import { ACTIONS } from './actions'

export const INITIAL_STATE = {
	alias: {
		value: '',
		validator: /\w+/,
		message: 'Alias should have atleast 3 characters',
		showError: false,
	},
	email: {
		value: '',
		validator: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
		message: 'Please enter valid email',
		showError: false,
	},
	password: {
		value: '',
		validator: /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%?=*&]).{8,}$/,
		message:
			'Password should be 8 characters long, contain one special character, one digit and a capital letter',
		showError: false,
	},
	formSubmitted: false,
}

export default function reducer(state, action) {
	const key = action.key
	const existingKeyState = state[key]
	const formSubmitted = state.formSubmitted
	const isLoggingIn = action.isLoggingIn
	switch (action.type) {
		case ACTIONS.VALUE_EDIT:
			return {
				...state,
				[key]: {
					...existingKeyState,
					value: action.value,
					showError:
						formSubmitted &&
						!existingKeyState.validator.test(action.value),
				},
			}
		case ACTIONS.VALIDATE:
			return {
				...state,
				[key]: {
					...existingKeyState,
					showError: !existingKeyState.validator.test(
						existingKeyState.value,
					),
				},
			}
		case ACTIONS.FORM_SUBMIT:
			return _.mapValues(state, (obj, key) => {
				return key === 'formSubmitted'
					? true
					: key === 'alias' && isLoggingIn
						? obj
						: { ...obj, showError: !obj.validator.test(obj.value) }
			})
		default:
			return INITIAL_STATE
	}
}
