import { createTheme } from '@shopify/restyle'

const FONT_SIZES = [
	{
		label: 'tiny',
		value: 10,
	},
	{
		label: 'small',
		value: 12,
	},
	{
		label: 'paragraph',
		value: 14,
	},
	{
		label: 'heading6',
		value: 16,
	},
	{
		label: 'heading5',
		value: 18,
	},
]

const FONT_WEIGHTS = [
	{
		label: 'Regular',
		value: 'Lato_400Regular',
	},
	{
		label: 'Medium',
		value: 'Lato_700Bold',
	},
	{
		label: 'Bold',
		value: 'Lato_900Black',
	},
]

const TEXT_VARIANTS = FONT_SIZES.reduce((acc, fontSize) => {
	FONT_WEIGHTS.forEach((weight) => {
		acc[`${fontSize.label}${weight.label}`] = {
			fontSize: fontSize.value,
			fontFamily: weight.value,
		}
	})
	return acc
}, {})

export const palette = {
	white: '#fff',
	blue: '#00bfdb',
	darkBlue: '#0083b0',
	yellow: '#f6e58d',
	lightGray: '#f6f6f6',
	red: '#e74c3c',
	black: '#2f3640',
}

const theme = createTheme({
	colors: {
		mainBackground: palette.white,
		secondaryBackground: palette.lightGray,
		primary: palette.darkBlue,
		white: palette.white,
		warning: palette.yellow,
		danger: palette.red,
		textBlack: palette.black,
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 36,
		xxl: 64,
	},
	textVariants: {
		header: {
			fontWeight: 'bold',
			fontSize: 34,
		},
		body: {
			fontSize: 16,
			lineHeight: 24,
		},
		...TEXT_VARIANTS,
		defaults: {
			fontFamily: 'Lato_400Regular',
		},
	},
})

export type Theme = typeof theme
export default theme
