import { useState } from "preact/hooks";
import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import TextField from "../../components/TextField";
import Icon from "../../components/Icon";

export default function LoginView() {
  const compass = useCompass();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  function handleFormSubmit(e: Event) {
    e.preventDefault();
  }

  return (
    <section class="flex h-full w-full flex-col gap-2 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">Fazer login</h1>
      </header>
      <form onSubmit={handleFormSubmit} class="flex flex-col gap-2">
        <label class="flex flex-col">
          E-mail
          <TextField kind="text" value={emailInput} onInput={setEmailInput} />
        </label>
        <label class="flex flex-col">
          Senha
          <TextField
            kind="text"
            value={passwordInput}
            onInput={setPasswordInput}
            usesPasswordMask
          />
        </label>
        <footer class="flex justify-end">
          <Button>
            <Icon name="Check" />
            Fazer login
          </Button>
        </footer>
      </form>
    </section>
  );
}
