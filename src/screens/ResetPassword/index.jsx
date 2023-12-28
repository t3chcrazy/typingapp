import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ScrollView, StyleSheet } from 'react-native'

import { ResetPasswordSchema } from './schema'
import Text from '../../components/Text'
import View from '../../restyle/components/view'

const styles = StyleSheet.create({
	scrollContent: { backgroundColor: '#f6e58d' },
	root: {
		flexGrow: 1,
		justifyContent: 'center',
	},
})

export default function ResetPassword() {
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(ResetPasswordSchema),
	})
	return (
		<ScrollView
			style={styles.scrollContent}
			contentContainerStyle={styles.root}
			keyboardShouldPersistTaps="always"
		>
			<View>
				<Text>Reset password</Text>
			</View>
		</ScrollView>
	)
}
