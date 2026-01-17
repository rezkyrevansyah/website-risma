import { useState, useEffect, useMemo } from "react";

interface CountdownResult {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

export function useCountdown(targetDate: string | Date): CountdownResult {
    // Memoize target time to prevent recalculations on every render
    const countDownDate = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

    const [countDown, setCountDown] = useState<number>(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            setCountDown(distance);
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
}

const getReturnValues = (countDown: number): CountdownResult => {
    if (countDown < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    // Calculate time units
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
};
