"use client";

import { useState, useEffect } from "react";
import {
  Database, Download, Upload, RefreshCw, AlertTriangle,
  CheckCircle, FileJson, Shield, ArrowRight, HardDrive
} from "lucide-react";
import {
  exportDatabaseBackup, importDatabaseBackup, resetToDefaultData,
  getMembers, getBooks, getMusics
} from "@/lib/db";

export default function DiretorBackup() {
  const [counts, setCounts] = useState({ members: 0, books: 0, musics: 0 });
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  function reloadCounts() {
    setCounts({
      members: getMembers().length,
      books: getBooks().length,
      musics: getMusics().length,
    });
  }

  useEffect(() => {
    reloadCounts();
  }, []);

  function handleExport() {
    const json = exportDatabaseBackup();
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_academia_barao_rio_branco_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const res = importDatabaseBackup(content);
      if (res.success) {
        setImportStatus({ type: "success", message: res.message });
        reloadCounts();
      } else {
        setImportStatus({ type: "error", message: res.message });
      }
    };
    reader.readAsText(file);
  }

  function handleReset() {
    resetToDefaultData();
    reloadCounts();
    setResetConfirm(false);
    setImportStatus({ type: "success", message: "Dados restaurados com sucesso para os registros iniciais da Academia." });
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black">
            Backup & Segurança dos Dados
          </h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Protegido
          </span>
        </div>
        <p className="text-gray-500 text-base mt-1">
          Exporte ou importe a base de dados completa da Academia (membros, mensalidades, livros e músicas).
        </p>
      </div>

      {/* Status Banner */}
      {importStatus && (
        <div
          className={`p-4 rounded-2xl mb-8 flex items-center gap-3 border ${
            importStatus.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {importStatus.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <p className="text-sm font-medium">{importStatus.message}</p>
        </div>
      )}

      {/* Database Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Integrantes</p>
            <p className="text-2xl font-black text-black">{counts.members} registros</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileJson className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Livros no Acervo</p>
            <p className="text-2xl font-black text-black">{counts.books} títulos</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Músicas & Áudios</p>
            <p className="text-2xl font-black text-black">{counts.musics} faixas</p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Export Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
              <Download className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-black text-black mb-2">
              Exportar Backup do Sistema
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Gera e baixa um arquivo <code>.json</code> completo contendo todos os associados, histórico de pagamentos de mensalidades, livros cadastrados e áudios. Guarde este arquivo em segurança ou use para transferir para outro computador.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-accent" />
            Baixar Backup Completo (.JSON)
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center mb-6">
              <Upload className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-black text-black mb-2">
              Restaurar de um Backup
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Carregue um arquivo de backup previamente exportado para restaurar ou sincronizar todos os registros de uma só vez nesta máquina.
            </p>
          </div>
          <label className="w-full flex items-center justify-center gap-2 bg-brand text-white px-6 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm">
            <Upload className="w-4 h-4" />
            Selecionar Arquivo JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/60 rounded-3xl border border-red-200 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-serif font-bold text-red-900 mb-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Restaurar Valores Iniciais da Academia
          </h3>
          <p className="text-xs text-red-700 max-w-xl">
            Esta ação recarrega a lista oficial de fundadores e livros originais de fábrica. Recomendamos fazer um backup antes de restaurar.
          </p>
        </div>
        <button
          onClick={() => setResetConfirm(true)}
          className="bg-white border border-red-300 text-red-600 hover:bg-red-600 hover:text-white px-5 py-3 rounded-xl font-bold text-xs transition-colors shrink-0"
        >
          Redefinir Dados de Fábrica
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-black text-center text-black">
              Confirmar Restauração de Fábrica
            </h3>
            <p className="text-xs text-gray-600 text-center">
              Tem certeza que deseja redefinir os dados para os registros padrões?
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-sm"
              >
                Sim, Redefinir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
