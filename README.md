# 代码酷 (echo.cool)

![Home](static/homepage.png)

- [https://www.echo.cool/](https://www.echo.cool/)

一个免费的编程语言 & 框架教程学习平台

## 主要内容

### 计算机科学基础
- 八股面试宝典（技术面试全攻略）
- 数据结构与算法
- 计算机网络
- 数据库与信息系统
- 操作系统
- 系统设计与验证（Lean）
- PRISM 概率模型检测器

### 编程语言与平台
- Python / Java / C / C++ / C# / JavaScript / TypeScript / Go / Swift / PHP

### 前端技术
- 微信小程序 / HTML / CSS / JavaScript / TypeScript / Next.js / React / Vue.js

### 后端技术
- Spring / Spring Cloud Alibaba / Django / Gin

### 可观测性 & 监控
- Alloy / Prometheus / Loki / Grafana / Jaeger / Zipkin / SkyWalking / OpenTelemetry

### 数据与 AI 技术
- Airflow / Drill / Hadoop / Spark / Pandas / PyTorch / TensorFlow / R

### 移动开发
- Swift / Android (Java & Kotlin)

### 操作系统
- CentOS / Ubuntu / Debian

### 数据库与数据存储
- SQL / MySQL / PostgreSQL / Elasticsearch / Cassandra / HBase / Hive

### 集成与部署
- Docker / Kubernetes / Git / Jenkins

### 中间件
- Nginx / Redis / Kafka / RocketMQ / RabbitMQ / Nacos / Seata / Sentinel / Eureka / Zookeeper

### 物联网
- Arduino / STM32 / 51 单片机

---

## 支持我们

喜欢这个项目吗？到 [GitHub](https://github.com/echo-cool-coding/cool-coding) 给我们点个 ⭐ 支持一下吧！

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=echo-cool-coding/cool-coding&type=Date)](https://www.star-history.com/#echo-cool-coding/cool-coding&Date)

## 微信公众号悬浮窗 / 弹窗

站点右下角的「关注公众号」悬浮窗和首次访问的二维码弹窗由 `src/components/WechatFollow` 渲染，
在 `src/theme/Layout/index.js` 中挂载。所有文案与行为都在 `docusaurus.config.js` 的
`customFields.wechat` 里配置：

| 字段 | 说明 |
| --- | --- |
| `enabled` | 是否启用整个功能 |
| `name` | 公众号名称，改名只需改这一项 |
| `description` | 一句话介绍 |
| `qrImage` | 二维码图片路径（相对 `static/`），替换 `static/img/wechat-qrcode.jpg` 即可换码 |
| `floatLabel` | 悬浮按钮文字 |
| `popupTitle` | 弹窗标题，`null` 时自动生成「关注「name」公众号」 |
| `popup.enabled` / `popup.delayMs` / `popup.dismissDays` | 是否自动弹窗、延迟毫秒数、关闭后多少天内不再弹 |
| `storageKey` | 记录「已关闭」的 localStorage 键名，`null` 时自动带上 `name`，因此改名后弹窗会重新展示一次 |

