import { useRef, useEffect, useState } from 'react'

export default function useTimer(limit, interval = 1000) {
    const [timer, setTimer] = useState(limit)
    const [isRunning, setRunning] = useState(false)
    const intervalRef = useRef()

    useEffect(() => {
        return stopTimer
    }, [])

    const startTimer = () => {
        setRunning(true)
        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    stopTimer()
                }
                return prev-1
            })
        }, interval)
    }

    const stopTimer = () => {
        setTimer(limit)
        setRunning(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    }

    return { startTimer, stopTimer, isRunning, timer }

}