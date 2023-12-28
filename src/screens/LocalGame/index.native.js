import { FontAwesome } from '@expo/vector-icons'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Pressable, ScrollView, View, Platform, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'

import { useGenerateWords } from './helpers/generateWords'
import { PADDING_VERTICAL, styles } from './helpers/styles'
import Button from '../../components/Button'
import Input from '../../components/Input'
import useTimer from '../../hooks/useTimer'
import { saveRunToDB } from '../../lib/db'

const INITIAL_STATE = {
	wpm: 0,
	correct_keystrokes: 0,
	wrong_keystrokes: 0,
	accuracy: 0,
	correct_words: 0,
	wrong_words: 0,
	platform: Platform.OS,
}

export default function LocalGame() {
	const progress = useSharedValue(0)
	const inputRef = useRef()
	const localGameData = useRef(INITIAL_STATE)
	const prevWord = useRef('')
	const currentWordIndex = useRef(0)
	const scrollContainer = useRef()
	const viewRef = useRef()
	const { texts, generateWords } = useGenerateWords()
	const { mutate } = useMutation({
		mutationKey: ['createRecord'],
		mutationFn: (body) => saveRunToDB(body),
		onSuccess: () => {
			progress.value = withTiming(1)
		},
		onError: () => {
			stopTimer()
			resetGameState()
			showMessage({
				message: 'Something went wrong. Please try again',
				type: 'danger',
			})
		},
	})
	const { timer, startTimer, isRunning, stopTimer } = useTimer(
		60,
		1000,
		() => {
			mutate({
				...localGameData.current,
				accuracy: (
					(localGameData.current.correct_words /
						(localGameData.current.correct_words +
							localGameData.current.wrong_words)) *
					100
				).toFixed(2),
				wpm:
					localGameData.current.correct_words +
					localGameData.current.wrong_words,
				created_date: new Date(),
			})
		},
	)

	const bgColorIndexWord = (index, bg = 'gray') => {
		texts[index].ref.setNativeProps({ backgroundColor: bg })
	}

	useEffect(() => {
		if (texts.length > 0) {
			bgColorIndexWord(0)
		}
	}, [texts])

	const handleChange = (text) => {
		if (!isRunning) {
			startTimer()
		}
		if (text?.includes(' ')) {
			inputRef.current?.setNativeProps({ text: '' })
			prevWord.current = ''
			const isCorrect =
				text?.replace(' ', '') === texts[currentWordIndex.current].value
			texts[currentWordIndex.current].ref.setNativeProps({
				style: { color: isCorrect ? 'green' : 'red' },
			})
			bgColorIndexWord(currentWordIndex.current, 'transparent')
			currentWordIndex.current += 1
			texts[currentWordIndex.current].ref.measureLayout(
				scrollContainer.current,
				(left, top, width, height) => {
					scrollContainer.current.scrollTo({
						y: top + (top ? PADDING_VERTICAL / 2 : 0),
					})
				},
			)
			if (isCorrect) {
				localGameData.current.correct_words += 1
			} else {
				localGameData.current.wrong_words += 1
			}
			bgColorIndexWord(currentWordIndex.current)
		} else {
			if (texts[currentWordIndex.current].value.length > text.length) {
				if (prevWord.current.startsWith(text)) {
					localGameData.current.correct_keystrokes += 1
				} else {
					localGameData.current.wrong_keystrokes += 1
				}
			}
			prevWord.current = text
		}
	}

	const resetGameState = () => {
		currentWordIndex.current = 0
		scrollContainer.current?.scrollTo?.({ y: 0 })
		localGameData.current = INITIAL_STATE
	}

	const handleRetryGame = () => {
		stopTimer()
		generateWords()
		resetGameState()
	}

	const handleRestartGame = () => {
		stopTimer()
		generateWords()
		resetGameState()
		progress.value = withTiming(0)
	}

	const inputStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateY: interpolate(progress.value, [0, 1], [0, 500]) },
		],
		opacity: 1 - progress.value,
	}))

	const infoContainer = useAnimatedStyle(() => ({
		transform: [
			{ translateY: interpolate(progress.value, [0, 1], [500, 0]) },
		],
		opacity: progress.value,
	}))

	return (
		<ScrollView contentContainerStyle={styles.mainContent}>
			<Animated.View style={[styles.mainContainer, inputStyle]}>
				<Text style={styles.textHeader}>
					Try to type as many words as you can within the time limit!
				</Text>
				<ScrollView
					scrollEnabled={false}
					showsVerticalScrollIndicator={false}
					pointerEvents="none"
					ref={scrollContainer}
					style={styles.scrollViewStyle}
				>
					<View
						ref={viewRef}
						style={{ flexDirection: 'row', flexWrap: 'wrap' }}
					>
						{texts.map((t, ind) => (
							<Text
								ref={(ref) => (t.ref = ref)}
								key={`${t.value}-${ind}`}
								style={styles.individualWord}
							>
								{t.value}
							</Text>
						))}
					</View>
				</ScrollView>
				<View style={styles.inputContainer}>
					<Input
						contextMenuHidden
						selectTextOnFocus={false}
						placeholder="Start Typing!"
						onChangeText={handleChange}
						ref={inputRef}
						autoCorrect={false}
						autoComplete="off"
						spellCheck={false}
						autoCapitalize="none"
						rootStyle={{ flex: 1 }}
					/>
					<View style={styles.timeContainer}>
						<Text style={styles.timeText}>{timer}</Text>
					</View>
					<Pressable
						onPress={handleRetryGame}
						style={styles.retryButton}
					>
						<FontAwesome name="refresh" size={24} color="black" />
					</Pressable>
				</View>
			</Animated.View>
			<Animated.View style={[styles.mainContainer, infoContainer]}>
				<Text>Here are the results</Text>
				<Text>
					WPM:{' '}
					{localGameData.current.correct_words +
						localGameData.current.wrong_words}
				</Text>
				<Text>
					Correct Words: {localGameData.current.correct_words}
				</Text>
				<Text>Wrong Words: {localGameData.current.wrong_words}</Text>
				<Text>
					Correct Keystrokes:{' '}
					{localGameData.current.correct_keystrokes}
				</Text>
				<Text>
					Wrong Keystrokes: {localGameData.current.wrong_keystrokes}
				</Text>
				<Button onPress={handleRestartGame}>
					<Text>Restart</Text>
				</Button>
			</Animated.View>
		</ScrollView>
	)
}
