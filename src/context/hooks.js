import { useContext, useEffect, useState } from 'react'

import { UserSession } from '.'
import { supabase } from '../lib/supabase'

export function useSessionData() {
	const { session } = useContext(UserSession)
	const [savedProfileImage, setSavedProfileImage] = useState('')

	useEffect(() => {
		;(async () => {
			const { data } = await supabase.storage
				.from('avatars')
				.createSignedUrl(`${session.id}/profile-image.png`, 3600)
			setSavedProfileImage(data?.signedUrl)
		})()
	}, [session?.id])

	return { ...session, savedProfileImage }
}
