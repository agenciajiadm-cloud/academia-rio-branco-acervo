"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  DollarSign, CheckCircle2, Clock, Shield, Search,
  Download, Filter, Check, MoreHorizontal,
  Calendar, RefreshCw, MessageSquare, ArrowUpDown, ChevronLeft, ChevronRight, X
} from "lucide-react";
import {
  getMembers, toggleMonthlyPayment, setBulkMonthlyPayment,
  type DBMember, type DBPayment
} from "@/lib/db";

const MONTHS = [
  { num: "01", name: "Jan", full: "Janeiro" },
  { num: "02", name: "Fev", full: "Fevereiro" },
  { num: "03", name: "Mar", full: "Março" },
  { num: "04", name: "Abr", full: "Abril" },
  { num: "05", name: "Mai", full: "Maio" },
  { num: "06", name: "Jun", full: "Junho" },
  { num: "07", name: "Jul", full: "Julho" },
  { num: "08", name: "Ago", full: "Agosto" },
  { num: "09", name: "Set", full: "Setembro" },
  { num: "10", name: "Out", full: "Outubro" },
  { num: "11", name: "Nov", full: "Novembro" },
  { num: "12", name: "Dez", full: "Dezembro" },
];

const DEFAULT_VALOR = 49.9;

export default function DiretorMensalidades() {
  const currentYear = new Date().getFullYear();
  const currentMonthNum = String(new Date().getMonth() + 1).padStart(2, "0");

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [members, setMembers] = useState<DBMember[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendentes_mes" | "em_dia" | "isentos">("todos");
  
  // Cell details modal / popover
  const [activeCell, setActiveCell] = useState<{
    member: DBMember;
    month: string;
    monthName: string;
    payment: DBPayment | null;
    customValor: number;
    customMetodo: string;
    customObs: string;
  } | null>(null);

  // Bulk modal
  const [bulkMonth, setBulkMonth] = useState<string>(currentMonthNum);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  function reload() {
    setMembers(getMembers());
  }

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("academia_db_updated", handleUpdate);
    return () => window.removeEventListener("academia_db_updated", handleUpdate);
  }, []);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const matchQuery =
        m.nome.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        (m.cadeira || "").toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);

      if (!matchQuery) return false;

      const mesRefAtual = `${selectedYear}-${currentMonthNum}`;
      const pagMesAtual = (m.pagamentos || []).find((p) => p.mesReferencia === mesRefAtual);

      if (filterStatus === "pendentes_mes") {
        return m.status !== "inativo" && (!pagMesAtual || pagMesAtual.status === "pendente");
      }
      if (filterStatus === "em_dia") {
        return pagMesAtual && (pagMesAtual.status === "pago" || pagMesAtual.status === "isento");
      }
      if (filterStatus === "isentos") {
        return pagMesAtual && pagMesAtual.status === "isento";
      }

      return true;
    });
  }, [members, search, filterStatus, selectedYear, currentMonthNum]);

  // Statistics calculation for selected year
  const stats = useMemo(() => {
    let totalArrecadadoAno = 0;
    let totalArrecadadoMesAtual = 0;
    let pagosMesAtualCount = 0;
    let ativosCount = 0;
    let emDiaAnoCount = 0;

    const mesRefAtual = `${selectedYear}-${currentMonthNum}`;

    members.forEach((m) => {
      if (m.status !== "inativo") ativosCount++;
      const pags = m.pagamentos || [];

      // Ano
      const pagsAno = pags.filter((p) => p.mesReferencia.startsWith(`${selectedYear}-`) && p.status === "pago");
      pagsAno.forEach((p) => {
        totalArrecadadoAno += p.valor || 0;
      });

      if (pagsAno.length >= 10) {
        emDiaAnoCount++;
      }

      // Mês atual
      const pagAtual = pags.find((p) => p.mesReferencia === mesRefAtual);
      if (pagAtual && pagAtual.status === "pago") {
        totalArrecadadoMesAtual += pagAtual.valor || 0;
        pagosMesAtualCount++;
      } else if (pagAtual && pagAtual.status === "isento") {
        pagosMesAtualCount++;
      }
    });

    const taxaAdimplenciaMes = ativosCount > 0 ? Math.round((pagosMesAtualCount / ativosCount) * 100) : 0;

    return {
      totalArrecadadoAno,
      totalArrecadadoMesAtual,
      taxaAdimplenciaMes,
      pagosMesAtualCount,
      ativosCount,
      emDiaAnoCount,
    };
  }, [members, selectedYear, currentMonthNum]);

  // Monthly totals across all filtered members
  const monthTotals = useMemo(() => {
    return MONTHS.map((m) => {
      const mesRef = `${selectedYear}-${m.num}`;
      let totalValor = 0;
      let pagosCount = 0;
      let isentosCount = 0;

      members.forEach((mem) => {
        if (mem.status === "inativo") return;
        const p = (mem.pagamentos || []).find((item) => item.mesReferencia === mesRef);
        if (p && p.status === "pago") {
          totalValor += p.valor || 0;
          pagosCount++;
        } else if (p && p.status === "isento") {
          isentosCount++;
        }
      });

      const totalValidos = pagosCount + isentosCount;
      const pct = stats.ativosCount > 0 ? Math.round((totalValidos / stats.ativosCount) * 100) : 0;

      return {
        mesRef,
        totalValor,
        pagosCount,
        isentosCount,
        pct,
      };
    });
  }, [members, selectedYear, stats.ativosCount]);

  // Fast single click toggle: None -> Pago -> Pendente -> Isento -> Pago
  function handleCellClick(member: DBMember, monthNum: string) {
    const mesRef = `${selectedYear}-${monthNum}`;
    toggleMonthlyPayment(member.id, mesRef);
    reload();
  }

  // Open details popover
  function handleOpenDetails(member: DBMember, monthNum: string, monthName: string, e: React.MouseEvent) {
    e.stopPropagation();
    const mesRef = `${selectedYear}-${monthNum}`;
    const pag = (member.pagamentos || []).find((p) => p.mesReferencia === mesRef) || null;
    setActiveCell({
      member,
      month: monthNum,
      monthName,
      payment: pag,
      customValor: pag ? pag.valor : DEFAULT_VALOR,
      customMetodo: pag?.metodo || "pix",
      customObs: pag?.observacao || "",
    });
  }

  function handleSaveCustomPayment(status: "pago" | "pendente" | "isento") {
    if (!activeCell) return;
    const mesRef = `${selectedYear}-${activeCell.month}`;
    toggleMonthlyPayment(
      activeCell.member.id,
      mesRef,
      status,
      activeCell.customValor,
      activeCell.customObs
    );
    reload();
    setActiveCell(null);
  }

  function handleBulkApply() {
    const mesRef = `${selectedYear}-${bulkMonth}`;
    setBulkMonthlyPayment(mesRef, "pago", DEFAULT_VALOR);
    reload();
    setBulkModalOpen(false);
  }

  // Export to CSV
  function downloadSpreadsheetCSV() {
    const headers = [
      "Código",
      "Nome",
      "Cadeira",
      "Status Geral",
      ...MONTHS.map((m) => `${m.name}/${selectedYear}`),
      "Total Pago (R$)",
      "Meses Pagos",
    ];

    const rows = members.map((m) => {
      let totalPago = 0;
      let countPagos = 0;

      const monthStatuses = MONTHS.map((mo) => {
        const mesRef = `${selectedYear}-${mo.num}`;
        const p = (m.pagamentos || []).find((item) => item.mesReferencia === mesRef);
        if (p && p.status === "pago") {
          totalPago += p.valor || 0;
          countPagos++;
          return `Pago (R$ ${p.valor.toFixed(2)})`;
        }
        if (p && p.status === "isento") {
          return "Isento";
        }
        return "Pendente";
      });

      return [
        m.code,
        m.nome,
        m.cadeira || "—",
        m.status,
        ...monthStatuses,
        totalPago.toFixed(2),
        `${countPagos}/12`,
      ]
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mensalidades_academia_${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Generate friendly WhatsApp payment reminder
  function sendWhatsAppReminder(member: DBMember, monthName: string) {
    const text = `Prezado(a) acadêmico(a) ${member.nome},\n\nEsperamos que esteja bem! Lembramos cordialmente da contribuição mensal da Academia de Letras Barão do Rio Branco referente a *${monthName}/${selectedYear}* (R$ 49,90).\n\nSua participação fortalece nossas publicações e o acervo literário.\n\nPara realizar o pagamento via PIX ou cartão, você pode acessar seu painel: https://academia-rio-branco-acervo.vercel.app/login com o código ${member.code}.\n\nAtenciosamente,\nDiretoria da Academia de Letras Barão do Rio Branco`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header & Year Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-serif font-black text-black">
              Controle de Mensalidades
            </h1>
            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold font-mono">
              Planilha {selectedYear}
            </span>
          </div>
          <p className="text-gray-500 text-base mt-1">
            Controle de contribuições dos Imortais e Associados em planilha interativa.
          </p>
        </div>

        {/* Year and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {[2025, 2026, 2027].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  selectedYear === yr
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setBulkModalOpen(true)}
            className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Marcar Mês em Massa
          </button>

          <button
            onClick={downloadSpreadsheetCSV}
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors shadow-sm"
            title="Baixar planilha compatível com Excel"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Arrecadado em {selectedYear}</p>
            <p className="text-2xl font-black text-black mt-0.5">
              R$ {stats.totalArrecadadoAno.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mês Atual ({MONTHS.find(m => m.num === currentMonthNum)?.name})</p>
            <p className="text-2xl font-black text-black mt-0.5">
              R$ {stats.totalArrecadadoMesAtual.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Adimplência do Mês</p>
            <p className="text-2xl font-black text-black mt-0.5">
              {stats.taxaAdimplenciaMes}%
              <span className="text-xs text-gray-400 font-normal ml-2">({stats.pagosMesAtualCount}/{stats.ativosCount} membros)</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Quadro de Associados</p>
            <p className="text-2xl font-black text-black mt-0.5">
              {members.length}
              <span className="text-xs text-green-600 font-bold ml-2">({stats.ativosCount} ativos)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, código ou cadeira..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-400 uppercase mr-1">Filtrar:</span>
          {[
            { id: "todos", label: "Todos" },
            { id: "pendentes_mes", label: "Pendentes este mês" },
            { id: "em_dia", label: "Em dia este mês" },
            { id: "isentos", label: "Isentos" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterStatus === f.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Spreadsheet Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500 font-bold select-none">
                <th className="py-3.5 px-4 sticky left-0 z-20 bg-gray-50 border-r border-gray-200 w-[240px]">
                  Imortal / Associado
                </th>
                <th className="py-3.5 px-3 text-center border-r border-gray-200 w-[100px]">
                  Código
                </th>
                {MONTHS.map((m) => (
                  <th key={m.num} className="py-3.5 px-2 text-center border-r border-gray-200 min-w-[76px]">
                    <span className={m.num === currentMonthNum && selectedYear === currentYear ? "text-brand font-black" : ""}>
                      {m.name}
                    </span>
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center border-r border-gray-200 min-w-[110px]">
                  Total Ano
                </th>
                <th className="py-3.5 px-3 text-center min-w-[90px]">
                  Ações
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={16} className="text-center py-16 text-gray-400 text-base">
                    Nenhum integrante encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  // Calculate member year totals
                  let totalPagoAno = 0;
                  let mesesPagosCount = 0;

                  MONTHS.forEach((mo) => {
                    const mesRef = `${selectedYear}-${mo.num}`;
                    const p = (member.pagamentos || []).find((item) => item.mesReferencia === mesRef);
                    if (p && p.status === "pago") {
                      totalPagoAno += p.valor || 0;
                      mesesPagosCount++;
                    } else if (p && p.status === "isento") {
                      mesesPagosCount++;
                    }
                  });

                  return (
                    <tr key={member.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Sticky Member Col */}
                      <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-blue-50/50 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden relative shrink-0 border border-gray-200">
                            {member.foto ? (
                              <Image src={member.foto} fill alt={member.nome} className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                {member.nome[0]}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-black text-sm truncate leading-tight">
                              {member.nome}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate max-w-[160px]">
                              {member.cadeira || (member.role === "diretor" ? "Diretoria" : "Associado")}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3 px-3 text-center border-r border-gray-200 font-mono text-xs font-bold text-brand">
                        {member.code}
                      </td>

                      {/* 12 Months Cells */}
                      {MONTHS.map((mo) => {
                        const mesRef = `${selectedYear}-${mo.num}`;
                        const payment = (member.pagamentos || []).find((p) => p.mesReferencia === mesRef);
                        const isCurrentMonth = mo.num === currentMonthNum && selectedYear === currentYear;

                        return (
                          <td
                            key={mo.num}
                            onClick={() => handleCellClick(member, mo.num)}
                            className={`py-2 px-1 text-center border-r border-gray-200 cursor-pointer select-none transition-all ${
                              isCurrentMonth ? "bg-amber-50/30" : ""
                            } hover:bg-gray-100/80`}
                            title="Clique para alternar: Pago (✓) / Pendente (-) / Isento (🛡️)"
                          >
                            <div className="flex items-center justify-center relative">
                              {payment?.status === "pago" ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-700 font-black text-xs hover:scale-110 transition-transform shadow-xs">
                                  ✓
                                </span>
                              ) : payment?.status === "isento" ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-200 text-gray-700 font-bold text-xs hover:scale-110 transition-transform" title="Isento de mensalidade">
                                  🛡️
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-200 text-sm font-bold">
                                  —
                                </span>
                              )}

                              {/* Small edit trigger */}
                              <button
                                onClick={(e) => handleOpenDetails(member, mo.num, mo.full, e)}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-gray-300 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] shadow-xs"
                                title="Editar detalhes deste pagamento"
                              >
                                ✎
                              </button>
                            </div>
                          </td>
                        );
                      })}

                      {/* Total Ano */}
                      <td className="py-3 px-4 text-center border-r border-gray-200 font-bold text-black">
                        <span className={totalPagoAno > 0 ? "text-green-700 font-black" : "text-gray-400"}>
                          R$ {totalPagoAno.toFixed(2).replace(".", ",")}
                        </span>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {mesesPagosCount} de 12 meses
                        </div>
                      </td>

                      {/* Quick WhatsApp Reminder */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => sendWhatsAppReminder(member, MONTHS.find(m => m.num === currentMonthNum)?.full || "Abril")}
                          className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          title="Enviar lembrete amigável via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Total Footer Row (Excel style summary) */}
            <tfoot>
              <tr className="bg-gray-100/90 font-bold text-xs text-black border-t-2 border-gray-300">
                <td className="py-4 px-4 sticky left-0 z-20 bg-gray-100 border-r border-gray-300 font-black">
                  TOTAIS DO ACERVO
                </td>
                <td className="py-4 px-3 text-center border-r border-gray-300 text-gray-500">
                  {filteredMembers.length} memb.
                </td>
                {monthTotals.map((mt, idx) => (
                  <td key={idx} className="py-3 px-1 text-center border-r border-gray-300">
                    <p className="text-green-700 font-black text-xs">
                      {mt.totalValor > 0 ? `R$${Math.round(mt.totalValor)}` : "—"}
                    </p>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5">
                      {mt.pagosCount + mt.isentosCount} pag.
                    </p>
                  </td>
                ))}
                <td className="py-4 px-4 text-center border-r border-gray-300 text-green-800 font-black text-sm">
                  R$ {stats.totalArrecadadoAno.toFixed(2).replace(".", ",")}
                </td>
                <td className="py-4 px-3 text-center text-gray-400">
                  —
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-bold text-black uppercase tracking-wider">Legenda:</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-green-100 text-green-700 font-bold flex items-center justify-center text-xs">✓</span>
            <span>Pago (R$ 49,90)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg text-gray-400 bg-gray-100 flex items-center justify-center text-xs">—</span>
            <span>Pendente / Em Aberto</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs">🛡️</span>
            <span>Isento (Honorário / Diretoria)</span>
          </div>
        </div>
        <p className="text-gray-400 italic">
          * Clique na célula para alternar o status instantaneamente. Passe o mouse para editar valores e notas.
        </p>
      </div>

      {/* Cell Detail Modal */}
      {activeCell && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setActiveCell(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-black">
                  {activeCell.monthName} / {selectedYear}
                </h3>
                <p className="text-xs text-gray-500">{activeCell.member.nome} ({activeCell.member.code})</p>
              </div>
              <button onClick={() => setActiveCell(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSaveCustomPayment("pago")}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-green-50 text-green-700 font-bold text-xs hover:bg-green-100 transition-colors border border-green-200"
              >
                <Check className="w-4 h-4" /> Marcar Pago
              </button>
              <button
                onClick={() => handleSaveCustomPayment("pendente")}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <Clock className="w-4 h-4" /> Pendente
              </button>
              <button
                onClick={() => handleSaveCustomPayment("isento")}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors border border-gray-300"
              >
                <Shield className="w-4 h-4" /> Isento
              </button>
            </div>

            {/* Custom Values */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Valor da Mensalidade (R$)</label>
                <input
                  type="number"
                  step="0.10"
                  value={activeCell.customValor}
                  onChange={(e) => setActiveCell({ ...activeCell, customValor: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Forma de Pagamento</label>
                <select
                  value={activeCell.customMetodo}
                  onChange={(e) => setActiveCell({ ...activeCell, customMetodo: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
                >
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="dinheiro">Dinheiro em Espécie</option>
                  <option value="boleto">Boleto / Transferência</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Observações / Comprovante</label>
                <input
                  value={activeCell.customObs}
                  onChange={(e) => setActiveCell({ ...activeCell, customObs: e.target.value })}
                  placeholder="Ex: Pago adiantado na reunião..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
              <button
                onClick={() => setActiveCell(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => handleSaveCustomPayment("pago")}
                className="px-5 py-2 rounded-xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Month Modal */}
      {bulkModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setBulkModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-black">
                Marcar Mês Completo em Massa
              </h3>
              <button onClick={() => setBulkModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Deseja marcar todos os associados ativos do mês selecionado como <strong>PAGO (R$ 49,90)</strong> de uma única vez?
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Selecione o Mês / {selectedYear}</label>
              <select
                value={bulkMonth}
                onChange={(e) => setBulkMonth(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
              >
                {MONTHS.map((m) => (
                  <option key={m.num} value={m.num}>
                    {m.full} ({m.name}/{selectedYear})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
              <button
                onClick={() => setBulkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkApply}
                className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                Confirmar e Marcar Todos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
