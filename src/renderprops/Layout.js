import { createContext } from 'react'
import { useWindowDimensions, Dimensions } from 'react-native'

const initialWidth = Dimensions.get('window').width

const LayoutContext = createContext({
	width: initialWidth,
	showColumnLayout: initialWidth <= 768,
})

export default function Layout(props) {
	const { width } = useWindowDimensions()
	const isMobile = width < 768

	return (
		<LayoutContext.Provider value={{ width, isMobile }}>
			{typeof props.children === 'function'
				? props.children({ width, isMobile })
				: props.children}
		</LayoutContext.Provider>
	)
}
