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
import IconRefresh from "./Refresh.png";
import IconAdd from "./Add.png";
import IconNewLayer from "./NewLayer.png";
import IconBuild from "./Build.png";
import IconSizeP from "./SizeP.png";
import IconSizeM from "./SizeM.png";
import IconSizeG from "./SizeG.png";
import IconSizeGG from "./SizeGG.png";
import IconSizePAdd from "./SizePAdd.png";
import IconSizeMAdd from "./SizeMAdd.png";
import IconSizeGAdd from "./SizeGAdd.png";
import IconSizeGGAdd from "./SizeGGAdd.png";
import IconDelete from "./Delete.png";
import IconEdit from "./Edit.png";

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
  Refresh: IconRefresh,
  Add: IconAdd,
  NewLayer: IconNewLayer,
  Build: IconBuild,
  SizeP: IconSizeP,
  SizeM: IconSizeM,
  SizeG: IconSizeG,
  SizeGG: IconSizeGG,
  SizePAdd: IconSizePAdd,
  SizeMAdd: IconSizeMAdd,
  SizeGAdd: IconSizeGAdd,
  SizeGGAdd: IconSizeGGAdd,
  Delete: IconDelete,
  Edit: IconEdit,
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
