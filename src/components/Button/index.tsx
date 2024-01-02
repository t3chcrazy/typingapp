import { useMemo } from 'react'
import { ActivityIndicator } from 'react-native'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated'
import { ScaledSheet } from 'react-native-size-matters'

import Pressable from '../../restyle/components/pressable'

const AnimatedButton = Animated.createAnimatedComponent(Pressable)

export default function Button(props) {
	const scale = useSharedValue(1)

	const buttonStyle = useAnimatedStyle(
		() => ({
			transform: [{ scale: scale.value }],
		}),
		[],
	)

	const handlers = useMemo(
		() => ({
			onHoverIn: () => {
				scale.value = withSpring(0.95)
			},
			onPressIn: () => {
				scale.value = withSpring(0.9)
			},
			onPressOut: () => {
				scale.value = withSpring(1)
			},
			onHoverOut: () => {
				scale.value = withSpring(1)
			},
		}),
		[],
	)

	return (
		<AnimatedButton
			{...handlers}
			{...props}
			children={
				props.submitting ? (
					<ActivityIndicator color="white" size="small" />
				) : (
					props.children
				)
			}
			style={[
				buttonStyle,
				styles.baseStyle,
				props.style,
				props.disabled && { backgroundColor: '#D3D3D3' },
			]}
		/>
	)
}

const styles = ScaledSheet.create({
	baseStyle: {
		backgroundColor: '#f39c12',
		paddingVertical: '10@ms0.1',
		alignItems: 'center',
		borderRadius: '12@ms0.1',
	},
})