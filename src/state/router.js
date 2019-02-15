import UrlPattern from 'url-pattern'
import {Lens} from '../utilities/store/simpleLenses'
import {put, get} from '../utilities/store/unisaga.effects'

const routesMap = new Map()

function match(pattern, url) {
    const compiledPattern = routesMap.get(pattern) || new UrlPattern(pattern)
    routesMap.set(pattern, compiledPattern)

    return compiledPattern.match(url)
}

export const Route = ({path, render}) => (state) => {
    console.log("path", path)
    const route = get(routeLens)(state)
    console.log("route", route)
    const routeParams = match(path, route)
    console.log("match", routeParams)
    return routeParams && render(routeParams)
}

export const routeLens = Lens('route')

export const initializeRouter = () => window.location.pathname

export function navigate(url) {
    return (store) => {
        put(routeLens, url)(store)
        return window.history.pushState({}, document.title, url)
    }
}
