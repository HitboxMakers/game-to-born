const id = a => a

export function Lens(path, getter = id, setter = id) {
    const finalPath = formatPath(path)
    return {
        get() {
            return holder => getter(fromPath(holder, finalPath), holder)
        },
        set(value) {
            return holder => intoPath(holder, finalPath, setter(value, holder))
        },
        child(child) {
            return Lens(finalPath.concat(formatPath(child)))
        },
        wrap(path) {
            return Lens(formatPath(path).concat(finalPath), getter, setter)
        },
        onSet(setter) {
            return Lens(finalPath, getter, setter)
        },
        onGet(getter) {
            return Lens(finalPath, getter, setter)
        },
        get path() {
            return [].concat(finalPath)
        },
        get setter() {
            return setter
        },
        get getter() {
            return getter
        },
    }
}

export const multipleLenses = (...lenses) => {
    return ({
        get() {
            return lenses[0]?.get()
        },
        set(value) {
            return holder => lenses.reduce((acc, lens) => lens.set(value)(acc), holder)
        },
        child(child) { // use with care...
            return multipleLenses(...lenses.map(lens => lens.child(child)))
        },
        wrap(path) {
            return multipleLenses(...lenses.map(lens => lens.wrap(path)))
        },
        onSet(newSetter) {
            return multipleLenses(...lenses.map(lens => lens.onSet((v, holder) => lens.setter(newSetter(v, holder), holder))))
        },
        get path() {
            return lenses[0]?.path
        },
        get setter() {
            return id
        }
    })
}

export function mapLenses(obj) {
    return (holder, props) => {
        return Object.keys(obj).reduce((acc, key) => {
            const intermediate = obj[key]
            const element = typeof intermediate === 'function' ? intermediate(props) : intermediate
            return ({
                ...acc,
                [key]: element.get()(holder)
            })
        }, {})
    }
}


function intoPath(obj, path, update) {
    if (!path || path.length <= 0) return typeof update !== 'object'
        ? update
        : merge(obj, update)
    const [head, ...tail] = path
    return Array.isArray(obj)
        // is that useful ? feels weird...
        // || (obj == null && !isNaN(head) && (obj = Array(Number(head)) + 1)) // handle empty but with a number key => so fill an array
        ? obj
            .slice(0, head)
            .concat(
                intoPath(obj?.[head], tail, update)
            )
            .concat(
                obj.slice(head + 1)
            )
        : {
            ...obj,
            [head]: intoPath(obj?.[head], tail, update),
        }

}

function fromPath(obj, path) {
    return path
        .reduce((acc, item) => (acc || {})[item], obj)
}

function formatPath(path) {
    path = path || []
    if (!Array.isArray(path)) path = path.split(/[./\[\]\\]/ig)
    return path.filter(v => Boolean(v) || v === 0)
}

function merge(a, b) {
    return Object.assign(emptyIt(a, b), a, b)
}

function emptyIt(...items) {
    return items.some(v => Array.isArray(v)) ? [] : {}
}
