// Based on Filter.tsx

import { Children } from "react"

type ControlPanelProps = {
    children: any,
}

export const ControlPanel = ({children}: ControlPanelProps) => {
    return (<div>
        {children}
    </div>

    )
}