import View from '../../restyle/components/view'

export default function DrawerScreen({ children }) {
	return <View p={{ phone: 'sm', tablet: 'lg', pc: 'xl' }}>{children}</View>
}
