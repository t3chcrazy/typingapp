import { Dimensions, Platform, StyleSheet } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

const width = Dimensions.get("screen").width

const TEXT_HEIGHT = Platform.select({
    native: 24,
    web: 27
})
const PADDING_VERTICAL = 24
const INPUT_SIDE_SIZE = 40

const styles = ScaledSheet.create({
    mainContainer: {
        backgroundColor: "#F6F6F6",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 25,
        flexGrow: 0,
        width: width > 768? 600: 0.9*width,
        alignSelf: "center",
        position: "absolute",
        top: "20@vs"
    },
    textHeader: {
        fontSize: Platform.select({
            native: 18,
            web: "18@s0.8"
        }),
        fontWeight: "bold"
    },
    retryButton: {
        borderRadius: 4,
        width: INPUT_SIDE_SIZE,
        height: INPUT_SIDE_SIZE,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12
    },
    scrollViewStyle: {
        borderWidth: 2,
        borderColor: "#c8d6e5",
        borderRadius: 12,
        padding: PADDING_VERTICAL/2,
        height: 2*TEXT_HEIGHT+PADDING_VERTICAL, overflow: "hidden",
        marginVertical: "12@vs"
    },
    mainContent: {
        paddingHorizontal: "16@s",
        position: 'relative',
        alignItems: "center",
        flexGrow: 1
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeContainer: {
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "gray",
        marginLeft: "10@ms0.4",
        width: INPUT_SIDE_SIZE,
        height: INPUT_SIDE_SIZE,
        justifyContent: "center",
        alignItems: "center"
    },
    timeText: {
        fontSize: "12@s",
        color: "black"
    },
    individualWord: {
        marginRight: 10,
        height: TEXT_HEIGHT,
        fontSize: 20
    }
})

export { styles, PADDING_VERTICAL, TEXT_HEIGHT, INPUT_SIDE_SIZE }