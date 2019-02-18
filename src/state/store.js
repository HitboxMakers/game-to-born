import createStore from 'unistore'
import {Lens} from '../utilities/store/simpleLenses'
import {initializeRouter} from './router'
import ky from 'ky'
import join from 'url-join'
import {gamesList} from '../gameList'

export const store = createStore({
    route: initializeRouter(),
    home : {
        selected: 0,
    },
    game : {
        selected: 0,
        focus   : null,
    },
    games: [],
})

async function loadGames() {
    const games = []
    for (let game of gamesList) {
        games.push(await loadGame(game))
    }
    store.setState({
        games,
    })

}
loadGames()

async function loadGame(gamePath) {
    const gameConfig = await ky.get(fromGamePath('./config.json')).json()

    gameConfig.thumbnail = fromGamePath(gameConfig.thumbnail)

    gameConfig.timeline = gameConfig.timeline.map((item) => {
        const result = Object.assign({}, item)
        if (result.images) {
            result.images = result.images.map(image => fromGamePath(image))
        }
        if (result.url) {
            result.url = fromGamePath(result.url)
        }

        return result
    })
    console.log(gameConfig)
    return gameConfig

    function fromGamePath(...params) {
        return join(gamePath, ...params.map(s => s.replace(/\.\//, '')))
    }
}

export const gamesLens = Lens('games')
export const homeLens = Lens('home')
export const gameLens = Lens('game')
export const homeSelectedLens = homeLens.child('selected')
export const gameSelectedLens = gameLens.child('selected')
export const gameFocusLens = gameLens.child('focus')
