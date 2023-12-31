import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'

import routes from './routes'
import { UserSession } from '../context'
import { supabase } from '../lib/supabase'
import MainPlaceholder from '../loaders/MainPlaceholder'
import Landing from '../screens/Landing'
import MainPage from '../screens/MainPage'
import RequestPasswordChange from '../screens/RequestPasswordChange'
import ResetPassword from '../screens/ResetPassword'

const Stack = createNativeStackNavigator()

export default function AppRoutes() {
	const [isLoggingIn, setIsLoggingIn] = useState(false)
	const [loading, setLoading] = useState(true)
	const [session, setSession] = useState({})

	useEffect(() => {
		const initialSetup = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession()
				if (!error) {
					setIsLoggingIn(!!session?.user)
					setSession(session?.user)
				}
			} catch {
				setIsLoggingIn(false)
				setSession({})
			} finally {
				setLoading(false)
			}
		}
		initialSetup()
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			console.log({ session, event })
			setIsLoggingIn(!!session?.user)
			setSession(session?.user)
		})
		return subscription.unsubscribe
	}, [])

	if (loading) {
		return <MainPlaceholder />
	}

	return (
		<UserSession.Provider value={{ session }}>
			<Stack.Navigator
				screenOptions={{ header: () => null, title: 'Butterfingers' }}
			>
				{isLoggingIn ? (
					<Stack.Screen name="main" getComponent={() => MainPage} />
				) : (
					<>
						<Stack.Screen
							name={routes.LANDING}
							getComponent={() => Landing}
						/>
						<Stack.Screen
							name={routes.REQUEST_RESET}
							getComponent={() => RequestPasswordChange}
						/>
					</>
				)}
				<Stack.Screen
					name={routes.RESET_PASSWORD}
					getComponent={() => ResetPassword}
				/>
			</Stack.Navigator>
		</UserSession.Provider>
	)
}
