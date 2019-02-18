import {connect, h, read} from '../state/render'
import {gamesLens, homeSelectedLens} from '../state/store'
import {get, put} from '../utilities/store/unisaga.effects'
import {styled} from '../utilities/style/styled'
import {wrapAction} from '../utilities/store/unisaga'
import {navigate} from '../state/router'
import {ContainerTitle, ContainerWithTitle} from '../ui/Container'
import {CornerLabel} from '../ui/CornerLabel'
import {gamepad} from '../utilities/gamepad'

export const Home = () => <GameList oncreate={bindKeys} ondestroy={unbindKeys}>
    <CornerLabel size="32px">
        <Logo src={require('../ui/logo.png')}/>
        <span>Hitbox Makers</span>
    </CornerLabel>
    <ConnectedGameList/>
</GameList>

const ConnectedGameList = connect({
    games   : gamesLens,
    selected: homeSelectedLens,
})(
    ({games, selected}) =>
        games.map((game, i) => <GamePreview
            game={game}
            selected={selected === i}
        />),
)

const GameList = styled('div')({
    display   : 'flex',
    flexWrap  : 'wrap',
    padding   : '10px',
    paddingTop: '65px',
})

const GamePreview = ({game, selected}) => {
    let getOnScreen = ensureOnScreen(selected)
    return <GamePreviewWrapper
        selected={selected}
        oncreate={getOnScreen}
        onupdate={getOnScreen}
        background={game.thumbnail}
    >
        <CornerLabel selected={selected} size="24px">{game.name}</CornerLabel>
    </GamePreviewWrapper>
}

const GamePreviewWrapper = styled('div')({
    flex     : '1 0 300px',
    margin   : '10px',
    position : 'relative',
    outline  : `10px solid`,
    '&:after': {
        content: '""',
        display: 'block',

        width        : '100%',
        height       : '0',
        paddingBottom: '56.25%',
    },
}, ({background, selected}) => ({
    background        : `url(${background})`,
    backgroundSize    : 'cover',
    backgroundPosition: 'center center',
    transition        : 'all 150ms ease-in-out',
    zIndex            : selected ? '2' : '1',
    outlineColor      : selected ? 'white' : 'transparent',
    transform         : selected ? 'scale(1.01)' : 'scale(1)',

}))

const Logo = styled('img')({
    height      : '1em',
    paddingRight: '0.5em',
})

function noop() {
}

function ensureOnScreen(selected) {
    if (!selected) {
        return noop
    }
    return function* ensureOnScreenEffect(state, element) {
        console.log('element', element)
        const rect = element.getBoundingClientRect()
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
        const deltaBottom = rect.bottom - viewHeight
        if (deltaBottom > 0) {
            document.scrollingElement.scrollTop += deltaBottom
        }
        if (rect.top < 0) {
            document.scrollingElement.scrollTop += rect.top
        }
    }
}

function* onButtonPress(state, event) {
    console.log(event)
    const current = yield get(homeSelectedLens)
    const elmsPos = [...document.querySelectorAll(GamePreviewWrapper.staticSelector)]
        .map($elm => $elm.getBoundingClientRect())
        .map(({left, top}, i, elmsPos) => {
                const hDistance = left - elmsPos[current].left
                const vDistance = top - elmsPos[current].top
                return ({
                    hDistance: hDistance - (hDistance % elmsPos[i].width), // add tolerance on alignment
                    vDistance: vDistance - (vDistance % elmsPos[i].height), // add tolerance on alignment
                    i,
                })
            },
        )
    if (event.button === 'd_pad_right') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => hDistance > 0 && vDistance === 0)
            .sort(({hDistance: d1}, {hDistance: d2}) => d1 - d2)[0] || {i: current}
        yield put(homeSelectedLens, i)
    }
    if (event.button === 'd_pad_left') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => hDistance < 0 && vDistance === 0)
            .sort(({hDistance: d1}, {hDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(homeSelectedLens, i)
    }
    if (event.button === 'd_pad_up') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance < 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(homeSelectedLens, i)
    }
    if (event.button === 'd_pad_down') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance > 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d1 - d2)[0] || {i: current}
        yield put(homeSelectedLens, i)
    }
    if (event.button === 'button_1') {
        yield navigate('/game/' + current)
    }
}

function* bindKeys() {
    yield store => {
        const buttonListener = wrapAction(onButtonPress)(store)
        gamepad.on('press', "all", buttonListener)
    }
}

function* unbindKeys() {
    gamepad.off('press', 'all')
}
