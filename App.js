import { GestureHandlerRootView, enableExperimentalWebImplementation } from 'react-native-gesture-handler';
import { Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo'
import AppRoutes from './src/routes/AppRoutes';
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato'
import FlashMessage, { showMessage } from 'react-native-flash-message';
import routes from './src/routes/routes';
import MainPlaceholder from './src/loaders/MainPlaceholder';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@shopify/restyle'
import theme from './src/restyle/theme';

enableExperimentalWebImplementation(true)

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    if (!state.isConnected) {
      showMessage({
        message: "You are offline!. Please check your internet connection",
        type: "warning",
      })
    }
    else if (state.isConnected) {
      showMessage({
        message: "Back Online!",
        type: "success"
      })
    }
    setOnline(!!state.isConnected)
  })
})

const linking = {
  config: {
      screens: {
          [routes.LANDING]: "/login",
          [routes.MAIN]: "/",
          [routes.LOCAL_GAME]: "/game",
          [routes.PROFILE]: "/profile"
      }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.log({ error })
      }
    }
  }
})

export default function App() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client = {queryClient}>
        <GestureHandlerRootView style = {{ flex: 1 }}>
          <StatusBar animated translucent />
          <SafeAreaView style = {{ flex: 1 }}>
            {Platform.OS === "web" && ( <style> {` input { outline: none; }`} </style> )} 
            <NavigationContainer linking = {linking} fallback = {<MainPlaceholder />}>
              <AppRoutes />
            </NavigationContainer>
            <FlashMessage position = "top" />
          </SafeAreaView>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}