import { useController } from 'react-hook-form'
import { StyleSheet, TextInput } from 'react-native'

import Text from '../../restyle/components/text'
import View from '../../restyle/components/view'
import { palette } from '../../restyle/theme'

const styles = StyleSheet.create({
	field: {
		fontFamily: 'Lato_400Regular',
		color: palette.black,
		flex: 1,
	},
})

export default function FormField({ name, control, inputStyle, ...props }) {
	const {
		field: { value, ...fieldProps },
		fieldState: { error },
	} = useController({ name, control })
	return (
		<View
			px="lg"
			py="md"
			borderRadius="md"
			borderWidth={1}
			borderColor="secondaryBackground"
			flexDirection="row"
			{...props}
			position="relative"
		>
			<TextInput
				value={value}
				{...fieldProps}
				style={[styles.field, inputStyle]}
				placeholderTextColor="#bdc3c7"
			/>
			{!!error && (
				<Text color="danger" variant="tinyRegular" mt="sm">
					{error.message}
				</Text>
			)}
		</View>
	)
}
