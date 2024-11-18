import { useEffect, useMemo, useState } from "preact/hooks";
import Button, { IconButton } from "../../components/Button";
import ComboBox from "../../components/ComboBox";
import ComboBoxOption from "../../components/ComboBox/ComboBoxOption";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import TextField, { MultilineTextField } from "../../components/TextField";
import { z } from "zod";
import { Fabricante, Grupo, Produto } from "../../api/entities";
import { fabricanteGetAll, grupoGetAll } from "../../api/client";

interface ProductCreateUpdateViewProps {
  seed?: Produto;
  operation: "CreateNew" | "Update";
  /**
   * Usado para informar a rota parente que deve atualizar seus dados.
   */
  notifyMutated: () => void;
}

export default function ProductCreateUpdateView(props: ProductCreateUpdateViewProps) {
  const compass = useCompass();

  const [name, setName] = useState(props.seed?.nome ?? "");
  const [description, setDescription] = useState(props.seed?.descricao ?? "");
  const [purchasePrice, setPurchasePrice] = useState(props.seed?.precoCompra ?? 0);
  const [salePrice, setSalePrice] = useState(props.seed?.precoVenda ?? 0);
  const [companyId, setCompanyId] = useState(props.seed?.fabricante.id ?? 0);
  const [categoryId, setCategoryId] = useState(props.seed?.grupo.id ?? 0);

  const validationModel = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "O nome precisa ter um ou mais caracteres"),
        description: z.string().min(1, "A descrição precisa ter um ou mais caracteres"),
        purchasePrice: z
          .number({ invalid_type_error: "O preço de compra precisa ser um número válido" })
          .min(0, "O preço de compra precisa ser um número positivo"),
        salePrice: z
          .number({ invalid_type_error: "O preço de venda precisa ser um número válido" })
          .min(0, "O preço de venda precisa ser um número positivo"),
        companyId: z
          .number()
          .refine(() => true /* todo check if valid company id */, "Fabricante inválido"),
        categoryId: z.number().refine(() => true, "Categoria inválida"),
      }),
    []
  );

  const formState = {
    name,
    description,
    purchasePrice,
    salePrice,
    companyId,
    categoryId,
  } satisfies z.infer<typeof validationModel>;

  const { error: validationError } = validationModel.safeParse(formState);

  function handleFormSubmit(e: Event) {
    e.preventDefault();
  }

  useEffect(() => {
    return () => props.notifyMutated();
  });

  const [allGroups, setAllGroups] = useState<Grupo[]>([]);
  const [allFabricantes, setAllFabricantes] = useState<Fabricante[]>([]);
  useEffect(() => {
    grupoGetAll().then((grupos) => setAllGroups(grupos));
    fabricanteGetAll().then((fabs) => setAllFabricantes(fabs));
  }, []);

  return (
    <section class="flex h-full w-full flex-col gap-2 bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">
          {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"} produto
        </h1>
      </header>
      <form onSubmit={handleFormSubmit} class="flex flex-col gap-2">
        <label class="flex flex-col">
          Nome
          <TextField kind="text" value={name} onInput={setName} />
        </label>
        <label class="flex flex-col">
          Descrição
          <MultilineTextField value={description} onInput={setDescription} />
        </label>
        <div class="flex w-full gap-2">
          <label class="flex flex-1 flex-col">
            Preço de compra
            <div class="flex items-center gap-1">
              <span class="text-sm">R$</span>
              <TextField
                placeholder="0.0"
                class="w-full"
                kind="number"
                min={0}
                max={10_000}
                step={0.25}
                value={purchasePrice}
                onInput={setPurchasePrice}
              />
            </div>
          </label>
          <label class="flex flex-1 flex-col">
            Preço de venda
            <div class="flex items-center gap-1">
              <span class="text-sm">R$</span>
              <TextField
                placeholder="0.0"
                class="w-full"
                kind="number"
                min={0}
                max={10_000}
                step={0.25}
                value={salePrice}
                onInput={setSalePrice}
              />
            </div>
          </label>
        </div>
        <label class="flex flex-col">
          Fabricante
          <ComboBox value={companyId.toString()} onChange={(c) => setCompanyId(parseInt(c) ?? 1)}>
            {allFabricantes.map((fab) => (
              <ComboBoxOption kind="option" value={fab.id.toString()}>
                #{fab.id} - {fab.nomeFantasia} {fab.razaoSocial}
              </ComboBoxOption>
            ))}
          </ComboBox>
        </label>
        <label class="flex flex-col">
          Grupo pertencente
          <ComboBox value={categoryId.toString()} onChange={(c) => setCategoryId(parseInt(c) ?? 1)}>
            {allGroups.map((group) => (
              <ComboBoxOption kind="option" value={group.id.toString()}>
                {group.nome} - {group.descricao || "Sem descrição"}
              </ComboBoxOption>
            ))}
          </ComboBox>
        </label>
        {validationError && (
          <div>
            <p class="text-error-on-light">{validationError.errors[0].message}</p>
          </div>
        )}
        <footer class="flex justify-end">
          <Button disabled={!!validationError}>
            <Icon name={props.operation === "CreateNew" ? "Add" : "Build"} />
            {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"}
          </Button>
        </footer>
      </form>
    </section>
  );
}
