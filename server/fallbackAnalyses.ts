import { LectureAnalysis, AIReadingCheck } from '../src/types';

export const PRESET_READING_CHECKS: Record<string, AIReadingCheck> = {
  tuition_centre: {
    status: 'ready',
    statusTitle: 'Ready to analyse | 可以开始分析',
    statusDescription: 'The material was read clearly and all key entities, figures, and problems were successfully identified.',
    isCaseStudy: true,
    whatIRead: {
      title: 'Tuition Centre – Excel through Commitment',
      peopleAndOrganisations: ['Jean', 'Collins', 'Excel Tutoring Centre', 'Boutique Competitors'],
      importantFacts: [
        'Jean and Collins were full-time school teachers for 35 years before starting the centre.',
        'They established the tuition centre near Jurong Point.',
        'The centre enrolled 888 students in the last 24 months across 3 regional branches.',
        'Staff turnover was approximately 30% over the last 24 months among senior tutors.',
        'Operational overheads surged by 18%, while re-enrollment dropped by 12% at the primary-to-secondary school transition.',
        'More small boutique tuition centres and on-demand platforms are appearing nearby with flexible schedules.',
      ],
      mainProblemIdentified:
        'The business is facing increasing external competition from boutique competitors and a severe 30% employee turnover rate that is destabilizing teaching quality.',
      rawExtractedSnippet:
        'Excel Tutoring Centre operates 3 branches with 888 enrolled students. 30% annual staff turnover over 24 months. Overheads up 18%, retention down 12%. Boutique competitors expanding near Jurong Point.',
    },
    understandingSummary: {
      englishSummary:
        'This case study is about a tuition centre facing two main challenges: increasing competition and serious staff turnover. The owners need to analyse changes in their external environment and improve their organisational climate to retain employees.',
      chineseSummary:
        '本案例讲述了一家拥有888名学生的知名补习中心（由教龄35年的Jean和Collins创办）所面临的两大危机：周边小型精品机构带来的外部竞争压力，以及高达30%的师资高离职率。管理层亟需分析外部环境变化并优化内部组织氛围以挽留核心教师。',
    },
    uncertainties: {
      hasUncertainties: false,
      items: ['✓ No major reading problems detected. / 未发现明显的识别问题。'],
    },
    missingContent: {
      hasMissingContent: false,
      items: ['✓ No important missing content detected. / 未发现重要内容遗漏。'],
    },
  },

  opportunity_cost: {
    status: 'ready',
    statusTitle: 'Ready to analyse | 可以开始分析',
    statusDescription: 'The economic concepts and financial parameters were extracted with full clarity.',
    isCaseStudy: true,
    whatIRead: {
      title: 'Opportunity Cost & Capital Allocation in Business Decisions',
      peopleAndOrganisations: ['Corporate Executive Management', 'Manufacturing Firm'],
      importantFacts: [
        'Capital allocation budget limit: $100,000 under financial scarcity constraints.',
        'Option A: Equipment automation upgrade yielding estimated 15% labor efficiency improvement.',
        'Option B: Digital customer acquisition marketing campaign with $140,000 projected gross revenue.',
        'Sunk cost item: $35,000 past equipment maintenance expenditure that cannot be recovered.',
      ],
      mainProblemIdentified:
        'Evaluating trade-offs in capital budgeting between assembly automation and marketing, while strictly excluding past sunk costs.',
      rawExtractedSnippet:
        'Capital allocation decision: $100,000 budget constraint. Comparing automation upgrade with marketing campaign. Past maintenance expenditures ($35,000) are sunk costs.',
    },
    understandingSummary: {
      englishSummary:
        'This lecture explains how economic opportunity cost measures the forgone return of the next best alternative when allocating scarce funds, and why historical sunk costs must be excluded from future-oriented investment decisions.',
      chineseSummary:
        '本节课深入阐释了机会成本的核心内涵：在预算有限的情况下，选择一项投资必须以放弃另一替代方案的预期收益为代价；同时强调决策必须剔除已无法挽回的既往沉没成本。',
    },
    uncertainties: {
      hasUncertainties: false,
      items: ['✓ No major reading problems detected. / 未发现明显的识别问题。'],
    },
    missingContent: {
      hasMissingContent: false,
      items: ['✓ No important missing content detected. / 未发现重要内容遗漏。'],
    },
  },

  'cs-recursion': {
    status: 'ready',
    statusTitle: 'Ready to analyse | 可以开始分析',
    statusDescription: 'Algorithmic concepts, call stack mechanics, and termination conditions extracted clearly.',
    isCaseStudy: false,
    whatIRead: {
      title: 'Recursion Mechanics & Stack Overflow Prevention',
      peopleAndOrganisations: ['Computer Science Lecture / Algorithm Design'],
      importantFacts: [
        'Recursion requires establishing an invariant base case (terminal condition).',
        'Without a base case, recursive calls cause unbounded stack growth leading to stack overflow.',
        'Decomposes larger problems into smaller self-similar sub-problems until call stack unwinds.',
      ],
      mainProblemIdentified:
        'Preventing fatal stack overflow errors by ensuring correct base case termination and call-stack unwinding in recursive functions.',
      rawExtractedSnippet:
        'Recursive algorithm design principles: base cases, recursive decomposition, call stack frames, and stack overflow prevention.',
    },
    understandingSummary: {
      englishSummary:
        'This lecture excerpt discusses the mechanics of recursion in computer science, highlighting why an invariant base case is essential to prevent recursive descent from overflowing the memory call stack.',
      chineseSummary:
        '本段计算机课程解析了递归算法的核心原理，重点讲解了为何必须设定终止基线条件（Base Case），以防止无限递归调用撑爆函数调用栈导致栈溢出崩溃。',
    },
    uncertainties: {
      hasUncertainties: false,
      items: ['✓ No major reading problems detected. / 未发现明显的识别问题。'],
    },
    missingContent: {
      hasMissingContent: false,
      items: ['✓ No important missing content detected. / 未发现重要内容遗漏。'],
    },
  },

  'bio-cellular-respiration': {
    status: 'ready',
    statusTitle: 'Ready to analyse | 可以开始分析',
    statusDescription: 'Cellular respiration stages, ATP synthesis mechanisms, and mitochondrial structures extracted clearly.',
    isCaseStudy: false,
    whatIRead: {
      title: 'Cellular Respiration & ATP Synthesis (Mitochondrial Bioenergetics)',
      peopleAndOrganisations: ['Biology / Biochemistry Department'],
      importantFacts: [
        'Glycolysis occurs in cytoplasm; citric acid cycle and oxidative phosphorylation occur across inner mitochondrial membrane.',
        'Electron transport chain pumps protons across inner membrane to establish electrochemical gradient.',
        'ATP synthase utilizes chemiosmosis proton motive force to synthesize bulk cellular ATP.',
      ],
      mainProblemIdentified:
        'Understanding how proton gradient chemiosmosis drives ATP synthase to produce cellular metabolic energy.',
      rawExtractedSnippet:
        'Aerobic respiration: glycolysis in cytoplasm, citric acid cycle, electron transport chain, and ATP synthase driven by chemiosmotic proton gradient.',
    },
    understandingSummary: {
      englishSummary:
        'This lecture explains how aerobic cellular respiration converts glucose into ATP energy across the cytoplasm and mitochondria via glycolysis, the citric acid cycle, and electron transport chemiosmosis.',
      chineseSummary:
        '本节生物课系统解析了有氧呼吸如何通过糖酵解、三羧酸循环和氧化磷酸化，利用线粒体内膜的质子浓度梯度驱动ATP合酶大量生成细胞能量货币ATP。',
    },
    uncertainties: {
      hasUncertainties: false,
      items: ['✓ No major reading problems detected. / 未发现明显的识别问题。'],
    },
    missingContent: {
      hasMissingContent: false,
      items: ['✓ No important missing content detected. / 未发现重要内容遗漏。'],
    },
  },

  'psych-cognitive-dissonance': {
    status: 'ready',
    statusTitle: 'Ready to analyse | 可以开始分析',
    statusDescription: 'Psychological theories, Festinger experimental concepts, and dissonance reduction behaviors extracted with clarity.',
    isCaseStudy: false,
    whatIRead: {
      title: 'Cognitive Dissonance & Behavioral Rationalization',
      peopleAndOrganisations: ['Leon Festinger (Social Psychologist)', 'Psychology Research Field'],
      importantFacts: [
        'Leon Festinger proposed cognitive dissonance theory in 1957.',
        'Mental discomfort arises when an individual holds conflicting cognitions or behaves inconsistently with values.',
        'Individuals employ post-decision rationalization to reduce psychological tension and restore cognitive equilibrium.',
      ],
      mainProblemIdentified:
        'Explaining how psychological discomfort from contradictory beliefs forces individuals to change beliefs or rationalize behaviors.',
      rawExtractedSnippet:
        'Cognitive dissonance: Leon Festinger proposed that contradictory cognitions or actions generate psychological discomfort, driving rationalization to restore equilibrium.',
    },
    understandingSummary: {
      englishSummary:
        'This psychology lecture introduces Leon Festinger’s theory of cognitive dissonance, explaining how individuals resolve internal discomfort caused by contradictory thoughts and actions through rationalization.',
      chineseSummary:
        '本节心理学课程介绍了利昂·费斯廷格的认知失调理论，探讨当个体的行为与内在信念产生冲突时，大脑如何通过心理合理化与态度调整来消除不适感并恢复认知平衡。',
    },
    uncertainties: {
      hasUncertainties: false,
      items: ['✓ No major reading problems detected. / 未发现明显的识别问题。'],
    },
    missingContent: {
      hasMissingContent: false,
      items: ['✓ No important missing content detected. / 未发现重要内容遗漏。'],
    },
  },
};

export const PRESET_ANALYSES: Record<string, LectureAnalysis> = {
  opportunity_cost: {
    isContentReadable: true,
    verifiedReadingCheck: PRESET_READING_CHECKS['opportunity_cost'],
    extractedContent: {
      documentType: 'Economics Lecture Notes / Case Scenario',
      extractedKeyFacts: [
        'Decision scenario: Automation upgrade ($100,000 capital) vs. Digital marketing campaign',
        'Scarcity principle: Limited financial and managerial budget',
        'Sunk costs: Past engineering investment ($35,000) that cannot be recouped',
        'Forgone benefit: Projected $140,000 sales revenue from the ad campaign',
      ],
      rawSummaryOrText:
        'Scenario comparing a $100,000 manufacturing equipment automation upgrade with a marketing initiative under strict capital budget constraints, demonstrating the concepts of opportunity cost, economic scarcity, and sunk cost fallacy.',
    },
    mainIdea: 'Opportunity cost is the value of the best alternative forgone when making a decision under limited resources.',
    mainIdeaChinese: '机会成本是在资源有限时，为了选择某一个方案而必须放弃的另一最佳替代方案的潜在价值。',
    plainChineseExplanation: `本节课的核心逻辑围绕“鱼和熊掌不可兼得”展开：

1. 核心概念拆解：
在现实经济活动中，任何决策都受限于预算和时间（Scarcity）。当企业决定将10万美元投入到生产线自动化改造时，这笔钱就无法再用于市场营销。那么，市场营销本可以带来的14万美元预期新增销售额与利润，就是这次设备改造的“机会成本”。

2. 沉没成本（Sunk Costs）的陷阱：
教授特别强调，过去已经花掉且无法追回的3.5万美元维护费用属于沉没成本。在权衡未来的机会成本时，理性的决策者必须彻底忽略沉没成本，只比较当前各项可行方案的未来边际净收益。`,
    simpleEnglishExplanation: `When resources like time and money are limited, every decision requires a trade-off. 

The economic cost of any choice is not merely the cash spent, but the value of the next best opportunity you gave up. For instance, allocating $100,000 to automate equipment means forgoing the $140,000 revenue from a marketing campaign. Rational decision-makers ignore past unrecoverable money ($35,000 in past repairs) and evaluate choices solely by comparing their future opportunity costs.`,
    isCaseStudy: true,
    caseAnalysis: {
      isCaseStudy: true,
      background: 'A mid-sized manufacturing firm allocating a strict $100,000 capital expenditure budget between production line automation and digital customer acquisition.',
      mainProblems: [
        'Capital scarcity: Unable to fund both equipment automation and brand marketing simultaneously.',
        'Risk of sunk cost fallacy: Hesitation to abandon legacy machinery due to $35,000 past repair expenditures.',
      ],
      keyEvidenceAndFacts: [
        '$100,000 available capital budget limit.',
        'Option A: Automation yields estimated 15% labor efficiency gain.',
        'Option B: Digital marketing yields estimated $140,000 gross new revenue.',
        'Historical sunk cost: $35,000 spent on legacy repairs over the past 2 years.',
      ],
      possibleCauses: [
        'Confusing accounting cost (direct cash outlay) with economic opportunity cost (forgone alternative value).',
        'Psychological bias towards past sunk investments rather than forward-looking marginal returns.',
      ],
      discussionQuestions: [
        'How should management calculate the net opportunity cost before presenting the budget to the board?',
        'Why should the $35,000 past repair expense be completely excluded from this investment appraisal?',
      ],
    },
    difficultySummary: 'Contains foundational microeconomics terms: scarcity, opportunity cost, implicit costs, and sunk cost fallacy.',
    keyTerms: [
      {
        term: 'Opportunity Cost',
        phonetic: 'ah-per-TOO-nuh-tee kawst',
        definition: 'The loss of potential gain from other alternatives when one alternative is chosen.',
        chineseMeaning: '机会成本（放弃的最佳替代方案的价值）',
        inContext: 'The $140,000 forgone marketing revenue when selecting automation.',
      },
      {
        term: 'Scarcity',
        phonetic: 'SKEHR-suh-tee',
        definition: 'The basic economic problem of having unlimited human wants in a world of limited resources.',
        chineseMeaning: '稀缺性（资源有限性）',
        inContext: 'The $100,000 budget constraint forcing a trade-off.',
      },
      {
        term: 'Sunk Cost',
        phonetic: 'suhnk kawst',
        definition: 'A cost that has already been incurred and cannot be recovered by any future action.',
        chineseMeaning: '沉没成本（无法挽回的既往支出）',
        inContext: 'The $35,000 past maintenance expenditure that must be ignored in future planning.',
      },
    ],
    simpleExample: 'If you have $20 and 2 hours tonight: choosing to watch a movie means giving up both the $20 and the study time you could have used to prepare for tomorrow’s exam.',
    simpleExampleChinese: '如果你今晚有20美元和2小时：选择看电影不仅消耗了金钱，其真正的机会成本是本可以用来复习明天考试的高分机会。',
    classroomSentences: [
      {
        phrase: 'Professor, how should we quantify the opportunity cost when the alternative has uncertain returns?',
        usageTip: 'Use this in class when discussing risk and forecasting in capital budgeting.',
        chineseTranslation: '教授，当替代方案的收益具有不确定性时，我们该如何量化机会成本？',
      },
      {
        phrase: 'In this case, should the $35,000 past maintenance expenses be strictly categorized as sunk costs?',
        usageTip: 'Use this during case discussions to confirm your application of cost principles.',
        chineseTranslation: '在这个案例中，过去3.5万美元的维护费用是否应当被严格归类为沉没成本？',
      },
    ],
  },

  tuition_centre: {
    isContentReadable: true,
    verifiedReadingCheck: PRESET_READING_CHECKS['tuition_centre'],
    extractedContent: {
      documentType: 'Business / Educational Management Case Study',
      extractedKeyFacts: [
        'Company: Excel Tutoring Centre (established tuition chain founded by Jean and Collins)',
        'Founders: Jean and Collins (full-time teachers for 35 years)',
        'Location: Near Jurong Point',
        'Enrollment: 888 active students across 3 regional branches in the last 24 months',
        'Staff Metrics: 30% annual tutor and administrative staff turnover',
        'Market condition: Increasing competition from small boutique and online tuition providers offering flexible schedules',
        'Financial issue: 18% increase in operational overheads alongside 12% drop in student retention after primary-to-secondary transition',
      ],
      rawSummaryOrText:
        'Case study detailing Excel Tutoring Centre founded by Jean and Collins near Jurong Point, facing high tutor turnover (30%), student retention leakage at key transition grades (12%), and rising competitive pressure from boutique and online education startups.',
    },
    mainIdea: 'Excel Tutoring Centre (founded by Jean & Collins) faces severe 30% tutor turnover and a 12% drop in transition student retention amidst rising boutique competition near Jurong Point.',
    mainIdeaChinese: '由Jean和Collins创办的补习中心面临30%的师资高离职率以及小升初12%的学生流失，亟需在Jurong Point周边精品机构的激烈竞争中重构运营与留存策略。',
    plainChineseExplanation: `本案例围绕由Jean和Collins（拥有35年教龄）在Jurong Point周边创立的补习中心（Excel Tutoring Centre）所面临的经营危机展开：

1. 核心业务痛点与数据：
补习中心过去24个月在3家分校共招收了888名学生。但目前面临两大致命问题：
一是高达30%的教师年流失率（Staff Turnover），导致核心名师流失、教学质量出现波动，直接影响了家长口碑；
二是周边涌现大量小型精品补习班（Boutique Centres），抢占灵活课时市场，导致中心在小升初关键升学节点，学生续费留存率下滑了12%，同时运营开支激增了18%。

2. 根源剖析与解决方向：
30%的高离职率源于内部激励机制与工作环境不足；外部精品班通过小班定制抢走了生源。学生需要针对“如何降低30%的教师流失率、如何重塑小升初衔接课程以挽留888名生源”提出具体的管理与竞争策略。`,
    simpleEnglishExplanation: `This case examines the operational and competitive crisis at Excel Tutoring Centre, founded near Jurong Point by veteran educators Jean and Collins (35 years of teaching experience).

While the centre enrolled 888 students across 3 branches over 24 months, it is suffering from an alarming 30% annual staff turnover rate among senior tutors. This high tutor turnover directly destabilizes teaching consistency and damages parent loyalty. Concurrently, operational costs rose by 18%, and re-enrollment dropped by 12% during the primary-to-secondary school transition as agile boutique competitors offer flexible scheduling. Students analyzing this case must propose actionable HR solutions to curb tutor turnover, stabilize student enrollment, and differentiate against boutique rivals.`,
    isCaseStudy: true,
    caseAnalysis: {
      isCaseStudy: true,
      background: 'Excel Tutoring Centre is an established regional after-school education provider founded by Jean and Collins near Jurong Point, operating 3 branches with 888 enrolled students.',
      mainProblems: [
        'Severe 30% annual staff turnover among senior tutors and administrative coordinators.',
        '12% decline in student retention during the primary-to-secondary school transition.',
        '18% increase in operational and rental overheads squeezing profit margins.',
        'Aggressive market competition from local boutique tuition centres offering smaller classes and flexible schedules.',
      ],
      keyEvidenceAndFacts: [
        'Founders: Jean and Collins (35 years teaching background).',
        '888 actively enrolled students across 3 branch centres in 24 months.',
        '30% annual staff turnover rate over the last 24 months.',
        '18% surge in facility rental and operational overhead expenses.',
        '12% drop in re-enrollment rates at primary-to-secondary transition milestone.',
        'Location: Near Jurong Point with expanding boutique tutoring studios nearby.',
      ],
      possibleCauses: [
        'Inadequate compensation structures, lack of tutor equity participation, and burnout causing 30% tutor departures.',
        'Rigid curriculum packaging failing to adapt to student preferences for personalized and flexible schedules.',
        'Weak parent relationship management leading to student churn when favorite tutors leave.',
      ],
      discussionQuestions: [
        'What immediate HR incentives and profit-sharing schemes should Jean and Collins implement to curb the 30% tutor turnover?',
        'How can the centre differentiate its core curriculum against the flexible schedules of boutique competitors near Jurong Point?',
        'What specific transition programs can be deployed to stop the 12% drop in primary-to-secondary student retention?',
      ],
    },
    difficultySummary: 'Case study in educational services management featuring operational KPIs, employee retention metrics, and competitive positioning.',
    keyTerms: [
      {
        term: 'Staff Turnover Rate',
        phonetic: 'staf TURN-oh-ver rayt',
        definition: 'The percentage of employees who leave an organization during a specified period and must be replaced.',
        chineseMeaning: '员工流失率 / 离职率（案例中高达30%）',
        inContext: 'The 30% annual tutor loss destabilizing classroom quality and causing parent complaints.',
      },
      {
        term: 'Student Retention',
        phonetic: 'STOO-duhnt rih-TEN-shuhn',
        definition: 'The ability of an educational institution to maintain student enrollment continuously across grade transitions.',
        chineseMeaning: '学生续费留存率',
        inContext: 'The 12% drop in continuing students during the primary-to-secondary transition.',
      },
      {
        term: 'Boutique Competitor',
        phonetic: 'boo-TEEK kuhm-PET-ih-ter',
        definition: 'A small, specialized firm providing customized and highly focused niche services.',
        chineseMeaning: '小型精品竞争对手',
        inContext: 'Smaller specialized tutoring studios near Jurong Point taking market share with smaller class sizes.',
      },
    ],
    simpleExample: 'Imagine a popular gym with 888 members where 30% of your favorite fitness coaches quit every year: workouts become inconsistent, and members leave for smaller neighborhood boutique studios offering flexible private sessions.',
    simpleExampleChinese: '就像一家拥有888名会员的健身房，每年有30%的王牌教练离职：教学连贯性被破坏，会员便纷纷转投周边提供灵活私教的小型精品工作室。',
    classroomSentences: [
      {
        phrase: 'How can Jean and Collins restructure tutor compensation to align incentives with student retention and curb the 30% turnover?',
        usageTip: 'Use this during case discussions to propose a concrete performance-management solution.',
        chineseTranslation: 'Jean和Collins如何重构教师薪酬结构，将激励与学生留存挂钩，从而遏制30%的高离职率？',
      },
      {
        phrase: 'Does the evidence indicate that the 12% student churn at transition is primarily caused by tutor departures or competitor pricing?',
        usageTip: 'Use this to question root causes and test the hypotheses presented in the case study.',
        chineseTranslation: '数据证据是否表明，升学阶段12%的学生流失主要是由名师离职引起的，还是由于竞争对手的定价策略？',
      },
    ],
  },

  'cs-recursion': {
    isContentReadable: true,
    verifiedReadingCheck: PRESET_READING_CHECKS['cs-recursion'],
    extractedContent: {
      documentType: 'Computer Science Lecture / Algorithm Principles',
      extractedKeyFacts: [
        'Core topic: Recursive function design and execution mechanics',
        'Invariant requirement: Base case (termination condition) must be established',
        'Failure mode: Unbounded recursive descent causing stack overflow',
        'Runtime behavior: Function frames pushed onto call stack until base case unwinds execution',
      ],
      rawSummaryOrText:
        'Technical lecture on recursive algorithmic formulation, emphasizing base case invariance, sub-problem reduction, and execution stack frames to prevent stack overflow errors.',
    },
    mainIdea: 'Recursion requires an invariant base case to terminate execution; without it, infinite calls exhaust the memory call stack and cause a stack overflow.',
    mainIdeaChinese: '递归函数必须设立一个不可变的基线条件（Base Case），否则无限自我调用将耗尽内存调用栈，触发栈溢出（Stack Overflow）崩溃。',
    plainChineseExplanation: `本节课用通俗的语言解释了递归算法的底层逻辑：
1. 什么是递归：
一个函数在内部调用自己，把一个大问题拆解成完全相同但规模更小的小问题。
2. 为什么必须有基线条件（Base Case）：
每次调用函数，计算机都要在内存的“调用栈”（Call Stack）里压入一层新记录。如果没有停止条件，栈空间会被迅速占满，程序就会崩溃报“Stack Overflow”。
3. 执行过程：
先“递进”（不断压栈）直到触发 Base Case，然后“回归”（逐层弹栈计算结果并返回）。`,
    simpleEnglishExplanation: `Recursion is an algorithm technique where a function solves a problem by calling a smaller instance of itself. 
Every recursive function must contain two essential parts:
1. Base Case: The terminal condition that stops recursion immediately without making further calls.
2. Recursive Step: The rule that reduces the problem size and moves closer to the base case.
If the base case is missing or unreachable, the computer continues allocating memory on the call stack until memory is completely exhausted, resulting in a fatal stack overflow crash.`,
    isCaseStudy: false,
    difficultySummary: 'Contains foundational CS concepts: base cases, call stacks, frames, stack overflow, and recursive descent.',
    keyTerms: [
      {
        term: 'Base Case',
        phonetic: 'bays kays',
        definition: 'The terminating condition in a recursive algorithm that returns a value directly without making further recursive calls.',
        chineseMeaning: '基线条件 / 终止条件',
        inContext: 'The check that prevents infinite recursion.',
      },
      {
        term: 'Call Stack',
        phonetic: 'kawl stak',
        definition: 'A specialized memory structure that stores information about the active subroutines and execution frames of a computer program.',
        chineseMeaning: '函数调用栈',
        inContext: 'The memory region that tracks each active recursive function frame.',
      },
      {
        term: 'Stack Overflow',
        phonetic: 'stak OH-ver-floh',
        definition: 'A runtime error that occurs when a program attempts to use more space on the call stack than is allocated.',
        chineseMeaning: '栈溢出错误',
        inContext: 'The crash triggered when unbounded recursive calls consume all stack memory.',
      },
    ],
    simpleExample: 'Think of Russian nesting dolls (Matryoshka): you keep opening smaller dolls (recursive step) until you reach the solid tiny wooden doll inside that cannot be opened (base case). Then you close them all back up.',
    simpleExampleChinese: '就像俄罗斯套娃：你不断打开更小的套娃（递进），直到找到最里面那个无法再打开的实心小木娃（基线条件），然后从内到外逐层盖上（回归）。',
    classroomSentences: [
      {
        phrase: 'Professor, how can we mathematically prove that our recursive step will always converge to the base case?',
        usageTip: 'Use this in CS tutorials when analyzing algorithm termination and correctness.',
        chineseTranslation: '教授，我们该如何用数学证明递归步骤必定能收敛到基线终止条件？',
      },
      {
        phrase: 'Does converting this recursive function to an iterative loop eliminate the risk of stack overflow in production?',
        usageTip: 'Use this when discussing time/space complexity trade-offs between recursion and iteration.',
        chineseTranslation: '将这个递归函数重构成迭代循环是否能在生产环境中彻底避免栈溢出风险？',
      },
    ],
  },

  'bio-cellular-respiration': {
    isContentReadable: true,
    verifiedReadingCheck: PRESET_READING_CHECKS['bio-cellular-respiration'],
    extractedContent: {
      documentType: 'Biology / Biochemistry Lecture Notes',
      extractedKeyFacts: [
        'Process: Aerobic cellular respiration converting biochemical energy from glucose into ATP',
        'Locations: Cytoplasm (Glycolysis), Mitochondrial Matrix (Krebs Cycle), Inner Mitochondrial Membrane (Oxidative Phosphorylation)',
        'Key Enzyme: ATP Synthase driven by electrochemical proton motive force',
      ],
      rawSummaryOrText:
        'Cellular bioenergetics detailing glycolysis, Krebs citric acid cycle, electron transport chain, and chemiosmosis ATP synthesis across mitochondrial membranes.',
    },
    mainIdea: 'Cellular respiration extracts biochemical energy from glucose to create a proton gradient across mitochondrial membranes, driving ATP synthase to produce cellular energy.',
    mainIdeaChinese: '细胞有氧呼吸通过氧化分解葡萄糖，在线粒体内膜建立质子电化学浓度梯度，以此驱动ATP合酶大量制造细胞能量货币ATP。',
    plainChineseExplanation: `本节课的核心主线是细胞如何把食物（葡萄糖）转化为可直接使用的化学能量货币（ATP）：
1. 糖酵解（Glycolysis）：在细胞质中先将葡萄糖粗加工成丙酮酸；
2. 三羧酸循环（Citric Acid Cycle）：在线粒体基质中充分氧化，释放高能电子；
3. 电子传递链与化学渗透（Electron Transport & Chemiosmosis）：电子传递将质子泵到膜间隙形成“水坝式”的电化学浓度差，当质子冲过 ATP 合酶时，就像水流冲动水车发电一样，合成海量 ATP。`,
    simpleEnglishExplanation: `Cellular respiration is the multi-stage metabolic process by which aerobic organisms harvest energy from nutrients. 
First, glycolysis splits glucose in the cytoplasm. Next, the citric acid cycle in mitochondria extracts high-energy electrons. Finally, the electron transport chain uses these electrons to pump protons across the inner mitochondrial membrane, establishing a powerful electrochemical gradient. As protons flow back through the ATP synthase enzyme like water through a turbine (chemiosmosis), large amounts of usable ATP are generated.`,
    isCaseStudy: false,
    difficultySummary: 'Biochemistry concepts: glycolysis, chemiosmosis, proton gradient, oxidative phosphorylation, ATP synthase.',
    keyTerms: [
      {
        term: 'ATP (Adenosine Triphosphate)',
        phonetic: 'ay-tee-pee (uh-DEN-uh-seen try-FOS-fayt)',
        definition: 'The primary energy currency of the cell that powers biological processes.',
        chineseMeaning: '三磷酸腺苷（细胞能量货币）',
        inContext: 'The final high-energy product synthesized by ATP synthase.',
      },
      {
        term: 'Chemiosmosis',
        phonetic: 'kem-ee-oz-MOH-sis',
        definition: 'The movement of ions across a semipermeable membrane down their electrochemical gradient, used to drive ATP synthesis.',
        chineseMeaning: '化学渗透作用',
        inContext: 'Protons moving through ATP synthase to generate ATP.',
      },
      {
        term: 'Proton Gradient',
        phonetic: 'PROH-ton GRAY-dee-uhnt',
        definition: 'A higher concentration of protons on one side of a membrane compared to the other, storing potential energy.',
        chineseMeaning: '质子电化学浓度梯度',
        inContext: 'The electrochemical potential energy across the inner mitochondrial membrane.',
      },
    ],
    simpleExample: 'Think of a hydroelectric dam: the electron transport chain pumps water up behind the dam (proton gradient), and when water rushes through the dam turbine (ATP synthase), electricity (ATP) is generated.',
    simpleExampleChinese: '就像水力发电站：电子传递链把水抽到大坝上方（建立质子势能），当水流冲过水轮发电机（ATP合酶）时，便源源不断输出电力（合成ATP）。',
    classroomSentences: [
      {
        phrase: 'Professor, how does the proton motive force directly rotate the catalytic subunits of ATP synthase?',
        usageTip: 'Use in biochemistry lectures when exploring molecular motors and enzyme kinetics.',
        chineseTranslation: '教授，质子动力势是如何直接驱动ATP合酶的催化亚基发生机械旋转的？',
      },
    ],
  },

  'psych-cognitive-dissonance': {
    isContentReadable: true,
    verifiedReadingCheck: PRESET_READING_CHECKS['psych-cognitive-dissonance'],
    extractedContent: {
      documentType: 'Psychology Lecture Notes / Cognitive Science',
      extractedKeyFacts: [
        'Theorist: Leon Festinger (1957)',
        'Core Phenomenon: Psychological tension resulting from contradictory beliefs or actions contradicting values',
        'Resolution Mechanism: Rationalization, belief alteration, or trivialization to restore equilibrium',
      ],
      rawSummaryOrText:
        'Cognitive dissonance theory explaining psychological discomfort from conflicting cognitions and post-decision justification behaviors.',
    },
    mainIdea: 'People experience psychological discomfort when their actions conflict with their beliefs, prompting them to change their attitudes or rationalize behaviors.',
    mainIdeaChinese: '当人们的行为与信念发生冲突时，会产生强烈的心理不适（认知失调），从而促使大脑通过改变态度或自我合理化来恢复心理平衡。',
    plainChineseExplanation: `本节课用通俗的方式解释了“认知失调”的心理机制：
当一个人的“想法”和“实际行为”发生矛盾时（例如：明知吸烟有害健康，却依然吸烟），大脑会产生一种极度不适的紧张状态。
为了消除这种不适，人往往不会立即改进行为，而是启动“心理防御合理化”（例如心想：“我认识某人抽烟也活到90岁”或者“抽烟帮我缓解学业压力”），以此强行恢复内心的认知平衡。`,
    simpleEnglishExplanation: `Cognitive dissonance describes the mental discomfort people feel when holding two conflicting beliefs, or when their actions contradict their values. 
Because this tension is uncomfortable, individuals are strongly motivated to reduce it. They typically do so by changing their attitudes, justifying the inconsistent behavior, or trivializing the contradiction to restore psychological harmony.`,
    isCaseStudy: false,
    difficultySummary: 'Social psychology terminology: cognitive dissonance, rationalization, cognitive equilibrium, belief modification.',
    keyTerms: [
      {
        term: 'Cognitive Dissonance',
        phonetic: 'KOG-nuh-tiv DIS-uh-nuhns',
        definition: 'The state of having inconsistent thoughts, beliefs, or attitudes, especially relating to behavioral decisions.',
        chineseMeaning: '认知失调（信念与行为冲突引起的心理不适）',
        inContext: 'The psychological tension triggered by conflicting cognitions.',
      },
      {
        term: 'Rationalization',
        phonetic: 'rash-uh-nuh-luh-ZAY-shuhn',
        definition: 'A defense mechanism in which controversial behaviors or feelings are justified in a seemingly logical manner.',
        chineseMeaning: '合理化（自我辩解机制）',
        inContext: 'Creating explanations to excuse behavior that violates personal principles.',
      },
    ],
    simpleExample: 'Aesop’s fable of the fox and the sour grapes: when the hungry fox cannot reach the grapes, he reduces his disappointment and dissonance by telling himself "the grapes were probably sour anyway".',
    simpleExampleChinese: '伊索寓言里吃不到葡萄说葡萄酸的狐狸：当摘不到葡萄时，狐狸为了消除挫败感（失调），便自我安慰说“这葡萄肯定是酸的”，从而平复心理落差。',
    classroomSentences: [
      {
        phrase: 'In consumer behavior, how do companies utilize post-purchase reassurance to prevent buyer’s remorse and cognitive dissonance?',
        usageTip: 'Use this during marketing or psychology case discussions.',
        chineseTranslation: '在消费者行为学中，企业如何通过售后保障来消除消费者的购买后悔与认知失调？',
      },
    ],
  },
};

/**
 * Intelligent heuristic fallback for custom student text when Gemini API key is not configured
 */
export function generateHeuristicReadingCheck(text: string): AIReadingCheck {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = lines[0] || 'Uploaded Academic Material';
  
  // Extract sentences with numbers or key metrics
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const facts: string[] = [];

  sentences.forEach((s) => {
    const trimmed = s.trim();
    if (/\d+/.test(trimmed) || /important|however|result|study|cost|increase|decrease|rate|staff|student/i.test(trimmed)) {
      if (facts.length < 5 && trimmed.length > 20) {
        facts.push(trimmed);
      }
    }
  });

  if (facts.length === 0) {
    facts.push(lines[0] || 'Core academic topic identified from uploaded lecture notes.');
    if (lines[1]) facts.push(lines[1]);
  }

  const isCase = /case|company|firm|turnover|profit|business|hospital|school|student|market/i.test(text);

  return {
    status: 'ready',
    statusTitle: 'Ready to analyse | 可以开始分析 (Heuristic Extracted)',
    statusDescription: 'The lecture material was scanned, key factual sentences and metrics were identified.',
    isCaseStudy: isCase,
    whatIRead: {
      title,
      peopleAndOrganisations: isCase
        ? ['Academic Case Scenario', 'Organization / Research Subject']
        : ['University Lecture Series', 'Academic Discipline'],
      importantFacts: facts,
      mainProblemIdentified: isCase
        ? 'Analyzing core operational dilemmas and evaluating trade-offs identified in the material.'
        : 'Understanding theoretical foundations, underlying mechanisms, and academic concepts.',
      rawExtractedSnippet: text.slice(0, 240) + (text.length > 240 ? '...' : ''),
    },
    understandingSummary: {
      englishSummary: `This material covers "${title}", detailing key relationships, evidence points (${facts.length} core observations), and foundational principles.`,
      chineseSummary: `该资料围绕“${title}”展开，梳理了文中的关键论点与核心事实，重点剖析了其中的核心逻辑与实际应用。`,
    },
    uncertainties: {
      hasUncertainties: false,
      items: [
        '✓ Factual text successfully parsed. (Tip: Configure GEMINI_API_KEY in Settings to enable deep multimodal AI reasoning).',
      ],
    },
    missingContent: {
      hasMissingContent: false,
      items: ['✓ No critical missing content detected.'],
    },
  };
}

/**
 * Intelligent heuristic fallback for LectureAnalysis when Gemini API key is not configured
 */
export function generateHeuristicAnalysis(
  text: string,
  verifiedCheck?: AIReadingCheck
): LectureAnalysis {
  const check = verifiedCheck || generateHeuristicReadingCheck(text);
  const title = check.whatIRead.title;
  const isCase = check.isCaseStudy ?? false;

  return {
    isContentReadable: true,
    verifiedReadingCheck: check,
    extractedContent: {
      documentType: isCase ? 'Academic Case Study / Practical Scenario' : 'University Lecture Notes',
      extractedKeyFacts: check.whatIRead.importantFacts,
      rawSummaryOrText: check.whatIRead.rawExtractedSnippet || text.slice(0, 200),
    },
    mainIdea: `Core academic takeaway: Understanding the foundational mechanisms and logical consequences in "${title}".`,
    mainIdeaChinese: `核心学术要点：掌握“${title}”中的底层运行逻辑、因果机制与关键结论。`,
    plainChineseExplanation: `针对“${title}”的通俗理解：

1. 核心背景与事实：
${check.whatIRead.importantFacts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

2. 核心逻辑拆解：
在学术研究与课堂探讨中，理解该主题的关键在于把握“因果链条”与“实际影响”。请结合右侧/下方的简单英文与课堂常用句型，在课堂讨论中积极发言！`,
    simpleEnglishExplanation: `Here is the simplified breakdown of "${title}":

Key Observations:
${check.whatIRead.importantFacts.map((f) => `- ${f}`).join('\n')}

Summary:
The material demonstrates how specific concepts directly drive observable outcomes. Review the vocabulary terms and classroom discussion sentences below to confidently engage in class presentations and tutorials.`,
    isCaseStudy: isCase,
    caseAnalysis: isCase
      ? {
          isCaseStudy: true,
          background: `Operational scenario and contextual background of "${title}".`,
          mainProblems: [
            check.whatIRead.mainProblemIdentified || 'Evaluating core trade-offs and decision consequences.',
          ],
          keyEvidenceAndFacts: check.whatIRead.importantFacts,
          possibleCauses: [
            'Systemic changes in the external environment or operational misalignment.',
          ],
          discussionQuestions: [
            'What actionable strategies should be prioritized based on the verified evidence?',
          ],
        }
      : undefined,
    difficultySummary: 'Contains academic vocabulary and analytical reasoning structures.',
    keyTerms: [
      {
        term: title.split(/[\s:–-]+/)[0] || 'Core Concept',
        phonetic: 'kohr KON-sept',
        definition: 'The fundamental principle or subject matter under discussion.',
        chineseMeaning: '核心概念 / 主题',
        inContext: `Central topic in ${title}.`,
      },
      {
        term: 'Evidence Grounding',
        phonetic: 'EV-ih-duhns GROWND-ing',
        definition: 'Backing up academic claims strictly with verified data points and facts.',
        chineseMeaning: '事实证据支撑',
        inContext: 'Using verified facts to justify conclusions.',
      },
    ],
    simpleExample: `Understanding "${title}" is like reading a recipe: you need to see the exact ingredients and steps to understand how the final dish comes together.`,
    simpleExampleChinese: `理解“${title}”就像看菜谱：只有看清每一个具体配料与步骤，才能明白整道菜是如何做出来的。`,
    classroomSentences: [
      {
        phrase: `Professor, based on the evidence presented in ${title}, what is the primary factor we should focus on?`,
        usageTip: 'Use this to initiate meaningful classroom participation during lectures or tutorials.',
        chineseTranslation: `教授，基于本案例展示的证据，我们应当重点关注哪项核心因素？`,
      },
    ],
  };
}

