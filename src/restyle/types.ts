type FONT_SIZES = 'tiny' | 'small' | 'paragraph' | 'heading6' | 'heading5'

type FONT_WEIGHTS = 'Regular' | 'Medium' | 'Bold'

export type TYPOGRAPHY = {
	[K in FONT_SIZES as `${K}${FONT_WEIGHTS}`]: object
}
