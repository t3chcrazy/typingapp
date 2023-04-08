import { useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, View } from "react-native";
import Input from "../../components/Input";
import endpoints from '../../api/endpoints';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetcher from '../../api/fetcher';
import Button from '../../components/Button';
import Text from '../../components/Text';
import useTimer from '../../hooks/useTimer';
import { ScaledSheet } from 'react-native-size-matters';

export default function LocalGame() {
    const inputRef = useRef()
    const localGameData = useRef({
        wpm: -1,
        correctKeyStrokes: -1,
        wrongKeystrokes: -1,
        accuracy: -1,
        correctWords: -1,
        wrongWords: -1
    })
    const { data, isLoading, isError } = useQuery({
        queryKey: ["fetchTypingData"],
        queryFn: ({ signal }) => fetcher(endpoints.GENERATE_WORDS, { signal }),
        cacheTime: 0
    })
    const recordCreator = useMutation({
        mutationKey: ["createRecord"],
        mutationFn: body => fetcher(endpoints.SAVE_RUN, { method: "POST", body: JSON.stringify(body) })
    })
    const { timer, startTimer, isRunning } = useTimer(60)

    const handleChange = text => {
        if (!isRunning) {
            startTimer()
        }
        if (text?.includes(" ")) {
            inputRef.current?.setNativeProps({ text: "" })
        }
    }

    return (
        <ScrollView contentContainerStyle = {styles.mainContent}>
            <View style = {styles.inputContainer}>
                <Input
                    contextMenuHidden = {true}
                    selectTextOnFocus = {false}
                    placeholder = "Start Typing!"
                    onChangeText = {handleChange}
                    ref = {inputRef}
                    autoCorrect = {false}
                    autoComplete = "off"
                    spellCheck = {false}
                    autoCapitalize = "none"
                    rootStyle = {{ flex: 1 }}
                />
                <View style = {styles.timeContainer}>
                    <Text style = {styles.timeText}>{timer}</Text>
                </View>
            </View>
            <Button>
                <Text>Submit</Text>
            </Button>
        </ScrollView>
    )
}

const styles = ScaledSheet.create({
    mainContent: {
        paddingHorizontal: "16@s"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeContainer: {
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "gray",
        marginLeft: "10@ms0.4",
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    timeText: {
        fontSize: "12@s",
        color: "black"
    }
})