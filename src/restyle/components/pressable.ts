import {
	createRestyleComponent,
	SpacingProps,
	LayoutProps,
	layout,
	spacing,
} from '@shopify/restyle'
import { Pressable as RNPressable } from 'react-native'

import { Theme } from '../theme'

type PressableProps = SpacingProps<Theme> & LayoutProps<Theme>

const Pressable = createRestyleComponent<PressableProps, Theme>(
	[spacing, layout],
	RNPressable,
)

export default Pressable
