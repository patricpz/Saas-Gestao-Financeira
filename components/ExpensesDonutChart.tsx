"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export default function ExpensesDonutChart() {
  // Dados centralizados para alimentar tanto o gráfico quanto a legenda
  const expensesData = [
    { value: 2100, name: "Housing", color: "#1d4ed8" },       // bg-blue-700
    { value: 840, name: "Entertainment", color: "#60a5fa" },  // bg-blue-400
    { value: 2460, name: "Others", color: "#dbeafe" },        // bg-blue-100
  ];

  // Cálculo automático do total
  const totalExpenses = expensesData.reduce((acc, curr) => acc + curr.value, 0);

  // Função para formatar moeda
  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const option = {
    tooltip: {
      trigger: "item",
      // Exibe: "Nome: $Valor (Porcentagem%)"
      formatter: (params: any) => {
        return `<b>${params.name}</b><br/>${formatCurrency(params.value)} (${params.percent}%)`;
      },
    },
    // Coloca o texto no centro exato do donut
    title: {
      text: formatCurrency(totalExpenses),
      subtext: "Total gasto",
      left: "center",
      top: "center",
      textStyle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0f172a", // text-slate-900
      },
      subtextStyle: {
        fontSize: 12,
        color: "#64748b", // text-slate-500
      },
    },
    series: [
      {
        name: "Expenses",
        type: "pie",
        radius: ["65%", "90%"], // O primeiro valor define o tamanho do buraco interno
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: "#ffffff",
          borderWidth: 3, // Cria um espaçamento branco bonito entre as fatias
        },
        label: {
          show: false, // Esconde as labels externas nativas
        },
        data: expensesData.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };

  return (
    <div className="max-w-sm rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
      
      {/* Gráfico Donut (ECharts) */}
      <div className="relative mx-auto mb-4 h-48 w-48">
        <ReactECharts 
          option={option} 
          style={{ height: "100%", width: "100%" }} 
        />
      </div>

      {/* Legenda HTML/Tailwind */}
      <div className="space-y-2 text-sm text-slate-600">
        {expensesData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
      
    </div>
  );
}