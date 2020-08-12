import { VNode } from "preact";
import { useObserver } from "./use-observer";

interface IObserverProps {
  children?(): VNode<any>;
  render?(): VNode<any>;
}

function ObserverComponent({ children, render }: IObserverProps) {
  const component = children || render;
  if (typeof component !== "function") {
    return null;
  }
  return useObserver(component);
}
ObserverComponent.displayName = "Observer";

export { ObserverComponent as Observer };
