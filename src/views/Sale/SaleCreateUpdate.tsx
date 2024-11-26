import { useEffect, useMemo, useState } from "preact/hooks";
import Button, { IconButton } from "../../components/Button";
import ComboBox from "../../components/ComboBox";
import ComboBoxOption from "../../components/ComboBox/ComboBoxOption";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import TextField from "../../components/TextField";
import { z } from "zod";
import { Produto, Venda } from "../../api/entities";
import { produtoGetAll, vendaCreate, vendaUpdate } from "../../api/client";
import useAlertDialog from "../../components/AlertDialog";

interface SaleCreateUpdateViewProps {
  seed?: Venda;
  operation: "CreateNew" | "Update";
  notifyMutated: () => void;
}

export default function SaleCreateUpdateView(props: SaleCreateUpdateViewProps) {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  const [quantity, setQuantity] = useState(props.seed?.quantidade ?? 1);
  const [productId, setProductId] = useState(props.seed?.produto.id ?? 0);
  const [dateTime, setDateTime] = useState(
    props.seed?.dateTime ? new Date(props.seed.dateTime).toISOString().slice(0, -1) : ""
  );

  const validationModel = useMemo(
    () =>
      z.object({
        quantity: z
          .number({ invalid_type_error: "A quantidade precisa ser um número válido" })
          .min(1, "A quantidade deve ser pelo menos 1"),
        productId: z.number().refine(() => true, "Produto inválido"),
        dateTime: z.string().nonempty("A data e hora são obrigatórias"),
      }),
    []
  );

  const formState = {
    quantity,
    productId,
    dateTime,
  } satisfies z.infer<typeof validationModel>;

  const { error: validationError } = validationModel.safeParse(formState);

  async function handleFormSubmit(e: Event) {
    e.preventDefault();
    if (validationError) return;

    try {
      const result =
        props.operation === "CreateNew"
          ? await vendaCreate({
              produto: { id: formState.productId },
              quantidade: formState.quantity,
              dateTime: new Date(formState.dateTime).toISOString(),
            })
          : await vendaUpdate({
              id: props.seed!.id,
              produto: { id: formState.productId },
              quantidade: formState.quantity,
              dateTime: new Date(formState.dateTime).toISOString(),
            });
      await showAlert({
        kind: "info",
        title: `${props.operation === "CreateNew" ? "Inserido" : "Atualizado"} com sucesso`,
        content: <p>A operação foi concluída.</p>,
        buttons: {
          ok: "OK",
        },
      });
      props.notifyMutated();
      compass.pop();
    } catch (error) {
      console.error(error);
      await showAlert({
        kind: "warn",
        title: `Erro ao ${props.operation === "CreateNew" ? "inserir" : "atualizar"}`,
        content: <p>Houve um erro ao atualizar.</p>,
        buttons: {
          ok: "OK",
        },
      });
    }
  }

  useEffect(() => {
    return () => props.notifyMutated();
  }, []);

  const [allProducts, setAllProducts] = useState<Produto[]>([]);
  useEffect(() => {
    produtoGetAll().then((produtos) => setAllProducts(produtos));
  }, []);

  return (
    <section class="flex h-full w-full flex-col gap-2 overflow-y-scroll bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">
          {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"} venda
        </h1>
      </header>
      <form onSubmit={handleFormSubmit} class="flex flex-col gap-2">
        <label class="flex flex-col">
          Quantidade
          <TextField kind="number" value={quantity} onInput={setQuantity} />
        </label>
        <label class="flex flex-col">
          Produto
          <ComboBox value={productId.toString()} onChange={(id) => setProductId(parseInt(id) || 0)}>
            {allProducts.map((product) => (
              <ComboBoxOption kind="option" value={product.id.toString()}>
                {product.nome}
              </ComboBoxOption>
            ))}
          </ComboBox>
        </label>
        <label class="flex flex-col">
          Data e Hora
          <input
            type="datetime-local"
            value={dateTime}
            onInput={(e) => setDateTime((e.target as HTMLInputElement).value)}
            class="border-gray-400 rounded border p-1"
          />
        </label>
        {validationError && <p class="text-error-on-light">{validationError.errors[0].message}</p>}
        <footer class="flex justify-end">
          <Button disabled={!!validationError} onClick={handleFormSubmit}>
            <Icon name={props.operation === "CreateNew" ? "Add" : "Build"} />
            {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"}
          </Button>
        </footer>
      </form>
    </section>
  );
}
