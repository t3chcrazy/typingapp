import { forwardRef } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import Text from '../Text'

export default forwardRef(function Input(
	{ label, error, rootStyle, leftComponent, rightComponent, ...props },
	ref,
) {
	return (
		<View style={rootStyle}>
			<View style={[styles.wrapper, !!error && { borderColor: 'red' }]}>
				{leftComponent}
				<TextInput
					ref={ref}
					{...props}
					style={{ flex: 1, ...props.style }}
					placeholderTextColor="#bdc3c7"
				/>
				{rightComponent}
			</View>
			{!!error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	)
})

const styles = ScaledSheet.create({
	wrapper: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#c8d6e5',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		fontFamily: 'Lato_400Regular',
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 50,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: '4@vs',
		width: '100%',
	},
})
