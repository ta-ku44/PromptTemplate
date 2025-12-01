export interface Template {
  id: number;
  name: string;
  content: string;
}

export interface StorageData {
  templates: Template[];
  shortcutKey: string;
}