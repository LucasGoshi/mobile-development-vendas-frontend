import { useEffect, useMemo, useState } from "preact/hooks";
import Button, { IconButton } from "../../components/Button";
import ComboBox from "../../components/ComboBox";
import ComboBoxOption from "../../components/ComboBox/ComboBoxOption";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import TextField, { MultilineTextField } from "../../components/TextField";
import { z } from "zod";
import { Grupo } from "../../api/entities";
import { grupoGetAll } from "../../api/client";

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

  const [allGroups, setAllGroups] = useState<Grupo[]>([]);
  useEffect(() => {
    grupoGetAll().then((grupos) => setAllGroups(grupos));
  }, []);

  const [name, setName] = useState(props.seed?.nome ?? "");
  const [description, setDescription] = useState(props.seed?.descricao ?? "");
  const [parentGroupId, setParentGroupId] = useState(props.seed?.grupoParenteId ?? 0);

  const validationModel = useMemo(
    () =>
      z.object({
        id: z.number().int().optional(),
        nome: z.string().min(1, "O nome precisa ter um ou mais caracteres"),
        descricao: z.string().min(1, "A descrição precisa ter um ou mais caracteres"),
        grupoParenteId: z
          .number()
          .refine(() => true /* todo check if valid company id */, "Grupo parente inválido"),
      }),
    []
  );

  const formState = {
    id: props.seed?.id,
    nome: name,
    descricao: description,
    grupoParenteId: parentGroupId,
  } satisfies z.infer<typeof validationModel>;

  const { error: validationError } = validationModel.safeParse(formState);

  function handleFormSubmit(e: Event) {
    e.preventDefault();
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
            onChange={(c) => setParentGroupId(parseInt(c) ?? 1)}>
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
