import { cn } from '@/lib/utils';

describe('cn utility', () => {
  test('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  test('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  test('should merge tailwind classes using tailwind-merge behavior', () => {
    // tailwind-merge should override conflicting classes
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4'); 
  });

  test('should handle arrays and objects if supported (clsx behavior)', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
    expect(cn({ 'class1': true, 'class2': false })).toBe('class1');
  });
});
