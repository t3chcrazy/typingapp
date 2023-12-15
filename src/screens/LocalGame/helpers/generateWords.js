import { createRef, useLayoutEffect, useState } from 'react'
import { generate } from 'random-words'

export function useGenerateWords() {
    const [texts, setTexts] = useState([])

    const generateWords = () => {
        const words = generate({ minLength: 4, maxLength: 10, exactly: 250 })
        setTexts(words.map((mess, ind) => ({
            ref: createRef(),
            value: mess,
        })))
    }

    useLayoutEffect(() => {
        generateWords()
    }, [])

    return { texts, generateWords }
}