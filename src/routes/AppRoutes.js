import { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from './routes'
import MainPlaceholder from '../loaders/MainPlaceholder'
import LocalGame from '../screens/LocalGame'
import Landing from '../screens/Landing'
import MainPage from '../screens/MainPage'
import OnlineGame from '../screens/OnlineGame'
import { supabase } from '../lib/supabase'

const Stack = createNativeStackNavigator()

export default function AppRoutes() {
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initialSetup = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (!error) {
                    setIsLoggingIn(!!session?.user)
                }
            }
            catch (err) {
                setIsLoggingIn(false)
            }
            finally {
                setLoading(false)
            }
        }
        initialSetup()
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggingIn(!!session?.user)
        })
        return subscription.unsubscribe
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