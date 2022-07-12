import { useRef } from 'react'
export const UserRefDebug = () => {
    const inputEl = useRef<HTMLInputElement>(null)
    const onButtonClick = () => {
        if ( inputEl.current ) inputEl.current.focus()
    }


return (<>
    <input ref={inputEl} type='text'/>
    
        <button onClick={onButtonClick}>Click</button>

    </>
    )
}