import type { VariableType, Variable } from '@/types/variable';

function buildVariableRegex(): RegExp {
  return /\{\{(\w+):\s*(\w+)(?:\s*=\s*\[([^\]]+)\])?\}\}/g;
}

export function hasVariables(text: string): boolean {
  return buildVariableRegex().test(text);
}

export function parseVariables(text: string): Variable[] {
  const seen = new Set<string>();
  const anchors: Variable[] = [];

  for (const match of text.matchAll(buildVariableRegex())) {
    const [, name, type, opts] = match;
    if (seen.has(name)) continue;
    seen.add(name);
    anchors.push({ name, type: type as VariableType, options: opts?.split(',').map((s) => s.trim()) });
  }
  return anchors;
}

export function applyValues(content: string, values: Record<string, unknown>): string {
  return content.replace(buildVariableRegex(), (_, name) => {
    const value = values[name];
    return value !== undefined ? String(value) : '';
  });
}
