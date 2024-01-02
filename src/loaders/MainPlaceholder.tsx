import Text from 'src/restyle/components/text'
import View from 'src/restyle/components/view'

export default function MainPlaceholder() {
	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			<Text>Loading...</Text>
		</View>
	)
}
