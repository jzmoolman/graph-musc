import CSS from 'csstype' 

type DevViewProps ={
    children: any,
}
export const DevView = ({children}:DevViewProps) => {
    
    const style_props: CSS.Properties = {
        position: 'absolute',
        top: '40px',
        right: '10px',
        bottom: '10px',
        left: '10px',
        border: '3px solid #73AD21',
    }

    return (
        <div style={style_props}>
            {children}
        </div>

    )
}