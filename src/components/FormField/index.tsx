import { LayoutProps, SpacingShorthandProps } from '@shopify/restyle'
import { useController } from 'react-hook-form'
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native'
import { Theme, palette } from 'src/restyle/theme'

import Text from '../../restyle/components/text'
import View from '../../restyle/components/view'

const styles = StyleSheet.create({
	field: {
		fontFamily: 'Lato_400Regular',
		color: palette.black,
		flex: 1,
	},
})

type FieldProps = {
	name: string
	control: any
	inputStyle?: TextStyle
	inputProps?: TextInputProps
} & LayoutProps<Theme> &
	SpacingShorthandProps<Theme>

export default function FormField({
	name,
	control,
	inputStyle,
	inputProps,
	...props
}: FieldProps) {
	const {
		field: { value, onChange, ...fieldProps },
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
				{...inputProps}
				placeholderTextColor="#bdc3c7"
				onChangeText={onChange}
			/>
			{!!error && (
				<Text color="danger" variant="tinyRegular" mt="sm">
					{error.message}
				</Text>
			)}
		</View>
	)
}
