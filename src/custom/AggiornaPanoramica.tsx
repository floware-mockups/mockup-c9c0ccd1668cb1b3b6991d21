// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("AggiornaPanoramica");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("AggiornaPanoramica");
import { useState } from "react";
import { Button, Card, useTable, usePrototype } from "../floware";

export default function AggiornaPanoramica(props) {__mk();
  const inventario = useTable("inventario-pc");
  const panoramica = useTable("dashboard");
  const { notify } = usePrototype();
  const [riepilogo, setRiepilogo] = useState(null);
  const nomi = ["Priorità", "Identificativo", "Sistema operativo", "CPU", "RAM", "Esito Windows 11 26H2"];
  if (!inventario || !panoramica) return <p>Inventario o panoramica non disponibili.</p>;
  const mancanti = nomi.filter((nome) => (__mk(), inventario.column(nome) < 0 || panoramica.column(nome) < 0));
  function aggiorna() {__mk();
    if (mancanti.length) return;
    const righe = inventario.rows.map((riga) => ((__mk(), {
      identificativo: inventario.value(riga, "Identificativo"),
      sistema: inventario.value(riga, "Sistema operativo"),
      cpu: inventario.value(riga, "CPU"),
      ram: inventario.value(riga, "RAM"),
      esito: inventario.value(riga, "Esito Windows 11 26H2"),
      priorita: inventario.value(riga, "Priorità")
    })));
    const compatibili = righe.filter((riga) => (__mk(), riga.esito.toLowerCase().startsWith("compatibile"))).length;
    const daVerificare = righe.filter((riga) => {__mk();
      const esito = riga.esito.toLowerCase().trim();
      return !esito || (!esito.startsWith("compatibile") && !esito.startsWith("non compatibile"));
    }).length;
    const alte = righe.filter((riga) => (__mk(), riga.priorita.toLowerCase().trim() === "alta")).length;
    const indici = panoramica.rows.map((riga, indice) => (__mk(), indice)).reverse();
    indici.forEach((indice) => (__mk(), panoramica.removeRow(indice)));
    righe.forEach((riga) => (__mk(), panoramica.addRow({
      "Priorità": riga.priorita,
      "Identificativo": riga.identificativo,
      "Sistema operativo": riga.sistema,
      "CPU": riga.cpu,
      "RAM": riga.ram,
      "Esito Windows 11 26H2": riga.esito
    })));
    setRiepilogo({ totale: righe.length, compatibili, daVerificare, alte, ora: new Date().toLocaleTimeString("it-IT") });
    notify("Panoramica aggiornata. Inventario invariato.");
  }
  return <Card title="Panoramica dall’inventario corrente">
    <div className="space-y-3">
      <p className="text-(--mk-muted)">Aggiorna il riepilogo qui sotto e tutte le righe della tabella. Gli esiti vengono ripresi dall’inventario, senza nuove valutazioni tecniche e senza modificare i dispositivi.</p>
      <Button onClick={aggiorna} disabled={mancanti.length > 0}>Aggiorna panoramica</Button>
      {mancanti.length > 0 && <p>Colonne necessarie mancanti: {mancanti.join(", ")}.</p>}
      {riepilogo ? <div>
        <p className="text-(--mk-muted)">Ultimo aggiornamento: {riepilogo.ora}. Questi conteggi sostituiscono come riferimento gli indicatori statici sottostanti.</p>
        <dl className="grid grid-cols-2 gap-3">
          <div><dt>PC inventariati</dt><dd className="text-xl font-semibold">{riepilogo.totale}</dd></div>
          <div><dt>Compatibili preliminarmente</dt><dd className="text-xl font-semibold">{riepilogo.compatibili}</dd></div>
          <div><dt>Da verificare</dt><dd className="text-xl font-semibold">{riepilogo.daVerificare}</dd></div>
          <div><dt>Priorità alta</dt><dd className="text-xl font-semibold">{riepilogo.alte}</dd></div>
        </dl>
      </div> : <p className="text-(--mk-muted)">Premi il pulsante per leggere l’inventario corrente e aggiornare la panoramica.</p>}
    </div>
  </Card>;
}
