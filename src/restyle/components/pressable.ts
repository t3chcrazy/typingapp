import {
	createRestyleComponent,
	SpacingShorthandProps,
	BackgroundColorShorthandProps,
	LayoutProps,
	layout,
	backgroundColorShorthand,
	spacingShorthand,
} from '@shopify/restyle'
import {
	Pressable as RNPressable,
	PressableProps as RNPressableProps,
} from 'react-native'

import { Theme } from '../theme'

type PressableProps = SpacingShorthandProps<Theme> &
	LayoutProps<Theme> &
	RNPressableProps &
	BackgroundColorShorthandProps<Theme>

const Pressable = createRestyleComponent<PressableProps, Theme>(
	[spacingShorthand, layout, backgroundColorShorthand],
	RNPressable,
)

export default Pressable
