import { useEffect, useState } from "preact/hooks";
import useAlertDialog from "../../components/AlertDialog";
import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import { fabricanteDelete, fabricanteGetAll } from "../../api/client";
import { Fabricante } from "../../api/entities";
import CompanyCreateUpdateView from "./CompanyCreateUpdateView";

export default function CompanyListView() {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  const [allCompanys, setAllCompanys] = useState<Fabricante[]>([]);
  async function refreshData() {
    setAllCompanys(await fabricanteGetAll());
  }

  useEffect(() => {
    refreshData();
  }, []);

  async function handleDeleteButton(companyId: number) {
    const userChoice = await showAlert({
      kind: "info",
      title: "Apagar fornecedor?",
      content: <p>Deseja apagar esse fornecedor?</p>,
      buttons: {
        cancel: "Cancelar",
        yes: "Sim, apagar",
      },
    });

    if (userChoice === "yes") {
      await fabricanteDelete(companyId);
      await refreshData();
      await showAlert({
        kind: "info",
        title: "Sucesso",
        content: <p>Fabricante apagado!</p>,
        buttons: { ok: "OK" },
      });
    }
  }

  return (
    <section class="flex h-full w-full flex-col gap-2 overflow-y-scroll bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">Lista de fornecedores</h1>
      </header>
      <div class="flex justify-end gap-1">
        <IconButton
          iconName="Add"
          onClick={() =>
            compass.push(CompanyCreateUpdateView, {
              operation: "CreateNew",
              notifyMutated: () => refreshData(),
            })
          }
        />
        <IconButton iconName="Refresh" onClick={refreshData} />
      </div>
      <ul class="flex grow flex-col gap-2">
        {allCompanys.map((company) => {
          return (
            <li
              key={company.id}
              class="company flex w-full flex-col border border-white-800 bg-white-100 p-2 shadow-pixel-sm focus-within:shadow-none"
              tabIndex={0}>
              <span class="font-mono text-sm">(id #{company.id})</span>
              <span class="font-mono">
                <span class="text-sm">Nome fantasia:</span> {company.nomeFantasia}
              </span>
              <span class="font-mono">
                <span class="text-sm">Razão social:</span> {company.razaoSocial}
              </span>
              <span class="font-mono">
                <span class="text-sm">CPNJ:</span> {company.cnpj}
              </span>
              <span class="font-mono">
                <span class="text-sm">Endereço:</span> {company.endereco}
              </span>
              <span class="font-mono">
                <span class="text-sm">Telefone:</span> {company.telefone}
              </span>
              <span class="font-mono">
                <span class="text-sm">E-mail:</span> {company.email}
              </span>
              <span class="font-mono">
                <span class="text-sm">Vendedor:</span> {company.vendedor}
              </span>
              <footer class="company-focus-within:flex mt-2 hidden justify-stretch gap-1">
                <Button class="flex-1 grow" onClick={handleDeleteButton.bind(null, company.id)}>
                  <Icon name="Delete" />
                  Remover
                </Button>
                <Button
                  class="flex-1 grow"
                  onClick={() =>
                    compass.push(CompanyCreateUpdateView, {
                      operation: "Update",
                      seed: company,
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
