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
  return <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={gridTop}><CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="t" {...axis} /><YAxis {...axis} /><Tooltip contentStyle={tooltipStyle} /><g className="recharts-default-legend" data-top={legendTop.top} />{lines.map((l) => <Line key={l.key} dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />)}</LineChart></ResponsiveContainer>;
}

const MiniLegend = ({ items }: { items: Array<{ label: string; color: string }> }) => <div className="absolute left-4 top-11 z-10 flex flex-wrap gap-4 text-[10px] text-muted-foreground">{items.map((item) => <span key={item.label} className="flex items-center gap-1.5"><i className="h-0.5 w-4" style={{ backgroundColor: item.color }} />{item.label}</span>)}</div>;

function Donut({ data }: { data: Array<{ name: string; value: number }> }) {
  const colors = ["var(--primary)", "var(--success)", "var(--warning)", "var(--chart-4)", "var(--destructive)"];
  return <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="48%" outerRadius="72%" paddingAngle={3}>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer>;
}

function Overview() {
  const radar = [{ k: "安全", v: 96 }, { k: "进度", v: 87 }, { k: "质量", v: 92 }, { k: "环境", v: 83 }, { k: "劳务", v: 95 }, { k: "设备", v: 89 }];
  return <>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="今日在场人数" value="1,286" unit="人" delta="较昨日 ↑ 8.2%" icon={Users} /><Kpi label="设备在线率" value="98.6" unit="%" delta="运行设备 142 台" icon={Cpu} tone="green" /><Kpi label="今日告警" value="17" unit="条" delta="待处理 3 条" icon={AlertTriangle} tone="orange" /><Kpi label="总体施工进度" value="72.4" unit="%" delta="领先计划 2.1%" icon={Activity} tone="cyan" /></div>
    <div className="grid gap-3 xl:grid-cols-[1.15fr_1.8fr_1fr]">
      <Panel title="项目综合评分" meta="实时评估" className="h-[310px]"><ResponsiveContainer width="100%" height="250"><RadarChart data={radar}><PolarGrid stroke="var(--chart-grid)" /><PolarAngleAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><Radar dataKey="v" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} /></RadarChart></ResponsiveContainer></Panel>
      <Panel title="项目总体趋势" meta="今日 08:00—18:00" className="relative h-[310px]"><MiniLegend items={[{ label: "实时人数", color: "var(--primary)" }, { label: "计划人数", color: "var(--success)" }]} /><div className="h-[250px]"><LineTrend /></div></Panel>
      <Panel title="实时动态告警" meta="17 条"><div className="space-y-2">{[["未佩戴安全帽", "东区 3#楼", "09:42", "danger"], ["扬尘指数偏高", "南门监测点", "09:31", "warn"], ["塔吊载荷接近阈值", "T-03 塔吊", "09:18", "warn"], ["人员越界进入", "材料堆场", "08:56", "danger"]].map((x) => <div key={x[2]} className="alert-row flex items-center gap-3 rounded-sm px-3 py-2.5"><StatusDot status={x[3] as "warn" | "danger"} /><div className="min-w-0 flex-1"><p className="truncate text-xs text-foreground">{x[0]}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{x[1]}</p></div><time className="font-mono text-[10px] text-muted-foreground">{x[2]}</time></div>)}</div></Panel>
    </div>
    <Panel title="现场态势分布" meta="数字孪生 · 实时"><div className="grid gap-3 md:grid-cols-4">{[["A 区主体结构", "施工中", "76%"], ["B 区机电安装", "施工中", "54%"], ["C 区材料堆场", "正常", "89%"], ["D 区生活区", "正常", "100%"]].map((x, i) => <div key={x[0]} className="zone-cell rounded-sm border border-border/60 p-3"><div className="flex justify-between"><span className="text-xs text-foreground">{x[0]}</span><StatusDot status={i < 2 ? "warn" : "ok"} /></div><p className="mt-3 text-[10px] text-muted-foreground">{x[1]}</p><div className="mt-2 h-1 overflow-hidden bg-muted"><div className="h-full bg-primary" style={{ width: x[2] }} /></div></div>)}</div></Panel>
  </>;
}

const records = [
  ["张建国", "钢筋工", "北门 02", "09:42:08", "进场"], ["刘海峰", "电焊工", "东门 01", "09:39:26", "进场"], ["王明", "架子工", "北门 01", "09:36:51", "离场"], ["赵志强", "木工", "南门 03", "09:30:14", "进场"], ["陈伟", "信号工", "北门 02", "09:26:03", "进场"],
];

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
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="今日 AI 抓拍" value="91" unit="次" delta="自动识别率 98.2%" icon={Camera} tone="orange" /><Kpi label="待整改隐患" value="12" unit="项" delta="重大隐患 1 项" icon={AlertTriangle} tone="red" /><Kpi label="今日已闭环" value="47" unit="项" delta="平均用时 1.8h" icon={ShieldCheck} tone="green" /><Kpi label="连续安全生产" value="186" unit="天" delta="目标 365 天" icon={HardHat} /></div><div className="grid gap-3 xl:grid-cols-[1fr_1.4fr_1fr]"><Panel title="违规类型统计" className="h-[320px]"><Donut data={violations} /></Panel><Panel title="AI 违规事件流"><div className="grid grid-cols-2 gap-2">{["未佩戴安全帽", "未穿反光衣", "危险区域闯入", "临边防护缺失"].map((x, i) => <div key={x} className="capture-tile relative h-28 overflow-hidden rounded-sm border border-border"><div className="scan-line" /><Camera className="absolute left-3 top-3 h-4 w-4 text-primary" /><div className="absolute inset-x-0 bottom-0 bg-background/80 p-2 backdrop-blur-sm"><p className="text-[11px] text-foreground">{x}</p><p className="text-[9px] text-muted-foreground">CAM-{String(i + 3).padStart(2,"0")} · 09:{42-i*7}</p></div></div>)}</div></Panel><Panel title="隐患级别"><div className="space-y-3 pt-2">{[["重大隐患",1,"danger"],["较大隐患",4,"warn"],["一般隐患",7,"ok"]].map(x => <div key={x[0] as string} className="flex items-center justify-between border-b border-border/50 pb-3"><span className="flex items-center gap-2 text-xs text-muted-foreground"><StatusDot status={x[2] as "ok"|"warn"|"danger"}/>{x[0]}</span><span className="font-mono text-xl text-foreground">{x[1]}</span></div>)}</div></Panel></div><DataTable title="安全巡检整改进度" headers={["隐患编号","位置","责任单位","期限","进度"]} rows={[["AQ-0921-017","3#楼 12F","中建劳务一队","今日 14:00","整改中 80%"],["AQ-0921-013","塔吊 T-03","设备维保组","今日 12:00","复查中"],["AQ-0921-009","南侧基坑","基础施工组","已完成","已闭环"],["AQ-0920-046","生活区 2F","后勤保障组","已完成","已闭环"]]} /></>;
}

function Green() {
  const env = trend.map((x,i)=>({...x, pm25:[27,31,38,43,34,29][i] ?? 0, pm10:[52,56,68,75,61,54][i] ?? 0, tsp:[71,78,91,106,89,76][i] ?? 0}));
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="PM2.5" value="34" unit="μg/m³" delta="空气质量：优" icon={Wind} tone="green" /><Kpi label="PM10" value="61" unit="μg/m³" delta="低于预警值 39%" icon={CloudCog} /><Kpi label="TSP" value="89" unit="μg/m³" delta="趋势平稳" icon={Gauge} tone="orange" /><Kpi label="环境综合指数" value="92" unit="分" delta="优于 86% 项目" icon={Leaf} tone="green" /></div><div className="grid gap-3 xl:grid-cols-[1.8fr_1fr]"><Panel title="24 小时颗粒物走势" meta="自动站 #01" className="relative h-[330px]"><MiniLegend items={[{label:"PM2.5",color:"var(--success)"},{label:"PM10",color:"var(--primary)"},{label:"TSP",color:"var(--warning)"}]} /><div className="h-[270px]"><LineTrend data={env} lines={[{key:"pm25",name:"PM2.5",color:"var(--success)"},{key:"pm10",name:"PM10",color:"var(--primary)"},{key:"tsp",name:"TSP",color:"var(--warning)"}]} /></div></Panel><Panel title="气象状态"><div className="grid grid-cols-2 gap-2">{[["温度","26.4°C"],["湿度","62%RH"],["风速","2.8m/s"],["风向","东北风"]].map(x=><div key={x[0]} className="zone-cell rounded-sm p-3"><p className="text-[10px] text-muted-foreground">{x[0]}</p><p className="mt-2 font-mono text-lg text-foreground">{x[1]}</p></div>)}</div><div className="mt-3 flex items-center justify-between rounded-sm border border-success/30 bg-success/5 p-3"><span className="flex items-center gap-2 text-xs text-foreground"><StatusDot />雾炮喷淋联动</span><span className="font-mono text-xs text-success">AUTO · ON</span></div></Panel></div><Panel title="噪声监测" className="h-[250px]"><ResponsiveContainer width="100%" height="190"><BarChart data={trend.map((x,i)=>({...x,db:[54,58,62,69,65,57][i]}))} margin={{...gridTop,top:20}}><CartesianGrid stroke="var(--chart-grid)" vertical={false}/><XAxis dataKey="t" {...axis}/><YAxis {...axis}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="db" name="噪声 dB" fill="var(--primary)" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></Panel></>;
}

function Equipment() {
  const health=[{k:"结构",v:94},{k:"电气",v:88},{k:"制动",v:96},{k:"传动",v:91},{k:"润滑",v:85},{k:"通讯",v:98}];
  return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="设备在线" value="42/43" unit="台" delta="在线率 97.7%" icon={Radio}/><Kpi label="塔吊当前载荷" value="4.62" unit="t" delta="额定载荷 8.0t" icon={Construction} tone="green"/><Kpi label="实时风速" value="6.2" unit="m/s" delta="允许作业" icon={Wind}/><Kpi label="维保待办" value="3" unit="项" delta="1 项即将逾期" icon={Wrench} tone="orange"/></div><div className="grid gap-3 xl:grid-cols-[1.5fr_1fr_1fr]"><Panel title="塔吊实时监测"><div className="relative grid h-[240px] place-items-center"><div className="gauge-ring grid h-40 w-40 place-items-center rounded-full"><div className="text-center"><p className="font-mono text-3xl font-bold text-primary">57.8%</p><p className="mt-1 text-[10px] text-muted-foreground">当前载荷率</p></div></div><div className="absolute bottom-1 flex w-full justify-around text-center text-[10px] text-muted-foreground"><span>倾角<br/><b className="font-mono text-foreground">0.18°</b></span><span>幅度<br/><b className="font-mono text-foreground">42.6m</b></span><span>高度<br/><b className="font-mono text-foreground">68.2m</b></span></div></div></Panel><Panel title="设备健康度" className="h-[300px]"><ResponsiveContainer width="100%" height="240"><RadarChart data={health}><PolarGrid stroke="var(--chart-grid)"/><PolarAngleAxis dataKey="k" tick={{fill:"var(--muted-foreground)",fontSize:10}}/><Radar dataKey="v" stroke="var(--success)" fill="var(--success)" fillOpacity={.2}/></RadarChart></ResponsiveContainer></Panel><Panel title="升降机运行轨迹"><div className="lift-shaft relative mx-auto h-[230px] w-20 border-x border-border"><div className="absolute inset-x-2 bottom-[42%] h-10 border border-primary bg-primary/15 shadow-[0_0_16px_var(--primary)]"/><div className="absolute -right-20 bottom-[44%] font-mono text-xs text-primary">12F · ↑</div>{[0,25,50,75,100].map(x=><i key={x} className="absolute left-0 h-px w-full bg-border" style={{bottom:`${x}%`}}/>)}</div></Panel></div><DataTable title="设备维保与检验台账" headers={["设备编号","设备类型","本次检验","下次维保","状态"]} rows={[["TC-03","塔式起重机","2026-09-18","2026-09-25","运行正常"],["SC-08","施工升降机","2026-09-16","2026-09-22","即将到期"],["TC-01","塔式起重机","2026-09-15","2026-09-28","运行正常"],["GD-12","高支模监测","2026-09-20","2026-10-02","运行正常"]]}/></>;
}

function ProgressView() {
 const pd=trend.map((x,i)=>({...x,plan:[45,52,59,65,70,76][i] ?? 0,actual:[44,51,58,64,72,78][i] ?? 0}));
 return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="工期倒计时" value="186" unit="天" delta="计划竣工 2027-03-26" icon={CalendarRange} tone="orange"/><Kpi label="总体进度" value="72.4" unit="%" delta="领先计划 2.1%" icon={Activity}/><Kpi label="本月完成产值" value="3,842" unit="万元" delta="完成率 106.7%" icon={Gauge} tone="green"/><Kpi label="质量验收合格率" value="98.6" unit="%" delta="首检合格 96.2%" icon={ShieldCheck} tone="green"/></div><div className="grid gap-3 xl:grid-cols-[1.7fr_1fr]"><Panel title="计划 / 实际进度对比" className="relative h-[330px]"><MiniLegend items={[{label:"计划进度",color:"var(--muted-foreground)"},{label:"实际进度",color:"var(--primary)"}]}/><div className="h-[270px]"><LineTrend data={pd} lines={[{key:"plan",name:"计划进度",color:"var(--muted-foreground)"},{key:"actual",name:"实际进度",color:"var(--primary)"}]}/></div></Panel><Panel title="质量指标"><div className="space-y-5 pt-2">{[["钢筋工程",99],["混凝土工程",98],["防水工程",96],["机电安装",94]].map(x=><ProgressRow key={x[0] as string} label={x[0] as string} value={x[1] as number}/>)}</div></Panel></div><Panel title="关键里程碑"><div className="grid gap-3 md:grid-cols-4">{[["地下室封顶","已完成","08.16",100],["主体结构封顶","进行中","10.28",72],["幕墙工程完成","待开始","12.15",18],["竣工验收","待开始","03.30",0]].map((x,i)=><div key={x[0] as string} className="relative border-l-2 border-primary/40 pl-4"><span className={cn("absolute -left-[5px] top-0 h-2 w-2 rounded-full",i===0?"bg-success":"bg-primary")}/><p className="text-xs text-foreground">{x[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">{x[1]} · {x[2]}</p><div className="mt-4 h-1 bg-muted"><div className="h-full bg-primary" style={{width:`${x[3]}%`}}/></div></div>)}</div></Panel></>;
}

function VideoView() {
 const [active,setActive]=useState(0);
 return <div className="grid gap-3 xl:grid-cols-[1fr_320px]"><div><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{["东区塔吊作业面","3#楼主体结构","南门人员通道","材料加工区"].map((x,i)=><button key={x} onClick={()=>setActive(i)} className={cn("video-feed group relative h-52 overflow-hidden rounded-md border text-left",active===i?"border-primary shadow-[0_0_18px_var(--primary-glow)]":"border-border")}><div className="scan-line"/><span className="absolute left-3 top-3 flex items-center gap-2 text-[10px] text-success"><StatusDot/> LIVE · CAM-{i+1}</span><Camera className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary/50"/><div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/80 p-3 backdrop-blur-sm"><span className="text-xs text-foreground">{x}</span><Maximize2 className="h-3.5 w-3.5 text-muted-foreground"/></div></button>)}</div></div><div className="space-y-3"><Panel title="云台控制"><div className="grid place-items-center"><div className="grid h-32 w-32 grid-cols-3 grid-rows-3 gap-1">{["↖","↑","↗","←","●","→","↙","↓","↘"].map(x=><Button key={x} variant="ghost" size="icon" className="h-auto w-auto border border-border bg-muted/40 text-primary hover:bg-primary/10">{x}</Button>)}</div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline">变焦 +</Button><Button size="sm" variant="outline">变焦 −</Button></div></div></Panel><Panel title="AI 异常回放"><div className="space-y-2">{["人员闯入警戒区","未佩戴安全帽","车辆逆向行驶"].map((x,i)=><div key={x} className="flex items-center gap-3 border-b border-border/50 py-2"><div className="grid h-10 w-14 place-items-center bg-muted"><Video className="h-4 w-4 text-primary"/></div><div><p className="text-[11px] text-foreground">{x}</p><p className="text-[9px] text-muted-foreground">09:{38-i*9} · {12+i*3}s</p></div></div>)}</div></Panel></div></div>;
}

function Materials() {
 const stock=trend.map((x,i)=>({...x,in:[42,58,31,72,55,61][i],out:[28,39,45,52,62,48][i],balance:[480,499,485,505,498,511][i]}));
 return <><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><Kpi label="今日进场" value="486.2" unit="吨" delta="12 车次已过磅" icon={Truck}/><Kpi label="库存总值" value="2,846" unit="万元" delta="周转率 78.6%" icon={Boxes} tone="green"/><Kpi label="低库存预警" value="4" unit="类" delta="钢筋 HRB400 告警" icon={AlertTriangle} tone="orange"/><Kpi label="供应商履约率" value="96.4" unit="%" delta="本月准时 81 批" icon={ShieldCheck}/></div><div className="grid gap-3 xl:grid-cols-[1.7fr_1fr]"><Panel title="库存进出与结余趋势" className="relative h-[330px]"><MiniLegend items={[{label:"入库",color:"var(--primary)"},{label:"出库",color:"var(--success)"},{label:"库存结余",color:"var(--warning)"}]}/><ResponsiveContainer width="100%" height="270"><ComposedChart data={stock} margin={gridTop}><CartesianGrid stroke="var(--chart-grid)" vertical={false}/><XAxis dataKey="t" {...axis}/><YAxis {...axis}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="in" name="入库" fill="var(--primary)"/><Bar dataKey="out" name="出库" fill="var(--success)"/><Line dataKey="balance" name="库存结余" stroke="var(--warning)" strokeWidth={2} dot={false}/></ComposedChart></ResponsiveContainer></Panel><Panel title="库存预警"><div className="space-y-3">{[["HRB400 钢筋","低于安全库存","danger"],["P.O 42.5 水泥","剩余 2.8 天","warn"],["C35 混凝土","供应正常","ok"],["铝合金模板","供应正常","ok"]].map(x=><div key={x[0]} className="flex items-center justify-between rounded-sm bg-muted/40 p-3"><div><p className="text-xs text-foreground">{x[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">{x[1]}</p></div><StatusDot status={x[2] as "ok"|"warn"|"danger"}/></div>)}</div></Panel></div><DataTable title="地磅过磅称重记录" headers={["磅单号","材料","供应商","净重","状态"]} rows={[["WB-0921-032","HRB400 钢筋","华东钢材","42.68t","已验收"],["WB-0921-031","P.O 42.5 水泥","海螺水泥","31.24t","已验收"],["WB-0921-030","C35 混凝土","城建商砼","28.60t","已入库"],["WB-0921-029","机制砂","鑫源建材","46.82t","已验收"]]}/></>;
}

const views: Record<ViewId, () => React.ReactNode> = { overview: Overview, people: People, safety: Safety, green: Green, equipment: Equipment, progress: ProgressView, video: VideoView, materials: Materials };

export function SiteCommandCenter() {
  const [view, setView] = useState<ViewId>("overview");
  const active = useMemo(() => NAV_ITEMS.find(item => item.id === view) ?? NAV_ITEMS[0], [view]);
  const View = views[view];
  return <main className="command-center min-h-screen bg-background text-foreground"><img src={siteBackdrop} width={1920} height={1024} alt="数字孪生智慧工地全景" className="site-backdrop"/><div className="tech-grid"/>
    <header className="topbar fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border px-4 backdrop-blur-xl lg:px-7"><div className="flex min-w-0 items-center gap-3"><div className="brand-mark grid h-9 w-9 shrink-0 place-items-center rounded-md"><Construction className="h-5 w-5 text-primary"/></div><div className="min-w-0"><h1 className="truncate text-sm font-bold tracking-normal text-foreground sm:text-lg">智慧工地数字化综合监管平台</h1><p className="hidden font-mono text-[9px] text-primary/80 sm:block">SMART CONSTRUCTION · DIGITAL COMMAND CENTER</p></div></div><div className="flex items-center gap-1.5"><Button variant="ghost" size="icon" className="text-muted-foreground" title="搜索"><Search/></Button><Button variant="ghost" size="icon" className="relative text-muted-foreground" title="告警通知"><Bell/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive"/></Button><div className="ml-2 hidden items-center gap-2 border-l border-border pl-3 md:flex"><span className="text-right"><b className="block text-xs font-medium">滨江智慧新城项目</b><small className="text-[9px] text-success">● 系统运行正常</small></span><div className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs text-primary">管</div></div></div></header>
    <nav className="side-nav fixed bottom-0 left-0 top-16 z-40 hidden w-[190px] border-r border-border p-3 backdrop-blur-xl lg:block"><p className="px-3 py-3 text-[9px] font-medium text-muted-foreground">业务中心 · MODULES</p><div className="space-y-1">{NAV_ITEMS.map(item=><Button key={item.id} variant="ghost" onClick={()=>setView(item.id)} className={cn("h-12 w-full justify-start gap-3 px-3 text-left",view===item.id&&"nav-active")}><item.icon className="h-4 w-4"/><span><b className="block text-xs font-medium">{item.label}</b><small className="block text-[9px] font-normal text-muted-foreground">{item.sub}</small></span>{view===item.id&&<ChevronRight className="ml-auto h-3 w-3"/>}</Button>)}</div><div className="absolute inset-x-3 bottom-4 rounded-md border border-border bg-muted/30 p-3"><p className="flex items-center gap-2 text-[10px] text-success"><StatusDot/>数据链路正常</p><p className="mt-2 font-mono text-[9px] text-muted-foreground">LAST SYNC 09:42:18</p></div></nav>
    <div className="fixed inset-x-0 top-16 z-30 overflow-x-auto border-b border-border bg-background/80 px-3 py-2 backdrop-blur-xl lg:hidden"><div className="flex min-w-max gap-1">{NAV_ITEMS.map(item=><Button key={item.id} size="sm" variant="ghost" onClick={()=>setView(item.id)} className={cn("gap-1.5 text-xs",view===item.id&&"nav-active")}><item.icon/>{item.label}</Button>)}</div></div>
    <div className="relative z-10 px-3 pb-8 pt-32 lg:ml-[190px] lg:px-5 lg:pt-20"><div className="mx-auto max-w-[1680px]"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] text-primary">COMMAND / {active.id.toUpperCase()}</p><h2 className="mt-1 text-xl font-bold text-foreground">{active.label}<span className="ml-2 text-xs font-normal text-muted-foreground">{active.sub}</span></h2></div><div className="hidden font-mono text-[10px] text-muted-foreground sm:block">2026-09-21 MON · 09:42:18</div></div><div className="space-y-3 animate-fade-in" key={view}><View/></div></div></div>
  </main>;
}