import { createRef, useRef, useState } from 'react'
import { Pressable, ScrollView, View, Platform, ActivityIndicator, Text } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';
import Input from "../../components/Input";
import Button from '../../components/Button';
import endpoints from '../../api/endpoints';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetcher from '../../api/fetcher';
import useTimer from '../../hooks/useTimer';
import { PADDING_VERTICAL, styles } from './helpers/styles';

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
    const progress = useSharedValue(0)
    const inputRef = useRef()
    const localGameData = useRef(INITIAL_STATE)
    const [texts, setTexts] = useState([])
    const prevWord = useRef("")
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const scrollContainer = useRef()
    const viewRef = useRef()
    const { isFetching, isError, refetch } = useQuery({
        queryKey: ["fetchTypingData"],
        queryFn: ({ signal }) => fetcher(endpoints.GENERATE_WORDS, { signal }),
        cacheTime: 0,
        onSuccess: ({ message }) => {
            setTexts(message.map((mess, ind) => ({
                ref: createRef(),
                value: mess,
            })))
        },
        refetchOnWindowFocus: false,
    })
    const { mutate, isLoading: isRecordSaving } = useMutation({
        mutationKey: ["createRecord"],
        mutationFn: body => fetcher(endpoints.SAVE_RUN, { method: "POST", body: JSON.stringify(body) }),
        onSuccess: () => {
            progress.value = withSpring(1)
        }
    })
    const { timer, startTimer, isRunning, stopTimer } = useTimer(60, 1000, () => {
        mutate(localGameData.current)
    })

    const handleChange = text => {
        if (!isRunning) {
            startTimer()
        }
        if (text?.includes(" ")) {
            inputRef.current?.setNativeProps({ text: "" })
            prevWord.current = ""
            const isCorrect = text?.replace(" ", "") === texts[currentWordIndex].value
            texts[currentWordIndex].ref.measureLayout(viewRef.current, (left, top, width, height) => {
                scrollContainer.current.scrollTo({ y: top+(!!top? PADDING_VERTICAL/2: 0) })
            })
            texts[currentWordIndex].ref.setNativeProps({ style: { color: isCorrect? "green": "red" } })
            if (isCorrect) {
                localGameData.current.correctWords += 1
            }
            else {
                localGameData.current.wrongWords += 1
            }
            setCurrentWordIndex(prev => prev+1)
        }
        else {
            if (text?.length > prevWord.current.length) {
                if (texts[currentWordIndex].value.startsWith(text?.replace(" ", ""))) {
                    localGameData.current.correctKeyStrokes += 1
                }
                else {
                    localGameData.current.wrongKeystrokes += 1
                }
            }
            prevWord.current = text
        }
    }

    const resetGameState = () => {
        scrollContainer.current?.scrollTo({
            y: 0,
            animated: true,
        })
        setCurrentWordIndex(0)
        localGameData.current = INITIAL_STATE
    }

    const handleRetryGame = () => {
        stopTimer()
        refetch()
        resetGameState()
    }

    const handleRestartGame = () => {
        progress.value = withSpring(0)
        refetch()
        resetGameState()
    }

    const inputStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0, 1], [0, 500]) }],
        opacity: 1-progress.value
    }))

    const infoContainer = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0, 1], [500, 0]) }],
        opacity: progress.value
    }))

    return (
        <ScrollView contentContainerStyle = {styles.mainContent}>
            <Animated.View style = {[styles.mainContainer, inputStyle]}>
                <Text style = {styles.textHeader}>Try to type as many words as you can within the time limit!</Text>
                <ScrollView pointerEvents = "none" scrollEnabled = {false} showsVerticalScrollIndicator = {false} ref = {scrollContainer} style = {styles.scrollViewStyle}>
                    {isFetching? 
                    <ActivityIndicator size = "large" color = "green" />: 
                    isError? 
                    <Text>Some error occurred. Please try again</Text>:
                    <View ref = {viewRef} style = {{ flexDirection: "row", flexWrap: "wrap" }}>
                        {texts.map((t, ind) => <Text ref= {ref => t.ref = ref} key = {`${t.value}-${ind}`} style = {{ ...styles.individualWord, backgroundColor: currentWordIndex === ind? "gray": "transparent" }}>{t.value}</Text>)}
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