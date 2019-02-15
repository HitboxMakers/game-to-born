import {connect, h} from '../../state/render'
import {styled} from '../../utilities/style/styled'
import {get, put} from '../../utilities/store/unisaga.effects'
import {gameFocusLens, gameSelectedLens, gamesLens} from '../../state/store'
import {wrapAction} from '../../utilities/store/unisaga'
import {NesIcon} from '../../utilities/style/nesicons'
import {Preview} from './Preview'


export const Game = connect({
    game    : ({gameId}) => gamesLens.child(gameId),
    focused : gameFocusLens,
    selected: gameSelectedLens,
})(({game, focused, selected}) => {
    console.log(focused)
    return <GameContainer>
        <Preview item={game.timeline[focused]}/>
        <div class="nes-container with-title">
            <span class="title">Timeline</span>
            <NavigationBar oncreate={bindKeys} ondestroy={unbindKeys}>
                {game.timeline.map((item, i) => {
                    let isSelected = i === selected
                    const getOnScreen = ensureOnScreen(isSelected)
                    return <NavigationItem
                        selected={isSelected}
                        oncreate={getOnScreen}
                        onupdate={getOnScreen}
                    >
                        <label>
                            {/*<input type="radio" class="nes-radio" name="selected-game" value={i} checked={isSelected}/>*/}
                            <NesIcon icon="star" transparent={!isSelected}/>
                        </label>
                        <span>{item.label}</span>
                    </NavigationItem>
                })}
            </NavigationBar>
        </div>
    </GameContainer>
})

const GameContainer = styled('div')({
    display      : 'flex',
    flexDirection: 'column',
    height       : '100vh',
})

const GameRender = styled('iframe')({
    margin: 'auto',
    width : '50vh',
    height: '50vh',
})

const NavigationBar = styled('nav')({
    height         : '20vh',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'flex-start', // keep it ! do not try to center !
    overflowX      : 'auto',
})
const NavigationItem = styled('article')(({selected}) => ({
    flex : '1 0 310px',
    fontWeight: selected ? '900' : '500',

    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    justifyContent: 'center',
}))


function* onKeyPress(state, event) {
    event.preventDefault()
    const current = yield get(gameSelectedLens)
    const elmsPos = [...document.querySelectorAll(NavigationItem.staticSelector)]
        .map($elm => $elm.getBoundingClientRect())
        .map(({left, top}, i, elmsPos) => ({
                hDistance: left - elmsPos[current].left,
                vDistance: top - elmsPos[current].top,
                i,
            }),
        )
    if (event.code === 'ArrowRight') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => hDistance > 0 && vDistance === 0)
            .sort(({hDistance: d1}, {hDistance: d2}) => d1 - d2)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.code === 'ArrowLeft') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => hDistance < 0 && vDistance === 0)
            .sort(({hDistance: d1}, {hDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.code === 'ArrowUp') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance < 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.code === 'ArrowDown') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance > 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d1 - d2)[0] || {i: current}
        yield put(gameSelectedLens, i)
    }
    if (event.code === 'Enter') {
        yield put(gameFocusLens, current)
    }
}

const map = new WeakMap()

function* bindKeys() {
    yield store => {
        const listener = wrapAction(onKeyPress)(store)
        map.set(onKeyPress, listener)
        window.addEventListener('keydown', listener, false)
    }
}

function* unbindKeys() {
    const listener = map.get(onKeyPress)
    window.removeEventListener('keydown', listener, false)
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