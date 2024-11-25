import { useEffect, useState } from "preact/hooks";
import { produtoDelete, produtoGetAll } from "../../api/client";
import { Produto } from "../../api/entities";
import useAlertDialog from "../../components/AlertDialog";
import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import ProductCreateUpdateView from "./ProductCreateUpdate";
import TestOverlayView from "./TestOverlayView";

export default function ProductListView() {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  const [allProducts, setAllProducts] = useState<Produto[]>([]);
  async function refreshData() {
    setAllProducts(await produtoGetAll());
  }

  useEffect(() => {
    refreshData();
  }, []);

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
      await produtoDelete(productId);
      await refreshData();
      await showAlert({
        kind: "info",
        title: "Sucesso",
        content: <p>Produto apagado!</p>,
        buttons: { ok: "OK" },
      });
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
          onClick={() =>
            compass.push(ProductCreateUpdateView, {
              operation: "CreateNew",
              notifyMutated: () => refreshData(),
            })
          }
        />
        <IconButton iconName="Refresh" onClick={refreshData} />
      </div>
      <ul class="flex grow flex-col gap-2">
        {allProducts.map((product) => {
          return (
            <li
              key={product.id}
              class="group flex w-full flex-col border border-white-800 bg-white-100 p-2 shadow-pixel-sm focus-within:shadow-none"
              tabIndex={0}>
              <span class="font-mono text-sm">{product.grupo.id}</span>
              <h2 class="font-bold">{product.nome}</h2>
              <span class="font-mono text-sm">
                {product.fabricante.nomeFantasia || product.fabricante.razaoSocial}
              </span>
              <div class="flex gap-2">
                <span class="font-mono">
                  <span class="text-sm">Compra</span> R$ {product.precoCompra.toFixed(2)}
                </span>
                <span>·</span>
                <span class="font-mono">
                  <span class="text-sm">Venda</span> R$ {product.precoVenda.toFixed(2)}
                </span>
              </div>
              <p>{product.descricao}</p>
              <footer class="mt-2 hidden justify-stretch gap-1 group-focus-within:flex">
                <Button class="flex-1 grow" onClick={handleDeleteButton.bind(null, product.id)}>
                  <Icon name="Delete" />
                  Remover
                </Button>
                <Button
                  class="flex-1 grow"
                  onClick={() =>
                    compass.push(ProductCreateUpdateView, {
                      operation: "Update",
                      seed: product,
                      notifyMutated: () => refreshData(),
                    })
                  }>
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
