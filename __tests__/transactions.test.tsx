/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as mobx from "mobx";
import { h } from "preact";
import { act, render } from "@testing-library/preact";

import { useObserver } from "../src/use-observer";

// eslint-disable-next-line jest/no-test-callback
test("mobx issue 50", (done) => {
  const foo = {
    a: mobx.observable.box(true),
    b: mobx.observable.box(false),
    c: mobx.computed((): boolean => {
      // console.log("evaluate c")
      return foo.b.get();
    }),
  };
  function flipStuff() {
    mobx.transaction(() => {
      foo.a.set(!foo.a.get());
      foo.b.set(!foo.b.get());
    });
  }
  let asText = "";
  let willReactCount = 0;
  mobx.autorun(
    () => (asText = [foo.a.get(), foo.b.get(), foo.c.get()].join(":"))
  );
  const Test = () => {
    willReactCount++;
    return useObserver(() => (
      <div id="x">{[foo.a.get(), foo.b.get(), foo.c.get()].join(",")}</div>
    ));
  };

  render(<Test />);

  setImmediate(() => {
    act(() => {
      flipStuff();
    });
    expect(asText).toBe("false:true:true");
    expect(document.getElementById("x")!.innerHTML).toBe("false,true,true");
    expect(willReactCount).toBe(2);
    done();
  });
});

it("should respect transaction", async () => {
  const a = mobx.observable.box(2);
  const loaded = mobx.observable.box(false);
  const valuesSeen = [] as number[];

  const Component = () => {
    valuesSeen.push(a.get());
    return useObserver(() => {
      if (loaded.get()) {
        return <div>{a.get()}</div>;
      }
      return <div>loading</div>;
    });
  };

  const { container } = render(<Component />);

  act(() => {
    mobx.transaction(() => {
      a.set(3);
      a.set(4);
      loaded.set(true);
    });
  });

  expect(container.textContent!.replace(/\s+/g, "")).toBe("4");
  expect(valuesSeen.sort()).toEqual([2, 4].sort());
});
