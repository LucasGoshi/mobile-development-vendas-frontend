import { useState } from "preact/hooks";
import Button from "../../components/Button";
import Icon from "../../components/Icon";

const API_BASE = "http://localhost:8080/comercial"; // URL base do backend

export default function LoginView({ onLogin }: { onLogin: () => void }) {
  // Estados para armazenar os valores do formulário e mensagens de erro
  const [emailInput, setEmailInput] = useState(""); // Armazena o email digitado
  const [passwordInput, setPasswordInput] = useState(""); // Armazena a senha digitada
  const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro

  // Função para lidar com o envio do formulário
  async function handleFormSubmit(e: Event) {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página
    setError(null); // Limpa qualquer mensagem de erro anterior

    try {
      // Faz uma requisição POST para o endpoint de login no backend
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ username: emailInput, password: passwordInput }), 
      });

      if (response.ok) {
        onLogin(); // Chama a função passada para indicar login bem-sucedido
      } else {
        const errorMessage = await response.text(); 
        setError(errorMessage || "Erro ao fazer login."); 
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor."); 
    }
  }

  return (
    <section class="flex h-full w-full flex-col gap-1 p-4">
      <form onSubmit={handleFormSubmit} class="flex flex-col gap-2">
        {error && <p class="text-error text-sm">{error}</p>}
        <label class="flex flex-col">
          Email:
          <input
            class="border p-2 rounded-md"
            type="text" 
            value={emailInput}
            onInput={(e) => setEmailInput((e.target as HTMLInputElement).value)} // Atualiza o estado do email
          />
        </label>
        <label class="flex flex-col">
          Senha:
          <input
            class="border p-2 rounded-md"
            type="password" 
            value={passwordInput}
            onInput={(e) => setPasswordInput((e.target as HTMLInputElement).value)} // Atualiza o estado da senha
          />
        </label>
        {/* Botão de login */}
        <Button type="submit" class="mt-2">
          <Icon name="Check" /> {/* Ícone dentro do botão */}
          Fazer Login
        </Button>
      </form>
    </section>
  );
}
