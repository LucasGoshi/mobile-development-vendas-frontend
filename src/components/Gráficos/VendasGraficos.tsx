/** @jsxImportSource preact */
import { useState, useEffect } from "preact/hooks";
import {
  Chart as ChartJS,
  LineElement,
  PointElement, 
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import { vendaGetAll } from "../../api/comercialApi";
import type { Venda } from "../../api/entities";
import type { ChartData } from "chart.js";

ChartJS.register(LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const VendasGraficos = () => {
  const [linhaDados, setLinhaDados] = useState<ChartData<"line"> | null>(null);
  const [barraDados, setBarraDados] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendas: Venda[] = await vendaGetAll();
        console.log("Vendas recebidas:", vendas);

        const vendasAnoCorrente = vendas.filter(
          (venda) => new Date(venda.dateTime).getFullYear() === new Date().getFullYear()
        );

        const meses = Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString("default", { month: "short" })
        );

        const dadosMensais = meses.map((_, i) => {
          const vendasMes = vendasAnoCorrente.filter(
            (venda) => new Date(venda.dateTime).getMonth() === i
          );

          const custoTotal = vendasMes.reduce(
            (acc, venda) => acc + venda.quantidade * venda.produto.precoCompra,
            0
          );

          const vendaTotal = vendasMes.reduce(
            (acc, venda) => acc + venda.quantidade * venda.produto.precoVenda,
            0
          );

          const quantidadeComprada = vendasMes.reduce((acc, venda) => acc + venda.quantidade, 0);
          const quantidadeVendida = vendasMes.reduce((acc, venda) => acc + venda.quantidade, 0);

          return { custoTotal, vendaTotal, quantidadeComprada, quantidadeVendida };
        });

        setLinhaDados({
          labels: meses, 
          datasets: [
            {
              label: "Custo Total",
              data: dadosMensais.map((d) => d.custoTotal),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            },
            {
              label: "Venda Total",
              data: dadosMensais.map((d) => d.vendaTotal),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
            },
          ],
        });

        setBarraDados({
          labels: meses, 
          datasets: [
            {
              label: "Quantidade Comprada",
              data: dadosMensais.map((d) => d.quantidadeComprada),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
            {
              label: "Quantidade Vendida",
              data: dadosMensais.map((d) => d.quantidadeVendida),
              backgroundColor: "rgba(153, 102, 255, 0.5)",
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Visualização de Vendas</h1>
      {linhaDados && (
        <div>
          <h2>Gráfico de Linha</h2>
          <Line data={linhaDados} />
        </div>
      )}
      {barraDados && (
        <div>
          <h2>Gráfico de Barras</h2>
          <Bar data={barraDados} />
        </div>
      )}
    </div>
  );
};

export default VendasGraficos;
