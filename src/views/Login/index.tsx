import { useState } from "preact/hooks";
import Button from "../../components/Button";
import Icon from "../../components/Icon";

const API_BASE = "http://localhost:8080/comercial"; // URL do backend

export default function LoginView({ onLogin }: { onLogin: () => void }) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFormSubmit(e: Event) {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: emailInput, password: passwordInput }),
      });

      if (response.ok) {
        onLogin(); // Notifica o AppRoot sobre o login bem-sucedido
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
            onInput={(e) => setEmailInput((e.target as HTMLInputElement).value)}
          />
        </label>
        <label class="flex flex-col">
          Senha:
          <input
            class="border p-2 rounded-md"
            type="password"
            value={passwordInput}
            onInput={(e) => setPasswordInput((e.target as HTMLInputElement).value)}
          />
        </label>
        <Button type="submit" class="mt-2">
          <Icon name="Check" />
          Fazer Login
        </Button>

      </form>
    </section>
  );
}
