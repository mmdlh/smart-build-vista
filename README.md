# Smart Site Command

## Execution Instruction
Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

## User Request
做一个智慧工地管理平台，包含8个一级菜单：
- **视觉与风格设计**：
  - 深蓝色科技风背景，浅蓝与深蓝为主色调，搭配工地/数字建造风格的纹理背景或网格微光效果。
  - 卡片采用毛玻璃半透明效果（Glassmorphism），搭配流光渐变边框（border glow/gradient）与 hover 浮起微动效。
  - 顶部固定导航栏，左侧大标题（如“智慧工地数字化综合监管平台”）+ 右侧图标导航菜单，导航栏同样具备玻璃质感与状态高亮。
  - 数据具有立体感和色彩冲击力（青蓝、荧光绿、告警橙/红等高对比度科技配色），整体炫酷、现代、具备科技大屏与中后台控制中心的双重视效。

- **8个一级菜单与差异化布局内容**：
  1. **综合看板 / 项目大屏**：核心KPI指标卡、实时动态告警轮播、多维度综合雷达图、趋势折线图、现场态势分布。
  2. **劳务人员管理**：在场实时人数、工种分布饼图、考勤打卡趋势柱状图、人员进出闸机记录表格、特种作业持证状态指示器。
  3. **安全隐患监控**：AI抓拍违规统计、隐患级别漏斗/饼图、未穿反光衣/未戴安全帽告警事件流、安全巡检整改进度表。
  4. **绿色施工与环境监测**：PM2.5/PM10/TSP实时数值仪表盘与24小时走势折线图、噪声分贝柱状图、温湿度风速卡片、雾炮喷淋联动状态。
  5. **特种设备运行**：塔吊倾角/风速/载荷监测、升降机运行轨迹、设备健康度雷达图、设备维保与检验台账表格。
  6. **进度与质量把控**：计划与实际进度对比图、关键里程碑节点甘特视图/卡片、质量检验合格率统计、缺陷整改闭环状态流。
  7. **现场视频巡检**：多路监控视频网格模拟、摄像头点位状态、云台控制模拟界面、AI异常行为抓拍回放列表。
  8. **物资材料管理**：钢筋/水泥/混凝土进场地磅过磅称重记录、库存消耗趋势、预警指示器、供应商供货排行表格。

- **图表规范**：
  - 所有折线图及折线/柱状混合图，图例（legend）统一放置在图表顶部（如 `legend: { top: 10, ... }`），并保留充足的 `grid.top` 间距以防与图表内容重叠。
  - 图表适配深色背景，tooltip、坐标轴和网格线样式契合科技风格。

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://smart-build-vista.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/32bed07b-aba9-421a-ab11-46c65f719cdc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
