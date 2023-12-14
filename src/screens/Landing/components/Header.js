import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, interpolate, Extrapolate, Easing } from 'react-native-reanimated'
import Text from '../../../components/Text'

const TEXTS = [
    "A fun typing game!",
    "Analyze your performance",
    "Share with friends",
    "A fun typing game!",
]

function SliderText({ progress, index, text }) {
    const transformStyle = useAnimatedStyle(() => ({
        transform: [{ 
            translateY: interpolate(
                progress.value,
                [index-1/2, index, index+1/2, index+1],
                [100, 0, 0, 100],
                Extrapolate.CLAMP
            )
        }]
    }))
    return (
        <Animated.Text style = {[transformStyle, styles.sliderText]}>
            {text}
        </Animated.Text>
    )
}

export default function Header() {
    const progress = useSharedValue(0)

    useEffect(() => {
        progress.value = withRepeat(withTiming(TEXTS.length-1, {
            duration: 6000,
            easing: Easing.linear
        }), -1)
    }, [])

    return (
        <View style = {styles.header}>
            <Text style = {styles.title}>Butterfingers</Text>
            <View style = {styles.sliderContainer}>
                {TEXTS.map((text, index) => <SliderText index = {index} progress = {progress} key = {text+index} text = {text} />)}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        marginBottom: 30
    },
    title: {
        fontSize: 40,
        color: "#2ecc71",
        fontWeight: "700",
    },
    sliderContainer: {
        overflow: "hidden",
        position: "relative",
        height: 50,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    sliderText: {
        position: "absolute",
        fontSize: 18,
        color: "#16a085"
    }
})