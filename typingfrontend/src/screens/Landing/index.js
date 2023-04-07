import { useState, useReducer } from 'react'
import { View, ScrollView, Dimensions } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { auth } from '../../../firebase-init'
import Input from '../../components/Input'
import Header from './components/Header'
import Text from '../../components/Text'
import Button from '../../components/Button'
import { ACTIONS } from './forms/actions'
import reducer, { INITIAL_STATE } from './forms/reducer'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Toggle from '../../renderprops/Toggle'
import { showMessage } from 'react-native-flash-message'
import { isFormValid } from './forms/validator'
import { mapCodeToMessage } from './forms/codes'

const { width } = Dimensions.get("window")

export default function Landing() {
    const [isLoggingIn, setIsLogginIn] = useState(true)
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
    const [submitting, setSubmitting] = useState(false)

    const toggleStatus = () => setIsLogginIn(prev => !prev)

    const handleFieldEdit = key => value => {
        dispatch({ type: ACTIONS.VALUE_EDIT, value, key })
        if (state[key].showError) {
            dispatch({ type: ACTIONS.VALIDATE, key })
        }
    }

    const handleSubmit = async () => {
        try {
            if (isFormValid(state, isLoggingIn)) {
                setSubmitting(true)
                if (isLoggingIn) {
                    await signInWithEmailAndPassword(auth, state.email.value, state.password.value)
                }
                else {
                    await createUserWithEmailAndPassword(auth, state.email.value, state.password.value)
                }
            }
            else {
                dispatch({ type: ACTIONS.FORM_SUBMIT, isLoggingIn })
            }
        }
        catch (err) {
            console.log(err.code)
            showMessage({
                message: mapCodeToMessage(err.code),
                type: "danger"
            })
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
        <ScrollView style = {{ backgroundColor: '#f6e58d' }} contentContainerStyle = {styles.root} keyboardShouldPersistTaps = "always">
            <Header />
            <View style = {styles.formContainer}>
                <View style = {styles.formHeader}>
                    {isLoggingIn? 
                    <View>
                        <Text style = {styles.formTitle}>Login</Text>
                        <Text style = {styles.formHeaderInfo}>Enter your details to signin to your account</Text>
                    </View>:
                    <View>
                        <Text style = {styles.formTitle}>Sign Up</Text>
                        <Text style = {styles.formHeaderInfo}>Enter your details to signup for butterfingers</Text>
                    </View>}
                </View>
                {!isLoggingIn && 
                <Input
                    leftComponent = {<MaterialIcons style = {styles.formIcon} name="person" />}
                    placeholder = "Alias"
                    value = {state["alias"].value}
                    onChangeText = {handleFieldEdit("alias")}
                    rootStyle = {styles.nonLastField}
                    error = {state["alias"].showError && state["alias"].message}
                />}
                <Input
                    leftComponent = {<MaterialIcons style = {styles.formIcon} name="mail" />}
                    placeholder = "Email Address"
                    keyboardType = "email-address"
                    value = {state["email"].value}
                    onChangeText = {handleFieldEdit("email")}
                    rootStyle = {styles.nonLastField}
                    autoCapitalize = "none"
                    error = {state["email"].showError && state["email"].message}
                />
                <Toggle>
                    {({ toggled: isSecureText, toggle }) => 
                    <Input
                        leftComponent = {<MaterialIcons style = {styles.formIcon} name="lock" />}
                        placeholder = "Password"
                        value = {state["password"].value}
                        onChangeText = {handleFieldEdit("password")}
                        secureTextEntry = {isSecureText}
                        autoCapitalize = "none"
                        error = {state["password"].showError && state["password"].message}
                        rightComponent = {<Ionicons onPress = {toggle} name={isSecureText? "ios-eye-outline": "ios-eye-off-outline"} style = {styles.formIcon} />}
                    />}
                </Toggle>
                <Button submitting = {submitting} disabled = {submitting} onPress = {handleSubmit} style = {styles.actionButton}>
                    <Text style = {styles.actionButtonText}>{isLoggingIn? "Login": "Sign Up"}</Text>
                </Button>
                <Text style = {styles.formFooterText}>{isLoggingIn? "Don't have an account?": "Already have an account?"} <Text style = {styles.modeToggleButton} onPress = {toggleStatus}>{isLoggingIn? "Sign up": "Sign In"}</Text></Text>
            </View>
        </ScrollView>
    )
}

const styles = ScaledSheet.create({
    root: {
        flexGrow: 1,
        justifyContent: "center"
    },
    formContainer: {
        backgroundColor: "#F6F6F6",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 25,
        flexGrow: 0,
        width: width > 800? 500: 0.9*width,
        alignSelf: "center"
    },
    formTitle: {
        fontSize: '24@ms0.1',
        fontWeight: 700,
        textAlign: "center"
    },
    formHeader: {
        marginTop: "5@vs",
        marginBottom: "30@vs",
        alignItems: "center",
        alignSelf: "center"
    },
    formHeaderInfo: {
        fontSize: '18@ms0.2',
        fontWeight: 500,
        textAlign: "center",
        marginTop: "10@vs"
    },
    nonLastField: {
        marginBottom: "10@vs"
    },
    actionButton: {
        marginTop: "20@vs",
        marginBottom: "24@vs",
    },
    actionButtonText: {
        color: "white",
        fontSize: "14@ms"
    },
    modeToggleButton: {
        textDecorationLine: "underline"
    },
    formFooterText: {
        fontSize: 14
    },
    formIcon: {
        color: "#c8d6e5",
        marginRight: 5,
        fontSize: 24
    }
})