import type { JSX } from "preact/jsx-runtime";
import sequence, { Sequence } from "../../Sequence";
import { useContext, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";
import style from "./style.module.css";
import { cn } from "../../utils/cn";
import doSwitch from "../../utils/switch_expression";
import useBackButton from "./useBackButton";

type RouteKey = Sequence;
const makeRouteKey = sequence();

interface Route<P> {
  key: RouteKey;
  kind: "screen" | "popup";
  props: P;
  state: "entering" | "normal" | "leaving";
  systemBackButtonEnabled: boolean;
  component: (props: P) => JSX.Element;
}

interface CompassContext {
  replace(arg0: string): unknown;
  routeStack: Route<any>[];
  push<P>(
    component: (props: P) => JSX.Element,
    props: P,
    options?: {
      kind?: Route<P>["kind"];
      systemBackButtonEnabled?: boolean;
    }
  ): void;
  pop(): void;
}

const CompassCtx = createContext<CompassContext | null>(null);

export function CompassProvider(props: { children: ComponentChildren }) {
  const [routeStack, setRouteStack] = useState<Route<any>[]>([]);

  function setRouteState(routeKey: RouteKey, state: Route<any>["state"]) {
    setRouteStack((stack) => stack.map((r) => (r.key === routeKey ? { ...r, state } : r)));
  }

  const compass: CompassContext = {
    routeStack,
    push: (component, props, options) => {
      const route = {
        key: makeRouteKey(),
        kind: options?.kind ?? "screen",
        systemBackButtonEnabled: options?.systemBackButtonEnabled ?? true,
        component,
        props,
        state: "entering",
      } satisfies Route<any>;

      console.log("Route push");
      setRouteStack((routeStack) => [...routeStack, route]);
    },
    pop: () => {
      const targetRoute = routeStack.at(-1);
      if (!targetRoute) {
        console.warn("Tried to pop off a route, but there are no routes on the stack.");
        return;
      }

      console.log("Route pop");
      setRouteState(targetRoute.key, "leaving");
    },
    replace: function (): unknown {
      throw new Error("Function not implemented.");
    }
  };

  function handleAnimationEndOnRoute(
    routeKey: Sequence,
    event: JSX.TargetedAnimationEvent<HTMLElement>
  ) {
    console.log("Animation End", routeKey, event.animationName);
    switch (event.animationName) {
      case style.AnimationRouteScreenEnter:
      case style.AnimationRoutePopupEnter:
        setRouteState(routeKey, "normal");
        break;
      case style.AnimationRouteScreenLeave:
      case style.AnimationRoutePopupLeave:
        setRouteStack((routeStack) => routeStack.filter((r) => r.key !== routeKey));
        break;
    }
  }

  useBackButton(() => {
    if (routeStack.at(-1)?.systemBackButtonEnabled === false) {
      return;
    }

    requestAnimationFrame(() => compass.pop());
  });

  return (
    <CompassCtx.Provider value={compass}>
      {props.children}
      {routeStack.map((route) => {
        const animationClass = doSwitch(route.state, {
          normal: style.routeWhenNormal,
          entering: style.routeWhenEntering,
          leaving: style.routeWhenLeaving,
        });

        const kindClass = doSwitch(route.kind, {
          screen: style.kindScreen,
          popup: style.kindPopup,
        });

        return (
          <section
            key={route.key}
            onAnimationEnd={handleAnimationEndOnRoute.bind(null, route.key)}
            class={cn("fixed left-0 top-0 h-full w-full", style.route, animationClass, kindClass)}>
            <route.component {...route.props} />
          </section>
        );
      })}
    </CompassCtx.Provider>
  );
}

export function useCompass() {
  const ctx = useContext(CompassCtx);

  if (!ctx) {
    throw new Error("useCompass must be used within a <Compass />");
  }

  return ctx!;
}
