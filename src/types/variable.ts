export type VariableType = 'string' | 'int' | 'float' | 'url' | 'date' | 'datetime' | 'time' | 'year';

export type Variable = {
  name: string;
  type: VariableType;
  options?: string[];
};
