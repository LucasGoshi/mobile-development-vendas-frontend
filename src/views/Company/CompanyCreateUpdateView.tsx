import { useEffect, useMemo, useState } from "preact/hooks";
import Button, { IconButton } from "../../components/Button";
import { useCompass } from "../../components/CompassNavigator";
import Icon from "../../components/Icon";
import TextField from "../../components/TextField";
import { z } from "zod";
import { Fabricante } from "../../api/entities";
import { fabricanteCreate, fabricanteUpdate } from "../../api/client";
import useAlertDialog from "../../components/AlertDialog";

interface CompanyCreateUpdateViewProps {
  seed?: Fabricante;
  operation: "CreateNew" | "Update";
  /**
   * Usado para informar a rota parente que deve atualizar seus dados.
   */
  notifyMutated: () => void;
}

export default function CompanyCreateUpdateView(props: CompanyCreateUpdateViewProps) {
  const compass = useCompass();
  const showAlert = useAlertDialog();

  const [nomeFantasia, setNomeFantasia] = useState(props.seed?.nomeFantasia ?? "");
  const [razaoSocial, setRazaoSocial] = useState(props.seed?.razaoSocial ?? "");
  const [cnpj, setCnpj] = useState(props.seed?.cnpj ?? "");
  const [endereco, setEndereco] = useState(props.seed?.endereco ?? "");
  const [telefone, setTelefone] = useState(props.seed?.telefone ?? "");
  const [email, setEmail] = useState(props.seed?.email ?? "");
  const [vendedor, setVendedor] = useState(props.seed?.vendedor ?? "");

  const validationModel = useMemo(
    () =>
      z.object({
        id: z.number().int().optional(),
        nomeFantasia: z.string().min(1, "O nome fantasia precisa ter um ou mais caracteres"),
        razaoSocial: z.string().min(1, "A razão social precisa ter um ou mais caracteres"),
        cnpj: z
          .string()
          .refine((cnpj) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(cnpj), "O CNPJ é inválido"),
        endereco: z.string().min(1, "O endereço precisa ser informado"),
        telefone: z
          .string()
          .refine(
            (telefone) =>
              /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/.test(
                telefone
              ),
            "O telefone é inválido"
          ),
        email: z.string().email("E-mail inválido"),
        vendedor: z.string().min(1, "O nome do vendedor precisa ser informado"),
      }),
    []
  );

  const formState = {
    id: props.seed?.id,
    nomeFantasia: nomeFantasia,
    razaoSocial: razaoSocial,
    cnpj: cnpj,
    endereco: endereco,
    telefone: telefone,
    email: email,
    vendedor: vendedor,
  } satisfies z.infer<typeof validationModel>;

  const { error: validationError } = validationModel.safeParse(formState);

  async function handleFormSubmit(e: Event) {
    e.preventDefault();

    try {
      const result =
        props.operation === "CreateNew"
          ? await fabricanteCreate({
              nomeFantasia: formState.nomeFantasia,
              razaoSocial: formState.razaoSocial,
              cnpj: formState.cnpj.replace(/[^0-9]/g, ""),
              endereco: formState.endereco,
              telefone: formState.telefone,
              email: formState.email,
              vendedor: formState.vendedor,
            })
          : await fabricanteUpdate({
              id: formState.id!,
              nomeFantasia: formState.nomeFantasia,
              razaoSocial: formState.razaoSocial,
              cnpj: formState.cnpj.replace(/[^\d]/g, ""),
              endereco: formState.endereco,
              telefone: formState.telefone,
              email: formState.email,
              vendedor: formState.vendedor,
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

  return (
    <section class="flex h-full w-full flex-col gap-2 overflow-y-scroll bg-white-0 p-4">
      <header class="flex items-center gap-2">
        <IconButton iconName="ArrowLeft" onClick={compass.pop} />
        <h1 class="font-bold">
          {props.operation === "CreateNew" ? "Cadastrar" : "Atualizar"} fornecedor
        </h1>
      </header>
      <form onSubmit={handleFormSubmit} class="flex flex-col gap-2">
        <label class="flex flex-col">
          Nome fantasia
          <TextField kind="text" value={nomeFantasia} onInput={setNomeFantasia} />
        </label>
        <label class="flex flex-col">
          Razão social
          <TextField kind="text" value={razaoSocial} onInput={setRazaoSocial} />
        </label>
        <label class="flex flex-col">
          CNPJ
          <TextField kind="text" value={cnpj} onInput={setCnpj} />
        </label>
        <label class="flex flex-col">
          Endereço
          <TextField kind="text" value={endereco} onInput={setEndereco} />
        </label>
        <label class="flex flex-col">
          Telefone de contato do vendedor
          <TextField kind="text" value={telefone} onInput={setTelefone} />
        </label>
        <label class="flex flex-col">
          E-mail de contato do vendedor
          <TextField kind="text" value={email} onInput={setEmail} />
        </label>
        <label class="flex flex-col">
          Nome de contato do vendedor
          <TextField kind="text" value={vendedor} onInput={setVendedor} />
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
