import { useEffect, useMemo, useState } from "preact/hooks";
import Button, { IconButton } from "../../components/Button";
import ComboBox from "../../components/ComboBox";
import ComboBoxOption from "../../components/ComboBox/ComboBoxOption";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import TextField, { MultilineTextField } from "../../components/TextField";
import { z } from "zod";
import { Grupo } from "../../api/entities";
import { grupoCreate, grupoGetAll, grupoUpdate } from "../../api/client";
import useAlertDialog from "../../components/AlertDialog";

interface GroupCreateUpdateViewProps {
  seed?: Grupo;
  operation: "CreateNew" | "Update";
  /**
   * Usado para informar a rota parente que deve atualizar seus dados.
   */
  notifyMutated: () => void;
}

export default function GroupCreateUpdateView(props: GroupCreateUpdateViewProps) {
  const compass = useCompass();

  const showAlert = useAlertDialog();

  const [allGroups, setAllGroups] = useState<Grupo[]>([]);
  useEffect(() => {
    grupoGetAll().then((grupos) => setAllGroups(grupos.filter((g) => g.id !== props.seed?.id)));
  }, []);

  const [name, setName] = useState(props.seed?.nome ?? "");
  const [description, setDescription] = useState(props.seed?.descricao ?? "");
  const [parentGroupId, setParentGroupId] = useState(props.seed?.grupoParenteId ?? -1);

  const validationModel = useMemo(
    () =>
      z.object({
        id: z.number().int().optional(),
        nome: z.string().min(1, "O nome precisa ter um ou mais caracteres"),
        descricao: z.string().min(1, "A descrição precisa ter um ou mais caracteres"),
        grupoParenteId: z.number().transform((n) => (n === -1 ? null : n)),
      }),
    []
  );

  const formState = {
    id: props.seed?.id,
    nome: name,
    descricao: description,
    grupoParenteId: parentGroupId,
  } satisfies z.infer<typeof validationModel>;

  const { error: validationError, data } = validationModel.safeParse(formState);

  async function handleFormSubmit(e: Event) {
    e.preventDefault();

    if (!data) return;

    try {
      const result =
        props.operation === "CreateNew" ? await grupoCreate(data) : await grupoUpdate(data as any);
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

  return (
    <section class="flex h-full w-full flex-col gap-2 overflow-y-scroll bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">
          {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"} grupo
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
        <label class="flex flex-col">
          Grupo pertencente
          <ComboBox
            value={parentGroupId.toString()}
            onChange={(c) => setParentGroupId(parseInt(c) ?? -1)}>
            <ComboBoxOption kind="option" value="-1">
              [sem grupo parente]
            </ComboBoxOption>
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
          <Button disabled={!!validationError} onClick={handleFormSubmit}>
            <Icon name={props.operation === "CreateNew" ? "Add" : "Build"} />
            {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"}
          </Button>
        </footer>
      </form>
    </section>
  );
}
