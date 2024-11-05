import type { JSX } from "preact/jsx-runtime";
import { cn } from "../../utils/cn";

import IconFileTypeUnknown from "./FileTypeUnknown.png";
import IconFileTypeDirectory from "./FileTypeDirectory.png";
import IconArrowUp from "./ArrowUp.png";
import IconWindowClose from "./WindowClose.png";
import IconWindowMaximize from "./WindowMaximize.png";
import IconWindowMinimize from "./WindowMinimize.png";
import IconWindowRestore from "./WindowRestore.png";
import IconCheck from "./Check.png";
import IconSpinnerArrow from "./SpinnerArrow.png";
import IconArrowLeft from "./ArrowLeft.png";

const Icons = {
  FileTypeUnknown: IconFileTypeUnknown,
  FileTypeDirectory: IconFileTypeDirectory,
  ArrowUp: IconArrowUp,
  WindowClose: IconWindowClose,
  WindowMaximize: IconWindowMaximize,
  WindowMinimize: IconWindowMinimize,
  WindowRestore: IconWindowRestore,
  Check: IconCheck,
  SpinnerArrow: IconSpinnerArrow,
  ArrowLeft: IconArrowLeft,
} as const;

export type IconName = keyof typeof Icons;

export const getIconUrl = (name: IconName) => Icons[name];

interface IconProps extends JSX.HTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: 16;
  class?: string;
}

export default function Icon(props: IconProps) {
  const size = props.size ?? 16;

  return (
    <img
      {...props}
      src={Icons[props.name]}
      aria-label={props.name}
      class={cn("pointer-events-none aspect-square select-none", props.class)}
      style={{
        fontSize: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
