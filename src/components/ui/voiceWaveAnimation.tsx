import { motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

interface WaveBarProps {
    index: number;
    isBackground: boolean;
    baseHeight: number;
    peakHeight: number;
}

// Keyframes for CSS animation
const styles = `
  @keyframes wave-bg {
    0%, 100% { height: var(--base-height); opacity: 0.2; }
    50% { height: var(--peak-height); opacity: 0.6; }
  }
`;

const WaveBar = memo(({ index, isBackground, baseHeight, peakHeight }: WaveBarProps) => {
    const baseDelay = index * (isBackground ? 0.2 : 0.15);

    if (isBackground) {
        return (
            <div
                className="rounded-full bg-gradient-to-t from-red-700/60 via-red-600/40 to-red-500/30 w-[12px]"
                style={{
                    transformOrigin: 'bottom center',
                    animation: `wave-bg 3s ease-in-out infinite`,
                    animationDelay: `${baseDelay}s`,
                    '--base-height': `${baseHeight}px`,
                    '--peak-height': `${peakHeight}px`,
                } as React.CSSProperties}
            />
        );
    }

    return (
        <motion.div
            className="bg-gradient-to-t from-red-600 via-red-500 to-red-400 rounded-full shadow-lg shadow-red-500/50 w-[8px]"
            style={{ transformOrigin: 'bottom center' }}
            animate={{
                height: [baseHeight, peakHeight, baseHeight],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.1, 1],
                boxShadow: [
                    '0 0 20px rgba(255, 0, 0, 0.3)',
                    '0 0 40px rgba(255, 0, 0, 0.8)',
                    '0 0 20px rgba(255, 0, 0, 0.3)',
                ],
            }}
            transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: baseDelay,
                ease: 'easeInOut',
            }}
        />
    );
});
WaveBar.displayName = 'WaveBar';

const VoiceWaveAnimation: React.FC = () => {
    const [isClient, setIsClient] = useState(false);
    const [isSmallDevice, setIsSmallDevice] = useState(false);
    const [foregroundHeights, setForegroundHeights] = useState<{ baseHeight: number; peakHeight: number }[]>([]);
    const [backgroundHeights, setBackgroundHeights] = useState<{ baseHeight: number; peakHeight: number }[]>([]);

    useEffect(() => {
        setIsClient(true);
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        setIsSmallDevice(mediaQuery.matches);

        const fgCount = mediaQuery.matches ? 15 : 25;
        const bgCount = mediaQuery.matches ? 10 : 15;

        const generateHeights = (count: number, baseRange: [number, number], peakRange: [number, number]) =>
            Array.from({ length: count }, () => ({
                baseHeight: Math.random() * (baseRange[1] - baseRange[0]) + baseRange[0],
                peakHeight: Math.random() * (peakRange[1] - peakRange[0]) + peakRange[0],
            }));

        setForegroundHeights(generateHeights(fgCount, [60, 180], [100, 300]));
        setBackgroundHeights(generateHeights(bgCount, [80, 260], [120, 400]));
    }, []);

    if (!isClient) return null; // Prevent SSR hydration mismatch

    return (
        <>
            <style>{styles}</style>
            <div className="absolute inset-0 flex items-center justify-center md:bottom-10 bottom-96">
                {/* Background Waves */}
                <div className="absolute inset-0 flex items-center justify-center md:bottom-10 bottom-96 opacity-60">
                    <div className={`flex ${isSmallDevice ? 'space-x-5' : 'space-x-8'} items-center h-full justify-center`}>
                        {backgroundHeights.map(({ baseHeight, peakHeight }, i) => (
                            <WaveBar key={`bg-${i}`} index={i} isBackground baseHeight={baseHeight} peakHeight={peakHeight} />
                        ))}
                    </div>
                </div>

                {/* Foreground Wave Layers */}
                {[0, 1].map((layer) => (
                    <div key={layer} className="absolute inset-0 flex items-center justify-center md:bottom-10 bottom-96">
                        <div className={`flex ${isSmallDevice ? 'space-x-4' : 'space-x-6'} items-center h-full justify-center`}>
                            {foregroundHeights.map(({ baseHeight, peakHeight }, i) => (
                                <WaveBar key={`${layer}-fg-${i}`} index={i} isBackground={false} baseHeight={baseHeight} peakHeight={peakHeight} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default VoiceWaveAnimation;
