import { View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { ScaledSheet } from "react-native-size-matters";

export default function StatBox(props) {
    const styles = { ...style.baseStyle, ...props.style }
    
    return props.colors? 
    <LinearGradient {...props} style = {styles} />:
    <View {...props} style = {styles} />
}

const style = ScaledSheet.create({
    baseStyle: {
        borderRadius: 12,
        paddingHorizontal: "10@s",
        paddingVertical: "12@s",
        maxWidth: "100%",
        minHeight: "80@vs",
        flexGrow: 1,
        position: "relative",
        overflow: "hidden"
    }
})