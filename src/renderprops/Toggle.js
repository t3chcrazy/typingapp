import { useState } from 'react'

export default function Toggle({ defToggle = true , children}) {
    const [toggled, setToggled] = useState(defToggle)

    const toggle = () => setToggled(prev => !prev)

    return children({ toggled, toggle })
}