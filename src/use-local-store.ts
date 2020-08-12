import { observable, runInAction, transaction } from "mobx";
import { useState } from "preact/hooks";

import { useAsObservableSourceInternal } from "./use-as-observable-source";
import { isPlainObject } from "./utils";

export function useLocalStore<TStore extends Record<string, any>>(
  initializer: () => TStore
): TStore;
export function useLocalStore<
  TStore extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TSource extends object
>(initializer: (source: TSource) => TStore, current: TSource): TStore;
export function useLocalStore<
  TStore extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TSource extends object
>(initializer: (source?: TSource) => TStore, current?: TSource): TStore {
  const source = useAsObservableSourceInternal(current, true);

  return useState(() => {
    const local = observable(initializer(source));
    if (isPlainObject(local)) {
      runInAction(() => {
        Object.keys(local).forEach((key) => {
          const value = local[key];
          if (typeof value === "function") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: No idea why ts2536 is popping out here
            local[key] = wrapInTransaction(value, local);
          }
        });
      });
    }
    return local;
  })[0];
}

// eslint-disable-next-line @typescript-eslint/ban-types
function wrapInTransaction(fn: Function, context: object) {
  return (...args: unknown[]) => {
    return transaction(() => fn.apply(context, args));
  };
}
