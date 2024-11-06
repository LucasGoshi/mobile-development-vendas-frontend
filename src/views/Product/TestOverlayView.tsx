import { useCompass } from "../../components/CompassNavigator";

export default function TestOverlayView() {
  const compass = useCompass();
  return <div class="h-full w-full bg-white-800/50" onClick={compass.pop}></div>;
}
