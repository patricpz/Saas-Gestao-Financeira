"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

export default function IncomeExpenseChart() {
  // Seus dados base (Income)
  const baseData = [2, 56, 68, 48, 82, 64];
  
  // Calculando os dados de Expenses baseado na sua lógica original
  const incomeData = baseData;
  const expensesData = baseData.map((value) => Math.min(100, value + 20));

  const option = {
    // Fundo simulando o bg-slate-50
    backgroundColor: "#f8fafc",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow", // Efeito de sombra ao passar o mouse
      },
    },
    // Substitui as divs manuais da sua legenda original
    legend: {
      data: ["Income", "Expenses"],
      bottom: 0,
      icon: "circle",
      itemGap: 20,
      textStyle: {
        color: "#475569", // text-slate-600
        fontSize: 14,
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      top: "10%",
      bottom: "15%", // Espaço para a legenda
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Período 1", "Período 2", "Período 3", "Período 4", "Período 5", "Período 6"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#64748b", // text-slate-500
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#e2e8f0", // border-slate-200 (linhas de grade)
          type: "dashed",
        },
      },
      axisLabel: {
        color: "#64748b",
      },
    },
    series: [
      {
        name: "Income",
        type: "bar",
        stack: "total", // Faz as barras ficarem empilhadas (como o flex-col original)
        barWidth: "40%",
        data: incomeData,
        itemStyle: {
          color: "#2563eb", // bg-blue-600
          borderRadius: [0, 0, 4, 4], // Arredondando a base
        },
      },
      {
        name: "Expenses",
        type: "bar",
        stack: "total",
        data: expensesData,
        itemStyle: {
          color: "#bfdbfe", // bg-blue-200
          borderRadius: [4, 4, 0, 0], // Arredondando o topo
        },
      },
    ],
  };

  return (
    <div className="rounded-xl border border-slate-100 p-5 shadow-sm max-w-3xl">
      <ReactECharts 
        option={option} 
        style={{ height: "300px", width: "100%" }} 
      />
    </div>
  );
}