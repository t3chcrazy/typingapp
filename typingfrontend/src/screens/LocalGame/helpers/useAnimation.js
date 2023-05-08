import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export default function useAnimation(initial) {
    const progress = useSharedValue(initial)

    const inputStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0, 1], [0, 500]) }],
        opacity: 1-progress.value
    }))

    const infoContainer = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0, 1], [500, 0]) }],
        opacity: progress.value
    }))

    const setProgressValue = val => {
        progress.value = withSpring(val)
    }

    return { progress, inputStyle, infoContainer, setProgressValue }
}