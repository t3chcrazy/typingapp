import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ScrollView, StyleSheet } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RequestPasswordSchema } from './schema'
import Button from '../../components/Button'
import FormField from '../../components/FormField'
import { supabase } from '../../lib/supabase'
import Text from '../../restyle/components/text'

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
})

export default function RequestPasswordChange() {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm({
		resolver: yupResolver(RequestPasswordSchema),
		defaultValues: {
			resetEmail: '',
		},
	})

	const handleSendResetLink = async ({ resetEmail }) => {
		try {
			await supabase.auth.resetPasswordForEmail(resetEmail)
			showMessage({
				message: 'Password reset link sent successfully!',
			})
		} catch (err) {
			console.log({ err })
		}
	}

	return (
		<SafeAreaView style={styles.root}>
			<ScrollView contentContainerStyle={styles.root}>
				<Text variant="heading5Medium">Forgot password?</Text>
				<Text variant="paragraphRegular">
					No worries! Submit your email and we will send you a reset
					password link
				</Text>
				<FormField
					name="resetEmail"
					control={control}
					inputProps={{
						placeholder: 'Enter email',
					}}
					autocapitalize="none"
				/>
				<Button
					disabled={isSubmitting}
					onPress={handleSubmit(handleSendResetLink)}
				>
					<Text>Submit</Text>
				</Button>
			</ScrollView>
		</SafeAreaView>
	)
}
