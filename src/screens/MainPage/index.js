import { createDrawerNavigator } from '@react-navigation/drawer'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CustomDrawer from './components/CustomDrawer'
import CustomHeader from './components/CustomHeader'
import routes from '../../routes/routes'
import Dashboard from '../Dashboard'
import LocalGame from '../LocalGame'
import Profile from '../Profile'

const Drawer = createDrawerNavigator()

const SCREENS = [
	{
		component: LocalGame,
		name: routes.LOCAL_GAME,
		options: {
			title: 'Play game!',
			unmountOnBlur: true,
		},
	},
	{
		component: Profile,
		name: routes.PROFILE,
		options: {
			title: 'Profile',
		},
	},
]

export default function MainPage() {
	const { width } = useWindowDimensions()
	const { top } = useSafeAreaInsets()
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawer {...props} />}
			screenOptions={{
				lazy: true,
				sceneContainerStyle: {
					paddingTop: top,
				},
				drawerType: width >= 768 ? 'permanent' : 'front',
				freezeOnBlur: true,
				header: (props) => <CustomHeader {...props} />,
			}}
		>
			{SCREENS.map(({ name, options, component }) => (
				<Drawer.Screen
					key={name}
					name={name}
					options={options}
					getComponent={() => component}
				/>
			))}
		</Drawer.Navigator>
	)
}
