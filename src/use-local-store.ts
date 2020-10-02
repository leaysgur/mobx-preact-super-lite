import { observable } from "mobx";
import { useState } from "preact/hooks";

import { printDeprecated } from "./utils/utils";
import { useAsObservableSource } from "./use-as-observable-source";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLocalStore<TStore extends Record<string, any>>(
  initializer: () => TStore
): TStore;

export function useLocalStore<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TStore extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TSource extends object
>(initializer: (source: TSource) => TStore, current: TSource): TStore;

export function useLocalStore<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TStore extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TSource extends object
>(initializer: (source?: TSource) => TStore, current?: TSource): TStore {
  if ("production" !== process.env.NODE_ENV)
    printDeprecated(
      "[mobx-react-lite] 'useLocalStore' is deprecated, use 'useLocalObservable' instead."
    );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const source = current && useAsObservableSource(current);
  return useState(() =>
    observable(initializer(source), undefined, { autoBind: true })
  )[0];
}
