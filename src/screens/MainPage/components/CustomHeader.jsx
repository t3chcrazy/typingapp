import { Feather } from '@expo/vector-icons'

import Layout from '../../../renderprops/Layout'

export default function CustomHeader({ navigation }) {
	const handleMenuClick = () => navigation.openDrawer()

	return (
		<Layout>
			{({ isMobile }) =>
				isMobile ? (
					<Feather
						onPress={handleMenuClick}
						name="menu"
						size={24}
						color="black"
					/>
				) : null
			}
		</Layout>
	)
}
