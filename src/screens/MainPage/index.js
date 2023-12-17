import routes from "../../routes/routes";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "../Dashboard";
import LocalGame from '../LocalGame'
import Profile from "../Profile";
import { useWindowDimensions } from "react-native";
import CustomHeader from "./components/CustomHeader";

const Drawer = createDrawerNavigator()

const SCREENS = [
    {
        component: Dashboard,
        name: routes.MAIN,
        options: {
            title: "Dashboard"
        },
    },
    {
        component: LocalGame,
        name: routes.LOCAL_GAME,
        options: {
            title: "Play game!"
        },
    },
    {
        component: Profile,
        name: routes.PROFILE,
        options: {
            title: "Profile"
        },
    },
]

export default function MainPage() {
    const { width } = useWindowDimensions()
    return (
        <Drawer.Navigator
            screenOptions={{
                drawerType: width >= 768? "permanent": "front",
                freezeOnBlur: true,
                header: props => <CustomHeader {...props} />,
            }}
        >
            {SCREENS.map(({ name, options, component }) => <Drawer.Screen key={name} name={name} options={options} getComponent={() => component} />)}
        </Drawer.Navigator>
    )
}