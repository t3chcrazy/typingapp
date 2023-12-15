import { supabase } from './supabase'

export const saveRunToDB = async runData => {
    const { error } = await supabase.from("wpm-runs").insert([runData])
    if (!!error) {
        throw error.message
    }
}