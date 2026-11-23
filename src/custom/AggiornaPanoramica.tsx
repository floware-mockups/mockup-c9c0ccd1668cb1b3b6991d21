// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("AggiornaPanoramica");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("AggiornaPanoramica");
import { useState } from "react";
import { Button, Card, Dialog, useTable, usePrototype } from "../floware";

export default function AggiornaPanoramica(props) {__mk();
  const inventario = useTable("inventario-pc");
  const panoramica = useTable("dashboard");
  const { notify } = usePrototype();
  const [aperto, setAperto] = useState(false);
  const [ultimo, setUltimo] = useState("");
  const nomi = ["Identificativo", "Sistema operativo", "CPU", "RAM", "Esito Windows 11 26H2", "Priorità", "CPU verificata"];
  if (!inventario || !panoramica) return <p>Inventario o panoramica non disponibili.</p>;
  const mancanti = nomi.filter((nome) => (__mk(), inventario.column(nome) < 0 || panoramica.column(nome) < 0));
  const righe = inventario.rows;
  const compatibili = righe.filter((r) => (__mk(), inventario.value(r, "Esito Windows 11 26H2").toLowerCase().startsWith("compatibile"))).length;
  const daVerificare = righe.filter((r) => {__mk();
    const esito = inventario.value(r, "Esito Windows 11 26H2").toLowerCase();
    return !esito.startsWith("compatibile") && !esito.startsWith("non compatibile");
  }).length;
  const alte = righe.filter((r) => (__mk(), inventario.value(r, "Priorità") === "Alta")).length;
  const nonRaggiungibili = righe.filter((r) => (__mk(), inventario.value(r, "Esito Windows 11 26H2").includes("non raggiungibile"))).length;
  const incompleti = righe.filter((r) => (__mk(), inventario.value(r, "Esito Windows 11 26H2").includes("dati incompleti"))).length;
  function esegui() {__mk();
    if (mancanti.length) { setAperto(false); return; }
    const ora = new Date().toLocaleString("it-IT");
    const risultati = righe.map((riga, indice) => {__mk();
      const dati = {};
      for (const nome of nomi) {__mk();dati[nome] = inventario.value(riga, nome);}
      const raggiungibile = indice % 5 !== 4;
      const ram = Number(dati["RAM"].toLowerCase().replaceAll("gb", "").trim());
      let esito = "Da verificare: dati incompleti; CPU, firmware, sicurezza e requisiti ufficiali 26H2 da convalidare";
      if (!raggiungibile) esito = "Da verificare: dispositivo non raggiungibile (simulazione); dati precedenti conservati";
      else if (ram > 0 && ram < 4) esito = "Non compatibile secondo verifica preliminare: RAM sotto 4 GB; dati incompleti per i restanti controlli";
      dati["Esito Windows 11 26H2"] = esito;
      inventario.setCell(indice, "Esito Windows 11 26H2", esito);
      if (inventario.column("Azione consigliata") >= 0) inventario.setCell(indice, "Azione consigliata", raggiungibile ? "Completare i dati e convalidare i requisiti ufficiali. Simulazione: " + ora : "Verificare raggiungibilità e ripetere la rilevazione. Simulazione: " + ora);
      return dati;
    });
    for (const indice of panoramica.rows.map((r, i) => (__mk(), i)).reverse()) {__mk();panoramica.removeRow(indice);}
    for (const dati of risultati) {__mk();panoramica.addRow(dati);}
    setUltimo(ora);
    setAperto(false);
    notify("Simulazione completata: inventario e panoramica aggiornati in memoria.");
  }
  return <Card title="Scansione dimostrativa dei PC">
    <div className="space-y-3">
      <p>Rilegge i dispositivi registrati, rivaluta gli esiti e aggiorna tutte le righe della panoramica. Non contatta PC reali e non inventa nuove rilevazioni di CPU, RAM o sistema operativo.</p>
      <p className="text-(--mk-muted)">Ogni quinto dispositivo è simulato come non raggiungibile. Per gli altri vengono segnalati i controlli mancanti: la sola RAM o la voce «CPU verificata» non bastano a confermare la compatibilità.</p>
      <Button onClick={() => (__mk(), setAperto(true))} disabled={mancanti.length > 0}>Avvia scansione dimostrativa</Button>
      {mancanti.length > 0 && <p>Colonne necessarie mancanti: {mancanti.join(", ")}.</p>}
      <p className="text-(--mk-muted)">Riepilogo aggiornato dall’inventario, da usare al posto degli indicatori statici sottostanti. Le priorità operative restano quelle registrate.</p>
      <dl className="grid grid-cols-2 gap-3">
        <div><dt>PC inventariati</dt><dd>{righe.length}</dd></div>
        <div><dt>Compatibili preliminarmente</dt><dd>{compatibili}</dd></div>
        <div><dt>Da verificare</dt><dd>{daVerificare}</dd></div>
        <div><dt>Priorità alta</dt><dd>{alte}</dd></div>
        <div><dt>Non raggiungibili simulati</dt><dd>{nonRaggiungibili}</dd></div>
        <div><dt>Raggiunti con dati incompleti</dt><dd>{incompleti}</dd></div>
      </dl>
      {ultimo && <p>Ultima simulazione: {ultimo}. Esiti preliminari, da convalidare con i requisiti ufficiali correnti.</p>}
      {aperto && <Dialog title="Avviare una nuova simulazione?" onClose={() => (__mk(), setAperto(false))} footer={<><Button variant="secondary" onClick={() => (__mk(), setAperto(false))}>Annulla</Button><Button onClick={esegui}>Esegui simulazione</Button></>}>
        <p>Gli esiti nell’inventario saranno rivalutati prudentemente e la tabella della panoramica sarà sostituita con i dati correnti di tutti i dispositivi. I valori hardware saranno conservati; anomalie e controlli mancanti saranno indicati nell’esito.</p>
      </Dialog>}
    </div>
  </Card>;
}
