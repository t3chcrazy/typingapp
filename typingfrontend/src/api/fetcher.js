import { getToken } from "../util/auth"

export default async (...args) => {
    const token = await getToken()
    return fetch(args[0], {
        ...args[1],
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            ...args[2]
        }
    }).then(res => res.json())
}