import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Boxes,
  Building2,
  CalendarRange,
  Camera,
  ChevronRight,
  CloudCog,
  Construction,
  Cpu,
  Gauge,
  HardHat,
  Leaf,
  Maximize2,
  Radio,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Video,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import siteBackdrop from "@/assets/construction-digital-twin.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "overview", label: "综合看板", sub: "项目大屏", icon: Building2 },
  { id: "people", label: "劳务人员", sub: "实名考勤", icon: Users },
  { id: "safety", label: "安全隐患", sub: "AI 监控", icon: ShieldCheck },
  { id: "green", label: "绿色施工", sub: "环境监测", icon: Leaf },
  { id: "equipment", label: "特种设备", sub: "运行监测", icon: Construction },
  { id: "progress", label: "进度质量", sub: "节点把控", icon: CalendarRange },
  { id: "video", label: "视频巡检", sub: "智能监控", icon: Video },
  { id: "materials", label: "物资材料", sub: "库存供应", icon: Boxes },
] as const;

type ViewId = (typeof NAV_ITEMS)[number]["id"];
type Tone = "cyan" | "green" | "orange" | "red";

const trend = [
  { t: "08:00", actual: 122, plan: 118, warning: 4 },
  { t: "10:00", actual: 168, plan: 152, warning: 7 },
  { t: "12:00", actual: 211, plan: 205, warning: 5 },
  { t: "14:00", actual: 246, plan: 234, warning: 9 },
  { t: "16:00", actual: 273, plan: 268, warning: 6 },
  { t: "18:00", actual: 198, plan: 210, warning: 3 },
];

const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false };
const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  color: "var(--popover-foreground)",
};
const legendTop = { top: 10 } as const;
const gridTop = { top: 46, right: 18, bottom: 8, left: -12 } as const;

function Panel({ title, meta, className, children }: { title: string; meta?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("glass-panel group relative overflow-hidden rounded-md p-4", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        {meta && <span className="font-mono text-[10px] text-muted-foreground">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, unit, delta, icon: Icon, tone = "cyan" }: { label: string; value: string; unit?: string; delta?: string; icon: LucideIcon; tone?: Tone }) {
  return (
    <div className={cn("metric-card relative overflow-hidden rounded-md border p-4", `tone-${tone}`)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground"><span className="metric-number">{value}</span>{unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}</p>
        </div>
        <div className="metric-icon grid h-9 w-9 place-items-center rounded-md"><Icon className="h-4 w-4" /></div>
      </div>
      {delta && <p className="mt-3 text-[10px] text-muted-foreground">{delta}</p>}
    </div>
  );
}

function StatusDot({ status = "ok" }: { status?: "ok" | "warn" | "danger" }) {
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]", status === "ok" ? "bg-success text-success" : status === "warn" ? "bg-warning text-warning" : "bg-destructive text-destructive")} />;
}

function LineTrend({ data = trend, lines = [{ key: "actual", name: "实时人数", color: "var(--primary)" }, { key: "plan", name: "计划人数", color: "var(--success)" }] }: { data?: Array<Record<string, string | number>>; lines?: Array<{ key: string; name: string; color: string }> }) {
  return <div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={gridTop}><CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="t" {...axis} /><YAxis {...axis} /><Tooltip contentStyle={tooltipStyle} /><g className="recharts-default-legend" data-top={legendTop.top} />{lines.map((l) => <Line key={l.key} dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />)}</LineChart></ResponsiveContainer></div>;
}


function ScoreRadar() {
  const dimensions = [["安全",96,"优",20],["劳务",95,"优",15],["质量",92,"良",20],["设备",89,"良",15],["进度",87,"良",20],["环境",83,"需关注",10]] as const;
  const points = dimensions.map(([,score],i) => { const a=(-90+i*60)*Math.PI/180; const r=82*score/100; return `${110+Math.cos(a)*r},${110+Math.sin(a)*r}`; }).join(" ");
  return <div className="grid gap-4 xl:grid-cols-[.72fr_1.05fr_1.25fr] xl:items-center">
    <div className="score-core flex min-h-[220px] flex-col items-center justify-center rounded-sm border border-primary/25 bg-primary/5 text-center"><span className="text-[10px] text-muted-foreground">PROJECT HEALTH INDEX</span><div className="mt-2 font-mono text-5xl font-bold text-primary drop-shadow-[0_0_12px_var(--primary)]">94.8</div><span className="mt-1 text-xs text-muted-foreground">综合评分 / 100</span><strong className="mt-3 rounded-sm border border-success/30 bg-success/10 px-3 py-1 text-sm text-success">A+ 优良工程</strong><div className="mt-4 grid grid-cols-2 gap-4 text-[10px]"><span className="text-muted-foreground">全周期达标率<br/><b className="font-mono text-base text-foreground">98.2%</b></span><span className="text-muted-foreground">安全生产<br/><b className="font-mono text-base text-success">连续45天</b></span></div></div>
    <div className="relative h-[240px] min-h-[220px] w-full" aria-label="项目六维综合评分雷达图"><svg viewBox="0 0 220 220" className="h-full w-full overflow-visible" role="img"><title>安全、劳务、质量、设备、进度、环境六维评分</title>{[1,.75,.5,.25].map(r=><polygon key={r} points={[0,1,2,3,4,5].map(i=>{const a=(-90+i*60)*Math.PI/180;return `${110+Math.cos(a)*82*r},${110+Math.sin(a)*82*r}`}).join(" ")} fill="none" stroke="var(--chart-grid)" strokeWidth="1"/>)}{[0,1,2,3,4,5].map(i=>{const a=(-90+i*60)*Math.PI/180;return <line key={i} x1="110" y1="110" x2={110+Math.cos(a)*82} y2={110+Math.sin(a)*82} stroke="var(--chart-grid)"/>})}<polygon points={points} fill="var(--primary)" fillOpacity=".22" stroke="var(--primary)" strokeWidth="2" className="radar-glow"/>{dimensions.map((d,i)=>{const a=(-90+i*60)*Math.PI/180;const x=110+Math.cos(a)*82*d[1]/100,y=110+Math.sin(a)*82*d[1]/100;const lx=110+Math.cos(a)*101,ly=110+Math.sin(a)*101;return <g key={d[0]}><circle cx={x} cy={y} r="3" fill="var(--success)"/><text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="var(--foreground)" fontSize="10">{d[0]} {d[1]}</text></g>})}<circle cx="110" cy="110" r="4" fill="var(--primary)" className="radar-center"/></svg></div>
    <div className="grid grid-cols-2 gap-2">{dimensions.map(([name,score,grade,weight])=><div key={name} className="zone-cell rounded-sm p-2.5"><div className="flex items-center justify-between"><span className="text-xs text-foreground">{name}</span><span className={cn("font-mono text-sm",grade==="优"?"text-success":grade==="需关注"?"text-warning":"text-primary")}>{score}分</span></div><div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground"><span>权重 {weight}%</span><span className="flex items-center gap-1"><StatusDot status={grade==="需关注"?"warn":"ok"}/>{grade}</span></div></div>)}</div>
  </div>;
}

const MiniLegend = ({ items }: { items: Array<{ label: string; color: string }> }) => <div className="absolute left-4 top-11 z-10 flex flex-wrap gap-4 text-[10px] text-muted-foreground">{items.map((item) => <span key={item.label} className="flex items-center gap-1.5"><i className="h-0.5 w-4" style={{ backgroundColor: item.color }} />{item.label}</span>)}</div>;

function Donut({ data }: { data: Array<{ name: string; value: number }> }) {
  const colors = ["var(--primary)", "var(--success)", "var(--warning)", "var(--chart-4)", "var(--destructive)"];
  return <div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="48%" outerRadius="72%" paddingAngle={3}>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer></div>;
}

function Overview() {
  const zones = [["A区主体","386","18","低风险","09:41"],["B区机电","274","12","低风险","09:39"],["C区堆场","118","9","需关注","09:36"],["D区生活区","508","3","低风险","09:40"]];
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="今日在场人数" value="1,286" unit="人" delta="较昨日 ↑ 8.2%" icon={Users}/><Kpi label="设备在线率" value="98.6" unit="%" delta="运行设备 142 台" icon={Cpu} tone="green"/><Kpi label="今日告警" value="17" unit="条" delta="待处理 3 条" icon={AlertTriangle} tone="orange"/><Kpi label="总体施工进度" value="72.4" unit="%" delta="领先计划 2.1%" icon={Activity}/></div>
  <Panel title="项目综合评分" meta="六维实时评估 · 09:42"><ScoreRadar/></Panel>
  <div className="grid gap-3 xl:grid-cols-[1.8fr_1fr]"><Panel title="项目总体趋势" meta="今日 08:00—18:00" className="relative min-h-[310px]"><MiniLegend items={[{label:"实时人数",color:"var(--primary)"},{label:"计划人数",color:"var(--success)"}]}/><LineTrend/></Panel><Panel title="实时动态告警" meta="17 条"><div className="space-y-2">{[["未佩戴安全帽","东区 3#楼","09:42","danger"],["扬尘指数偏高","南门监测点","09:31","warn"],["塔吊载荷接近阈值","T-03 塔吊","09:18","warn"],["人员越界进入","材料堆场","08:56","danger"]].map(x=><div key={x[2]} className="alert-row flex items-center gap-3 rounded-sm px-3 py-2.5"><StatusDot status={x[3] as "warn"|"danger"}/><div className="min-w-0 flex-1"><p className="truncate text-xs">{x[0]}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{x[1]}</p></div><time className="font-mono text-[10px] text-muted-foreground">{x[2]}</time></div>)}</div></Panel></div>
  <Panel title="现场态势分布" meta="4 大标段 · 实时"><div className="grid gap-3 md:grid-cols-4">{zones.map((x,i)=><div key={x[0]} className="zone-cell rounded-sm border border-border/60 p-3"><div className="flex justify-between"><span className="text-xs font-medium">{x[0]}</span><span className={i===2?"text-[10px] text-warning":"text-[10px] text-success"}><StatusDot status={i===2?"warn":"ok"}/> {x[3]}</span></div><div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground"><span>在场 <b className="font-mono text-foreground">{x[1]}人</b></span><span>设备 <b className="font-mono text-foreground">{x[2]}台</b></span><span className="col-span-2">巡检打卡 {x[4]}</span></div></div>)}</div></Panel>
  </>;
}

const records = [["张建国","钢筋工","北门02","09:42:08","进场"],["刘海峰","电焊工","东门01","09:39:26","进场"],["王明","架子工","北门01","09:36:51","离场"],["赵志强","木工","南门03","09:30:14","进场"],["陈伟","信号工","北门02","09:26:03","进场"],["孙强","塔吊司机","东门02","09:21:45","进场"],["周林","电工","南门01","09:18:30","进场"],["吴勇","砼工","北门03","09:12:16","离场"]];

function People() {
  const jobs = [{ name: "钢筋工", value: 326 }, { name: "木工", value: 248 }, { name: "砼工", value: 196 }, { name: "电焊工", value: 148 }, { name: "其他", value: 368 }];
  const attendance = trend.map((x, i) => ({ ...x, present: [182, 236, 268, 288, 274, 221][i], absent: [16, 11, 8, 13, 9, 7][i] }));
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="实时在场" value="1,286" unit="人" delta="实名制覆盖 100%" icon={Users} /><Kpi label="今日出勤率" value="96.8" unit="%" delta="应到 1,329 人" icon={Activity} tone="green" /><Kpi label="特种作业人员" value="148" unit="人" delta="证件有效 143 人" icon={HardHat} tone="orange" /><Kpi label="在场班组" value="42" unit="组" delta="分布于 6 个施工区" icon={Construction} /></div><div className="grid gap-3 xl:grid-cols-[1fr_1.7fr]"><Panel title="工种分布" className="h-[300px]"><Donut data={jobs} /></Panel><Panel title="考勤打卡趋势" className="relative h-[300px]"><MiniLegend items={[{ label: "已出勤", color: "var(--primary)" }, { label: "缺勤", color: "var(--warning)" }]} /><ResponsiveContainer width="100%" height="240"><BarChart data={attendance} margin={gridTop}><CartesianGrid stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="t" {...axis} /><YAxis {...axis} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="present" name="已出勤" fill="var(--primary)" radius={[2,2,0,0]} /><Bar dataKey="absent" name="缺勤" fill="var(--warning)" radius={[2,2,0,0]} /></BarChart></ResponsiveContainer></Panel></div><div className="grid gap-3 xl:grid-cols-[1.7fr_1fr]"><DataTable title="人员进出闸机记录" headers={["姓名", "工种", "闸机", "时间", "状态"]} rows={records} /><Panel title="特种作业持证状态"><div className="space-y-4">{[["电焊作业", 96], ["塔吊司机", 100], ["高处作业", 92], ["电工作业", 98]].map(x => <ProgressRow key={x[0] as string} label={x[0] as string} value={x[1] as number} />)}</div></Panel></div></>;
}

function DataTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return <Panel title={title} meta={`共 ${rows.length} 条`}><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr>{headers.map(h => <th key={h} className="border-b border-border px-3 py-2 text-[10px] font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i} className="table-row">{r.map((v, j) => <td key={j} className="border-b border-border/50 px-3 py-3 text-xs text-foreground">{headers[j] === "照片" ? <span className="grid h-7 w-7 place-items-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[9px] text-primary">{v}</span> : j === r.length - 1 ? <span className="inline-flex items-center gap-1.5 text-success"><StatusDot status={v.includes("异常") || v.includes("逾期") || v.includes("未闭环") ? "danger" : "ok"} />{v}</span> : v}</td>)}</tr>)}</tbody></table></div></Panel>;
}

function ProgressRow({ label, value }: { label: string; value: number }) { return <div><div className="mb-1.5 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-mono text-foreground">{value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-success shadow-[0_0_8px_var(--success)]" style={{ width: `${value}%` }} /></div></div>; }

function Safety() {
  const violations = [{ name: "未戴安全帽", value: 38 }, { name: "未穿反光衣", value: 26 }, { name: "越界闯入", value: 19 }, { name: "违规吸烟", value: 8 }];
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="今日 AI 抓拍" value="91" unit="次" delta="自动识别率 98.2%" icon={Camera} tone="orange" /><Kpi label="待整改隐患" value="12" unit="项" delta="重大隐患 1 项" icon={AlertTriangle} tone="red" /><Kpi label="今日已闭环" value="47" unit="项" delta="平均用时 1.8h" icon={ShieldCheck} tone="green" /><Kpi label="连续安全生产" value="186" unit="天" delta="目标 365 天" icon={HardHat} /></div><div className="grid gap-3 xl:grid-cols-[1fr_1.4fr_1fr]"><Panel title="违规类型统计" className="h-[320px]"><Donut data={violations} /></Panel><Panel title="AI 违规事件流"><div className="grid grid-cols-2 gap-2">{["未佩戴安全帽","未穿反光衣","危险区域闯入","临边防护缺失"].map((x,i)=><div key={x} className="capture-tile relative h-32 overflow-hidden rounded-sm border border-border"><div className="scan-line"/><span className="target-box absolute left-[32%] top-[22%] h-12 w-10 border border-destructive"><i/><i/></span><span className="absolute right-2 top-2 bg-destructive/15 px-1.5 py-1 font-mono text-[9px] text-destructive">识别率 {(98.6-i*.7).toFixed(1)}%</span><div className="absolute inset-x-0 bottom-0 bg-background/85 p-2 backdrop-blur-sm"><p className="text-[11px] text-foreground">{x} <b className="text-destructive">[坐标已锁定]</b></p><p className="text-[9px] text-muted-foreground">数字哨兵 CAM-{String(i+3).padStart(2,"0")} · 09:{42-i*7}</p></div></div>)}</div></Panel><Panel title="隐患级别"><div className="space-y-3 pt-2">{[["重大隐患",1,"danger"],["较大隐患",4,"warn"],["一般隐患",7,"ok"]].map(x => <div key={x[0] as string} className="flex items-center justify-between border-b border-border/50 pb-3"><span className="flex items-center gap-2 text-xs text-muted-foreground"><StatusDot status={x[2] as "ok"|"warn"|"danger"}/>{x[0]}</span><span className="font-mono text-xl text-foreground">{x[1]}</span></div>)}</div></Panel></div><DataTable title="安全巡检整改进度" headers={["隐患编号","位置","责任单位","期限","进度"]} rows={[["AQ-0921-017","3#楼 12F","中建劳务一队","今日 14:00","整改中 80%"],["AQ-0921-013","塔吊 T-03","设备维保组","今日 12:00","复查中"],["AQ-0921-009","南侧基坑","基础施工组","已完成","已闭环"],["AQ-0920-046","生活区 2F","后勤保障组","已完成","已闭环"]]} /></>;
}

function Green() {
  const env = trend.map((x,i)=>({...x, pm25:[27,31,38,43,34,29][i] ?? 0, pm10:[52,56,68,75,61,54][i] ?? 0, tsp:[71,78,91,106,89,76][i] ?? 0}));
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="PM2.5" value="34" unit="μg/m³" delta="空气质量：优" icon={Wind} tone="green" /><Kpi label="PM10" value="61" unit="μg/m³" delta="低于预警值 39%" icon={CloudCog} /><Kpi label="TSP" value="89" unit="μg/m³" delta="趋势平稳" icon={Gauge} tone="orange" /><Kpi label="环境综合指数" value="92" unit="分" delta="优于 86% 项目" icon={Leaf} tone="green" /></div><div className="grid gap-3 xl:grid-cols-[1.8fr_1fr]"><Panel title="24 小时颗粒物走势" meta="自动站 #01" className="relative h-[330px]"><MiniLegend items={[{label:"PM2.5",color:"var(--success)"},{label:"PM10",color:"var(--primary)"},{label:"TSP",color:"var(--warning)"}]} /><div className="h-[270px]"><LineTrend data={env} lines={[{key:"pm25",name:"PM2.5",color:"var(--success)"},{key:"pm10",name:"PM10",color:"var(--primary)"},{key:"tsp",name:"TSP",color:"var(--warning)"}]} /></div></Panel><Panel title="气象状态"><div className="grid grid-cols-2 gap-2">{[["温度","26.4°C"],["湿度","62%RH"],["风速","2.8m/s"],["风向","东北风"]].map(x=><div key={x[0]} className="zone-cell rounded-sm p-3"><p className="text-[10px] text-muted-foreground">{x[0]}</p><p className="mt-2 font-mono text-lg text-foreground">{x[1]}</p></div>)}</div><div className="mt-3 flex items-center justify-between rounded-sm border border-success/30 bg-success/5 p-3"><span className="flex items-center gap-2 text-xs text-foreground"><StatusDot />雾炮喷淋联动</span><span className="font-mono text-xs text-success">AUTO · ON</span></div></Panel></div><Panel title="噪声监测" className="h-[250px]"><ResponsiveContainer width="100%" height="190"><BarChart data={trend.map((x,i)=>({...x,db:[54,58,62,69,65,57][i]}))} margin={{...gridTop,top:20}}><CartesianGrid stroke="var(--chart-grid)" vertical={false}/><XAxis dataKey="t" {...axis}/><YAxis {...axis}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="db" name="噪声 dB" fill="var(--primary)" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></Panel></>;
}

function Equipment() {
  const health=[{k:"结构",v:94},{k:"电气",v:88},{k:"制动",v:96},{k:"传动",v:91},{k:"润滑",v:85},{k:"通讯",v:98}];
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="设备在线" value="42/43" unit="台" delta="在线率 97.7%" icon={Radio}/><Kpi label="塔吊当前载荷" value="4.62" unit="t" delta="额定载荷 8.0t" icon={Construction} tone="green"/><Kpi label="实时风速" value="6.2" unit="m/s" delta="允许作业" icon={Wind}/><Kpi label="维保待办" value="3" unit="项" delta="1 项即将逾期" icon={Wrench} tone="orange"/></div><div className="grid gap-3 xl:grid-cols-[1.45fr_1fr_1fr]"><Panel title="塔吊全要素实时监测" meta="TC-03 · QTZ125"><div className="grid min-h-[240px] grid-cols-[150px_1fr] items-center gap-4"><div className="gauge-ring grid h-36 w-36 place-items-center rounded-full"><div className="text-center"><p className="font-mono text-3xl font-bold text-primary">68.4%</p><p className="text-[10px] text-muted-foreground">力矩百分比</p></div></div><div className="grid grid-cols-2 gap-2">{[["回转角度","142°"],["工作幅度","42.6m"],["起升高度","68.2m"],["当前吊重","4.62t / 8.0t"],["实时风速","6.2m/s"],["防碰撞预警","正常"]].map((x,i)=><div key={x[0]} className="zone-cell rounded-sm p-2"><p className="text-[9px] text-muted-foreground">{x[0]}</p><p className={cn("mt-1 font-mono text-xs",i===5?"text-success":"text-foreground")}>{x[1]}</p></div>)}</div></div></Panel><Panel title="设备健康度"><div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><RadarChart data={health}><PolarGrid stroke="var(--chart-grid)"/><PolarAngleAxis dataKey="k" tick={{fill:"var(--muted-foreground)",fontSize:10}}/><Radar dataKey="v" stroke="var(--success)" fill="var(--success)" fillOpacity={.2}/></RadarChart></ResponsiveContainer></div></Panel><Panel title="施工电梯双笼状态"><div className="grid min-h-[240px] grid-cols-2 gap-3">{[["左笼","12F","↑ 0.8m/s","1.26t / 2.0t"],["右笼","28F","↓ 0.6m/s","0.92t / 2.0t"]].map((x,i)=><div key={x[0]} className="lift-shaft relative border-x border-border"><div className="absolute inset-x-2 h-12 border border-primary bg-primary/15 shadow-[0_0_16px_var(--primary)]" style={{bottom:i?"75%":"35%"}}/><div className="absolute inset-x-1 bottom-2 text-center"><b className="text-xs text-primary">{x[0]} · {x[1]}</b><p className="mt-1 font-mono text-[9px] text-muted-foreground">{x[2]}<br/>{x[3]}</p></div></div>)}</div></Panel></div><DataTable title="设备维保与检验台账" headers={["设备编号","设备类型","本次检验","下次维保","状态"]} rows={[["TC-03","塔式起重机","2026-09-18","2026-09-25","运行正常"],["SC-08","施工升降机","2026-09-16","2026-09-22","即将到期"],["TC-01","塔式起重机","2026-09-15","2026-09-28","运行正常"],["GD-12","高支模监测","2026-09-20","2026-10-02","运行正常"]]}/></>;
}

function ProgressView() {
 const pd=trend.map((x,i)=>({...x,plan:[45,52,59,65,70,76][i] ?? 0,actual:[44,51,58,64,72,78][i] ?? 0}));
 return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="工期倒计时" value="186" unit="天" delta="计划竣工 2027-03-26" icon={CalendarRange} tone="orange"/><Kpi label="总体进度" value="72.4" unit="%" delta="领先计划 2.1%" icon={Activity}/><Kpi label="本月完成产值" value="3,842" unit="万元" delta="完成率 106.7%" icon={Gauge} tone="green"/><Kpi label="质量验收合格率" value="98.6" unit="%" delta="首检合格 96.2%" icon={ShieldCheck} tone="green"/></div><div className="grid gap-3 xl:grid-cols-[1.7fr_1fr]"><Panel title="计划 / 实际进度对比" className="relative h-[330px]"><MiniLegend items={[{label:"计划进度",color:"var(--muted-foreground)"},{label:"实际进度",color:"var(--primary)"}]}/><div className="h-[270px]"><LineTrend data={pd} lines={[{key:"plan",name:"计划进度",color:"var(--muted-foreground)"},{key:"actual",name:"实际进度",color:"var(--primary)"}]}/></div></Panel><Panel title="质量指标"><div className="space-y-5 pt-2">{[["钢筋工程",99],["混凝土工程",98],["防水工程",96],["机电安装",94]].map(x=><ProgressRow key={x[0] as string} label={x[0] as string} value={x[1] as number}/>)}</div></Panel></div><Panel title="关键里程碑"><div className="grid gap-3 md:grid-cols-4">{[["地下室封顶","已完成","08.16",100],["主体结构封顶","进行中","10.28",72],["幕墙工程完成","待开始","12.15",18],["竣工验收","待开始","03.30",0]].map((x,i)=><div key={x[0] as string} className="relative border-l-2 border-primary/40 pl-4"><span className={cn("absolute -left-[5px] top-0 h-2 w-2 rounded-full",i===0?"bg-success":"bg-primary")}/><p className="text-xs text-foreground">{x[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">{x[1]} · {x[2]}</p><div className="mt-4 h-1 bg-muted"><div className="h-full bg-primary" style={{width:`${x[3]}%`}}/></div></div>)}</div></Panel></>;
}

function VideoView() {
 const [active,setActive]=useState(0); const feeds=[["东区塔吊","CAM-001","25 FPS · 8.2Mbps"],["主体结构面","CAM-018","25 FPS · 6.8Mbps"],["大门地磅通道","CAM-032","30 FPS · 9.1Mbps"],["危险基坑","CAM-047","25 FPS · 7.4Mbps"]];
 return <div className="grid gap-3 xl:grid-cols-[1fr_320px]"><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{feeds.map((x,i)=><Button key={x[0]} variant="ghost" onClick={()=>setActive(i)} className={cn("video-feed group relative h-56 overflow-hidden rounded-md border p-0 text-left",active===i?"border-primary shadow-[0_0_18px_var(--primary-glow)]":"border-border")}><div className="scan-line"/><span className="absolute left-3 top-3 flex items-center gap-2 text-[10px] text-success"><StatusDot/> REC · {x[1]}</span><time className="absolute right-3 top-3 font-mono text-[9px] text-foreground">2026-09-21 09:42:{18+i}</time><span className="target-reticle absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2"/><span className="absolute bottom-11 right-3 font-mono text-[9px] text-primary">{x[2]}</span><div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/80 p-3 backdrop-blur-sm"><span className="text-xs text-foreground">{x[0]}</span><Maximize2 className="h-3.5 w-3.5"/></div></Button>)}</div><div className="space-y-3"><Panel title="云台控制"><div className="grid place-items-center"><div className="grid h-32 w-32 grid-cols-3 grid-rows-3 gap-1">{["↖","↑","↗","←","●","→","↙","↓","↘"].map(x=><Button key={x} variant="ghost" size="icon" className="h-auto w-auto border border-border bg-muted/40 text-primary hover:bg-primary/10">{x}</Button>)}</div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline">变焦 +</Button><Button size="sm" variant="outline">变焦 −</Button></div></div></Panel><Panel title="预置位巡航"><div className="grid grid-cols-2 gap-2">{["塔吊全景","基坑边界","卸料平台","消防通道","大门车道","夜间巡航"].map((x,i)=><Button key={x} size="sm" variant="outline" className="text-[10px]">P{i+1} · {x}</Button>)}</div></Panel></div></div>;
}

function Materials() {
 const stock=trend.map((x,i)=>({...x,in:[42,58,31,72,55,61][i],out:[28,39,45,52,62,48][i],balance:[480,499,485,505,498,511][i]}));
 return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="今日进场" value="486.2" unit="吨" delta="12 车次已过磅" icon={Truck}/><Kpi label="库存总值" value="2,846" unit="万元" delta="周转率 78.6%" icon={Boxes} tone="green"/><Kpi label="低库存预警" value="4" unit="类" delta="钢筋 HRB400 告警" icon={AlertTriangle} tone="orange"/><Kpi label="供应商履约率" value="96.4" unit="%" delta="本月准时 81 批" icon={ShieldCheck}/></div><div className="grid gap-3 xl:grid-cols-[1.7fr_1fr]"><Panel title="库存进出与结余趋势" className="relative h-[330px]"><MiniLegend items={[{label:"入库",color:"var(--primary)"},{label:"出库",color:"var(--success)"},{label:"库存结余",color:"var(--warning)"}]}/><ResponsiveContainer width="100%" height="270"><ComposedChart data={stock} margin={gridTop}><CartesianGrid stroke="var(--chart-grid)" vertical={false}/><XAxis dataKey="t" {...axis}/><YAxis {...axis}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="in" name="入库" fill="var(--primary)"/><Bar dataKey="out" name="出库" fill="var(--success)"/><Line dataKey="balance" name="库存结余" stroke="var(--warning)" strokeWidth={2} dot={false}/></ComposedChart></ResponsiveContainer></Panel><Panel title="库存预警"><div className="space-y-3">{[["HRB400 钢筋","低于安全库存","danger"],["P.O 42.5 水泥","剩余 2.8 天","warn"],["C35 混凝土","供应正常","ok"],["铝合金模板","供应正常","ok"]].map(x=><div key={x[0]} className="flex items-center justify-between rounded-sm bg-muted/40 p-3"><div><p className="text-xs text-foreground">{x[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">{x[1]}</p></div><StatusDot status={x[2] as "ok"|"warn"|"danger"}/></div>)}</div></Panel></div><DataTable title="地磅过磅称重记录" headers={["磅单号","材料","供应商","净重","状态"]} rows={[["WB-0921-032","HRB400 钢筋","华东钢材","42.68t","已验收"],["WB-0921-031","P.O 42.5 水泥","海螺水泥","31.24t","已验收"],["WB-0921-030","C35 混凝土","城建商砼","28.60t","已入库"],["WB-0921-029","机制砂","鑫源建材","46.82t","已验收"]]}/></>;
}

function CompactBars({ data, dataKey = "value" }: { data: Array<Record<string, string | number>>; dataKey?: string }) {
  return <div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 18, right: 10, bottom: 4, left: -18 }}><CartesianGrid stroke="var(--chart-grid)" vertical={false}/><XAxis dataKey="name" {...axis}/><YAxis {...axis}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey={dataKey} fill="var(--primary)" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>;
}

function SupplementalContent({ view }: { view: ViewId }) {
 const month=[{t:"08.23",actual:1180,plan:1200},{t:"08.29",actual:1260,plan:1280},{t:"09.04",actual:1310,plan:1300},{t:"09.10",actual:1270,plan:1320},{t:"09.16",actual:1360,plan:1340},{t:"09.21",actual:1286,plan:1290}];
 if(view==="overview") return <><div className="grid gap-3 xl:grid-cols-2"><Panel title="项目全景工况一览"><div className="grid grid-cols-2 gap-2">{[["作业面","26处","24处正常"],["大型设备","43台","42台在线"],["巡检任务","38项","完成35项"],["风险源","12处","全部受控"]].map(x=><div key={x[0]} className="zone-cell rounded-sm p-3"><p className="text-[10px] text-muted-foreground">{x[0]}</p><b className="mt-1 block font-mono text-xl text-primary">{x[1]}</b><span className="text-[9px] text-success">{x[2]}</span></div>)}</div></Panel><Panel title="今日重要事项闭环" meta="完成 6 / 8"><div className="space-y-2">{[["塔吊 T-03 月检复核","已闭环","ok"],["3#楼悬挑架专项验收","进行中 80%","warn"],["南门扬尘联动测试","已闭环","ok"],["夜间混凝土浇筑报备","待审批","danger"]].map(x=><div key={x[0]} className="flex items-center justify-between border-b border-border/50 py-2 text-xs"><span>{x[0]}</span><span className="flex items-center gap-2 text-muted-foreground"><StatusDot status={x[2] as "ok"|"warn"|"danger"}/>{x[1]}</span></div>)}</div></Panel></div><div className="grid gap-3 xl:grid-cols-[.85fr_1.45fr]"><Panel title="能耗与成本分布"><Donut data={[{name:"施工用电",value:38},{name:"机械台班",value:27},{name:"临建用水",value:14},{name:"人工成本",value:21}]}/></Panel><DataTable title="工程检验与实时态势台账" headers={["标段","负责人","施工区域","质量评分","巡检结果","状态"]} rows={[["一标段","周建华","1—3#楼主体","96.8","合格","正常施工"],["二标段","李国伟","地下车库 B 区","94.2","2项待复查","整改中"],["三标段","陈志远","机电安装层","98.1","合格","正常施工"],["景观标段","王海涛","南侧展示区","91.6","1项待整改","跟踪中"]]}/></div></>;
 if(view==="people") return <><div className="grid gap-3 xl:grid-cols-2"><Panel title="班组健康与防护佩戴率"><div className="grid min-h-[220px] grid-cols-3 place-items-center gap-2">{[["安全帽",99],["反光衣",97],["健康达标",98]].map(x=><div key={x[0]} className="text-center"><div className="gauge-ring grid h-24 w-24 place-items-center rounded-full"><b className="font-mono text-lg text-success">{x[1]}%</b></div><p className="mt-2 text-[10px] text-muted-foreground">{x[0]}</p></div>)}</div></Panel><Panel title="近30日人员进出场走势" className="relative"><MiniLegend items={[{label:"实际在场",color:"var(--primary)"},{label:"计划用工",color:"var(--success)"}]}/><LineTrend data={month}/></Panel></div><DataTable title="人员进出闸机记录明细" headers={["照片","姓名","工种","班组","体温","进出时间","闸机号","健康码"]} rows={[["张","张建国","钢筋工","钢筋一班","36.4℃","09:42 进场","北门02","绿码"],["刘","刘海峰","电焊工","机电二班","36.5℃","09:39 进场","东门01","绿码"],["王","王明","架子工","架子三班","36.3℃","09:36 离场","北门01","绿码"],["赵","赵志强","木工","木工一班","36.6℃","09:30 进场","南门03","绿码"],["孙","孙强","塔吊司机","机械班","36.2℃","09:21 进场","东门02","绿码"],["周","周林","电工","机电一班","36.5℃","09:18 进场","南门01","绿码"],["吴","吴勇","砼工","混凝土班","36.4℃","09:12 离场","北门03","绿码"],["郑","郑海","信号工","起重班","36.3℃","09:08 进场","东门01","绿码"]]}/></>;
 if(view==="safety") return <><DataTable title="隐患分类整改与责任联络台账" headers={["分类","隐患描述","责任人","联系电话","整改时限","状态"]} rows={[["高处作业","12F临边防护松动","周建华","138****6021","今日14:00","整改中"],["起重机械","吊钩防脱装置磨损","李国伟","137****3186","今日12:00","复查中"],["临时用电","配电箱门未上锁","赵明","139****4472","已完成","已闭环"],["消防管理","通道堆放材料","孙海","136****8210","今日16:00","整改中"]]}/><Panel title="风险责任网格"><div className="grid gap-2 sm:grid-cols-4">{[["东区主体","周建华","低风险"],["南侧基坑","赵明","重点巡查"],["机械作业区","李国伟","低风险"],["生活区","孙海","低风险"]].map((x,i)=><div key={x[0]} className="zone-cell rounded-sm p-3"><p className="text-xs">{x[0]}</p><p className="mt-2 text-[10px] text-muted-foreground">责任人 {x[1]}</p><span className={i===1?"text-[10px] text-warning":"text-[10px] text-success"}>{x[2]}</span></div>)}</div></Panel></>;
 if(view==="green") return <><div className="grid gap-3 xl:grid-cols-[.7fr_1.3fr]"><Panel title="实时风向风速罗盘"><div className="wind-compass relative mx-auto h-[220px] w-[220px] rounded-full border border-primary/35"><span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs">N</span><span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">S</span><span className="absolute left-2 top-1/2 text-xs">W</span><span className="absolute right-2 top-1/2 text-xs">E</span><div className="wind-needle absolute left-1/2 top-1/2 h-20 w-1 origin-bottom bg-primary shadow-[0_0_12px_var(--primary)]"/><div className="absolute inset-0 grid place-items-center"><div className="mt-16 text-center"><b className="font-mono text-xl text-primary">6.2m/s</b><p className="text-[10px] text-muted-foreground">东北风 42°</p></div></div></div></Panel><DataTable title="扬尘超标喷淋联动记录" headers={["时间","点位","触发值","联动设备","持续时长","结果"]} rows={[["09:31","南门站","PM10 82","雾炮01","8分钟","已恢复"],["08:46","堆场站","TSP 116","围挡东线","12分钟","已恢复"],["07:58","塔吊站","PM10 79","塔吊喷淋","6分钟","已恢复"],["06:32","车道站","TSP 121","洗车台","15分钟","已恢复"]]}/></div><Panel title="各楼层 / 标段微环境传感器分布"><div className="grid gap-2 sm:grid-cols-4">{[["1#楼 18F","24枚","全部在线"],["3#楼 12F","18枚","17在线"],["地下车库 B区","12枚","全部在线"],["材料堆场","8枚","全部在线"]].map((x,i)=><div key={x[0]} className="zone-cell rounded-sm p-3"><p className="text-xs">{x[0]}</p><b className="mt-2 block font-mono text-primary">{x[1]}</b><span className={i===1?"text-[9px] text-warning":"text-[9px] text-success"}>{x[2]}</span></div>)}</div></Panel></>;
 if(view==="equipment") return <><Panel title="各设备日运行工时"><CompactBars data={[{name:"TC-01",value:8.6},{name:"TC-03",value:9.2},{name:"SC-05",value:7.8},{name:"SC-08",value:8.3},{name:"XP-02",value:5.4},{name:"XP-06",value:6.1}]}/></Panel><DataTable title="特种设备运行与维保履历" headers={["设备编号","型号","司机姓名","最近维保","下次定检","运行状态"]} rows={[["TC-03","QTZ125","陈国梁","2026-09-18","2026-10-18","运行正常"],["SC-08","SC200/200","张伟","2026-09-16","2026-09-22","即将到期"],["TC-01","QTZ80","李忠强","2026-09-15","2026-10-15","运行正常"],["XP-06","ZLP-2.0","王海峰","2026-09-20","2026-10-20","运行正常"]]}/></>;
 if(view==="progress") {const q=[{t:"08.23",actual:96.2,plan:96},{t:"08.29",actual:97.1,plan:96},{t:"09.04",actual:98.3,plan:97},{t:"09.10",actual:97.8,plan:97},{t:"09.16",actual:98.6,plan:98},{t:"09.21",actual:98.9,plan:98}];return <><div className="grid gap-3 xl:grid-cols-2"><Panel title="关键节点倒计时看板"><div className="grid grid-cols-2 gap-2">{[["主体结构封顶","37天","10.28"],["幕墙样板验收","18天","10.09"],["机电隐检完成","63天","11.23"],["竣工联合验收","190天","03.30"]].map((x,i)=><div key={x[0]} className="zone-cell rounded-sm p-3"><p className="text-[10px] text-muted-foreground">{x[0]}</p><b className={cn("mt-1 block font-mono text-xl",i===1?"text-warning":"text-primary")}>{x[1]}</b><span className="text-[9px] text-muted-foreground">计划 {x[2]}</span></div>)}</div></Panel><Panel title="分部工程合格率排行"><div className="space-y-3">{[["地基基础",99.6],["主体结构",98.9],["机电安装",97.4],["建筑防水",96.8],["装饰装修",95.9]].map(x=><ProgressRow key={x[0] as string} label={x[0] as string} value={x[1] as number}/>)}</div></Panel></div><Panel title="近30日检验批合格趋势" className="relative"><MiniLegend items={[{label:"实际合格率",color:"var(--primary)"},{label:"目标线",color:"var(--success)"}]}/><LineTrend data={q}/></Panel><DataTable title="分部工程检验批质量验收台账" headers={["检验批名称","所属部位","验收规范","抽检点数","合格率","验收结论"]} rows={[["墙柱钢筋安装","3#楼12F","GB50204-2015","48","100%","验收通过"],["梁板模板安装","2#楼15F","GB50204-2015","36","97.2%","验收通过"],["地下室防水层","车库B区","GB50208-2011","32","96.9%","整改复验"],["给排水管道","1#楼8F","GB50242-2002","28","100%","验收通过"]]}/></>}
 if(view==="video") {const cams=Array.from({length:16},(_,i)=>[`CAM-${String(i+1).padStart(3,"0")}`,i<4?["东区塔吊","主体结构面","大门地磅","危险基坑"][i]:`${(i%4)+1}#楼 ${6+i}F`,i===11?"信号波动":"在线",`${25+(i%2)*5} FPS`]);return <><Panel title="16 路摄像头在线状态" meta="15 在线 · 1 波动"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{cams.map((x,i)=><div key={x[0]} className="zone-cell flex items-center justify-between rounded-sm p-2.5"><div><p className="font-mono text-[10px] text-primary">{x[0]}</p><p className="mt-1 text-[9px] text-muted-foreground">{x[1]} · {x[3]}</p></div><StatusDot status={i===11?"warn":"ok"}/></div>)}</div></Panel><DataTable title="视频监控点位与 AI 智能抓拍明细" headers={["摄像机编号","安装位置","分辨率","AI分析算法","最近抓拍事件","推流状态"]} rows={[["CAM-001","东区塔吊作业面","4K","安全帽/越界","09:42 未戴安全帽","推流正常"],["CAM-018","3#楼主体结构","2K","反光衣/烟火","09:31 未穿反光衣","推流正常"],["CAM-032","大门地磅通道","4K","人脸/车辆","09:26 陌生车辆","推流正常"],["CAM-047","危险基坑","2K","越界/跌倒","08:58 人员靠近","推流正常"]]}/></>}
 return <><Panel title="月度主材消耗与预算对比"><div className="grid gap-4 md:grid-cols-2">{[["钢筋",82,"1,268t / 1,550t"],["水泥",74,"896t / 1,210t"],["商砼",91,"5,460m³ / 6,000m³"],["砂石料",68,"2,180t / 3,200t"]].map(x=><div key={x[0]}><div className="mb-2 flex justify-between text-xs"><span>{x[0]}</span><span className="font-mono text-muted-foreground">{x[2]} · {x[1]}%</span></div><div className="h-2 bg-muted"><div className="h-full bg-primary shadow-[0_0_8px_var(--primary)]" style={{width:`${x[1]}%`}}/></div></div>)}</div></Panel><DataTable title="实时地磅称重出入库自动计重台账" headers={["磅单号","方向","材料","毛重","皮重","净重","车牌","时间","状态"]} rows={[["WB-0921-036","入库","HRB400钢筋","58.42t","15.74t","42.68t","浙A·6K82Q","09:38","自动入库"],["WB-0921-035","出库","周转模板","36.20t","14.82t","21.38t","浙B·8P21M","09:26","已放行"],["WB-0921-034","入库","P.O42.5水泥","46.98t","15.74t","31.24t","浙B·3M19P","09:12","自动入库"],["WB-0921-033","入库","机制砂","62.56t","15.74t","46.82t","皖C·2L76H","08:15","待复检"]]}/></>;
}

const views: Record<ViewId, () => React.ReactNode> = { overview: Overview, people: People, safety: Safety, green: Green, equipment: Equipment, progress: ProgressView, video: VideoView, materials: Materials };

export function SiteCommandCenter() {
  const [view, setView] = useState<ViewId>("overview");
  const active = useMemo(() => NAV_ITEMS.find(item => item.id === view) ?? NAV_ITEMS[0], [view]);
  const View = views[view];
  return <main className="command-center min-h-screen bg-background text-foreground"><img src={siteBackdrop} width={1920} height={1024} alt="数字孪生智慧工地全景" className="site-backdrop"/><div className="tech-grid"/>
    <header className="topbar fixed inset-x-0 top-0 z-50 flex h-[88px] items-stretch border-b border-border px-3 backdrop-blur-xl"><div className="flex w-[285px] shrink-0 items-center gap-3 border-r border-border pr-3"><div className="brand-mark grid h-10 w-10 shrink-0 place-items-center rounded-md"><Construction className="h-5 w-5 text-primary"/></div><div className="min-w-0"><h1 className="text-sm font-bold leading-5 text-foreground">智慧工地数字化<br/>综合监管平台</h1><p className="mt-1 flex items-center gap-1 text-[9px] text-success"><StatusDot/>滨江智慧新城 · 09:42:18</p></div></div><nav className="top-modules flex min-w-0 flex-1 items-stretch overflow-x-auto pl-2">{NAV_ITEMS.map((item,i)=><Button key={item.id} variant="ghost" onClick={()=>setView(item.id)} className={cn("nav-module relative h-full min-w-[92px] flex-1 flex-col gap-1 rounded-none px-2",view===item.id&&"nav-active")}><item.icon className="h-4 w-4"/><span className="text-[11px] font-medium">{item.label}</span><small className="text-[8px] font-normal text-muted-foreground">{item.sub}</small>{(i===2||i===7)&&<span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[8px] text-destructive-foreground">{i===2?12:4}</span>}</Button>)}</nav></header>
    <div className="relative z-10 px-3 pb-8 pt-[104px] lg:px-5"><div className="mx-auto max-w-[1880px]"><div className="mb-3 flex items-end justify-between"><div><p className="text-[10px] text-primary">COMMAND / {active.id.toUpperCase()}</p><h2 className="mt-1 text-xl font-bold text-foreground">{active.label}<span className="ml-2 text-xs font-normal text-muted-foreground">{active.sub}</span></h2></div><div className="hidden items-center gap-4 font-mono text-[10px] text-muted-foreground sm:flex"><span className="text-success">● 数据链路正常</span><span>2026-09-21 MON · 09:42:18</span></div></div><div className="space-y-3 animate-fade-in" key={view}><View/><SupplementalContent view={view}/></div></div></div>
  </main>;
}