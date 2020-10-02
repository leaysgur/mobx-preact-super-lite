import { VNode } from "preact";
import { useObserver } from "./use-observer";

interface IObserverProps {
  children?(): VNode | null;
  render?(): VNode | null;
}

function ObserverComponent({ children, render }: IObserverProps) {
  const component = children || render;
  if (typeof component !== "function") {
    return null;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useObserver(component);
}

ObserverComponent.displayName = "Observer";

export { ObserverComponent as Observer };
