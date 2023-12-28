import { Feather } from '@expo/vector-icons'

import Layout from '../../../renderprops/Layout'
import View from '../../../restyle/components/view'

export default function CustomHeader({ navigation }) {
	const handleMenuClick = () => navigation.openDrawer()

	return (
		<Layout>
			{({ isMobile }) =>
				isMobile ? (
					<View p={{ phone: 'sm', tablet: 'lg', pc: 'xl' }}>
						<Feather
							onPress={handleMenuClick}
							name="menu"
							size={24}
							color="black"
						/>
					</View>
				) : null
			}
		</Layout>
	)
}
