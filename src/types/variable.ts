export type VariableType = 'string' | 'int' | 'float' | 'url' | 'date' | 'datetime' | 'time' | 'year';

export type VariableEntry = {
  name: string;
  type: VariableType;
  options?: string[];
};
