import { ResumeData, TemplateConfig } from './types';

export const MALE_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
export const FEMALE_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka';

export const INITIAL_DATA: ResumeData = {
  mode: 'domestic',
  personalInfo: {
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    jobTitle: '测试工程师',
    yearsExp: '3年经验',
    gender: 'male',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    location: '北京'
  },
  skills: {
    style: 'tags',
    list: ['Python', 'Java', 'Selenium', 'PyTest', 'Jenkins', 'Docker', 'MySQL', 'Postman', 'JIRA'],
    text: '熟悉软件测试理论和方法，熟练使用Selenium进行自动化测试。\n掌握Python/Java编程语言，能够编写自动化测试脚本。\n熟悉CI/CD流程，具备Jenkins持续集成实践经验。'
  },
  education: [
    {
      id: 'edu-1',
      school: '北京理工大学',
      major: '软件工程',
      degree: '本科',
      dateRange: '2016.09 - 2020.06'
    }
  ],
  work: [
    {
      id: 'work-1',
      company: '某知名互联网公司',
      jobTitle: '中级测试工程师',
      dateRange: '2022.07 - 至今'
    },
    {
      id: 'work-2',
      company: '某科技初创企业',
      jobTitle: '软件测试工程师',
      dateRange: '2020.07 - 2022.06'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: '电商后台自动化测试框架',
      dateRange: '2023.01 - 2023.08',
      intro: '针对电商后台管理系统构建的自动化测试框架，旨在提高回归测试效率。',
      responsibilities: '基于Selenium+PyTest搭建UI自动化框架，覆盖核心业务流程。集成Jenkins实现每日构建和自动报告生成，回归测试时间缩短60%。'
    },
    {
      id: 'proj-2',
      name: '支付网关接口压测',
      dateRange: '2022.09 - 2022.12',
      intro: '双十一大促前对支付网关进行全链路压测，保障系统高并发下的稳定性。',
      responsibilities: '使用JMeter编写压测脚本，模拟高并发场景。分析性能瓶颈，协助开发优化数据库连接池配置，系统TPS提升30%。'
    }
  ]
};

export const TEMPLATES: TemplateConfig[] = [
  { id: 'classic', name: '经典商务', description: '传统稳重，清晰的上下结构', color: 'bg-blue-700' },
  { id: 'modern', name: '现代侧栏', description: '左深色侧栏，高对比度', color: 'bg-slate-800' },
  { id: 'minimal', name: '极简主义', description: '大量留白，注重排版', color: 'bg-gray-800' },
  { id: 'banner', name: '精英通栏', description: '顶部视觉冲击，双栏布局', color: 'bg-indigo-900' },
  { id: 'creative', name: '创意设计', description: '活泼配色，网格化布局', color: 'bg-teal-500' },
  { id: 'professional', name: '专业学术', description: '衬线字体，适合严谨行业', color: 'bg-emerald-800' },
  { id: 'tech', name: '极客技术', description: '代码风格，极客最爱', color: 'bg-zinc-900' },
  { id: 'timeline', name: '时光轨迹', description: '时间轴可视化，强调历程', color: 'bg-orange-600' },
  { id: 'corporate', name: '外企风范', description: '双栏结构，专业干练', color: 'bg-gray-600' },
  { id: 'elegant', name: '优雅质感', description: '精致衬线，极简排版', color: 'bg-rose-800' },
];