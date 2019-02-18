import {h, render} from './state/render'
import {Home} from './screens/Home'
import {connectRouter, Route, Router} from './state/router'
import {Game} from './screens/Game/Game'
import {injectGlobal} from 'emotion'
import './ui/font/tahoma.css'

render(() => <div
    oncreate={connectRouter}
>
    <Route path="/" render={() => <Home/>}/>
    <Route path="/game/:id" render={({id}) => <Game gameId={id}/>}/>
</div>, document.getElementById('app'))

injectGlobal({
    'body': {
        margin    : 0,
        padding   : 0,
        height    : '100vh',
        width     : '100vw',
        background:
            `radial-gradient(circle at top center, #E1765F 10%, #2B1710 90%)`,
    },
})