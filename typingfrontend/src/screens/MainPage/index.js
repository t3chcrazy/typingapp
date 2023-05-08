import { ScrollView, View, Image } from "react-native";
import Text from "../../components/Text";
import { LinearGradient } from 'expo-linear-gradient'
import { ScaledSheet } from "react-native-size-matters";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { auth } from "../../../firebase-init";
import routes from "../../routes/routes";
import StatBox from "./components/StatBox";
import NavButton from "./components/NavButton";
import Layout from "../../renderprops/Layout";
import StatComp from "./components/StatComp";
import AccuracyBox from "./components/AccuracyBox";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 }
];

export default function GamePage({ navigation }) {

    const handleSignout = async () => {
        await auth.signOut()
    }

    const navTo = route => () => {
        navigation.navigate(route)
    }

    return (
        <ScrollView contentContainerStyle = {{ flexGrow: 1 }} showsVerticalScrollIndicator = {false}>
            <LinearGradient
                end = {{ x: 0, y: 1 }}
                colors = {["#0083B0", "#00B4DB"]}
                style = {{ flex: 1 }}
            >
                <Text style = {styles.header}>Butterfingers</Text>
                <Layout>
                    {({ showColumnLayout }) => {
                        const navStyle = [!showColumnLayout? { rowGap: 30 }: { columnGap: 30, flexDirection: "row", marginTop: 24, marginBottom: 12 }]
                        const statBoxContainerStyle = [styles.flexContainer, showColumnLayout && { flexDirection: "column", rowGap: 8 }]
                        return (
                            (
                                <View style = {[styles.mainContainer, { flexDirection: showColumnLayout? "column": "row" }]}>
                                    <View style = {navStyle}>
                                        <NavButton
                                            showColumnLayout = {showColumnLayout}
                                            onPress = {navTo(routes.LOCAL_GAME)}
                                            text = "Local"
                                            icon = {<MaterialCommunityIcons name="gamepad-square" size={24} color="white" />}
                                        />
                                        <NavButton
                                            showColumnLayout = {showColumnLayout}
                                            onPress = {navTo(routes.ONLINE_GAME)}
                                            text = "Online"
                                            icon = {<MaterialCommunityIcons name="account-multiple" size={24} color="white" />}
                                        />
                                        <NavButton
                                            showColumnLayout = {showColumnLayout}
                                            onPress = {handleSignout}
                                            text = "Signout"
                                            icon = {<MaterialCommunityIcons name="logout" size={24} color="white" />}
                                        />
                                    </View>
                                    <View style = {[styles.contentContainer]}>
                                        <View style = {statBoxContainerStyle}>
                                            <StatBox
                                                colors = {["#0083B0", "#fdcb6e"]}
                                                end = {{ x: 1, y: 1 }}
                                                style = {{ width: showColumnLayout? "100%": "50%" }}
                                            >
                                                <Text style = {styles.statboxHeader}>Base Statistics</Text>
                                                <Text style = {styles.wpmText}><Text style = {styles.wpmValue}>82</Text> WPM</Text>
                                                <View style = {styles.flexContainer}>
                                                    <View>
                                                        <Text style = {styles.statColHeader}>Last Match</Text>
                                                        <StatComp
                                                            title = "Correct Words"
                                                            info = {93}
                                                            icon = {<MaterialIcons name="star-outline" size={24} color="white" />}
                                                        />
                                                        <StatComp
                                                            title = "Wrong Words"
                                                            info = {3}
                                                            icon = {<MaterialIcons name="star-outline" size={24} color="white" />}
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text style = {styles.statColHeader}>Average</Text>
                                                        <StatComp
                                                            title = "Correct Words"
                                                            info = {83}
                                                            icon = {<MaterialIcons name="star-outline" size={24} color="white" />}
                                                        />
                                                        <StatComp
                                                            title = "Wrong Words"
                                                            info = {4}
                                                            icon = {<MaterialIcons name="star-outline" size={24} color="white" />}
                                                        />
                                                    </View>
                                                </View>
                                                <Image source = {require("../../assets/typing-banner-one.png")} style = {styles.bannerImage} />
                                            </StatBox>
                                            <AccuracyBox />
                                        </View>
                                        <View style = {statBoxContainerStyle}>
                                            <StatBox
                                                colors = {["#0083B0", "#fdcb6e"]}
                                                end = {{ x: 1, y: 1 }}
                                            >
                                                <VictoryChart width={350} theme={VictoryTheme.material}>
                                                    <VictoryBar data={data} x="quarter" y="earnings" />
                                                </VictoryChart>
                                            </StatBox>
                                            <StatBox
                                                colors = {["#0083B0", "#fdcb6e"]}
                                                end = {{ x: 1, y: 1 }}
                                            >
                                                <Text>Hello 2</Text>
                                            </StatBox>
                                            <StatBox
                                                colors = {["#0083B0", "#fdcb6e"]}
                                                end = {{ x: 1, y: 1 }}
                                            >
                                                <Text>Hello 3</Text>
                                            </StatBox>
                                        </View>
                                    </View>
                                </View>
                            )
                        )
                    }}
                </Layout>
            </LinearGradient>
        </ScrollView>
    )
}

const styles = ScaledSheet.create({
    flex1: {
        flex: 1
    },
    wpmText: {
        color: "white",
        fontSize: "16@vs",
        marginTop: "8@vs",
        marginBottom: "20@vs"
    },
    wpmValue: {
        fontSize: "30@vs",
        fontWeight: "700"
    },
    header: {
        textAlign: "center",
        fontSize: "24@s",
        color: "white",
        fontWeight: "bold",
        marginTop: "8@s",
        marginBottom: "12@s"
    },
    flexContainer: {
        flexDirection: "row",
        columnGap: "4@s"
    },
    mainContainer: {
        flexDirection: "row",
        paddingHorizontal: "8@ms",
        gap: "10@s"
    },
    contentContainer: {
        padding: "10@s",
        backgroundColor: "white",
        borderRadius: 12,
        rowGap: "10@vs",
        flexGrow: 1
    },
    statboxHeader: {
        fontSize: "18@ms0.5",
        color: "white",
        fontWeight: "bold"
    },
    bannerImage: {
        position: "absolute",
        bottom: -20,
        right: -20,
        width: "200@ms",
        height: "200@ms",
        zIndex: -1,
        opacity: 0.4
    },
    statColHeader: {
        color: "white",
        marginBottom: "5@vs",
        fontSize: "16@ms0.1"
    }
})