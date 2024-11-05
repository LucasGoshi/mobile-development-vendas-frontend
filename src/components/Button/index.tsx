import type { ComponentChildren, JSX, Ref } from "preact";
import { cn } from "../../utils/cn";
import Icon, { IconName } from "../Icon";
import doSwitch from "../../utils/switch_expression";

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children?: ComponentChildren;
  class?: string;
  buttonRef?: Ref<HTMLButtonElement>;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={cn(
        "enabled:active:bg-white-400 disabled:text-white-500 inline-flex h-8 select-none items-center justify-center gap-4 border border-white-800 bg-white-100 px-4 font-sans text-white-800 shadow-pixel enabled:hover:shadow-pixel-sm enabled:active:translate-x-px enabled:active:translate-y-px enabled:active:shadow-none disabled:bg-white-300",
        props.class
      )}
      ref={props.buttonRef}>
      {props.children}
    </button>
  );
}

export interface IconButtonProps extends ButtonProps {
  iconName: IconName;
  buttonSize?: "small" | "normal";
  children?: never;
}

export function IconButton(props: IconButtonProps) {
  const sizeClass = doSwitch(props.buttonSize ?? "normal", {
    normal: "!h-8 !w-8",
    small: "!h-6 !w-6",
  });

  return (
    <Button
      {...props}
      class={cn("inline-flex items-center justify-center !p-0", sizeClass, props.class)}>
      <Icon name={props.iconName} />
    </Button>
  );
}
