interface InvestigateProps {
    size?: number;
    title?: string;
}

export default function NoPic({ size = 200, title = 'Picture hidden' }: InvestigateProps) {
    const wrapText = (maxChars = 7) => {
        const words = title.split(' ');
        const lines = [];
        let line = '';

        words.forEach((word) => {
            const testLine = line ? `${line} ${word}` : word;

            if (testLine.length > maxChars) {
                if (line) lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        });

        if (line) lines.push(line);

        return lines;
    };

    const lines = wrapText();

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 2048 2048"
        >
            <defs>
                <linearGradient
                    id="cyanGlow"
                    x1="0"
                    y1="1"
                    x2="1"
                    y2="0"
                >
                    <stop
                        offset="0"
                        stopColor="#19CFE8"
                        stopOpacity=".55"
                    />
                    <stop
                        offset=".5"
                        stopColor="#39E8F5"
                        stopOpacity=".9"
                    />
                    <stop
                        offset="1"
                        stopColor="#19CFE8"
                        stopOpacity=".55"
                    />
                </linearGradient>

                <linearGradient
                    id="grayFade"
                    x1="0"
                    y1="1"
                    x2="1"
                    y2="0"
                >
                    <stop
                        offset="0"
                        stopColor="#5F686E"
                        stopOpacity=".25"
                    />
                    <stop
                        offset=".5"
                        stopColor="#858D91"
                        stopOpacity=".7"
                    />
                    <stop
                        offset="1"
                        stopColor="#515A60"
                        stopOpacity=".28"
                    />
                </linearGradient>

                <filter id="glow">
                    <feGaussianBlur stdDeviation="8" />
                </filter>
            </defs>

            <g fill="#252C32">
                <path
                    d="M-180 1800 L-180 1880 L1880 -180 L1800 -180 Z"
                    opacity=".72"
                />
                <path
                    d="M-160 1990 L-160 2048 L2048 -150 L2048 -210 Z"
                    opacity=".55"
                />
                <path
                    d="M80 2048 L180 2048 L2048 210 L2048 110 Z"
                    opacity=".8"
                />
                <path
                    d="M-120 1500 L-120 1560 L1560 -120 L1500 -120 Z"
                    opacity=".55"
                />
                <path
                    d="M420 2048 L500 2048 L2048 500 L2048 420 Z"
                    opacity=".65"
                />
                <path
                    d="M800 2048 L860 2048 L2048 860 L2048 800 Z"
                    opacity=".7"
                />
                <path
                    d="M1200 2048 L1260 2048 L2048 1260 L2048 1200 Z"
                    opacity=".55"
                />
            </g>

            <g fill="url(#grayFade)">
                <path d="M-140 1160 L-140 1235 L1235 -140 L1160 -140 Z" />
                <path
                    d="M-120 1460 L-120 1535 L1535 -120 L1460 -120 Z"
                    opacity=".72"
                />
                <path
                    d="M120 2048 L230 2048 L2048 230 L2048 120 Z"
                    opacity=".68"
                />
                <path
                    d="M620 2048 L710 2048 L2048 710 L2048 620 Z"
                    opacity=".56"
                />
                <path
                    d="M1040 2048 L1130 2048 L2048 1130 L2048 1040 Z"
                    opacity=".7"
                />
                <path
                    d="M-80 760 L-80 820 L820 -80 L760 -80 Z"
                    opacity=".5"
                />
            </g>

            <g
                stroke="#687177"
                fill="none"
            >
                <path
                    d="M-80 930 L930 -80"
                    strokeWidth="18"
                    opacity=".55"
                />
                <path
                    d="M-40 1040 L1040 -40"
                    strokeWidth="10"
                    opacity=".4"
                />
                <path
                    d="M140 1540 L1540 140"
                    strokeWidth="14"
                    opacity=".55"
                />
                <path
                    d="M300 1770 L1770 300"
                    strokeWidth="9"
                    opacity=".42"
                />
                <path
                    d="M520 2040 L2040 520"
                    strokeWidth="16"
                    opacity=".5"
                />
                <path
                    d="M900 2040 L2040 900"
                    strokeWidth="11"
                    opacity=".42"
                />
                <path
                    d="M1120 2040 L2040 1120"
                    strokeWidth="20"
                    opacity=".38"
                />
                <path
                    d="M-100 570 L570 -100"
                    strokeWidth="12"
                    opacity=".36"
                />
                <path
                    d="M-60 430 L430 -60"
                    strokeWidth="8"
                    opacity=".45"
                />
            </g>

            <g
                stroke="#22DCEC"
                fill="none"
                filter="url(#glow)"
            >
                <path
                    d="M-160 1180 L1180 -160"
                    strokeWidth="34"
                    opacity=".26"
                />
                <path
                    d="M260 2040 L2040 260"
                    strokeWidth="26"
                    opacity=".22"
                />
                <path
                    d="M720 2040 L2040 720"
                    strokeWidth="30"
                    opacity=".2"
                />
            </g>

            <g
                fill="none"
                strokeLinecap="butt"
            >
                <path
                    d="M-180 1020 L1020 -180"
                    stroke="url(#cyanGlow)"
                    strokeWidth="30"
                    opacity=".82"
                />

                <path
                    d="M-40 1320 L1320 -40"
                    stroke="#2ADCEC"
                    strokeWidth="12"
                    opacity=".72"
                />

                <path
                    d="M80 1580 L1580 80"
                    stroke="#32E2F0"
                    strokeWidth="22"
                    opacity=".9"
                />

                <path
                    d="M300 1900 L1900 300"
                    stroke="#26D8E9"
                    strokeWidth="10"
                    opacity=".62"
                />

                <path
                    d="M510 2048 L2048 510"
                    stroke="#35E4F2"
                    strokeWidth="18"
                    opacity=".78"
                />

                <path
                    d="M760 2048 L2048 760"
                    stroke="#20D4E7"
                    strokeWidth="9"
                    opacity=".56"
                />

                <path
                    d="M1040 2048 L2048 1040"
                    stroke="#3BE6F2"
                    strokeWidth="25"
                    opacity=".84"
                />

                <path
                    d="M1320 2048 L2048 1320"
                    stroke="#2EDDEA"
                    strokeWidth="13"
                    opacity=".68"
                />

                <path
                    d="M-40 720 L720 -40"
                    stroke="#31E0EE"
                    strokeWidth="8"
                    opacity=".58"
                />
            </g>

            <g fill="#2ADCEB">
                <path
                    d="M180 900 L420 660 L435 675 L195 915 Z"
                    opacity=".78"
                />
                <path
                    d="M650 1180 L820 1010 L835 1025 L665 1195 Z"
                    opacity=".65"
                />
                <path
                    d="M920 930 L1090 760 L1105 775 L935 945 Z"
                    opacity=".72"
                />
                <path
                    d="M1130 1360 L1350 1140 L1365 1155 L1145 1375 Z"
                    opacity=".58"
                />
                <path
                    d="M1450 880 L1650 680 L1665 695 L1465 895 Z"
                    opacity=".7"
                />
                <path
                    d="M1520 1510 L1730 1300 L1745 1315 L1535 1525 Z"
                    opacity=".52"
                />
            </g>

            <g
                stroke="#1D2429"
                fill="none"
            >
                <path
                    d="M-100 1330 L1330 -100"
                    strokeWidth="7"
                    opacity=".8"
                />
                <path
                    d="M40 1710 L1710 40"
                    strokeWidth="6"
                    opacity=".72"
                />
                <path
                    d="M370 2048 L2048 370"
                    strokeWidth="5"
                    opacity=".75"
                />
                <path
                    d="M690 2048 L2048 690"
                    strokeWidth="7"
                    opacity=".7"
                />
                <path
                    d="M970 2048 L2048 970"
                    strokeWidth="5"
                    opacity=".65"
                />
                <path
                    d="M-80 1090 L1090 -80"
                    strokeWidth="5"
                    opacity=".68"
                />
                <path
                    d="M-100 620 L620 -100"
                    strokeWidth="6"
                    opacity=".6"
                />
            </g>
            {/* Title */}

            <text
                x="1024"
                y="1024"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Tektur, sans-serif"
                fontSize="400"
                fontWeight="700"
                letterSpacing="2"
                fill="#FFF4F2"
                stroke="#431818"
                strokeWidth="3"
                paintOrder="stroke fill"
            >
                {lines.map((line, index) => (
                    <tspan
                        key={index}
                        x="1024"
                        dy={index === 0 ? `${-(lines.length - 1) * 256}px` : '512px'}
                    >
                        {line}
                    </tspan>
                ))}
            </text>
        </svg>
    );
}
