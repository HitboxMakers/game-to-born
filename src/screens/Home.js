import {connect, h, read} from '../state/render'
import {gamesLens, homeSelectedLens} from '../state/store'
import {get, put} from '../utilities/store/unisaga.effects'
import {styled} from '../utilities/style/styled'
import {wrapAction} from '../utilities/store/unisaga'
import {navigate} from '../state/router'
import {ContainerTitle, ContainerWithTitle} from '../ui/Container'

export const Home = () => <GameList oncreate={bindKeys} ondestroy={unbindKeys}>
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
    display : 'flex',
    flexWrap: 'wrap',
})

const GamePreview = ({game, selected}) => {
    let getOnScreen = ensureOnScreen(selected)
    return <GamePreviewWrapper
        class={'nes-container with-title ' + (selected ? 'is-dark' : '')}
        selected={selected}
        oncreate={getOnScreen}
        onupdate={getOnScreen}
        background={game.thumbnail}
    >
        <GamePreviewName class="title" selected={selected}>{game.name}</GamePreviewName>
        <GameSpacer/>
    </GamePreviewWrapper>
}

const selectedWidth = 3

const GamePreviewWrapper = styled('div')({
    flex   : '1 0 310px',
    margin : '10px',
}, ({background}) => ({
    '&:after' : {
        background        : `url(${background})`,
        backgroundSize    : 'cover',
        backgroundPosition: 'center center',
    },
}))
const GameSpacer = styled('div')({
    width: '100%',
    height: '0',
    paddingBottom: '56.25%'
})
const GamePreviewName = styled('h1')({})

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

function* onKeyPress(state, event) {
    event.preventDefault()
    console.log(event)
    const current = yield get(homeSelectedLens)
    const elmsPos = [...document.querySelectorAll(GamePreviewWrapper.staticSelector)]
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
        yield put(homeSelectedLens, i)
    }
    if (event.code === 'ArrowLeft') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => hDistance < 0 && vDistance === 0)
            .sort(({hDistance: d1}, {hDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(homeSelectedLens, i)
    }
    if (event.code === 'ArrowUp') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance < 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d2 - d1)[0] || {i: current}
        yield put(homeSelectedLens, i)
    }
    if (event.code === 'ArrowDown') {
        const {i} = elmsPos
            .filter(({hDistance, vDistance}) => vDistance > 0 && hDistance === 0)
            .sort(({vDistance: d1}, {vDistance: d2}) => d1 - d2)[0] || {i: current}
        yield put(homeSelectedLens, i)
    }
    if (event.code === 'Enter') {
        yield navigate('/game/1')
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
