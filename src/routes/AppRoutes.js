import { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from './routes'
import MainPlaceholder from '../loaders/MainPlaceholder'
import Landing from '../screens/Landing'
import MainPage from '../screens/MainPage'
import { supabase } from '../lib/supabase'
import { UserSession } from '../context'

const Stack = createNativeStackNavigator()

export default function AppRoutes() {
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState({})

    useEffect(() => {
        const initialSetup = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (!error) {
                    setIsLoggingIn(!!session?.user)
                    setSession(session?.user)
                }
            }
            catch (err) {
                setIsLoggingIn(false)
                setSession({})
            }
            finally {
                setLoading(false)
            }
        }
        initialSetup()
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggingIn(!!session?.user)
            setSession(session.user)
        })
        return subscription.unsubscribe
    }, [])

    if (loading) {
        return <MainPlaceholder />
    }

    return (
        <UserSession.Provider value={{ session }}>
            <Stack.Navigator screenOptions = {{ header: () => null, title: "Butterfingers" }}>
                {isLoggingIn?
                <Stack.Screen name = {routes.MAIN} getComponent = {() => MainPage} />:
                <>
                    <Stack.Screen name = {routes.LANDING} getComponent = {() => Landing} />
                </>}
            </Stack.Navigator>
        </UserSession.Provider>
    )
}