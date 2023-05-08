import { createRef, useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, View, Platform, ActivityIndicator, Text } from "react-native";
import Animated from 'react-native-reanimated';
import Input from "../../components/Input";
import endpoints from '../../api/endpoints';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetcher from '../../api/fetcher';
import useTimer from '../../hooks/useTimer';
import { FontAwesome } from '@expo/vector-icons';
import useAnimation from './helpers/useAnimation';
import { PADDING_VERTICAL, styles } from './helpers/styles';
import Button from '../../components/Button';

const INITIAL_STATE = {
    wpm: 0,
    correctKeyStrokes: 0,
    wrongKeystrokes: 0,
    accuracy: 0,
    correctWords: 0,
    wrongWords: 0,
    platform: Platform.OS
}

export default function LocalGame() {
    const inputRef = useRef()
    const localGameData = useRef(INITIAL_STATE)
    const [texts, setTexts] = useState([])
    const prevWord = useRef("")
    const currentWordIndex = useRef(0)
    const scrollContainer = useRef()
    const { isError, refetch, isFetching } = useQuery({
        queryKey: ["fetchTypingData"],
        queryFn: ({ signal }) => fetcher(endpoints.GENERATE_WORDS, { signal }),
        cacheTime: 0,
        onSuccess: ({ message }) => {
            setTexts(message.map((mess, ind) => ({
                ref: createRef(),
                value: mess,
            })))
        }
    })
    const { mutate, isLoading: isRecordSaving } = useMutation({
        mutationKey: ["createRecord"],
        mutationFn: body => fetcher(endpoints.SAVE_RUN, { method: "POST", body: JSON.stringify(body) }),
        onSuccess: () => {
            setProgressValue(1)
        }
    })
    const { timer, startTimer, isRunning, stopTimer } = useTimer(60, 1000, () => {
        mutate(localGameData.current)
    })
    const { inputStyle, infoContainer, setProgressValue } = useAnimation(0)

    const bgColorIndexWord = (index, bg = "gray") => {
        texts[index].ref.setNativeProps({ backgroundColor: bg })
    }

    useEffect(() => {
        if (texts.length > 0) {
            bgColorIndexWord(0)
        }
    }, [texts])

    const handleChange = text => {
        if (!isRunning) {
            startTimer()
        }
        if (text?.includes(" ")) {
            inputRef.current?.setNativeProps({ text: "" })
            if (texts[currentWordIndex.current].value === prevWord.current) {
                texts[currentWordIndex.current].ref.setNativeProps({ style: { color: "green" } })
            }
            else {
                texts[currentWordIndex.current].ref.setNativeProps({ style: { color: "red" } })
            }
            prevWord.current = ""
            bgColorIndexWord(currentWordIndex.current, "transparent")
            currentWordIndex.current += 1
            texts[currentWordIndex.current].ref.measureLayout(scrollContainer.current, (left, top, width, height) => {
                scrollContainer.current.scrollTo({ y: top+(!!top? PADDING_VERTICAL/2: 0) })
            })
            bgColorIndexWord(currentWordIndex.current)
        }
        else {
            if (text?.length > prevWord.current.length) {
                if (texts[currentWordIndex.current].value.startsWith(text?.replace(" ", ""))) {
                    localGameData.current.correctKeyStrokes += 1
                }
                else {
                    localGameData.current.wrongKeystrokes += 1
                }
            }
        }
        prevWord.current = text
    }

    const resetGameState = () => {
        currentWordIndex.current = 0
        scrollContainer.current?.scrollTo?.({ y: 0 })
        localGameData.current = INITIAL_STATE
    }

    const handleRetryGame = () => {
        stopTimer()
        refetch()
        resetGameState()
    }

    const handleRestartGame = () => {
        stopTimer()
        refetch()
        setProgressValue(0)
    }

    return (
        <ScrollView contentContainerStyle = {styles.mainContent}>
            <Animated.View style = {[styles.mainContainer, inputStyle]}>
                <Text style = {styles.textHeader}>Try to type as many words as you can within the time limit!</Text>
                <ScrollView scrollEnabled = {false} showsVerticalScrollIndicator = {false} pointerEvents='none' ref = {scrollContainer} style = {styles.scrollViewStyle}>
                    {isFetching? 
                    <ActivityIndicator size = "large" color = "green" />: 
                    isError? 
                    <Text>Some error occurred. Please try again</Text>:
                    <View style = {{ flexDirection: "row", flexWrap: "wrap" }}>
                        {texts.map((t, ind) => <Text ref = {ref => t.ref = ref} key = {`${t.value}-${ind}`} style = {styles.individualWord}>{t.value}</Text>)}
                    </View>
                    }
                </ScrollView>
                <View style = {styles.inputContainer}>
                    <Input
                        editable = {!isFetching}
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
                    <Pressable onPress = {handleRetryGame} style = {styles.retryButton} disabled = {isFetching}>
                        <FontAwesome name="refresh" size={24} color="black" />
                    </Pressable>
                </View>
            </Animated.View>
            <Animated.View style = {[styles.mainContainer, infoContainer]}>
                <Text>Here are the results</Text>
                <Text>WPM: {localGameData.current.correctWords+localGameData.current.wrongWords}</Text>
                <Text>Correct Words: {localGameData.current.correctWords}</Text>
                <Text>Wrong Words: {localGameData.current.wrongWords}</Text>
                <Text>Correct Keystrokes: {localGameData.current.correctKeyStrokes}</Text>
                <Text>Wrong Keystrokes: {localGameData.current.wrongKeystrokes}</Text>
                <Button onPress = {handleRestartGame}>
                    <Text>Restart</Text>
                </Button>
            </Animated.View>
        </ScrollView>
    )
}