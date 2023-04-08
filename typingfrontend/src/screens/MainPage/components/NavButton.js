import { Pressable } from "react-native";
import Text from "../../../components/Text";
import { ScaledSheet } from "react-native-size-matters";
import { useMemo } from "react";

export default function NavButton({ icon, text, showColumnLayout, ...props }) {
    const styles = useMemo(() => ScaledSheet.create({
        textStyle: {
            color: "white",
            fontSize: "14@ms0.4",
            marginTop: showColumnLayout? 0: "2@vs",
            marginLeft: showColumnLayout? "6@s": 0
        },
    }), [showColumnLayout])
    
    return (
        <Pressable style = {{ flexDirection: showColumnLayout? "row": "column", alignItems: "center", ...props.style }} {...props}>
            {icon}
            <Text style = {styles.textStyle}>{text}</Text>
        </Pressable>
    )
}