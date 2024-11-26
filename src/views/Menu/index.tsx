import useAlertDialog from "../../components/AlertDialog";
import Button from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import CompanyListView from "../Company/CompanyListView";
import GroupListView from "../Group/GroupListView";
//import LoginView from "../Login";
import ProductListView from "../Product/ProductListView";
import SaleListView from "../Sale/SaleListView";

export default function Menu() {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  return (
    <section class="flex h-full w-full flex-col gap-1 p-4">
      <h1 class="text-2xl font-light">Vendoísta</h1>
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
            content: <p>Sobre o Aplicativo</p>,
            buttons: {
              ok: "OK",
            },
          });
        }}>
        Sobre o Aplicativo
      </Button>
    </section>
  );
}
