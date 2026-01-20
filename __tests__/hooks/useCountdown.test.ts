import { renderHook, act } from '@testing-library/react';
import { useCountdown } from '@/hooks/useCountdown';

// Use fake timers
jest.useFakeTimers();

describe('useCountdown Hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return correct initial countdown values for future date', () => {
    // Set a fixed "now" time
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    // Target is 2 days, 3 hours, 30 minutes, 45 seconds from now
    const targetDate = new Date('2025-01-17T13:30:45Z');

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.isExpired).toBe(false);
    expect(result.current.days).toBe(2);
    expect(result.current.hours).toBe(3);
    expect(result.current.minutes).toBe(30);
    expect(result.current.seconds).toBe(45);
  });

  it('should return isExpired=true when target date has passed', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    // Target date in the past
    const targetDate = new Date('2025-01-10T10:00:00Z');

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.isExpired).toBe(true);
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it('should update countdown every second', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    const targetDate = new Date('2025-01-15T10:00:10Z'); // 10 seconds from now

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.seconds).toBe(10);

    // Advance time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
      jest.setSystemTime(new Date('2025-01-15T10:00:01Z'));
    });

    expect(result.current.seconds).toBe(9);

    // Advance time by 5 more seconds
    act(() => {
      jest.advanceTimersByTime(5000);
      jest.setSystemTime(new Date('2025-01-15T10:00:06Z'));
    });

    expect(result.current.seconds).toBe(4);
  });

  it('should handle string date input', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    const targetDateString = '2025-01-16T10:00:00Z'; // 1 day from now

    const { result } = renderHook(() => useCountdown(targetDateString));

    expect(result.current.isExpired).toBe(false);
    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it('should handle Date object input', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    const targetDateObj = new Date('2025-01-15T12:30:00Z'); // 2.5 hours from now

    const { result } = renderHook(() => useCountdown(targetDateObj));

    expect(result.current.isExpired).toBe(false);
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(2);
    expect(result.current.minutes).toBe(30);
    expect(result.current.seconds).toBe(0);
  });

  it('should transition to expired state when countdown reaches zero', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    const targetDate = new Date('2025-01-15T10:00:03Z'); // 3 seconds from now

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.isExpired).toBe(false);
    expect(result.current.seconds).toBe(3);

    // Advance past the target
    act(() => {
      jest.advanceTimersByTime(5000);
      jest.setSystemTime(new Date('2025-01-15T10:00:05Z'));
    });

    expect(result.current.isExpired).toBe(true);
  });

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    const targetDate = new Date('2025-01-20T10:00:00Z');

    const { unmount } = renderHook(() => useCountdown(targetDate));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should calculate correctly for different target dates', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    // Test with 1 day target
    const date1 = new Date('2025-01-16T10:00:00Z');
    const { result: result1 } = renderHook(() => useCountdown(date1));
    expect(result1.current.days).toBe(1);

    // Test with 5 days target
    const date5 = new Date('2025-01-20T10:00:00Z');
    const { result: result5 } = renderHook(() => useCountdown(date5));
    expect(result5.current.days).toBe(5);

    // Test with 10 days target
    const date10 = new Date('2025-01-25T10:00:00Z');
    const { result: result10 } = renderHook(() => useCountdown(date10));
    expect(result10.current.days).toBe(10);
  });

  it('should calculate hours correctly within a day', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    jest.setSystemTime(now);

    // 23 hours, 59 minutes, 59 seconds from now
    const targetDate = new Date('2025-01-16T09:59:59Z');

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(23);
    expect(result.current.minutes).toBe(59);
    expect(result.current.seconds).toBe(59);
  });
});
