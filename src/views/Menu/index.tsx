import useAlertDialog from "../../components/AlertDialog";
import Button from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import CompanyListView from "../Company/CompanyListView";
import GroupListView from "../Group/GroupListView";
import ProductListView from "../Product/ProductListView";
import SaleListView from "../Sale/SaleListView";

export default function Menu({ onLogout }: { onLogout: () => void }) {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  return (
    <section class="flex h-full w-full flex-col gap-1 p-4">
      <header>
        <h1 class="text-2xl font-light">Vendoísta</h1>
      </header>
      <nav class="grid aspect-square w-full grid-cols-2 gap-1">
        <Button class="h-full flex-col gap-0" onClick={() => compass.push(GroupListView, {})}>
          <Icon name="FileTypeDirectory" />
          Minhas categorias
        </Button>
        <Button class="h-full flex-col gap-0" onClick={() => compass.push(CompanyListView, {})}>
          <Icon name="WindowRestore" />
          Meus Fornecedores
        </Button>
        <Button class="h-full flex-col gap-0" onClick={() => compass.push(ProductListView, {})}>
          <Icon name="SizeP" />
          Meus Produtos
        </Button>
        <Button class="h-full flex-col gap-0" onClick={() => compass.push(SaleListView, {})}>
          <Icon name="Graph" />
          Minhas Vendas
        </Button>
      </nav>
      <Button
        onClick={async () => {
          await showAlert({
            kind: "info",
            title: "Sobre o Aplicativo",
            content: (
              <>
                <p>Autores:</p>
                <ul class="list-disc pl-4">
                  <li>Lucas Bortoli</li>
                  <li>Lucas Goshi</li>
                  <li>Arthur Monteiro</li>
                  <li>Renato Takanashi</li>
                  <li>Nicolas Lopes</li>
                </ul>
              </>
            ),
            buttons: {
              ok: "OK",
            },
          });
        }}>
        Sobre o Aplicativo
      </Button>
      <Button class="mt-4" onClick={onLogout}>
        <Icon name="ArrowLeft" />
        Sair
      </Button>
    </section>
  );
}
