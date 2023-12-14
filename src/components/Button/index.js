import { Pressable, ActivityIndicator } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ScaledSheet } from "react-native-size-matters";

const AnimatedButton = Animated.createAnimatedComponent(Pressable)

export default function Button(props) {
    const scale = useSharedValue(1)

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }), [])

    return (
        <AnimatedButton
            onHoverIn = {e => {
                scale.value = withSpring(0.95)
            }}
            onPressIn = {e => {
                scale.value = withSpring(0.9)
            }}
            onPressOut = {e => {
                scale.value = withSpring(1)
            }}
            onHoverOut = {e => {
                scale.value = withSpring(1)
            }}
            {...props}
            children = {props.submitting? <ActivityIndicator color = "white" size = "small" />: props.children}
            style = {[buttonStyle, styles.baseStyle, props.style, props.disabled && { backgroundColor: "gray" }]} 
        />
    )
}

const styles = ScaledSheet.create({
    baseStyle: {
        backgroundColor: "#f39c12",
        paddingVertical: "10@ms0.1",
        alignItems: "center",
        borderRadius: "12@ms0.1"
    }
})