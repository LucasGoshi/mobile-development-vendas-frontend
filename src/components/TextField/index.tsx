import type { JSX, Ref } from "preact";
import { cn } from "../../utils/cn";
import style from "./style.module.css";

interface BaseFieldProps {
  placeholder?: string;
  class?: string;
  disabled?: boolean;
  readOnly?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  style?: JSX.CSSProperties;
}

interface TextFieldProps extends BaseFieldProps {
  kind: "text";
  value: string;
  onInput(newValue: string): void;
  usesPasswordMask?: boolean;
}

interface NumericFieldProps extends BaseFieldProps {
  kind: "number";
  min?: number; 
  max?: number;
  step?: number;
  value: number;
  onInput(newValue: number): void;
}

export type FieldProps = TextFieldProps | NumericFieldProps;

export default function TextField(props: FieldProps) {
  // Inicialize como um objeto vazio com os tipos apropriados
  let inputProps: Partial<JSX.IntrinsicElements["input"]> = {};

  switch (props.kind) {
    case "text":
      inputProps = {
        type: props.usesPasswordMask ? "password" : "text", 
        value: props.value,
        onInput: (e) => props.onInput(e.currentTarget.value),
        style: { ...props.style },
      };
      break;
    case "number":
      inputProps = {
        type: "number", 
        min: props.min?.toString(), 
        max: props.max?.toString(),
        step: props.step ?? 1,
        value: props.value,
        onInput: (e) => props.onInput(e.currentTarget.valueAsNumber),
        style: { ...props.style, fontVariantNumeric: "tabular-nums" },
      };
      break;
  }

  return (
    <input
      {...inputProps}
      placeholder={props.placeholder}
      disabled={props.disabled ?? false}
      class={cn(
        "border-grey-800 bg-grey-0 text-grey-800 placeholder:text-grey-400 disabled:bg-grey-100 disabled:text-grey-600 inline-flex h-8 select-none gap-2 border px-2 font-sans shadow-pixel disabled:shadow-none",
        props.class,
        props.kind === "number" && style.numberInput
      )}
      readOnly={props.readOnly}
      ref={props.inputRef}
    />
  );
}

interface MultilineTextFieldProps {
  value: string;
  onInput(newValue: string): void;
  placeholder?: string;
  class?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export function MultilineTextField(props: MultilineTextFieldProps) {
  return (
    <textarea
      placeholder={props.placeholder}
      disabled={props.disabled ?? false}
      class={cn(
        "border-grey-800 bg-grey-0 text-grey-800 placeholder:text-grey-400 disabled:bg-grey-100 disabled:text-grey-600 inline-flex select-none gap-2 border px-2 py-1 font-sans shadow-pixel disabled:shadow-none",
        props.class
      )}
      value={props.value}
      onInput={(e) => props.onInput(e.currentTarget.value)}
      rows={props.rows}
      readOnly={props.readOnly}
      ref={props.textareaRef}
    />
  );
}
