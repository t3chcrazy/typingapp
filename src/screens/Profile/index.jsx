import { FontAwesome5 } from '@expo/vector-icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useWindowDimensions } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { ProfileSchema } from './schema'
import Button from '../../components/Button'
import DrawerScreen from '../../components/DrawerScreen'
import FormField from '../../components/FormField'
import { useSessionData } from '../../context/hooks'
import { supabase } from '../../lib/supabase'
import Pressable from '../../restyle/components/pressable'
import Text from '../../restyle/components/text'
import View from '../../restyle/components/view'

const PROFILE_SIZE = { phone: 60, tablet: 80, pc: 120 }

export default function Profile() {
	const [editing, setEditing] = useState(false)
	const data = useSessionData()
	const { width } = useWindowDimensions()
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
			await supabase.auth.updateUser({
				data: {
					userName: alias,
				},
				email,
			})
			toggleEdit()
			showMessage({
				message: 'Profile updated successfully!',
				type: 'success',
			})
		} else {
			toggleEdit()
		}
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
				minWidth={{ phone: '90%', tablet: '80%', pc: 600 }}
			>
				{editing ? (
					<>
						<Pressable
							borderWidth={2}
							borderColor="primary"
							borderRadius="circle"
							width={PROFILE_SIZE}
							height={PROFILE_SIZE}
							justifyContent="center"
							alignItems="center"
							bg="secondaryBackground"
						>
							<FontAwesome5
								name="user"
								size={width < 768 ? 35 : 60}
								color="black"
							/>
						</Pressable>
						<FormField
							width="80%"
							placeholder="Alias"
							name="alias"
							control={control}
						/>
						<FormField
							width="80%"
							placeholder="Email"
							name="email"
							control={control}
						/>
					</>
				) : (
					<>
						<View
							borderWidth={2}
							borderColor="primary"
							borderRadius="circle"
							width={PROFILE_SIZE}
							height={PROFILE_SIZE}
							justifyContent="center"
							alignItems="center"
							bg="secondaryBackground"
						>
							<FontAwesome5
								name="user"
								size={width < 768 ? 35 : 60}
								color="black"
							/>
						</View>
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
