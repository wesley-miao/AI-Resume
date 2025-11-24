export type Mode = 'domestic' | 'remote';
export type Gender = 'male' | 'female';
export type SkillStyle = 'tags' | 'lines';
export type TemplateId = 'classic' | 'modern' | 'minimal' | 'banner' | 'creative' | 'professional' | 'tech' | 'timeline' | 'corporate' | 'elegant';

export interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  dateRange: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  jobTitle: string;
  dateRange: string;
}

export interface ProjectExperience {
  id: string;
  name: string;
  dateRange: string;
  intro: string;
  responsibilities: string;
}

export interface ResumeData {
  mode: Mode;
  personalInfo: {
    name: string;
    avatar: string;
    banner?: string; // Added banner field
    jobTitle: string;
    yearsExp: string;
    gender: Gender;
    phone: string;
    email: string;
    location: string;
  };
  skills: {
    style: SkillStyle;
    list: string[];
    text: string;
  };
  education: Education[];
  work: WorkExperience[];
  projects: ProjectExperience[];
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  color: string;
}