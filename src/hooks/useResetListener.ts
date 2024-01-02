import { useURL, parse } from 'expo-linking'
import { useEffect } from 'react'

import { supabase } from '../lib/supabase'

export function useResetListener() {
	const openedURL = useURL()

	const handleLink = (link: string) => {
		const formattedLink = link.replace('#', '?')
		const parsedLink = parse(formattedLink)
		const access_token = parsedLink?.queryParams.access_token
		const refresh_token = parsedLink?.queryParams?.refresh_token
		if (
			typeof access_token === 'string' &&
			typeof refresh_token === 'string'
		) {
			supabase.auth.setSession({
				access_token,
				refresh_token,
			})
		}
	}

	useEffect(() => {
		if (openedURL) {
			handleLink(openedURL)
		}
	}, [openedURL])
}
