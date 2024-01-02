import { User } from '@supabase/supabase-js'
import { createContext } from 'react'

const UserSession = createContext<{
	session?: User
	setSession?: React.SetStateAction<User>
}>({})

export { UserSession }
