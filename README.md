# mobx-preact-super-lite

Super lightweight Preact bindings for MobX based on Preact 10.x+ and Hooks.

## Motivation

For now Preact app to use MobX, we need `preact/compat`(not just `preact`) and bundler alias.

To avoid them, I've just copied `mobx-react-lite` package and added some tweaks to work with Preact.

With this package you can use minimum `preact` package and `mobx-react-lite` APIs.

## Compatibility

Roughly speaking, `mobx-preact-super-lite` = `mobx-react-lite` - `observer()` hoc.

| API                      | mobx-react-lite | mobx-preact-super-lite |
| ------------------------ |:---------------:|:----------------------:|
| isUsingStaticRendering() |       ✅        |           ✅           |
| useStaticRendering()     |       ✅        |           ✅           |
| observer()               |       ✅        |          (*1)          |
| useObserver()            |       ✅        |           ✅           |
| \<Observer>               |       ✅        |           ✅           |
| useForceUpdate()         |       ✅        |           ✅           |
| useAsObservableSource()  |       ✅        |           ✅           |
| useLocalStore()          |       ✅        |           ✅           |
| observerBatching()       |       ✅        |          (*2)          |
| observerBatchingOptOut() |       ✅        |          (*2)          |
| isObserverBatched()      |       ✅        |          (*2)          |

- \*1 Original implementation requires `memo()` and `forwardRef()`, it means `preact/compat` is needed.
- \*2 We opt it out automatically.


Based `mobx-react-lite` version is `2.0.7`.

## API reference

See original [repository](https://github.com/mobxjs/mobx-react-lite) and [user guide](https://mobx-react.js.org/).
