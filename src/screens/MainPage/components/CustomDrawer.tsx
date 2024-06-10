import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { supabase } from 'src/lib/supabase'
import Pressable from 'src/restyle/components/pressable'
import Text from 'src/restyle/components/text'
import { ColorVariants, palette } from 'src/restyle/theme'
import routes from 'src/routes/routes'

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: 18,
	},
})

const BUTTON_TEXTS = {
	DASHBOARD: 'Dashboard',
	PLAY_GAME: 'Play game!',
	PROFILE: 'Profile',
	LOGOUT: 'Logout',
}

type ButtonProps = {
	isSelected: boolean
	text: string
	selectedBg?: ColorVariants
	selectedTextColor?: ColorVariants
	selectedIconColor?: string
	onPress: (...props: any[]) => any
}

function DrawerButton({
	isSelected,
	text,
	selectedBg = 'secondaryBackground',
	selectedTextColor = 'primary',
	selectedIconColor = palette.darkBlue,
	onPress,
}: ButtonProps) {
	const icon = useMemo(() => {
		switch (text) {
			case BUTTON_TEXTS.PLAY_GAME:
				return (
					<MaterialIcons
						name="videogame-asset"
						size={24}
						color={isSelected ? selectedIconColor : palette.black}
					/>
				)
			case BUTTON_TEXTS.PROFILE:
				return (
					<AntDesign
						name="user"
						size={24}
						color={isSelected ? selectedIconColor : palette.black}
					/>
				)
			default:
				return (
					<MaterialIcons
						name="logout"
						size={24}
						color={palette.red}
					/>
				)
		}
	}, [text, isSelected])
	return (
		<Pressable
			borderRadius="sm"
			bg={isSelected ? selectedBg : 'white'}
			px="sm"
			py="sm"
			my="xs"
			onPress={onPress}
			flexDirection="row"
			alignItems="center"
			cg="md"
		>
			{icon}
			<Text
				color={isSelected ? selectedTextColor : 'textBlack'}
				variant="heading6Regular"
			>
				{text}
			</Text>
		</Pressable>
	)
}

export default function CustomDrawer({ navigation, ...props }) {
	const handleNavigate = (page) => () => navigation.navigate(page)
	const selectedIndex = props.state.index

	const handleLogout = async () => {
		await supabase.auth.signOut()
	}

	return (
		<DrawerContentScrollView {...props} style={styles.content}>
			<Text mb="md" variant="heading5Medium" color="primary">
				Butterfingers
			</Text>
			<DrawerButton
				text={BUTTON_TEXTS.PLAY_GAME}
				onPress={handleNavigate(routes.LOCAL_GAME)}
				isSelected={selectedIndex === 0}
			/>
			<DrawerButton
				text={BUTTON_TEXTS.PROFILE}
				onPress={handleNavigate(routes.PROFILE)}
				isSelected={selectedIndex === 1}
			/>
			<DrawerButton
				isSelected
				text={BUTTON_TEXTS.LOGOUT}
				onPress={handleLogout}
				selectedBg="white"
				selectedTextColor="danger"
			/>
		</DrawerContentScrollView>
	)
}
