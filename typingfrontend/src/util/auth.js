import AsyncStorage from "@react-native-async-storage/async-storage"

const KEY = "@@ID_TOKEN"

export const setToken = async token => {
    await AsyncStorage.setItem(KEY, token)
}

export const getToken = async () => {
    return await AsyncStorage.getItem(KEY)
}