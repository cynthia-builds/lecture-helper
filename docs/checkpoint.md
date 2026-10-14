# Lecture Helper：实际检查记录

更新：充值后的真实调用和两页课件测试已完成，详见同目录 real-test-log.md。以下是充值前检查记录，保留作故障历史；“真实请求未成功”不再代表最新状态。

最新更新：已在原项目保存 server.ts 来源边界约束与 src/App.tsx 材料切换状态清理。固定预算课件阅读、解释以及文字/附件切换的最小回归已完成；解释首轮失败及第二次修正后的通过结果均记录于 real-test-log.md。未扩展到其他功能或全量测试。

检查日期：2026-10-14。沿用原 AI Studio 项目 5064ffd1-d840-4709-b839-350b6db3f924，未重建、未修改代码、未充值。

## 当前结果

真实 Gemini 请求已发出，但未成功。AI Studio 后端日志显示 `/api/check-reading` 在 `server.ts:175` 调用 Google GenAI SDK 时返回 402 RESOURCE_EXHAUSTED，消息为 “Your prepayment credits are depleted.”。历史记录中的 429 不能代表当前状态。

测试输入为人工编写的连通性短文，包含标记 LH-1014、水库初始 120 升、每分钟流入 9 升、流出 4 升、6 分钟后 150 升。不是实际课件，不计入真实课件评估。

## 已检查的实现

- 三个接口 `/api/check-reading`、`/api/explain-lecture`、`/api/ask-doubt` 均在 server.ts，均使用 `gemini-3.7-flash`。模型可用性尚未通过成功请求验证。
- dotenv 加载配置；密钥依次从 GEMINI_API_KEY、API_KEY、GOOGLE_API_KEY、GOOGLE_GENAI_API_KEY 读取。本次代码确实进入 SDK 调用；未读取或暴露密钥值，尚未核实采用哪个变量及所属计费项目。
- `/api/health` 仅检查是否有非空密钥，不验证余额或实际生成能力。
- 内置示例可直接返回预设答案，不能作为真实 API 成功证据。

## Bad Cases

### BC-001：真实 API 失败却显示可继续分析（已复现）

输入：上述连通性短文。预期：API 失败时明确提示服务不可用，不声称已完成 AI 阅读。实际：后端 402 后返回 HTTP 成功结构与 isHeuristic 标记；页面显示“Ready to analyse (Heuristic Extracted)”、无关键遗漏，并允许继续分析。规则内容还补出了输入未提供的 University Lecture Series / Academic Discipline。

必要修复：API 失败时返回清晰且脱敏的错误，禁止把规则内容作为已验证 AI 结果。三个接口均需检查；explain 的异常处理会返回规则解释，ask-doubt 的异常处理会返回通用回答。

### BC-002：关键词会绕过真实模型（代码检查发现，尚未用变体复现）

Reading Check 和 Explain 根据 recursion、base case、opportunity cost 等关键词返回固定答案，即使用户输入的是不同材料。必要修复：仅允许明确点击内置示例时使用对应预设，并清楚标明示例；用户自定义材料不应由主题关键词替换成固定结果。

## 待完成

1. 核实当前 key 所属项目及预付余额；任何充值均由用户决定并操作，预算约 US$5。
2. 余额可用后，用相同非预设短文完成一次真实生成，再验证其余接口。
3. 修复上述必要问题并回归验证。
4. 用实际课件完成评估，记录原始结果与修复证据；再完成 Demo、README 和真实简历描述。

目前没有成功生成证据、真实课件测试指标或可声称的质量提升比例。
