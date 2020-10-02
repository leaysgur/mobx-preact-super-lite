/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any */
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import mockConsole from "jest-mock-console";
import * as mobx from "mobx";
import { h, FunctionComponent, Component } from "preact";
import { useState, useMemo } from "preact/hooks";

import { enableStaticRendering } from "../src";
import { useObserver } from "../src/use-observer";

const getDNode = (obj: any, prop?: string) => mobx.getObserverTree(obj, prop);

afterEach(cleanup);

// eslint-disable-next-line @typescript-eslint/ban-types
function obsComponent<P extends object>(component: FunctionComponent<P>) {
  return (props: P) => {
    return useObserver(() => {
      return component(props);
    });
  };
}

describe("keep views alive", () => {
  const execute = () => {
    const data = mobx.observable({
      x: 3,
      yCalcCount: 0,
      get y() {
        this.yCalcCount++;
        return this.x * 2;
      },
      z: "hi",
    });
    const TestComponent = obsComponent(() => {
      return (
        <div>
          {data.z}
          {data.y}
        </div>
      );
    });
    return { ...render(<TestComponent />), data };
  };

  test("init state", () => {
    const { data, queryByText } = execute();
    expect(data.yCalcCount).toBe(1);
    expect(queryByText("hi6")).toBeTruthy();
  });

  test("rerender should not need a recomputation of data.y", () => {
    const { data, queryByText } = execute();
    act(() => {
      data.z = "hello";
    });
    expect(data.yCalcCount).toBe(1);
    expect(queryByText("hello6")).toBeTruthy();
  });
});

describe("does not keep views alive when using static rendering", () => {
  const execute = () => {
    enableStaticRendering(true);
    let renderCount = 0;
    const data = mobx.observable({
      z: "hi",
    });

    const TestComponent = obsComponent(() => {
      renderCount++;
      return <div>{data.z}</div>;
    });

    return {
      ...render(<TestComponent />),
      data,
      getRenderCount: () => renderCount,
    };
  };

  afterEach(() => {
    enableStaticRendering(false);
  });

  test("init state is correct", () => {
    const { getRenderCount, getByText } = execute();
    expect(getRenderCount()).toBe(1);
    expect(getByText("hi")).toBeTruthy();
  });

  test("no re-rendering on static rendering", () => {
    const { getRenderCount, getByText, data } = execute();
    act(() => {
      data.z = "hello";
    });
    expect(getRenderCount()).toBe(1);
    expect(getByText("hi")).toBeTruthy();
    expect(getDNode(data, "z").observers!).toBeFalsy();
  });
});

describe("issue 12", () => {
  const createData = () =>
    mobx.observable({
      selected: "coffee",
      items: [
        {
          name: "coffee",
        },
        {
          name: "tea",
        },
      ],
    });

  interface IItem {
    name: string;
  }
  interface IRowProps {
    item: IItem;
    selected: string;
  }
  const Row: FunctionComponent<IRowProps> = (props) => {
    return (
      <span>
        {props.item.name}
        {props.selected === props.item.name ? "!" : ""}
      </span>
    );
  };
  /** table stateles component */
  const Table = obsComponent<{ data: { items: IItem[]; selected: string } }>(
    (props) => {
      return (
        <div>
          {props.data.items.map((item) => (
            <Row key={item.name} item={item} selected={props.data.selected} />
          ))}
        </div>
      );
    }
  );

  test("init state is correct", () => {
    const data = createData();
    const { container } = render(<Table data={data} />);
    expect(container).toMatchSnapshot();
  });

  test("run transaction", () => {
    const data = createData();
    const { container } = render(<Table data={data} />);
    act(() => {
      mobx.transaction(() => {
        data.items[1].name = "boe";
        data.items.splice(0, 2, { name: "soup" });
        data.selected = "tea";
      });
    });
    expect(container).toMatchSnapshot();
  });
});

test("changing state in render should fail", () => {
  // This test is most likely obsolete ... exception is not thrown
  const data = mobx.observable.box(2);
  const Comp = obsComponent(() => {
    if (data.get() === 3) {
      try {
        data.set(4); // wouldn't throw first time for lack of observers.. (could we tighten this?)
      } catch (err) {
        // eslint-disable-next-line jest/no-try-expect
        expect(
          /Side effects like changing state are not allowed at this point/.test(
            err
          )
        ).toBeTruthy();
      }
    }
    return <div>{data.get()}</div>;
  });
  const { container } = render(<Comp />);
  act(() => {
    data.set(3);
  });
  expect(container).toMatchSnapshot();
  mobx._resetGlobalState();
});

describe("should render component even if setState called with exactly the same props", () => {
  const execute = () => {
    let renderCount = 0;
    const Component = obsComponent(() => {
      const [, setState] = useState({});
      const onClick = () => {
        setState({});
      };
      renderCount++;
      return <div onClick={onClick} data-testid="clickableDiv" />;
    });
    return { ...render(<Component />), getCount: () => renderCount };
  };

  test("renderCount === 1", () => {
    const { getCount } = execute();
    expect(getCount()).toBe(1);
  });

  test("after click once renderCount === 2", async () => {
    const { getCount, getByTestId } = execute();
    fireEvent.click(getByTestId("clickableDiv"));
    expect(getCount()).toBe(2);
  });

  test("after click twice renderCount === 3", async () => {
    const { getCount, getByTestId } = execute();
    fireEvent.click(getByTestId("clickableDiv"));
    fireEvent.click(getByTestId("clickableDiv"));
    expect(getCount()).toBe(3);
  });
});

describe("it rerenders correctly when useMemo is wrapping observable", () => {
  const execute = () => {
    let renderCount = 0;
    const createProps = () => {
      const odata = mobx.observable({ x: 1 });
      const data = { y: 1 };
      function doStuff() {
        data.y++;
        odata.x++;
      }
      return { odata, data, doStuff };
    };

    const Component = obsComponent((props: any) => {
      const computed = useMemo(() => props.odata.x, [props.odata.x]);

      renderCount++;
      return (
        <span onClick={props.doStuff}>
          {props.odata.x}-{props.data.y}-{computed}
        </span>
      );
    });

    const rendered = render(<Component {...createProps()} />);
    return {
      ...rendered,
      getCount: () => renderCount,
      span: rendered.container.querySelector("span")!,
    };
  };

  test("init renderCount === 1", () => {
    const { span, getCount } = execute();
    expect(getCount()).toBe(1);
    expect(span.innerHTML).toBe("1-1-1");
  });

  test("after click renderCount === 2", async () => {
    const { span, getCount } = execute();
    fireEvent.click(span);
    expect(getCount()).toBe(2);
    expect(span.innerHTML).toBe("2-2-2");
  });

  test("after click twice renderCount === 3", async () => {
    const { span, getCount } = execute();
    fireEvent.click(span);
    fireEvent.click(span);
    expect(getCount()).toBe(3);
    expect(span.innerHTML).toBe("3-3-3");
  });
});

describe("error handling", () => {
  test("errors should propagate", () => {
    const x = mobx.observable.box(1);
    const errorsSeen: any[] = [];

    class ErrorBoundary extends Component {
      public static getDerivedStateFromError() {
        return { hasError: true };
      }

      public state = {
        hasError: false,
      };

      public componentDidCatch(error: any) {
        errorsSeen.push(`${error}`);
      }

      public render() {
        if (this.state.hasError) {
          return <span>Saw error!</span>;
        }
        return this.props.children;
      }
    }

    const C = obsComponent(() => {
      if (x.get() === 42) {
        throw new Error("The meaning of life!");
      }
      return <span>{x.get()}</span>;
    });

    const restoreConsole = mockConsole();
    try {
      const rendered = render(
        <ErrorBoundary>
          <C />
        </ErrorBoundary>
      );
      expect(rendered.container.querySelector("span")!.innerHTML).toBe("1");
      act(() => {
        x.set(42);
      });
      expect(errorsSeen).toEqual(["Error: The meaning of life!"]);
      expect(rendered.container.querySelector("span")!.innerHTML).toBe(
        "Saw error!"
      );
    } finally {
      restoreConsole();
    }
  });
});
