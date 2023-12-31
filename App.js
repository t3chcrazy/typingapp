import {
	useFonts,
	Lato_400Regular,
	Lato_700Bold,
	Lato_900Black,
} from '@expo-google-fonts/lato'
import NetInfo from '@react-native-community/netinfo'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import {
	QueryClient,
	QueryClientProvider,
	onlineManager,
} from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { Platform, SafeAreaView } from 'react-native'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import {
	GestureHandlerRootView,
	enableExperimentalWebImplementation,
} from 'react-native-gesture-handler'

import MainPlaceholder from './src/loaders/MainPlaceholder'
import theme from './src/restyle/theme'
import AppRoutes from './src/routes/AppRoutes'
import routes from './src/routes/routes'

enableExperimentalWebImplementation(true)

global.Buffer = global.Buffer || require('buffer').Buffer

onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		if (!state.isConnected) {
			showMessage({
				message:
					'You are offline!. Please check your internet connection',
				type: 'warning',
			})
		} else if (state.isConnected) {
			showMessage({
				message: 'Back Online!',
				type: 'success',
			})
		}
		setOnline(!!state.isConnected)
	})
})

const linking = {
	config: {
		screens: {
			[routes.LANDING]: '/login',
			[routes.REQUEST_RESET]: '/request-reset',
			[routes.RESET_PASSWORD]: '/reset-password',
			main: {
				screens: {
					[routes.MAIN]: '/dashboard',
					[routes.PROFILE]: '/profile',
					[routes.LOCAL_GAME]: '/local-game',
				},
			},
		},
	},
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			onError: (error) => {
				console.log({ error })
			},
		},
	},
})

export default function App() {
	const [fontsLoaded] = useFonts({
		Lato_400Regular,
		Lato_700Bold,
		Lato_900Black,
	})

	if (!fontsLoaded) {
		return null
	}

	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<StatusBar animated translucent />
					<SafeAreaView style={{ flex: 1 }}>
						{Platform.OS === 'web' && (
							<style> {` input { outline: none; }`} </style>
						)}
						<NavigationContainer
							linking={linking}
							fallback={<MainPlaceholder />}
						>
							<AppRoutes />
						</NavigationContainer>
						<FlashMessage position="top" />
					</SafeAreaView>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</ThemeProvider>
	)
}
