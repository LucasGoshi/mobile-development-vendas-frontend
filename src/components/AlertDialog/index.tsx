import { ComponentChildren } from "preact";
import { useCompass } from "../CompassNavigator";
import { useRef } from "preact/hooks";
import Button from "../Button";
import Deferred from "../../utils/Deferred";

function AlertDialogOverlay<ActionKeys extends string>(props: {
  kind: "info" | "ask" | "warn";
  title: string;
  content: string | ComponentChildren;
  buttons: Record<ActionKeys, string>;
  onButtonClicked: (button: ActionKeys) => void;
}) {
  return (
    <div class="absolute left-0 top-0 h-full w-full bg-white-900/70">
      <main class="absolute left-1/2 top-1/2 mx-auto flex max-h-screen w-[calc(100%-theme(spacing.8))] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 bg-white-0 p-4 shadow-pixel-md">
        <h1 class="text-xl font-bold">{props.title}</h1>
        {props.content}
        <footer class="flex justify-end gap-1">
          {Object.keys(props.buttons).map((buttonKey) => {
            const buttonText = props.buttons[buttonKey as ActionKeys];

            return (
              <Button
                key={buttonKey}
                onClick={() => props.onButtonClicked(buttonKey as ActionKeys)}>
                {buttonText}
              </Button>
            );
          })}
        </footer>
      </main>
    </div>
  );
}

export default function useAlertDialog() {
  const compass = useCompass();
  const compassRef = useRef(compass);

  compassRef.current = compass;

  function showAlert<ActionKeys extends string>(config: {
    kind: "info" | "ask" | "warn";
    title: string;
    content: string | ComponentChildren;
    buttons: Record<ActionKeys, string>;
  }): Promise<ActionKeys> {
    const deferred = new Deferred<ActionKeys>();

    compass.push(
      AlertDialogOverlay<ActionKeys>,
      {
        kind: config.kind,
        title: config.title,
        content: config.content,
        buttons: config.buttons,
        onButtonClicked: (buttonKey) => {
          console.log("button clicked", buttonKey);
          compassRef.current.pop();
          deferred.resolve(buttonKey);
        },
      },
      {
        kind: "popup",
        systemBackButtonEnabled: false,
      }
    );

    return deferred.promise;
  }

  return showAlert;
}
