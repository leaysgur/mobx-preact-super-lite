import "./utils/assert-environment";

import { printDeprecated } from "./utils/utils";
import { useObserver as useObserverOriginal } from "./use-observer";
import { enableStaticRendering } from "./static-rendering";

export {
  isUsingStaticRendering,
  enableStaticRendering,
} from "./static-rendering";
export { Observer } from "./observer-component";
export { useLocalObservable } from "./use-local-observable";
export { useLocalStore } from "./use-local-store";
export { useAsObservableSource } from "./use-as-observable-source";

export function useObserver<T>(fn: () => T, baseComponentName = "observed"): T {
  if ("production" !== process.env.NODE_ENV) {
    printDeprecated(
      "[mobx-react-lite] 'useObserver(fn)' is deprecated. Use `<Observer>{fn}</Observer>` instead, or wrap the entire component in `observer`."
    );
  }
  return useObserverOriginal(fn, baseComponentName);
}

export function useStaticRendering(enable: boolean) {
  if ("production" !== process.env.NODE_ENV) {
    printDeprecated(
      "[mobx-react-lite] 'useStaticRendering' is deprecated, use 'enableStaticRendering' instead"
    );
  }
  enableStaticRendering(enable);
}
