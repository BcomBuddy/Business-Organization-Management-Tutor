import type { Lesson, Question, CaseScenario } from '../types/index';

export const seedData = {
  lessons: [
    {
      topic: "Planning in Management",
      objectives: [
        "Define planning and explain its importance",
        "Differentiate types of plans",
        "Describe MBO"
      ],
      contentBlocks: [
        {
          type: "text",
          value: "Planning sets objectives and decides actions in advance."
        },
        {
          type: "bullets",
          value: [
            "Reduces uncertainty",
            "Improves coordination", 
            "Sets measurable targets"
          ]
        },
        {
          type: "text",
          value: "Types: Strategic, Tactical, Operational, Contingency."
        },
        {
          type: "text", 
          value: "MBO: Joint goal setting between managers and employees with periodic review."
        },
        {
          type: "example",
          value: "College fest plan with goals, budget, and KPIs."
        }
      ],
      keyTerms: ["Objectives", "MBO", "Strategic Plan", "Operational Plan"],
      exitQuiz: [
        {
          type: "mcq",
          q: "Planning primarily deals with:",
          options: ["Staffing", "Future actions", "Control", "Leadership"],
          answer: "Future actions"
        },
        {
          type: "short", 
          q: "State two benefits of planning.",
          answer: "Reduces uncertainty; sets measurable targets"
        }
      ]
    },
    {
      topic: "Organizing Function",
      objectives: [
        "Understand the organizing process",
        "Explain delegation and decentralization",
        "Identify organizational structures"
      ],
      contentBlocks: [
        {
          type: "text",
          value: "Organizing involves arranging resources and activities to achieve objectives efficiently."
        },
        {
          type: "bullets",
          value: [
            "Division of work",
            "Authority-responsibility relationships",
            "Coordination mechanisms"
          ]
        },
        {
          type: "text",
          value: "Delegation: Transfer of authority from superior to subordinate."
        },
        {
          type: "example",
          value: "Department head delegates budget approval authority to team leads."
        }
      ],
      keyTerms: ["Delegation", "Span of Control", "Chain of Command", "Decentralization"],
      exitQuiz: [
        {
          type: "mcq",
          q: "What is the primary purpose of organizing?",
          options: ["Planning", "Resource arrangement", "Control", "Motivation"],
          answer: "Resource arrangement"
        }
      ]
    }
  ] as Lesson[],

  questions: [
    {
      type: "mcq",
      q: "Which plan deals with day-to-day activities?",
      options: ["Strategic", "Tactical", "Operational", "Contingency"],
      answer: "Operational",
      bloom: "Remember"
    },
    {
      type: "long",
      q: "Draft a 5-step plan to launch a campus café.",
      answer: "Market research, Business model, Permits, Setup, Launch",
      rubric: [
        "Clear goal & scope",
        "Actionable tasks", 
        "Resource allocation",
        "Relevant KPIs",
        "Feasible timeline"
      ],
      bloom: "Apply"
    },
    {
      type: "short",
      q: "What are the main benefits of delegation?",
      answer: "Reduces workload; develops subordinates; improves efficiency"
    },
    {
      type: "mcq",
      q: "MBO stands for:",
      options: ["Management By Objectives", "Management By Operations", "Management By Organization", "Management By Output"],
      answer: "Management By Objectives",
      bloom: "Remember"
    }
  ] as Question[],

  cases: [
    {
      id: "bakery_expansion_llp",
      title: "Bakery Expansion — Choosing a Legal Form", 
      scenario: "Profitable single-city bakery expanding to three cities with investors.",
      nodes: [
        {
          prompt: "Choose a structure:",
          options: [
            {
              label: "Sole Proprietorship",
              impact: "Unlimited liability; capital constraints.",
              score: 1
            },
            {
              label: "Partnership", 
              impact: "Shared control; unlimited liability for general partners.",
              score: 2
            },
            {
              label: "LLP",
              impact: "Limited liability; operational flexibility.", 
              score: 4
            },
            {
              label: "Joint Stock Company",
              impact: "Best for large capital; higher compliance overhead.",
              score: 3
            }
          ]
        }
      ],
      explain: "Consider risk, control, capital access, and compliance."
    }
  ] as CaseScenario[]
};