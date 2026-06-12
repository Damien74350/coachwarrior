import { Card, Pill, Stat } from "../../components/Card";
import { TerritoryMap } from "../../components/TerritoryMap";
import { MY_TERRITORY, MY_CLUB, CLUB_DUELS } from "../../lib/mock";
import { compact, relativeDate } from "../../lib/format";
import { MapPin, Swords, Trophy, Crown, TrendingUp, TrendingDown, Minus, Zap, Clock } from "lucide-react";

export default function MapPage() {
  const sorted = [...MY_TERRITORY.rivals].sort((a, b) => b.weekPoints - a.weekPoints);
  const myClub = MY_TERRITORY.rivals.find(r => r.brand === MY_CLUB.brand)
    ?? MY_TERRITORY.rivals.find(r => r.brand === "Iron Republic")
    ?? MY_TERRITORY.rivals[1];
  const myRank = sorted.findIndex(r => r.brand === myClub.brand) + 1;
  const liveDuels = CLUB_DUELS.filter(d => d.status === "live");
  const pastDuels = CLUB_DUELS.filter(d => d.status !== "live" && d.status !== "pending");

  return (
    <div className="space-y-6">
      <header>
        <Pill color="flame">Carte du territoire</Pill>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          La <span className="flame-text">guerre de quartier</span>, en direct
        </h1>
        <p className="mt-2 text-muted max-w-2xl">
          Chaque club a son drapeau. Clique sur un rival pour le défier.
          La couleur des zones montre qui domine quel coin du {MY_TERRITORY.zone}.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<MapPin size={16} />} label="Clubs sur la carte" value={MY_TERRITORY.totalClubsInZone} hint={MY_TERRITORY.zone} />
        <Stat icon={<Crown size={16} />} label="Ton rang" value={`#${myRank}`} hint={`${compact(myClub.weekPoints)} pts cette sem.`} trend={myRank <= 2 ? 5.0 : -2.0} />
        <Stat icon={<Swords size={16} />} label="Duels en cours" value={liveDuels.length} hint={liveDuels[0]?.rivalBrand ?? "—"} />
        <Stat icon={<Trophy size={16} />} label="Duels remportés" value={pastDuels.filter(d => d.status === "won").length} hint="sur 30 derniers j" />
      </div>

      <TerritoryMap />

      <Card title="Duels actifs" subtitle="Tes face-à-face en direct" right={<Pill color="war"><Swords size={11} className="mr-1" />{liveDuels.length}</Pill>}>
        {liveDuels.length === 0 ? (
          <p className="text-sm text-muted">Aucun duel en cours. Clique sur un drapeau de la carte pour défier un club.</p>
        ) : (
          <div className="space-y-3">
            {liveDuels.map(d => {
              const lead = d.myMinutes > d.rivalMinutes ? "me" : d.myMinutes < d.rivalMinutes ? "rival" : "draw";
              const total = d.myMinutes + d.rivalMinutes;
              const myShare = (d.myMinutes / total) * 100;
              const remaining = Math.max(0, Math.ceil((new Date(d.endsAt).getTime() - Date.now()) / 86400000));
              return (
                <div key={d.id} className="rounded-2xl bg-overlay/5 ring-1 ring-overlay/10 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-flame">{myClub.brand}</span>
                      <span className="text-muted">vs</span>
                      <span className="font-bold">{d.rivalBrand}</span>
                    </div>
                    <span className="text-muted inline-flex items-center gap-1"><Clock size={11} /> {remaining}j restants</span>
                  </div>

                  <div className="mt-3 relative">
                    <div className="h-3 rounded-full bg-overlay/10 overflow-hidden flex">
                      <div className="h-full flame-gradient" style={{ width: `${myShare}%` }} />
                      <div className="h-full bg-overlay/20" style={{ width: `${100 - myShare}%` }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[11px]">
                      <span className="font-bold text-flame">{compact(d.myMinutes)} min</span>
                      <span className="font-bold">{compact(d.rivalMinutes)} min</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${lead === "me" ? "text-success" : lead === "rival" ? "text-danger" : "text-muted"}`}>
                      {lead === "me" && "🏆 Tu mènes"}
                      {lead === "rival" && "⚠️ Ils mènent"}
                      {lead === "draw" && "Égalité"}
                    </span>
                    <span className="text-muted flex items-center gap-1"><Zap size={11} className="text-flame" /> {d.stake}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Classement de la zone" subtitle="Top des clubs du quartier — cette semaine">
        <div className="space-y-1.5">
          {sorted.map((r, i) => {
            const isMine = r.brand === myClub.brand;
            return (
              <div key={r.brand} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${isMine ? "bg-flame/10 ring-1 ring-flame/30" : "bg-overlay/5"}`}>
                <div className={`w-8 text-center font-black ${i === 0 ? "text-gold" : "text-muted"}`}>
                  {i === 0 ? <Crown size={14} className="inline -mt-1" /> : null} #{i + 1}
                </div>
                <div className="w-9 h-9 rounded-lg grid place-items-center text-white font-black text-xs" style={{ background: r.color || "#777" }}>
                  {r.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate flex items-center gap-2">
                    {r.clubName}
                    {isMine && <span className="text-[10px] text-flame font-bold">· toi</span>}
                  </p>
                  <p className="text-[11px] text-muted truncate">{r.members.toLocaleString("fr-FR")} membres</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-flame">{compact(r.weekPoints)}</p>
                  <p className="text-[10px] text-muted flex items-center justify-end gap-0.5">
                    {r.trend > 0 && <><TrendingUp size={9} className="text-success" /> +{r.trend}</>}
                    {r.trend < 0 && <><TrendingDown size={9} className="text-danger" /> {r.trend}</>}
                    {r.trend === 0 && <><Minus size={9} /> stable</>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {pastDuels.length > 0 && (
        <Card title="Historique des duels" subtitle="Trente derniers jours">
          <div className="space-y-2">
            {pastDuels.map(d => (
              <div key={d.id} className="rounded-xl bg-overlay/5 p-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg grid place-items-center font-black text-xs ${d.status === "won" ? "bg-success/20 text-success" : d.status === "lost" ? "bg-danger/20 text-danger" : "bg-muted/20 text-muted"}`}>
                  {d.status === "won" && "✓"}
                  {d.status === "lost" && "✗"}
                  {d.status === "draw" && "="}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">vs {d.rivalBrand}</p>
                  <p className="text-[11px] text-muted">{relativeDate(d.endsAt)} · {compact(d.myMinutes)} vs {compact(d.rivalMinutes)} min</p>
                </div>
                <span className={`text-[10px] uppercase font-bold ${d.status === "won" ? "text-success" : d.status === "lost" ? "text-danger" : "text-muted"}`}>
                  {d.status === "won" ? "Remporté" : d.status === "lost" ? "Perdu" : "Égalité"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
