import { View } from "react-native";
import Text from "../components/Text";

export default function MainPlaceholder() {
    return (
        <View style = {{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading...</Text>
        </View>
    )
}