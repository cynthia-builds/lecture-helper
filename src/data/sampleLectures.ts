import { SampleLecture } from '../types';

export const SAMPLE_LECTURES: SampleLecture[] = [
  {
    id: 'tuition_centre',
    subject: 'Business Case Study',
    title: 'Tuition Centre: Excel through Commitment (Jean & Collins)',
    text: `Case Study: Tuition Centre – Excel through Commitment
Founders Jean and Collins were full-time school teachers for 35 years before establishing Excel Tutoring Centre near Jurong Point. The centre successfully enrolled 888 students in the last 24 months across 3 regional branches. However, staff turnover was approximately 30% over the last 24 months among senior tutors, leading to concerns over instructional consistency. More small boutique tuition centres and on-demand digital tutoring providers are appearing nearby offering flexible schedules. Operational overheads increased by 18%, while student re-enrollment dropped by 12% at the primary-to-secondary transition milestone. Jean and Collins must analyze changes in their external environment and improve organizational climate to retain employees and defend market share.`,
  },
  {
    id: 'opportunity_cost',
    subject: 'Economics 101',
    title: 'Opportunity Cost & Capital Allocation',
    text: `Now let's examine opportunity cost in corporate decision-making. When a firm faces budget scarcity and allocates $100,000 to automate assembly lines rather than launching a digital marketing campaign, the forgone prospective profit from marketing is the true economic opportunity cost. Remember that past equipment maintenance expenditures are sunk costs and must be strictly excluded from this forward-looking marginal calculation.`,
  },
  {
    id: 'cs-recursion',
    subject: 'Computer Science',
    title: 'Recursion & Base Cases',
    text: `When designing recursive algorithms, you must establish an invariant base case; otherwise, you inevitably trigger a stack overflow error due to unbounded recursive descent. The function calls itself with a decomposed sub-problem until the terminal state is evaluated and the call stack unwinds.`,
  },
  {
    id: 'bio-cellular-respiration',
    subject: 'Biology',
    title: 'ATP & Cellular Energy',
    text: `During aerobic respiration, glucose undergoes glycolysis in the cytoplasm, followed by the citric acid cycle and oxidative phosphorylation across the inner mitochondrial membrane. The electron transport chain establishes a proton gradient, driving ATP synthase through chemiosmosis to generate the bulk of cellular ATP.`,
  },
  {
    id: 'psych-cognitive-dissonance',
    subject: 'Psychology',
    title: 'Cognitive Dissonance',
    text: `Leon Festinger posited that individuals experience psychological discomfort—termed cognitive dissonance—when holding contradictory cognitions or when their behavioral actions clash with established beliefs. Consequently, subjects exhibit rationalization mechanisms to restore cognitive equilibrium.`,
  },
];
