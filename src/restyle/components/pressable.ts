import {
	createRestyleComponent,
	SpacingShorthandProps,
	BackgroundColorShorthandProps,
	LayoutProps,
	BorderProps,
	layout,
	backgroundColorShorthand,
	border,
	spacingShorthand,
} from '@shopify/restyle'
import {
	Pressable as RNPressable,
	PressableProps as RNPressableProps,
} from 'react-native'

import { Theme } from '../theme'

type PressableProps = SpacingShorthandProps<Theme> &
	LayoutProps<Theme> &
	BackgroundColorShorthandProps<Theme> &
	RNPressableProps &
	BorderProps<Theme>

const Pressable = createRestyleComponent<PressableProps, Theme>(
	[spacingShorthand, layout, backgroundColorShorthand, border],
	RNPressable,
)

export default Pressable
