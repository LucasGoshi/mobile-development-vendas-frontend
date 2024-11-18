import { useEffect, useState } from "preact/hooks";
import useAlertDialog from "../../components/AlertDialog";
import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import { Grupo } from "../../api/entities";
import { grupoDelete, grupoGetAll } from "../../api/client";
import GroupCreateUpdateView from "./GroupCreateUpdate";

export default function GroupListView() {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  const [allGroups, setAllGroups] = useState<Grupo[]>([]);
  async function refreshData() {
    setAllGroups(await grupoGetAll());
  }

  useEffect(() => {
    refreshData();
  }, []);

  async function handleDeleteButton(groupId: number) {
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
      alert("Grupo apagado!");
    }

    await grupoDelete(groupId);
    refreshData();
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
            compass.push(GroupCreateUpdateView, {
              operation: "CreateNew",
              notifyMutated: () => refreshData(),
            })
          }
        />
        <IconButton iconName="Refresh" />
      </div>
      <ul class="flex grow flex-col gap-2">
        {allGroups.map((group) => {
          return (
            <li
              key={group.id}
              class="group flex w-full flex-col border border-white-800 bg-white-100 p-2 shadow-pixel-sm focus-within:shadow-none"
              tabIndex={0}>
              <span class="font-mono text-sm">(id #{group.id})</span>
              <h2 class="font-bold">{group.nome}</h2>
              {group.grupoParenteId !== null && (
                <span class="font-mono text-sm">(filho do grupo #{group.grupoParenteId})</span>
              )}
              <p>{group.descricao}</p>
              <footer class="mt-2 hidden justify-stretch gap-1 group-focus-within:flex">
                <Button class="flex-1 grow" onClick={handleDeleteButton.bind(null, group.id)}>
                  <Icon name="Delete" />
                  Remover
                </Button>
                <Button
                  class="flex-1 grow"
                  onClick={() =>
                    compass.push(GroupCreateUpdateView, {
                      operation: "Update",
                      seed: group,
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
