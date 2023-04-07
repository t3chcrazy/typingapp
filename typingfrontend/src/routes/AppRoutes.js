import { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from './routes'
import { auth } from '../../firebase-init'
import MainPlaceholder from '../loaders/MainPlaceholder'
import LocalGame from '../screens/LocalGame'
import Landing from '../screens/Landing'
import MainPage from '../screens/MainPage'
import { setToken } from '../util/auth'
import OnlineGame from '../screens/OnlineGame'

const Stack = createNativeStackNavigator()

export default function AppRoutes() {
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleLoad = async user => {
            if (!user) {
                setIsLoggingIn(false)
            }
            else {
                await setToken(await user.getIdToken())
                setIsLoggingIn(true)
            }
            setLoading(false)
        }
        auth.onAuthStateChanged(handleLoad)
    }, [])

    if (loading) {
        return <MainPlaceholder />
    }

    return (
        <Stack.Navigator screenOptions = {{ header: () => null, title: "Butterfingers" }}>
            {isLoggingIn?
            <>
                <Stack.Screen name = {routes.MAIN} getComponent = {() => MainPage} />
                <Stack.Screen name = {routes.LOCAL_GAME} getComponent = {() => LocalGame} />
                <Stack.Screen name = {routes.ONLINE_GAME} getComponent = {() => OnlineGame} />
            </>:
            <>
                <Stack.Screen name = {routes.LANDING} getComponent = {() => Landing} />
            </>}
        </Stack.Navigator>
    )
}