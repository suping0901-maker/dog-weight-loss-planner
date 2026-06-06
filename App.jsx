import { useState, useMemo } from "react";

// ─────────────────────────────────────────────
//  FOOD DATABASE  (kcal per 100g)
// ─────────────────────────────────────────────
const SECTIONS = [
  {
    key: "meat", group: "荤类", groupEn: "Animal Foods",
    color: "#b45309", light: "#fffbeb", border: "#fde68a",
    pctMin: 60, pctMax: 70,
    categories: [
      {
        key: "whiteMeat", label: "白肉", labelEn: "White Meat",
        pctMin: 12, pctMax: 20, required: true, emoji: "🍗",
        multi: false,
        options: [
          { name: "鸡胸肉（去皮）", cal: 165 },
          { name: "鸡腿肉（去皮）", cal: 185 },
          { name: "火鸡胸肉", cal: 135 },
          { name: "鸭胸肉（去皮）", cal: 140 },
          { name: "兔肉", cal: 136 },
        ],
      },
      {
        key: "redMeat", label: "红肉", labelEn: "Red Meat",
        pctMin: 12, pctMax: 20, required: true, emoji: "🥩",
        multi: false,
        options: [
          { name: "牛腱肉", cal: 150 },
          { name: "猪肉眼 (Pork Loin)", cal: 143 },
          { name: "羊腿肉", cal: 169 },
          { name: "鹿肉", cal: 120 },
        ],
      },
      {
        key: "seafood", label: "海鲜", labelEn: "Seafood / Fish",
        pctMin: 5, pctMax: 9, required: true, emoji: "🐟",
        multi: false,
        options: [
          { name: "三文鱼", cal: 208 },
          { name: "鳕鱼", cal: 82 },
          { name: "沙丁鱼", cal: 208 },
          { name: "鲭鱼", cal: 205 },
          { name: "鲣鱼", cal: 132 },
          { name: "虱目鱼", cal: 148 },
          { name: "基围虾", cal: 93 },
        ],
      },
      {
        key: "egg", label: "鸡蛋", labelEn: "Egg",
        pctMin: 4, pctMax: 7, required: false, emoji: "🥚",
        multi: false,
        options: [
          { name: "蛋黄（熟）", cal: 322 },
          { name: "全鸡蛋（生）", cal: 143 },
          { name: "全鸡蛋（熟）", cal: 155 },
        ],
      },
      {
        key: "heart", label: "心脏", labelEn: "Heart",
        pctMin: 5, pctMax: 9, required: true, emoji: "🫀",
        multi: false,
        options: [
          { name: "鸡心", cal: 185 },
          { name: "牛心", cal: 112 },
          { name: "猪心", cal: 118 },
          { name: "鸭心", cal: 193 },
        ],
      },
      {
        key: "liver", label: "肝脏", labelEn: "Liver",
        pctMin: 2, pctMax: 5, required: true, emoji: "🫁",
        multi: false,
        options: [
          { name: "鸡肝", cal: 172 },
          { name: "猪肝", cal: 130 },
          { name: "牛肝", cal: 135 },
          { name: "鸭肝", cal: 136 },
        ],
      },
      {
        key: "otherOrgan", label: "其他内脏", labelEn: "Other Organ",
        pctMin: 1, pctMax: 3, required: false, emoji: "🧫",
        multi: false,
        options: [
          { name: "鸡肾", cal: 119 },
          { name: "牛肾", cal: 99 },
          { name: "猪脾", cal: 100 },
          { name: "牛肺", cal: 92 },
        ],
      },
      {
        key: "oyster", label: "生蚝", labelEn: "Oyster",
        pctMin: 3, pctMax: 4, required: false, emoji: "🦪",
        multi: false,
        options: [
          { name: "生蚝（生）", cal: 68 },
          { name: "生蚝（熟）", cal: 81 },
        ],
      },
      {
        key: "shellfish", label: "贝类", labelEn: "Shellfish",
        pctMin: 2, pctMax: 3, required: false, emoji: "🐚",
        multi: false,
        options: [
          { name: "青口贝", cal: 86 },
          { name: "蛤蜊", cal: 74 },
          { name: "扇贝", cal: 88 },
        ],
      },
    ],
  },
  {
    key: "veg", group: "素食", groupEn: "Plant Foods",
    color: "#15803d", light: "#f0fdf4", border: "#bbf7d0",
    pctMin: 30, pctMax: 40,
    categories: [
      {
        key: "highCarbVeg", label: "高碳水蔬菜", labelEn: "High-Carb Veg",
        pctMin: 10, pctMax: 15, required: true, emoji: "🎃",
        multi: false,
        options: [
          { name: "南瓜", cal: 26 },
          { name: "山药", cal: 63 },
          { name: "紫薯", cal: 80 },
          { name: "红薯", cal: 86 },
          { name: "玉米", cal: 86 },
        ],
      },
      {
        key: "lowCarbVeg", label: "低碳水蔬菜", labelEn: "Low-Carb Veg",
        pctMin: 10, pctMax: 15, required: true, emoji: "🥦",
        multi: false,
        options: [
          { name: "西兰花", cal: 34 },
          { name: "椰菜花", cal: 25 },
          { name: "红萝卜", cal: 41 },
          { name: "芹菜", cal: 16 },
          { name: "秋葵", cal: 33 },
          { name: "彩椒", cal: 31 },
          { name: "紫甘蓝", cal: 31 },
          { name: "包菜", cal: 25 },
          { name: "黄瓜", cal: 16 },
          { name: "苦瓜", cal: 17 },
          { name: "冬瓜", cal: 13 },
          { name: "菠菜", cal: 23 },
        ],
      },
      {
        key: "grain", label: "谷物", labelEn: "Grain",
        pctMin: 3, pctMax: 8, required: true, emoji: "🌾",
        multi: false,
        options: [
          { name: "藜麦（熟）", cal: 120 },
          { name: "小米（熟）", cal: 119 },
          { name: "燕麦", cal: 71 },
          { name: "糙米（熟）", cal: 123 },
          { name: "薏米（熟）", cal: 113 },
        ],
      },
      {
        key: "mushroom", label: "菌菇", labelEn: "Mushroom",
        pctMin: 1, pctMax: 3, required: false, emoji: "🍄",
        multi: false,
        options: [
          { name: "香菇", cal: 34 },
          { name: "平菇", cal: 33 },
          { name: "金针菇", cal: 37 },
          { name: "虫草花", cal: 248 },
          { name: "杏鲍菇", cal: 35 },
        ],
      },
      {
        key: "seaweed", label: "海带", labelEn: "Seaweed",
        pctMin: 3, pctMax: 4, required: true, emoji: "🌊",
        multi: false,
        options: [
          { name: "海带芽", cal: 45 },
          { name: "紫菜", cal: 35 },
        ],
      },
      {
        key: "plantOil", label: "植物油", labelEn: "Plant Oil",
        pctMin: 1, pctMax: 3, required: false, emoji: "🫒",
        multi: false,
        options: [
          { name: "亚麻籽油", cal: 884 },
          { name: "椰子油", cal: 862 },
          { name: "橄榄油", cal: 884 },
          { name: "奇亚籽油", cal: 900 },
        ],
      },
    ],
  },
];

// Powder — dose = totalGrams × 0.005, not counted in calories
const POWDER_OPTIONS = [
  { key: "eggshell", name: "蛋壳粉", note: "补钙，每日约 0.5–1g" },
  { key: "flaxseed", name: "亚麻籽粉", note: "Omega-3，每日约 1–2g" },
];

const FORBIDDEN = ["葡萄/葡萄干", "洋葱/大蒜/韭菜", "巧克力/可可", "牛油果", "夏威夷果", "木糖醇", "生面团/酵母", "澳洲坚果"];

function calcRER(kg) { return 70 * Math.pow(kg, 0.75); }
function calcTarget(cw, tw, activity) {
  const mid = (parseFloat(cw) + parseFloat(tw)) / 2;
  const rer = calcRER(mid);
  const f = { low: 1.0, medium: 1.2, high: 1.4 }[activity] || 1.0;
  return Math.round(rer * f);
}

const ACTIVITY_OPTS = [
  { val: "low", label: "低活动量", sub: "室内为主 / 运动 < 30min/天" },
  { val: "medium", label: "中等活动量", sub: "每天散步约 1 小时" },
  { val: "high", label: "高活动量", sub: "活泼好动 / 运动 > 2h/天" },
];

// ── Calorie bar colour ────────────────────────────────────────────────────────
function barColor(ratio) {
  if (ratio <= 0.85) return "#16a34a";
  if (ratio <= 1.0) return "#d97706";
  return "#dc2626";
}

// ── Compact food-select row ───────────────────────────────────────────────────
function CatRow({ cat, chosen, grams, onChoose, onGrams }) {
  const [open, setOpen] = useState(false);
  const isSkipped = chosen === null && !cat.required;
  const hasChoice = chosen != null;
  const kcalThis = hasChoice && grams ? Math.round((grams * chosen.cal) / 100) : 0;

  return (
    <div style={{
      borderRadius: 10, overflow: "hidden",
      border: `1.5px solid ${hasChoice ? "#d97706" : "#e5e7eb"}`,
      background: hasChoice ? "#fffbeb" : "#fafafa",
      marginBottom: 8,
      transition: "border-color .2s, background .2s",
    }}>
      {/* header row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", cursor: "pointer",
      }} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1c1e", lineHeight: 1.2 }}>
            {cat.label}
            {!cat.required && (
              <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 5, fontWeight: 400 }}>可选</span>
            )}
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>
            {cat.pctMin}–{cat.pctMax}% · {hasChoice ? cat.options.find(o => o.name === chosen.name)?.name : isSkipped ? "不加" : "未选"}
          </div>
        </div>
        {/* grams input — only visible when a food is chosen */}
        {hasChoice && (
          <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="number" min={0} value={grams ?? ""}
              onChange={e => onGrams(e.target.value === "" ? "" : Number(e.target.value))}
              style={{
                width: 62, padding: "4px 6px", borderRadius: 7, textAlign: "right",
                border: "1.5px solid #d97706", background: "#fff",
                fontSize: 14, fontWeight: 700, color: "#92400e",
                fontFamily: "inherit", outline: "none",
              }}
            />
            <span style={{ fontSize: 11, color: "#92400e", fontWeight: 600 }}>g</span>
          </div>
        )}
        {hasChoice && (
          <span style={{ fontSize: 11, color: "#b45309", fontWeight: 600, minWidth: 50, textAlign: "right" }}>
            {kcalThis} kcal
          </span>
        )}
        <span style={{ fontSize: 10, color: "#9ca3af" }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* dropdown */}
      {open && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "10px 12px", background: "#f9f9f9" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {!cat.required && (
              <button onClick={() => { onChoose(null); setOpen(false); }}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                  border: `1.5px solid ${isSkipped ? "#b45309" : "#d1d5db"}`,
                  background: isSkipped ? "#fef3c7" : "#fff",
                  color: isSkipped ? "#92400e" : "#6b7280", fontFamily: "inherit",
                }}>不加</button>
            )}
            {cat.options.map(opt => (
              <button key={opt.name}
                onClick={() => { onChoose(opt); setOpen(false); }}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                  border: `1.5px solid ${chosen?.name === opt.name ? "#b45309" : "#d1d5db"}`,
                  background: chosen?.name === opt.name ? "#fef3c7" : "#fff",
                  color: chosen?.name === opt.name ? "#92400e" : "#374151",
                  fontWeight: chosen?.name === opt.name ? 700 : 400,
                  fontFamily: "inherit",
                }}>
                {opt.name}
                <span style={{ opacity: .5, marginLeft: 4 }}>{opt.cal}kcal/100g</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1);
  const [dog, setDog] = useState({
    name: "", breed: "", age: "", currentWeight: "", targetWeight: "",
    activity: "low", allergies: "", healthNotes: "",
  });
  // { [catKey]: { name, cal } | null }
  const [chosen, setChosen] = useState({});
  // { [catKey]: number }
  const [grams, setGrams] = useState({});
  // powders: Set of keys
  const [powders, setPowders] = useState(new Set());
  const [copied, setCopied] = useState(false);

  const cw = parseFloat(dog.currentWeight) || 0;
  const tw = parseFloat(dog.targetWeight) || 0;
  const target = cw && tw ? calcTarget(cw, tw, dog.activity) : 0;

  // ── derived calorie total ────────────────────────────────────────────────
  const totalKcal = useMemo(() => {
    let sum = 0;
    SECTIONS.forEach(sec => sec.categories.forEach(cat => {
      const food = chosen[cat.key];
      const g = grams[cat.key];
      if (food && g) sum += (g * food.cal) / 100;
    }));
    return Math.round(sum);
  }, [chosen, grams]);

  const totalGrams = useMemo(() => {
    let sum = 0;
    SECTIONS.forEach(sec => sec.categories.forEach(cat => {
      const g = grams[cat.key];
      if (chosen[cat.key] && g) sum += g;
    }));
    return Math.round(sum);
  }, [chosen, grams]);

  const ratio = target > 0 ? totalKcal / target : 0;
  const overLimit = ratio > 1;

  // ── auto-fill grams from formula mid-% when food chosen ─────────────────
  function handleChoose(catKey, food) {
    setChosen(p => ({ ...p, [catKey]: food }));
    if (food && target) {
      // find cat pct
      let pctMid = 10;
      SECTIONS.forEach(sec => sec.categories.forEach(cat => {
        if (cat.key === catKey) pctMid = (cat.pctMin + cat.pctMax) / 2;
      }));
      const suggestedKcal = target * pctMid / 100;
      const suggestedG = Math.round((suggestedKcal / food.cal) * 100);
      setGrams(p => ({ ...p, [catKey]: suggestedG }));
    }
    if (!food) setGrams(p => ({ ...p, [catKey]: "" }));
  }

  function handleGrams(catKey, val) {
    setGrams(p => ({ ...p, [catKey]: val }));
  }

  function togglePowder(key) {
    setPowders(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const allRequired = SECTIONS.flatMap(s => s.categories)
    .filter(c => c.required)
    .every(c => chosen[c.key] != null);

  // ── export ───────────────────────────────────────────────────────────────
  function doExport() {
    const lines = [];
    lines.push(`╔══════════════════════════════════════╗`);
    lines.push(`   🐾 ${dog.name} 的专属减脂鲜食方案`);
    lines.push(`╚══════════════════════════════════════╝`);
    lines.push(``);
    lines.push(`📋 基本资料`);
    lines.push(`  品种：${dog.breed}  ｜  年龄：${dog.age}岁`);
    lines.push(`  体重：${dog.currentWeight}kg → 目标 ${dog.targetWeight}kg`);
    lines.push(`  活动量：${{ low: "低", medium: "中", high: "高" }[dog.activity]}`);
    if (dog.allergies) lines.push(`  过敏：${dog.allergies}`);
    if (dog.healthNotes) lines.push(`  备注：${dog.healthNotes}`);
    lines.push(``);
    lines.push(`🔥 每日热量目标：${target} kcal`);
    lines.push(`📦 本方案总热量：${totalKcal} kcal  (${Math.round(ratio * 100)}%)`);
    lines.push(`⚖️  每日总食量：约 ${totalGrams} g`);
    lines.push(``);

    SECTIONS.forEach(sec => {
      lines.push(`━━━ ${sec.group} ━━━`);
      sec.categories.forEach(cat => {
        const food = chosen[cat.key];
        const g = grams[cat.key];
        if (food && g) {
          const kcal = Math.round((g * food.cal) / 100);
          lines.push(`  ${cat.emoji} ${cat.label}（${food.name}）：${g}g ≈ ${kcal} kcal`);
        } else if (!cat.required) {
          lines.push(`  ${cat.emoji} ${cat.label}：不加`);
        }
      });
      lines.push(``);
    });

    if (powders.size > 0) {
      lines.push(`🧪 营养补充粉（不计入热量）`);
      POWDER_OPTIONS.filter(p => powders.has(p.key)).forEach(p => {
        const dose = totalGrams > 0 ? (totalGrams * 0.005).toFixed(1) : "—";
        lines.push(`  • ${p.name}：约 ${dose}g（${p.note}）`);
      });
      lines.push(``);
    }

    lines.push(`📌 使用说明`);
    lines.push(`  • 以上为单日总量，建议分 2 次喂食`);
    lines.push(`  • 荤类轻煮不加调味料，鱼类务必去刺`);
    lines.push(`  • 植物油待食物冷却后拌入`);
    lines.push(`  • 每 2 周称重，目标每月减重 ≤ 体重 1–2%`);
    lines.push(``);
    lines.push(`⛔ 禁忌食材：${FORBIDDEN.join(" · ")}`);
    lines.push(`── 专业宠物营养顾问制定 ──`);

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  // ── shared styles ─────────────────────────────────────────────────────────
  const INPUT = {
    width: "100%", padding: "9px 12px", borderRadius: 9,
    border: "1.5px solid #e5e7eb", background: "#fff",
    fontSize: 14, color: "#1c1c1e", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };
  const BTN_P = {
    background: "linear-gradient(135deg,#b45309,#d97706)",
    color: "#fff", border: "none", borderRadius: 11,
    padding: "13px 24px", fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", width: "100%",
    boxShadow: "0 4px 18px rgba(180,83,9,.3)", letterSpacing: .3,
  };
  const BTN_G = {
    background: "#fff", color: "#b45309", border: "1.5px solid #b45309",
    borderRadius: 11, padding: "11px 20px", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#fafaf8",
      fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
      paddingBottom: 80,
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg,#1c1410 0%,#451a03 55%,#b45309 100%)",
        padding: "28px 20px 0",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,.12)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>🐾</div>
            <div>
              <div style={{ color: "rgba(255,255,255,.45)", fontSize: 9, letterSpacing: 3 }}>
                CANINE NUTRITION SYSTEM
              </div>
              <div style={{ color: "#fff", fontSize: 19, fontWeight: 800 }}>
                狗狗减脂鲜食定制
              </div>
            </div>
          </div>
          {/* tabs */}
          <div style={{ display: "flex" }}>
            {[{ n: 1, l: "狗狗信息" }, { n: 2, l: "食材 & 热量" }, { n: 3, l: "便当方案" }].map(t => (
              <div key={t.n}
                style={{
                  flex: 1, padding: "8px 6px", textAlign: "center",
                  borderBottom: `3px solid ${step === t.n ? "#fbbf24" : "transparent"}`,
                  cursor: step > t.n ? "pointer" : "default",
                }}
                onClick={() => step > t.n && setStep(t.n)}>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: step === t.n ? "#fbbf24" : "rgba(255,255,255,.4)",
                }}>
                  {step > t.n ? "✓ " : `${t.n}. `}{t.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "22px 16px 0" }}>

        {/* ══ STEP 1 ══════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["name", "狗狗名字", "例：Mochi"], ["breed", "品种", "例：柴犬"]].map(([k, l, p]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5, fontWeight: 600 }}>{l}</div>
                  <input style={INPUT} placeholder={p} value={dog[k]}
                    onChange={e => setDog(d => ({ ...d, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[["age", "年龄（岁）", "3"], ["currentWeight", "目前体重 kg", "12"], ["targetWeight", "目标体重 kg", "10"]].map(([k, l, p]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5, fontWeight: 600 }}>{l}</div>
                  <input style={INPUT} placeholder={p} type="number" value={dog[k]}
                    onChange={e => setDog(d => ({ ...d, [k]: e.target.value }))} />
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>日常活动量</div>
              {ACTIVITY_OPTS.map(a => (
                <div key={a.val} onClick={() => setDog(d => ({ ...d, activity: a.val }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 13px",
                    borderRadius: 9, marginBottom: 6, cursor: "pointer",
                    border: `1.5px solid ${dog.activity === a.val ? "#b45309" : "#e5e7eb"}`,
                    background: dog.activity === a.val ? "#fffbeb" : "#fff",
                  }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${dog.activity === a.val ? "#b45309" : "#d1d5db"}`,
                    background: dog.activity === a.val ? "#b45309" : "transparent",
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: dog.activity === a.val ? "#92400e" : "#374151" }}>
                      {a.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* calorie preview */}
            {cw > 0 && tw > 0 && (
              <div style={{
                background: "linear-gradient(135deg,#1c1410,#451a03)",
                borderRadius: 14, padding: "16px 20px", color: "#fff",
              }}>
                <div style={{ fontSize: 10, color: "#fbbf24", letterSpacing: 2, marginBottom: 8 }}>CALORIE TARGET</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#fde68a" }}>目前 RER</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fbbf24" }}>
                      {Math.round(calcRER(cw))} <span style={{ fontSize: 10 }}>kcal</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#fde68a" }}>减脂目标</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                      {target} <span style={{ fontSize: 10 }}>kcal</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "rgba(253,230,138,.5)", marginTop: 6 }}>
                  * 取现重与目标体重中间值 × 活动系数
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["allergies", "已知食物过敏（选填）", "例：鸡肉"], ["healthNotes", "健康备注（选填）", "例：慢性肾病"]].map(([k, l, p]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5, fontWeight: 600 }}>{l}</div>
                  <input style={INPUT} placeholder={p} value={dog[k]}
                    onChange={e => setDog(d => ({ ...d, [k]: e.target.value }))} />
                </div>
              ))}
            </div>

            <button style={BTN_P} disabled={!dog.name || !cw || !tw}
              onClick={() => setStep(2)}>
              下一步：选择食材 →
            </button>
          </div>
        )}

        {/* ══ STEP 2: food + live calorie ══════════════════════════════════════ */}
        {step === 2 && (
          <div>
            {/* ── sticky calorie bar ── */}
            <div style={{
              position: "sticky", top: 0, zIndex: 50,
              background: "#fff", borderRadius: 14, padding: "12px 16px",
              marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,.1)",
              border: `2px solid ${barColor(ratio)}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#9ca3af", letterSpacing: 1 }}>热量进度</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: barColor(ratio) }}>
                    {totalKcal} <span style={{ fontSize: 12, fontWeight: 400 }}>/ {target} kcal</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: overLimit ? "#dc2626" : ratio > 0.85 ? "#d97706" : "#16a34a",
                  }}>
                    {overLimit ? "⚠️ 超出目标！" : ratio > 0.85 ? "🟡 接近上限" : ratio > 0 ? "✅ 范围内" : "—"}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{Math.round(ratio * 100)}% of target</div>
                </div>
              </div>
              {/* bar */}
              <div style={{ height: 10, background: "#f3f4f6", borderRadius: 5, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 5,
                  width: `${Math.min(ratio * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${barColor(ratio)}, ${barColor(ratio)}cc)`,
                  transition: "width .3s, background .3s",
                }} />
              </div>
              {/* remaining */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#9ca3af" }}>
                <span>总食量：{totalGrams} g</span>
                <span style={{ color: overLimit ? "#dc2626" : "#9ca3af" }}>
                  {overLimit ? `超出 ${totalKcal - target} kcal` : `还剩 ${target - totalKcal} kcal`}
                </span>
              </div>
            </div>

            {/* ── sections ── */}
            {SECTIONS.map(sec => (
              <div key={sec.key} style={{ marginBottom: 20 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: `linear-gradient(135deg,${sec.color}dd,${sec.color})`,
                  borderRadius: 11, padding: "11px 14px", marginBottom: 10,
                }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
                      {sec.group === "荤类" ? "🥩" : "🌿"} {sec.group}
                    </div>
                    <div style={{ color: "rgba(255,255,255,.6)", fontSize: 10 }}>
                      {sec.pctMin}–{sec.pctMax}% of daily intake
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,.18)", borderRadius: 20,
                    padding: "3px 12px", color: "#fff", fontSize: 12, fontWeight: 700,
                  }}>{sec.pctMin}–{sec.pctMax}%</div>
                </div>
                {sec.categories.map(cat => (
                  <CatRow
                    key={cat.key} cat={cat}
                    chosen={chosen[cat.key] !== undefined ? chosen[cat.key] : (cat.required ? undefined : null)}
                    grams={grams[cat.key]}
                    onChoose={food => handleChoose(cat.key, food)}
                    onGrams={val => handleGrams(cat.key, val)}
                  />
                ))}
              </div>
            ))}

            {/* ── powders ── */}
            <div style={{
              background: "#fff", border: "1.5px solid #e5e7eb",
              borderRadius: 12, padding: "14px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1c1e", marginBottom: 10 }}>
                🧪 粉类营养补充（可多选）
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>
                剂量 = 总食量 × 0.5%，不计入热量
                {totalGrams > 0 && <span style={{ color: "#b45309", fontWeight: 600 }}>
                  {" "}（当前约 {(totalGrams * 0.005).toFixed(1)}g / 种）
                </span>}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {POWDER_OPTIONS.map(p => (
                  <div key={p.key}
                    onClick={() => togglePowder(p.key)}
                    style={{
                      padding: "8px 14px", borderRadius: 20, cursor: "pointer",
                      border: `1.5px solid ${powders.has(p.key) ? "#b45309" : "#d1d5db"}`,
                      background: powders.has(p.key) ? "#fffbeb" : "#fff",
                      transition: "all .15s",
                    }}>
                    <div style={{ fontSize: 13, fontWeight: powders.has(p.key) ? 700 : 400, color: powders.has(p.key) ? "#92400e" : "#374151" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* forbidden */}
            <div style={{
              background: "#fff1f2", border: "1.5px solid #fecaca",
              borderRadius: 11, padding: "12px 14px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 7 }}>⛔ 禁止食材</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {FORBIDDEN.map(f => (
                  <span key={f} style={{
                    background: "#fee2e2", color: "#dc2626",
                    fontSize: 10, padding: "3px 9px", borderRadius: 20,
                  }}>{f}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...BTN_G, flex: "0 0 72px" }} onClick={() => setStep(1)}>← 返回</button>
              <button style={{ ...BTN_P, flex: 1 }}
                disabled={!allRequired || overLimit}
                onClick={() => setStep(3)}>
                {overLimit ? "⚠️ 热量超标，请调整克数" : "查看完整方案 →"}
              </button>
            </div>
            {!allRequired && !overLimit && (
              <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 8 }}>
                请为所有必填类别各选一种食材
              </div>
            )}
          </div>
        )}

        {/* ══ STEP 3: plan summary ═════════════════════════════════════════════ */}
        {step === 3 && (
          <div>
            {/* hero */}
            <div style={{
              background: "linear-gradient(135deg,#1c1410,#451a03,#b45309)",
              borderRadius: 18, padding: "22px 20px", marginBottom: 14,
              boxShadow: "0 8px 32px rgba(180,83,9,.25)",
            }}>
              <div style={{ fontSize: 9, color: "#fbbf24", letterSpacing: 3, marginBottom: 4 }}>MEAL PLAN</div>
              <div style={{ color: "#fff", fontSize: 21, fontWeight: 800 }}>🐾 {dog.name} 的减脂方案</div>
              <div style={{ color: "#fde68a", fontSize: 12, marginTop: 4 }}>
                {dog.currentWeight}kg → {dog.targetWeight}kg ｜ {dog.breed}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                {[
                  ["热量目标", `${target} kcal`],
                  ["本方案", `${totalKcal} kcal`],
                  ["总食量", `~${totalGrams} g`],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "10px" }}>
                    <div style={{ fontSize: 9, color: "#fde68a" }}>{l}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* food items */}
            {SECTIONS.map(sec => {
              const rows = sec.categories
                .map(cat => ({ cat, food: chosen[cat.key], g: grams[cat.key] }))
                .filter(r => r.food && r.g);
              if (rows.length === 0) return null;
              return (
                <div key={sec.key} style={{
                  background: "#fff", borderRadius: 14, padding: "14px",
                  marginBottom: 12, border: `1.5px solid ${sec.border}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: sec.color, marginBottom: 12 }}>
                    {sec.group === "荤类" ? "🥩" : "🌿"} {sec.group}
                  </div>
                  {rows.map(({ cat, food, g }) => {
                    const kcal = Math.round((g * food.cal) / 100);
                    const pctOfTarget = target > 0 ? kcal / target * 100 : 0;
                    return (
                      <div key={cat.key} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: "#374151" }}>
                            {cat.emoji} {cat.label}
                            <span style={{ color: "#9ca3af", marginLeft: 5 }}>({food.name})</span>
                          </span>
                          <span>
                            <span style={{ fontSize: 16, fontWeight: 800, color: sec.color }}>{g}g</span>
                            <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 4 }}>{kcal} kcal</span>
                          </span>
                        </div>
                        <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${Math.min(pctOfTarget, 100)}%`,
                            background: sec.color, borderRadius: 3,
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* powders */}
            {powders.size > 0 && (
              <div style={{
                background: "#fff", borderRadius: 14, padding: "14px",
                marginBottom: 12, border: "1.5px solid #e5e7eb",
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 8 }}>🧪 营养补充粉</div>
                {POWDER_OPTIONS.filter(p => powders.has(p.key)).map(p => (
                  <div key={p.key} style={{ fontSize: 12, color: "#374151", marginBottom: 5 }}>
                    • {p.name}：约 {(totalGrams * 0.005).toFixed(1)}g（{p.note}）
                  </div>
                ))}
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>不计入热量，拌入食物中即可</div>
              </div>
            )}

            {/* notes */}
            <div style={{
              background: "#fff", borderRadius: 14, padding: "14px",
              marginBottom: 12, border: "1.5px solid #e5e7eb",
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1c1c1e", marginBottom: 10 }}>📋 使用说明</div>
              {[
                ["分餐", "以上为单日总量，建议早晚各喂一半"],
                ["烹饪", "荤类轻煮不加调味料，鱼类务必去刺"],
                ["植物油", "食物冷却后再拌入，避免高温破坏营养"],
                ["过渡期", "新食谱用 10–14 天循序渐进替换"],
                ["监控", "每 2 周称重，每月减重 ≤ 体重 1–2%"],
              ].map(([t, d]) => (
                <div key={t} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
                  <span style={{
                    background: "#f3f4f6", color: "#4b5563", padding: "2px 8px",
                    borderRadius: 5, fontWeight: 700, fontSize: 11, whiteSpace: "nowrap", height: "fit-content",
                  }}>{t}</span>
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{d}</span>
                </div>
              ))}
            </div>

            {/* forbidden */}
            <div style={{
              background: "#fff1f2", borderRadius: 13, padding: "13px 14px",
              marginBottom: 20, border: "1.5px solid #fecaca",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 7 }}>⛔ 绝对禁止食材</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {FORBIDDEN.map(f => (
                  <span key={f} style={{ background: "#fee2e2", color: "#dc2626", fontSize: 10, padding: "3px 9px", borderRadius: 20 }}>{f}</span>
                ))}
              </div>
              {dog.allergies && (
                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 7 }}>
                  ⚠️ 该狗狗额外过敏：{dog.allergies}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...BTN_G, flex: "0 0 72px" }} onClick={() => setStep(2)}>← 修改</button>
              <button style={{ ...BTN_P, flex: 1 }} onClick={doExport}>
                {copied ? "✅ 已复制！" : "📋 复制方案发给客户"}
              </button>
            </div>
            <button style={{ ...BTN_G, width: "100%", marginTop: 10 }}
              onClick={() => {
                setStep(1); setChosen({}); setGrams({});
                setPowders(new Set()); setMealPlan(null);
                setDog({ name: "", breed: "", age: "", currentWeight: "", targetWeight: "", activity: "low", allergies: "", healthNotes: "" });
              }}>
              重新制作新客户方案
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
