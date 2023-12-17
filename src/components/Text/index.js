import { Text as RNText, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	root: {
		fontFamily: 'Lato_400Regular',
	},
})

export default function Text({ style, ...props }) {
	return <RNText style={[styles.root, style]} {...props} />
}
