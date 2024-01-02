import { yupResolver } from '@hookform/resolvers/yup'
import { Buffer } from 'buffer'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import ProfileImage from './components/ProfileImage'
import { ProfileSchema } from './schema'
import Button from '../../components/Button'
import DrawerScreen from '../../components/DrawerScreen'
import FormField from '../../components/FormField'
import { useSessionData } from '../../context/hooks'
import { supabase } from '../../lib/supabase'
import Text from '../../restyle/components/text'
import View from '../../restyle/components/view'

const prepareBase64DataUrl = (base64) =>
	base64
		.replace('data:image/png;', 'data:image/png;charset=utf-8;')
		.replace(/^.+,/, '')

export default function Profile() {
	const [editing, setEditing] = useState(false)
	const { savedProfileImage, ...data } = useSessionData()
	const {
		control,
		handleSubmit,
		setValue,
		formState: { isSubmitting },
	} = useForm({
		resolver: yupResolver(ProfileSchema),
		defaultValues: {
			email: data.email,
			alias: data?.user_metadata?.userName,
		},
	})

	const toggleEdit = () => {
		setValue('alias', data?.user_metadata?.userName)
		setValue('email', data?.email)
		setEditing((prev) => !prev)
	}

	const handleButtonClick = async ({ alias, email, profileImage }) => {
		if (editing) {
			try {
				if (profileImage) {
					await supabase.storage.from('avatars').upload(
						`${data.id}/profile-image.png`,
						Platform.select({
							web: Buffer.from(
								prepareBase64DataUrl(profileImage.uri),
								'base64',
							),
							native: profileImage,
						}),
						{
							contentType: 'image/png',
							upsert: true,
						},
					)
				}
				await supabase.auth.updateUser({
					data: {
						userName: alias,
						profileImage: `${data.id}/profile-image.png`,
					},
					email,
				})
				toggleEdit()
				showMessage({
					message: 'Profile updated successfully!',
					type: 'success',
				})
			} catch {}
		} else {
			toggleEdit()
		}
	}

	const handleImagePick = async (imageAsset) => {
		setValue('profileImage', imageAsset)
	}

	return (
		<DrawerScreen>
			<Text mb="lg" variant="heading5Medium" color="primary">
				Your profile
			</Text>
			<View
				bg="white"
				alignItems="center"
				rg="md"
				borderRadius="lg"
				p="lg"
				alignSelf="center"
				minWidth={{ phone: '95%', tablet: '85%', pc: '70%' }}
			>
				<ProfileImage
					editing={editing}
					savedProfileImage={savedProfileImage}
					handleImageSelect={handleImagePick}
				/>
				{editing ? (
					<>
						<FormField
							width="80%"
							inputProps={{
								placeholder: 'Alias',
							}}
							name="alias"
							control={control}
						/>
						<FormField
							width="80%"
							inputProps={{
								placeholder: 'Email',
							}}
							name="email"
							control={control}
						/>
					</>
				) : (
					<>
						<Text variant="heading5Medium" color="textBlack">
							{data?.user_metadata?.userName}
						</Text>
						<Text variant="heading5Medium" color="textBlack">
							{data?.email}
						</Text>
					</>
				)}
				<View cg="md" flexDirection="row" alignSelf="stretch">
					{editing ? (
						<>
							<Button
								disabled={isSubmitting}
								flex={1}
								onPress={toggleEdit}
							>
								<Text color="white">Cancel</Text>
							</Button>
							<Button
								disabled={isSubmitting}
								flex={1}
								onPress={handleSubmit(handleButtonClick)}
							>
								<Text color="white">Edit</Text>
							</Button>
						</>
					) : (
						<Button flex={1} onPress={toggleEdit}>
							<Text color="white">Edit</Text>
						</Button>
					)}
				</View>
			</View>
		</DrawerScreen>
	)
}
