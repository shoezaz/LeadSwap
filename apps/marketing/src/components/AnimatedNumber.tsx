import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
}

const easeOutQuad = (t: number) => t * (2 - t);

export default function AnimatedNumber({ value, duration = 500 }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(value);
    const [startValue, setStartValue] = useState(value);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        // If value hasn't changed effectively, don't restart animation
        if (value === displayValue) return;

        setStartValue(displayValue);
        setStartTime(performance.now());
    }, [value]);

    useEffect(() => {
        if (startTime === null) return;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutQuad(progress);

            const nextValue = Math.round(startValue + (value - startValue) * easeProgress);
            setDisplayValue(nextValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setStartTime(null);
            }
        };

        const handle = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(handle);
    }, [startTime, value, startValue, duration]);

    return <>{displayValue}</>;
}
