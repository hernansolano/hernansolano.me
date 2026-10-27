import profileData from '../content/profile.json';
import projectsData from '../content/projects.json';
import experienceData from '../content/experience.json';
import educationData from '../content/education.json';
import skillsData from '../content/skills.json';
import languagesData from '../content/languages.json';

export type Locale = 'en' | 'es';

export interface Profile {
  name: string;
  title: string;
  description: string;
  about: string;
  email: string;
  resumePath?: string;
  social: {
    github: string;
    linkedin: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imagePath: string;
  githubLink: string;
  liveLink: string;
  category?: string;
  year?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  status?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  details: string;
}

export interface Skills {
  frontend: string[];
  backend: string[];
  tools: string[];
}

export interface LanguageLevel {
  language: string;
  level: string;
}

export function getProfile(locale: Locale): Profile {
  return profileData[locale];
}

export function getProjects(locale: Locale): Project[] {
  return projectsData[locale];
}

export function getExperience(locale: Locale): Experience[] {
  return experienceData[locale];
}

export function getEducation(locale: Locale): Education[] {
  return educationData[locale];
}

export function getSkills(locale: Locale): Skills {
  return skillsData[locale];
}

export function getLanguages(locale: Locale): LanguageLevel[] {
  return languagesData[locale];
}
