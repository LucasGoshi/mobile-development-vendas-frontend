import type { ComponentChildren } from "preact";
import { cn } from "../../utils/cn";
import style from "./style.module.css";
import { getIconUrl } from "../Icon";

interface ComboBoxProps {
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  class?: string;
  children: ComponentChildren;
}

export default function ComboBox(props: ComboBoxProps) {
  const icon = getIconUrl("SpinnerArrow");

  return (
    <select
      disabled={props.disabled ?? false} 
      class={cn(
        "border-grey-800 bg-grey-0 text-grey-800 placeholder:text-grey-400 disabled:bg-grey-100 disabled:text-grey-600 inline-flex h-8 select-none appearance-none items-center gap-2 border px-2 pr-8 font-sans shadow-pixel hover:shadow-pixel-sm disabled:shadow-none",
        style.combobox,
        props.class
      )}
      style={{ "--icon-url": `url('${icon}')` }}
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}>
      {props.children}
    </select>
  );
}
