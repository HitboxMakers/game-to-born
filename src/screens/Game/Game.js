import {connect, h} from '../../state/render'
import {styled} from '../../utilities/style/styled'
import {get, put, wait} from '../../utilities/store/unisaga.effects'
import {gameFocusLens, gameSelectedLens, gamesLens} from '../../state/store'
import {wrapAction} from '../../utilities/store/unisaga'
import {Preview} from './Preview'
import {CornerLabel} from '../../ui/CornerLabel'
import {gamepad} from '../../utilities/gamepad'

export const Game = connect({
    game    : ({gameId}) => gamesLens.child(gameId),
    focused : gameFocusLens,
    selected: gameSelectedLens,
})(({game, focused, selected}) => {
    if (!game) return <div/>
    console.log(focused)
    return <GameContainer>
        <Preview item={game.timeline[focused]}/>
        <TimelineContainer>
            <CornerLabel size="14px">Timeline</CornerLabel>
            <NavigationBar oncreate={bindKeys} ondestroy={unbindKeys}>
                {game.timeline.map((item, i) => {
                    let isSelected = i === selected
                    const getOnScreen = ensureOnScreen(isSelected)
                    return <NavigationItem
                        selected={isSelected}
                        oncreate={getOnScreen}
                        onupdate={getOnScreen}
                    >
                        <Logo src={require('../../ui/logo.png')}/>
                        <Label>{item.label}</Label>
                    </NavigationItem>
                })}
            </NavigationBar>
        </TimelineContainer>
    </GameContainer>
})

const GameContainer = styled('div')({
    display      : 'flex',
    flexDirection: 'column',
    height       : '100vh',
})
const TimelineContainer = styled('div')({
    position: 'relative',
    flex    : '0 0 auto',
})
const NavigationBar = styled('nav')({
    display       : 'flex',
    alignItems    : 'center',
    justifyContent: 'flex-start', // keep it ! do not try to center !
    overflowX     : 'auto',
})
const NavigationItem = styled('article')({
    flex          : '1 0 310px',
    margin        : '20px auto',
    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    justifyContent: 'center',
}, ({selected}) => ({
    fontWeight: selected ? '900' : '500',
    filter    : selected ? `drop-shadow(0px 0px 8px rgba(255, 255, 255, 1))` : 'none',
}))
const Logo = styled('img')({
    height: '60px',
})
const Label = styled('span')({
    display      : 'inline-block',
    background   : 'white',
    padding      : '6px',
    fontSize     : '14px',
    textTransform: 'uppercase',
    position     : 'relative',
    margin       : '8px',

    '&, & *'           : {
        verticalAlign: 'bottom',
        lineHeight   : '1',
    },
    '&:after, &:before': {
        content    : '""',
        display    : 'inline-block',
        position   : 'absolute',
        width      : 0,
        height     : 0,
        borderStyle: 'solid',
    },
    '&:after'          : {
        borderWidth: '13px 0 13px 13px',
        borderColor: 'transparent transparent transparent white',
        right      : '-13px',
        top        : 0,
    },
    '&:before'         : {
        borderWidth: '13px 13px 13px 0',
        borderColor: 'transparent white transparent transparent',
        left       : '-13px',
        top        : 0,
    },
})

function* onButtonPress(state, event) {
    const current = yield get(gameSelectedLens)
    const elmsPos = [...document.querySelectorAll(NavigationItem.staticSelector)]
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
    console.log(elmsPos)
    if (event.button === 'd_pad_right') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => hDistance > 0 && vDistance === 0)
            .sort(({hDistance: d1}, {hDistance: d2}) => d1 - d2)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.button === 'd_pad_left') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => hDistance < 0 && vDistance === 0)
            .sort(({hDistance: d1}, {hDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.button === 'd_pad_up') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance < 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.button === 'd_pad_down') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance > 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d1 - d2)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.button === 'button_1') {
        console.log("reset")
        yield put(gameFocusLens, null)
        yield wait(200)
        console.log("set")
        yield put(gameFocusLens, current)
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


function noop() {
}

function ensureOnScreen(selected) {
    if (!selected) {
        return noop
    }
    return function* ensureOnScreenEffect(state, element) {
        const index = indexFromElement(element)
        const count = element.parentNode.children.length
        console.log(element.parentNode.scrollWidth, index, count)
        const rect = element.getBoundingClientRect()
        const viewWidth = Math.max(element.parentNode.clientWidth, window.innerWidth)
        const deltaRight = rect.right - viewWidth
        if (deltaRight > 0) {
            element.parentNode.scrollLeft = element.parentNode.scrollWidth * (index / count)
        }
        if (rect.left < 0) {
            element.parentNode.scrollLeft = element.parentNode.scrollWidth * (index / count)
        }
    }
}

function indexFromElement(elm) {
    return [...elm.parentNode.children].indexOf(elm)
}