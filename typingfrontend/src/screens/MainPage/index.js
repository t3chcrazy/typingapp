import { ScrollView, View } from "react-native";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { auth } from "../../../firebase-init";
import routes from "../../routes/routes";
import { LinearGradient } from 'expo-linear-gradient'
import { ScaledSheet } from "react-native-size-matters";

export default function GamePage({ navigation }) {

    const handleSignout = async () => {
        await auth.signOut()
    }

    const handleLocalRedirect = () => {
        navigation.navigate(routes.LOCAL_GAME)
    }

    const handleOnlineRedirect = () => {
        navigation.navigate(routes.ONLINE_GAME)
    }

    return (
        <ScrollView contentContainerStyle = {{ flex: 1 }}>
            <LinearGradient
                end = {{ x: 0, y: 1 }}
                colors = {["red", "green"]}
                style = {{ flex: 1 }}
            >
                <Text style = {styles.header}>Butterfingers</Text>
                <View>
                    <View>
                    <Button onPress = {handleOnlineRedirect}>
                        <Text>Play with friends</Text>
                    </Button>
                    <Button onPress = {handleLocalRedirect}>
                        <Text>Play a local game</Text>
                    </Button>
                    <Button onPress = {handleSignout}>
                        <Text>Signout</Text>
                    </Button>
                    </View>
                    <View>

                    </View>
                </View>
            </LinearGradient>
        </ScrollView>
    )
}

const styles = ScaledSheet.create({
    header: {
        textAlign: "center",
        fontSize: "24@s"
    }
})