import { useCallback, useState } from "preact/hooks";

export function useForceUpdate() {
  const [, setTick] = useState(0);

  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);

  return update;
}

const deprecatedMessages: string[] = [];

export function printDeprecated(msg: string) {
  if (!deprecatedMessages.includes(msg)) {
    deprecatedMessages.push(msg);
    console.warn(msg);
  }
}
