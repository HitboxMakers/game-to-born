import {styled} from '../utilities/style/styled'


export const CornerLabel = styled('h1')(({size}) => ({
    position       : 'absolute',
    top            : '-1px',
    left           : '-1px',
    margin         : 0,
    padding        : '10px',
    backgroundColor: 'white',
    textTransform  : 'uppercase',
    filter         : 'drop-shadow(7px 7px 3px rgba(0, 0, 0, 0.5))',
    '&, & *'       : {
        lineHeight   : size || 0,
        fontSize     : size || 0,
        display      : 'inline-block',
        verticalAlign: 'bottom',
    },
    '&:after'      : {
        content    : '""',
        display    : 'inline-block',
        position   : 'absolute',
        right      : `calc(-${size || 0} - 20px)`,
        top        : 0,
        width      : 0,
        height     : 0,
        paddingLeft: '2px',
        borderStyle: 'solid',
        borderWidth: `calc(${size || 0} + 20px) calc(${size || 0} + 20px) 0 0`,
        borderColor: 'white transparent transparent transparent',
    },
}))