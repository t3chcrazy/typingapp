import { createContext } from 'react'
import { useWindowDimensions, Dimensions } from 'react-native'

const initialWidth = Dimensions.get("window").width

const LayoutContext = createContext({ width: initialWidth, showColumnLayout: initialWidth <= 768 })

export default function Layout(props) {
    const { width } = useWindowDimensions()
    const showColumnLayout = width <= 768

    return (
        <LayoutContext.Provider value = {{ width, showColumnLayout }}>
            {typeof props.children === "function"? props.children({ width, showColumnLayout }): props.children}
        </LayoutContext.Provider>
    )
}