export const mapCodeToMessage = code => {
    switch (code) {
        case "auth/user-not-found":
            return "User not found. Please signup instead"
        case "auth/email-already-exists":
            return "Email already exists. Please proceed with login"
        case "auth/id-token-expired":
            return "Session expired. Please login again"
        case "auth/invalid-password":
            return "Invalid Password. Please enter a valid password"
        case "auth/wrong-password":
            return "Incorrect Password. Please try again"
        case "auth/too-many-requests":
            return "Too many requests! Please try after some time"
        default:
            return "Something went wrong. Please try again"
    }
}