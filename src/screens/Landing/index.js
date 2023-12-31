import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useState, useReducer } from 'react'
import { View, ScrollView, Dimensions } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { ScaledSheet } from 'react-native-size-matters'

import Header from './components/Header'
import { ACTIONS } from './forms/actions'
import reducer, { INITIAL_STATE } from './forms/reducer'
import { isFormValid } from './forms/validator'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { supabase } from '../../lib/supabase'
import Toggle from '../../renderprops/Toggle'
import Pressable from '../../restyle/components/pressable'
import Text from '../../restyle/components/text'
import routes from '../../routes/routes'

const { width } = Dimensions.get('window')

export default function Landing({ navigation }) {
	const [isLoggingIn, setIsLogginIn] = useState(true)
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
	const [submitting, setSubmitting] = useState(false)

	const toggleStatus = () => setIsLogginIn((prev) => !prev)

	const handleFieldEdit = (key) => (value) => {
		dispatch({ type: ACTIONS.VALUE_EDIT, value, key })
		if (state[key].showError) {
			dispatch({ type: ACTIONS.VALIDATE, key })
		}
	}

	const handleSubmit = async () => {
		try {
			if (isFormValid(state, isLoggingIn)) {
				setSubmitting(true)
				if (isLoggingIn) {
					const data = await supabase.auth.signInWithPassword({
						email: state.email.value,
						password: state.password.value,
					})
					if (data.error) {
						throw data.error.message
					}
				} else {
					const data = await supabase.auth.signUp({
						email: state.email.value,
						password: state.password.value,
						options: {
							data: {
								userName: state.alias.value,
							},
						},
					})
					if (data.error) {
						throw data.error?.message
					}
				}
			} else {
				dispatch({ type: ACTIONS.FORM_SUBMIT, isLoggingIn })
			}
		} catch (err) {
			showMessage({
				message: err ?? 'Something went wrong. Please try again',
				type: 'danger',
			})
		} finally {
			setSubmitting(false)
		}
	}

	const handleForgotPassword = () => {
		navigation.navigate(routes.REQUEST_RESET)
	}

	return (
		<ScrollView
			style={styles.scrollContent}
			contentContainerStyle={styles.root}
			keyboardShouldPersistTaps="always"
		>
			<Header />
			<View style={styles.formContainer}>
				<View style={styles.formHeader}>
					{isLoggingIn ? (
						<View>
							<Text style={styles.formTitle}>Login</Text>
							<Text
								textAlign="center"
								variant="heading5Medium"
								mb="md"
							>
								Enter your details to signin to your account
							</Text>
						</View>
					) : (
						<View>
							<Text style={styles.formTitle}>Sign Up</Text>
							<Text style={styles.formHeaderInfo}>
								Enter your details to signup for butterfingers
							</Text>
						</View>
					)}
				</View>
				{!isLoggingIn && (
					<Input
						leftComponent={
							<MaterialIcons
								style={styles.formIcon}
								name="person"
							/>
						}
						placeholder="Alias"
						value={state['alias'].value}
						onChangeText={handleFieldEdit('alias')}
						rootStyle={styles.nonLastField}
						error={
							state['alias'].showError && state['alias'].message
						}
					/>
				)}
				<Input
					leftComponent={
						<MaterialIcons style={styles.formIcon} name="mail" />
					}
					placeholder="Email Address"
					inputMode="email"
					value={state['email'].value}
					onChangeText={handleFieldEdit('email')}
					rootStyle={styles.nonLastField}
					autoCapitalize="none"
					error={state['email'].showError && state['email'].message}
				/>
				<Toggle>
					{({ toggled: isSecureText, toggle }) => (
						<Input
							leftComponent={
								<MaterialIcons
									style={styles.formIcon}
									name="lock"
								/>
							}
							placeholder="Password"
							value={state['password'].value}
							onChangeText={handleFieldEdit('password')}
							secureTextEntry={isSecureText}
							autoCapitalize="none"
							error={
								state['password'].showError &&
								state['password'].message
							}
							rightComponent={
								<Ionicons
									onPress={toggle}
									name={
										isSecureText
											? 'ios-eye-outline'
											: 'ios-eye-off-outline'
									}
									style={styles.formIcon}
								/>
							}
						/>
					)}
				</Toggle>
				<Button
					submitting={submitting}
					disabled={submitting}
					onPress={handleSubmit}
					style={styles.actionButton}
				>
					<Text style={styles.actionButtonText}>
						{isLoggingIn ? 'Login' : 'Sign Up'}
					</Text>
				</Button>
				<Text variant="paragraphRegular">
					{isLoggingIn
						? "Don't have an account?"
						: 'Already have an account?'}{' '}
					<Text
						style={styles.modeToggleButton}
						onPress={toggleStatus}
					>
						{isLoggingIn ? 'Sign up' : 'Sign In'}
					</Text>
				</Text>
				<Pressable onPress={handleForgotPassword}>
					<Text>Reset password</Text>
				</Pressable>
			</View>
		</ScrollView>
	)
}

const styles = ScaledSheet.create({
	scrollContent: { backgroundColor: '#f6e58d' },
	root: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	formContainer: {
		backgroundColor: '#F6F6F6',
		borderRadius: 12,
		paddingHorizontal: 20,
		paddingVertical: 25,
		flexGrow: 0,
		width: width > 800 ? 500 : 0.9 * width,
		alignSelf: 'center',
	},
	formTitle: {
		fontSize: '24@ms0.1',
		fontWeight: 700,
		textAlign: 'center',
	},
	formHeader: {
		marginTop: '5@vs',
		marginBottom: '20@vs',
		alignItems: 'center',
		alignSelf: 'center',
	},
	formHeaderInfo: {
		fontSize: '18@ms0.2',
		fontWeight: 500,
		textAlign: 'center',
		marginTop: '10@vs',
	},
	nonLastField: {
		marginBottom: '10@vs',
	},
	actionButton: {
		marginTop: '20@vs',
		marginBottom: '24@vs',
	},
	actionButtonText: {
		color: 'white',
		fontSize: '14@ms',
	},
	modeToggleButton: {
		textDecorationLine: 'underline',
	},
	formFooterText: {
		fontSize: 14,
	},
	formIcon: {
		color: '#c8d6e5',
		marginRight: 5,
		fontSize: 24,
	},
})
