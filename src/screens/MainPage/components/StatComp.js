import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Text from "../../../components/Text";

export default function StatComp({ title, info, icon }) {
    return (
        <View style = {styles.row}>
            <View style = {styles.iconContainer}>
                {icon}
            </View>
            <View>
                <Text style = {styles.title}>{title}</Text>
                <Text style = {styles.info}>{info}</Text>
            </View>
        </View>
    )
}

const styles = ScaledSheet.create({
    row: {
        flexDirection: "row",
        marginTop: "10@vs"
    },
    iconContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "4@vs",
        width: "24@ms",
        height: "24@ms",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "4@ms0.8"
    },
    title: {
        fontSize: "14@ms0.4",
        color: "rgba(255, 255, 255, 0.8)",
    },
    info: {
        fontSize: "18@ms0.4",
        fontWeight: "700",
        color: "white"
    }
})