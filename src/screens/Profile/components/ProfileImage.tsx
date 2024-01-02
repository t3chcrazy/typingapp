import { FontAwesome5 } from '@expo/vector-icons'
import { Image } from 'expo-image'
import {
	useMediaLibraryPermissions,
	launchImageLibraryAsync,
	MediaTypeOptions,
} from 'expo-image-picker'
import { useState } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import Pressable from 'src/restyle/components/pressable'
import View from 'src/restyle/components/view'

const PROFILE_SIZE = { phone: 80, tablet: 90, pc: 120 }

const styles = StyleSheet.create({
	profileImage: {
		width: '100%',
		height: '100%',
	},
	editIcon: {
		position: 'absolute',
		bottom: 2,
		right: 2,
		zIndex: 3,
	},
})

export default function ProfileImage({
	editing,
	savedProfileImage,
	handleImageSelect,
}) {
	const [tempProfilePicture, setTempProfilePicture] = useState<{
		uri?: string
	}>({})
	const [libraryStatus, requestLibraryPermission] =
		useMediaLibraryPermissions()
	const { width } = useWindowDimensions()

	const handleImagePick = async (count = 0) => {
		if (libraryStatus.granted) {
			const result = await launchImageLibraryAsync({
				allowsMultipleSelection: false,
				mediaTypes: MediaTypeOptions.Images,
				base64: false,
			})
			if (!result.canceled) {
				setTempProfilePicture(result.assets[0])
				handleImageSelect(result.assets[0])
			}
		} else {
			if (count > 3) {
				return
			}
			await requestLibraryPermission()
			await handleImagePick(count + 1)
		}
	}

	return editing ? (
		<View position="relative">
			<Pressable
				onPress={() => handleImagePick()}
				borderWidth={2}
				borderColor="primary"
				borderRadius="circle"
				width={PROFILE_SIZE}
				height={PROFILE_SIZE}
				justifyContent="center"
				alignItems="center"
				bg="secondaryBackground"
				overflow="hidden"
			>
				{savedProfileImage || tempProfilePicture ? (
					<Image
						source={{
							uri: tempProfilePicture?.uri
								? tempProfilePicture?.uri
								: savedProfileImage,
						}}
						contentFit="cover"
						style={styles.profileImage}
					/>
				) : (
					<FontAwesome5
						name="user"
						size={width < 768 ? 35 : 60}
						color="black"
					/>
				)}
			</Pressable>
			<FontAwesome5
				style={styles.editIcon}
				name="edit"
				size={24}
				color="black"
			/>
		</View>
	) : (
		<View
			borderWidth={2}
			borderColor="primary"
			borderRadius="circle"
			width={PROFILE_SIZE}
			height={PROFILE_SIZE}
			justifyContent="center"
			alignItems="center"
			bg="secondaryBackground"
			overflow="hidden"
		>
			{savedProfileImage ? (
				<Image
					source={{
						uri: tempProfilePicture?.uri
							? tempProfilePicture?.uri
							: savedProfileImage,
					}}
					contentFit="cover"
					style={styles.profileImage}
				/>
			) : (
				<FontAwesome5
					name="user"
					size={width < 768 ? 35 : 60}
					color="black"
				/>
			)}
		</View>
	)
}
