import { useEffect, useState } from "preact/hooks";
import { vendaDelete, vendaGetAll } from "../../api/client";
import { Venda } from "../../api/entities";
import useAlertDialog from "../../components/AlertDialog";
import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import SaleCreateUpdateView from "./SaleCreateUpdate";

export default function SaleListView() {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  const [allVendas, setAllVendas] = useState<Venda[]>([]);

  async function refreshData() {
    setAllVendas(await vendaGetAll());
  }

  useEffect(() => {
    refreshData();
  }, []);

  async function handleDeleteButton(vendaId: number) {
    const userChoice = await showAlert({
      kind: "info",
      title: "Apagar venda?",
      content: <p>Deseja apagar essa venda?</p>,
      buttons: {
        cancel: "Cancelar",
        yes: "Sim, apagar",
      },
    });

    if (userChoice === "yes") {
      await vendaDelete(vendaId);
      alert("Venda Apagada!");
      refreshData();
    }
  }

  return (
    <section class="flex h-full w-full flex-col gap-2 overflow-y-scroll bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">Lista de vendas</h1>
      </header>
      <div class="flex justify-end gap-1">
        <IconButton iconName="Graph">Métricas</IconButton>
        <IconButton
          iconName="Add"
          onClick={() =>
            compass.push(SaleCreateUpdateView, {
              operation: "CreateNew",
              notifyMutated: () => refreshData(),
            })
          }
        />
      </div>
      <ul class="flex grow flex-col gap-2">
        {allVendas.map((venda) => {
          const produto = venda.produto;
          return (
            <li
              key={venda.id}
              class="group flex w-full flex-col border border-white-800 bg-white-100 p-2 shadow-pixel-sm focus-within:shadow-none"
              tabIndex={0}>
              <span class="font-mono text-sm">Venda #{venda.id}</span>
              <h2 class="font-bold">{produto.nome}</h2>
              <span class="font-mono text-sm">Quantidade: {venda.quantidade}</span>
              <span class="font-mono text-sm">
                Data: {new Date(venda.dateTime).toLocaleString()}
              </span>
              <footer class="mt-2 hidden justify-stretch gap-1 group-focus-within:flex">
                <Button class="flex-1 grow" onClick={handleDeleteButton.bind(null, venda.id)}>
                  <Icon name="Delete" />
                  Remover
                </Button>
                <Button
                  class="flex-1 grow"
                  onClick={() =>
                    compass.push(SaleCreateUpdateView, {
                      operation: "Update",
                      seed: venda,
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
