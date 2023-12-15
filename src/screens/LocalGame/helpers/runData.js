import { useRef, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";
import { Platform } from "react-native";
import useTimer from "../../../hooks/useTimer";
import { saveRunToDB } from "../../../lib/firestore";
import { useGenerateWords } from "./generateWords";

const INITIAL_STATE = {
    wpm: 0,
    correctKeyStrokes: 0,
    wrongKeystrokes: 0,
    accuracy: 0,
    correctWords: 0,
    wrongWords: 0,
    platform: Platform.OS
}

export function useRunData() {
    const progress = useSharedValue(0)
    const localGameData = useRef(INITIAL_STATE)
    const { mutate, isLoading } = useMutation({
        mutationKey: ["post-run"],
        mutationFn: data => saveRunToDB(data) ,
        onSuccess: () => {
            progress.value = withTiming(1)
            showMessage({
                message: "Run saved successfully!",
                type: "success"
            })
        },
        onError: () => {
            showMessage({
                message: "Run saved successfully!",
                type: "success"
            })
        }
    })
    const { timer, startTimer, isRunning, stopTimer } = useTimer(60, 1000, () => {
        mutate(localGameData.current)
    })
    const { texts, generateWords } = useGenerateWords()
    const prevWord = useRef("")
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const scrollContainer = useRef()

    const startGame = () => {
        startTimer()
    }

    const retryGame = () => {
        generateWords()
        scrollContainer.current?.scrollTo({
            y: 0,
            animated: true,
        })
        stopTimer()
        localGameData.current = INITIAL_STATE
        setCurrentWordIndex(0)
    }

    const restartGame = () => {
        progress.value = withTiming(0)
        generateWords()
        localGameData.current = INITIAL_STATE
        setCurrentWordIndex(0)
    }

    return {
        timer,
        localGameData,
        startGame,
        restartGame,
        retryGame,
        isRunning,
        texts,
        currentWordIndex,
        prevWord,
        isSaving: isLoading
    }
}