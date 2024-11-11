import useAlertDialog from "../../components/AlertDialog";
import Button from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import LoginView from "../Login";
import ProductListView from "../Product/ProductListView";

export default function Menu() {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  return (
    <section class="flex h-full w-full flex-col gap-2 p-4">
      <h1 class="font-bold">Vendoísta</h1>

      <div class="mb-4 flex gap-2">
        <Button class="grow basis-0" onClick={() => {}}>
          Fazer cadastro
        </Button>
        <Button class="grow basis-0" onClick={() => compass.push(LoginView, {})}>
          Fazer login
        </Button>
      </div>

      <Button onClick={() => compass.push(ProductListView, {})}>Produtos</Button>
      <Button>Grupos</Button>
      <Button>Gerenciamento de usuários</Button>
      <Button
        onClick={async () => {
          await showAlert({
            kind: "info",
            title: "Apagar dados?",
            content: <p>Deseja apagar todos os dados de tudo mesmo?</p>,
            buttons: {
              cancel: "Cancelar",
              yes: "Sim",
            },
          });
        }}>
        Vendas
      </Button>
    </section>
  );
}
