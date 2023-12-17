import { DrawerContentScrollView } from '@react-navigation/drawer'

import Text from '../../../components/Text'
import Pressable from '../../../restyle/components/pressable'

export default function CustomDrawer(props) {
	return (
		<DrawerContentScrollView {...props}>
			<Pressable>
				<Text>Dashboard</Text>
			</Pressable>
		</DrawerContentScrollView>
	)
}
