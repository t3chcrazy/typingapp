import './firebase-init'
import { Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import AppRoutes from './src/routes/AppRoutes';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato'
import FlashMessage from 'react-native-flash-message';
import routes from './src/routes/routes';
import MainPlaceholder from './src/loaders/MainPlaceholder';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const linking = {
  config: {
      screens: {
          [routes.LANDING]: "/validate",
          [routes.MAIN]: "/main",
          [routes.LOCAL_GAME]: "/local-game"
      }
  }
}

const queryClient = new QueryClient()

export default function App() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client = {queryClient}>
      <SafeAreaView style = {{ flex: 1 }}>
        {Platform.OS === "web" && ( <style> {` input { outline: none; }`} </style> )} 
        <NavigationContainer linking = {linking} fallback = {<MainPlaceholder />}>
          <AppRoutes />
        </NavigationContainer>
        <FlashMessage position = "top" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}