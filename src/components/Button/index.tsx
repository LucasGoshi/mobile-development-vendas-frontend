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
        "border-grey-800 bg-grey-100 text-grey-800 enabled:active:bg-grey-400 disabled:bg-grey-300 disabled:text-grey-500 inline-flex h-8 select-none items-center justify-center gap-4 border px-4 font-sans shadow-pixel enabled:hover:shadow-pixel-sm enabled:active:translate-x-px enabled:active:translate-y-px enabled:active:shadow-none",
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
  children?: string;
}

export function IconButton(props: IconButtonProps) {
  const sizeClass = doSwitch(props.buttonSize ?? "normal", {
    normal: cn("!h-8 !gap-2", !props.children && "!w-8", props.children && "!px-2"),
    small: cn("!h-6 !gap-1", !props.children && "!w-6", props.children && "!px-1"),
  });

  return (
    <Button
      {...props}
      class={cn("inline-flex items-center justify-center !p-0", sizeClass, props.class)}>
      <Icon name={props.iconName} />
      {props.children}
    </Button>
  );
}
