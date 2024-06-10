import { FontAwesome } from '@expo/vector-icons'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Pressable, ScrollView, View, Platform } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	interpolate,
	withTiming,
} from 'react-native-reanimated'

import { useGenerateWords } from './helpers/generateWords'
import { PADDING_VERTICAL, styles } from './helpers/styles'
import Button from '../../components/Button'
import Input from '../../components/Input'
import useTimer from '../../hooks/useTimer'
import { saveRunToDB } from '../../lib/db'
import Text from '../../restyle/components/text'

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
	const [currentWordIndex, setCurrentWordIndex] = useState(0)
	const scrollContainer = useRef()
	const viewRef = useRef()
	const { texts, generateWords } = useGenerateWords()
	const { mutate, isLoading: isRecordSaving } = useMutation({
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

	const handleChange = (text) => {
		if (!isRunning) {
			startTimer()
		}
		if (text?.includes(' ')) {
			inputRef.current.value = ''
			prevWord.current = texts[currentWordIndex].value
			const isCorrect =
				text?.replace(' ', '') === texts[currentWordIndex].value
			texts[currentWordIndex].ref.measureLayout(
				viewRef.current,
				(left, top, width, height) => {
					scrollContainer.current.scrollTo({
						y: top + (top ? PADDING_VERTICAL / 2 : 0),
					})
				},
			)
			texts[currentWordIndex].ref.style.color = isCorrect
				? 'green'
				: 'red'
			if (isCorrect) {
				localGameData.current.correct_words += 1
			} else {
				localGameData.current.wrong_words += 1
			}
			setCurrentWordIndex((prev) => prev + 1)
		} else {
			if (prevWord.current.startsWith(text)) {
				localGameData.current.correct_keystrokes += 1
			} else {
				localGameData.current.wrong_keystrokes += 1
			}
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
		generateWords()
		resetGameState()
	}

	const handleRestartGame = () => {
		progress.value = withSpring(0)
		generateWords()
		resetGameState()
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
								style={{
									...styles.individualWord,
									backgroundColor:
										currentWordIndex === ind
											? 'gray'
											: 'transparent',
								}}
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
				<Text variant="paragraphMedium" mb="md">
					Here are the results
				</Text>
				<Text variant="smallRegular">
					WPM:{' '}
					{localGameData.current.correct_words +
						localGameData.current.wrong_words}
				</Text>
				<Text variant="smallRegular">
					Correct Words: {localGameData.current.correct_words}
				</Text>
				<Text variant="smallRegular">
					Wrong Words: {localGameData.current.wrong_words}
				</Text>
				<Text variant="smallRegular">
					Correct Keystrokes:{' '}
					{localGameData.current.correct_keysrokes}
				</Text>
				<Text variant="smallRegular">
					Wrong Keystrokes: {localGameData.current.wrong_keystrokes}
				</Text>
				<Button disabled={isRecordSaving} onPress={handleRestartGame}>
					<Text>Restart</Text>
				</Button>
			</Animated.View>
		</ScrollView>
	)
}
