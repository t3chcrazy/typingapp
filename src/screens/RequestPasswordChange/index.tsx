import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ScrollView, StyleSheet } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import Button from 'src/components/Button'
import FormField from 'src/components/FormField'
import Text from 'src/restyle/components/text'
import View from 'src/restyle/components/view'

import { RequestPasswordSchema } from './schema'
import { supabase } from '../../lib/supabase'

const styles = StyleSheet.create({
	root: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	scrollContent: { backgroundColor: '#f6e58d' },
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
			const { error } =
				await supabase.auth.resetPasswordForEmail(resetEmail)
			if (!error?.message) {
				throw error.message
			}
			showMessage({
				message: 'Password reset link sent successfully!',
			})
		} catch (err) {
			console.log({ err })
		}
	}

	return (
		<ScrollView
			keyboardShouldPersistTaps="always"
			style={styles.scrollContent}
			contentContainerStyle={styles.root}
		>
			<View
				bg="white"
				p="lg"
				borderRadius="md"
				alignSelf="center"
				width={{ phone: '90%', tablet: 500 }}
				rg="sm"
			>
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
						autoCapitalize: 'none',
					}}
					my="md"
				/>
				<Button
					disabled={isSubmitting}
					onPress={handleSubmit(handleSendResetLink)}
				>
					<Text>Submit</Text>
				</Button>
			</View>
		</ScrollView>
	)
}
