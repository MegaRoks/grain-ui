import { renderHook, act } from '@testing-library/react';
import { usePresence } from './usePresence';

describe('usePresence', () => {
  it('остаётся смонтированным до конца exit-перехода', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ open }) => usePresence(open, 200), { initialProps: { open: true } });
    expect(result.current[0]).toBe(true);
    rerender({ open: false });
    expect(result.current).toEqual([true, 'closed']);
    act(() => vi.advanceTimersByTime(200));
    expect(result.current[0]).toBe(false);
    vi.useRealTimers();
  });
});
