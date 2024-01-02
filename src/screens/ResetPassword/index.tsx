import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ScrollView, StyleSheet } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { ResetPasswordSchema } from './schema'
import Button from '../../components/Button'
import FormField from '../../components/FormField'
import { supabase } from '../../lib/supabase'
import Text from '../../restyle/components/text'
import View from '../../restyle/components/view'

const styles = StyleSheet.create({
	scrollContent: { backgroundColor: '#f6e58d' },
	root: {
		flexGrow: 1,
		justifyContent: 'center',
	},
})

export default function ResetPassword({ access_token, route, navigation }) {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm({
		resolver: yupResolver(ResetPasswordSchema),
	})

	const handlePasswordReset = async ({ newPassword }) => {
		try {
			await supabase.auth.updateUser({
				password: newPassword,
			})
			showMessage({
				message: 'Password Reset!',
				type: 'success',
			})
		} catch (err) {
			console.log({ err })
		}
	}

	return (
		<ScrollView
			style={styles.scrollContent}
			contentContainerStyle={styles.root}
			keyboardShouldPersistTaps="always"
		>
			<View
				bg="white"
				p="lg"
				borderRadius="md"
				alignSelf="center"
				width={{ phone: '90%', tablet: 500 }}
				rg="sm"
			>
				<Text variant="heading6Medium">Reset password</Text>
				<Text variant="paragraphRegular" mb="md">
					Enter your new password
				</Text>
				<FormField
					name="newPassword"
					control={control}
					inputProps={{
						placeholder: 'New password',
					}}
				/>
				<FormField
					name="confirmPassword"
					control={control}
					inputProps={{
						placeholder: 'Confirm password',
					}}
					mb="md"
				/>
				<Button
					disabled={isSubmitting}
					onPress={handleSubmit(handlePasswordReset)}
				>
					<Text>Submit</Text>
				</Button>
			</View>
		</ScrollView>
	)
}
