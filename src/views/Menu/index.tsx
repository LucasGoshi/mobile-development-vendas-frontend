import Button from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import LoginView from "../Login";

export default function Menu() {
  const compass = useCompass();

  return (
    <section class="flex h-full w-full flex-col gap-2 p-4">
      <h1 class="font-bold">Vendoísta</h1>
      <Button onClick={() => compass.push(LoginView, {})}>Fazer login</Button>
      <Button>Produtos</Button>
      <Button>Grupos</Button>
      <Button>Gerenciamento de usuários</Button>
      <Button>Vendas</Button>
    </section>
  );
}
