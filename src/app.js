import {h, render} from './state/render'
import {Home} from './screens/Home'
import {Route, Router} from './state/router'
import {Game} from './screens/Game/Game'
import {injectGlobal} from 'emotion'
import "nes.css/css/nes.css"

render(() => <div>
    <Route path="/" render={() => <Home/>}/>
    <Route path="/game/:id" render={({id}) => <Game gameId={id}/>}/>
</div>, document.getElementById('app'))

injectGlobal({
    'body': {
        margin: 0,
        padding: 0,
    }
})
