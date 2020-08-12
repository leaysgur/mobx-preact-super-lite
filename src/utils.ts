import { useCallback, useState } from "preact/hooks";

export function useForceUpdate() {
  const [, setTick] = useState(0);

  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);

  return update;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isPlainObject(value: any): value is object {
  if (!value || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return !proto || proto === Object.prototype;
}
