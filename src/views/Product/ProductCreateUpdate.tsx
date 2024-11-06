import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import TextField from "../../components/TextField";

interface ProductCreateUpdateViewProps {
  // seed: Product;
  operation: "CreateNew" | "Update";
}
export default function ProductCreateUpdateView(props: ProductCreateUpdateViewProps) {
  const compass = useCompass();

  function handleFormSubmit(e: Event) {
    e.preventDefault();
  }

  return (
    <section class="flex h-full w-full flex-col gap-2 bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">
          {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"} produto
        </h1>
      </header>
      <form onSubmit={handleFormSubmit} class="flex flex-col gap-2">
        <label class="flex flex-col">
          E-mail
          <TextField kind="text" value={""} onInput={() => {}} />
        </label>
        <label class="flex flex-col">
          Senha
          <TextField kind="text" value={""} onInput={() => {}} usesPasswordMask />
        </label>
        <footer class="flex justify-end">
          <Button>
            <Icon name={props.operation === "CreateNew" ? "Add" : "Build"} />
            {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"}
          </Button>
        </footer>
      </form>
    </section>
  );
}
