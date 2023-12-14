import { Text as RNText, StyleSheet } from 'react-native'

export default function Text({ style, ...props }) {
    return <RNText style = {StyleSheet.compose({ fontFamily: "Lato_400Regular" }, style)} {...props} />
}