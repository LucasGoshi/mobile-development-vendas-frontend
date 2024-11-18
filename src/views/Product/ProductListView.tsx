import useAlertDialog from "../../components/AlertDialog";
import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import ProductCreateUpdateView from "./ProductCreateUpdate";
import TestOverlayView from "./TestOverlayView";

export default function ProductListView() {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  async function handleDeleteButton(productId: number) {
    const userChoice = await showAlert({
      kind: "info",
      title: "Apagar produto?",
      content: <p>Deseja apagar esse produto?</p>,
      buttons: {
        cancel: "Cancelar",
        yes: "Sim, apagar",
      },
    });

    if (userChoice === "yes") {
      // TODO: Apagar produto
      alert("Produto Apagado!");
    }
  }

  return (
    <section class="flex h-full w-full flex-col gap-2 overflow-y-scroll bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">Lista de produtos</h1>
      </header>
      <div class="flex justify-end gap-1">
        <IconButton
          iconName="Add"
          onClick={() => compass.push(ProductCreateUpdateView, { operation: "CreateNew" })}
        />
        <IconButton
          iconName="Refresh"
          onClick={() => compass.push(TestOverlayView, {}, { kind: "popup" })}
        />
      </div>
      <ul class="flex grow flex-col gap-2">
        {[1, 2, 3, 4].map((i) => {
          return (
            <li
              key={i}
              class="group flex w-full flex-col border border-white-800 bg-white-100 p-2 shadow-pixel-sm focus-within:shadow-none"
              tabIndex={0}>
              <span class="font-mono text-sm">Eletrônicos</span>
              <h2 class="font-bold">Monitor 23' 1080p Odyssey</h2>
              <span class="font-mono text-sm">SAMSUNG Electronics, Inc.</span>
              <div class="flex gap-2">
                <span class="font-mono">
                  <span class="text-sm">Compra</span> R$ 729
                </span>
                <span>·</span>
                <span class="font-mono">
                  <span class="text-sm">Venda</span> R$ 990
                </span>
              </div>
              <p>Isso aqui é uma descrição</p>
              <footer class="mt-2 hidden justify-stretch gap-1 group-focus-within:flex">
                <Button class="flex-1 grow" onClick={handleDeleteButton.bind(null, i)}>
                  <Icon name="Delete" />
                  Remover
                </Button>
                <Button class="flex-1 grow">
                  <Icon name="Edit" />
                  Editar
                </Button>
              </footer>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
