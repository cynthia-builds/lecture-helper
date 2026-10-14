# 简历与面试证据

## 中文简历描述（保守版）

**Lecture Helper｜面向国际学生的 AI 课件学习助手**

- 完成基于 React、Express 与 Gemini 的 Web Demo，串联课件读取、AI Reading Check、人工确认/纠正、双语解释及后续追问。
- 使用两张真实课程页图开展小规模测试，记录币种误判、无依据补全及材料切换残留等 Bad Cases；通过来源约束与状态清理完成针对性修复和最小回归。
- 验证人工纠正能够进入后续解释，保留修复前后真实记录，并明确预设/兜底、模型不确定性及测试覆盖边界。

## English resume version

**Lecture Helper — AI-assisted lecture comprehension Web demo**

- Built a Gemini-powered learning demo with a reading-verification step, user corrections, bilingual explanations, and follow-up questions for international students.
- Evaluated two real lecture-page images, documented unsupported currency assumptions and stale analysis across material changes, and implemented targeted prompt and state-management fixes with focused regression checks.
- Preserved before-and-after evidence and documented model limitations, preset/fallback behavior, and evaluation scope without claiming unmeasured accuracy or user impact.

以上描述用于本人确实能够解释、演示该项目的情况。实现过程中使用了 AI 编程工具；面试应如实说明工具协助，以及自己负责的需求判断、范围取舍、验收和理解。不要把工具完成的全部编码说成独立手写。

## 可讲的面试故事

### 为什么先 Reading Check？

直接生成流畅解释会掩盖课件读取错误。先把事实、数字与不确定性暴露给用户，给用户纠正入口，再进入解释。它是可检查的工作流，而不是零幻觉保证。

### 最有证据的失败案例

原页只写 $4M，首次中文输出成了美元。先通过人工纠正验证信息能传递到后续解释，再增加来源边界规则。回归时主动显示币种未注明并要求核对。解释回归第一轮还补出市场需求增长，进一步限定原因字段后才通过固定检查点。失败也保留，没有只挑成功输出。

### 区分模型与工程问题

补充不存在的币种是模型来源约束问题；更换文件后还能打开旧分析是前端状态问题。后者通过材料变化清理与请求版本保护处理，文字与附件切换通过真实 UI 验证。

### 成本和范围取舍

不用 Agent/RAG 堆复杂度。初测5次、修复回归3次 UI 生成请求；状态回归零模型调用。不声称这些数字是账单次数或用户指标。保留明确限制，选择结束功能开发。

## 不能说的结论

- 没有“准确率提升 X%”“节省学习时间 X%”“服务 X 名用户”证据。
- 不能说经过完整 PDF/PPT/音频、多用户或公开部署验收。
- 不能说消除幻觉、全部用例通过或达到生产级安全。
- 不能把 AI Studio 的示例/规则兜底当成 Gemini 实时成功。
- 本次是小规模真实材料评估，不是用户研究或正式 benchmark。
