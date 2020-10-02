# mobx-preact-super-lite

Super lightweight Preact bindings for MobX based on Preact 10.x+ and Hooks.

[![NPM](https://nodei.co/npm/mobx-preact-super-lite.png)](https://www.npmjs.com/package/mobx-preact-super-lite)

## Motivation

For now Preact app to use MobX, we need `preact/compat`(not just `preact`) and bundler alias.

To avoid them, I've just copied `mobx-react-lite` package and added some tweaks to work with Preact.

With this package you can use minimum `preact` package and `mobx-react-lite` APIs.

## Compatibility

Roughly speaking, `mobx-preact-super-lite` = `mobx-react-lite` - `observer()` hoc.

| API                     | mobx-react-lite | mobx-preact-super-lite |
| ----------------------- |:---------------:|:----------------------:|
| observer()              |       ✅        |          (*1)          |
| \<Observer>             |       ✅        |           ✅           |
| useLocalObservable()    |       ✅        |           ✅           |
| enableStaticRendering() |       ✅        |           ✅           |

- \*1 Original implementation requires `memo()` and `forwardRef()`, it means `preact/compat` is needed.

### Deprecated APIs

| API                      | mobx-react-lite | mobx-preact-super-lite |
| ------------------------ |:---------------:|:----------------------:|
| useObserver()            |       ✅        |           ✅           |
| useLocalStore()          |       ✅        |           ✅           |
| useAsObservableSource()  |       ✅        |           ✅           |
| observerBatching()       |       ✅        |          (*2)          |
| observerBatchingOptOut() |       ✅        |          (*2)          |
| isObserverBatched()      |       ✅        |          (*2)          |

- \*2 We opt it out automatically.

Version is aligned with `mobx-react-lite` version.

## API reference

See original [repository](https://github.com/mobxjs/mobx-react-lite) and [user guide](https://mobx.js.org/react-integration.html).
