import React from 'react';

const DefaultGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="url(#paint0_linear_default)" />
        <circle cx="50" cy="60" r="40" fill="url(#paint1_radial_default)" opacity="0.5" />
        <rect x="120" y="30" width="60" height="60" rx="10" fill="url(#paint2_linear_default)" opacity="0.6" transform="rotate(15 150 60)" />
        <defs>
            <linearGradient id="paint0_linear_default" x1="0" y1="0" x2="200" y2="133" gradientUnits="userSpaceOnUse"><stop stopColor="#E0E7FF" /><stop offset="1" stopColor="#C7D2FE" /></linearGradient>
            <radialGradient id="paint1_radial_default" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 60) rotate(90) scale(40)"><stop stopColor="#A5B4FC" /><stop offset="1" stopColor="#6366F1" stopOpacity="0" /></radialGradient>
            <linearGradient id="paint2_linear_default" x1="120" y1="30" x2="180" y2="90" gradientUnits="userSpaceOnUse"><stop stopColor="#FBBF24" /><stop offset="1" stopColor="#F59E0B" /></linearGradient>
        </defs>
    </svg>
);

const HistoryGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#FFFBEB" />
        <path d="M75 133V43H125V133H75Z" fill="#F3EADF"/><path d="M70 43H130V33H70V43Z" fill="#DCD1C4"/><path d="M70 18H130V33H70V18Z" fill="#DCD1C4" stroke="#B8AFA2" strokeWidth="2"/><path d="M65 133V123H135V133H65Z" fill="#DCD1C4"/>
    </svg>
);

const EconGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#ECFDF5" />
        <path d="M40 103L70 73L100 88L130 58L160 38" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y="83" width="20" height="40" fill="#A7F3D0" /><rect x="70" y="103" width="20" height="20" fill="#A7F3D0" /><rect x="100" y="63" width="20" height="60" fill="#A7F3D0" /><rect x="130" y="93" width="20" height="30" fill="#A7F3D0" />
    </svg>
);

const SociologyGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#FEF2F2" />
        <circle cx="100" cy="66" r="20" fill="#F87171" /><circle cx="50" cy="46" r="15" fill="#FB923C" /><circle cx="150" cy="46" r="15" fill="#FB923C" /><circle cx="50" cy="86" r="15" fill="#FB923C" /><circle cx="150" cy="86" r="15" fill="#FB923C" />
        <path d="M100 66L50 46" stroke="#FCA5A5" strokeWidth="4" /><path d="M100 66L150 46" stroke="#FCA5A5" strokeWidth="4" /><path d="M100 66L50 86" stroke="#FCA5A5" strokeWidth="4" /><path d="M100 66L150 86" stroke="#FCA5A5" strokeWidth="4" />
    </svg>
);

const PsychologyGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#F5F3FF" />
        <path d="M135 113C135 83 115 63 95 63C75 63 65 43 90 23C115 3 155 43 155 73C155 103 135 113 135 113Z" fill="#DDD6FE" />
        <path d="M112.5 67C112.5 57 107.5 52 97.5 52C87.5 52 82.5 42 95 35.5" stroke="#A78BFA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="97.5" cy="72" r="10" fill="#C4B5FD" />
    </svg>
);

const BiologyGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#EFF6FF" />
        <path d="M85 18C115 43 65 83 95 108" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" /><path d="M115 18C85 43 135 83 105 108" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" />
        <path d="M88 33H112" stroke="#BFDBFE" strokeWidth="6" strokeLinecap="round" /><path d="M85 58H115" stroke="#BFDBFE" strokeWidth="6" strokeLinecap="round" /><path d="M88 83H112" stroke="#BFDBFE" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

const ChemistryGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#F5F3FF" />
        <path d="M70 23H130V33H70V23Z" fill="#C4B5FD" /><path d="M80 33L60 113H140L120 33H80Z" fill="#DDD6FE" />
        <path d="M70 93H130" fill="#A78BFA" stroke="#A78BFA" strokeWidth="8" strokeLinecap="round" />
        <circle cx="85" cy="63" r="5" fill="#A78BFA" /><circle cx="115" cy="73" r="3" fill="#A78BFA" />
    </svg>
);

const AstronomyGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#1E1B4B" />
        <circle cx="100" cy="66" r="35" fill="#A5B4FC" />
        <path d="M40 71C40 71 80 51 160 61" stroke="#E0E7FF" strokeWidth="8" strokeLinecap="round" />
        <circle cx="150" cy="33" r="5" fill="#FBBF24" /><circle cx="60" cy="23" r="3" fill="#FEF3C7" /><circle cx="50" cy="103" r="4" fill="#FEF3C7" />
    </svg>
);

const MathsGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#EEF2FF" />
        <path d="M60 43L80 23L100 43" stroke="#818CF8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90 63H130" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" /><path d="M110 43V83" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" />
        <path d="M130 103C120 113 80 113 70 103" stroke="#A5B4FC" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

const ELAGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#FFF7ED" />
        <path d="M20 23H180V113H20V23Z" fill="#FFEDD5" /><path d="M100 23V113" stroke="#FB923C" strokeWidth="4" />
        <path d="M40 43H90" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" /><path d="M40 63H80" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" /><path d="M40 83H90" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
        <path d="M110 43H160" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" /><path d="M110 63H150" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" /><path d="M110 83H160" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const CSGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#F0F9FF" />
        <path d="M70 43L40 68L70 93" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M130 43L160 68L130 93" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="85" y="103" width="30" height="10" rx="5" fill="#7DD3FC" />
    </svg>
);

const CteTechGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#F3F4F6" />
        <rect x="60" y="33" width="80" height="50" rx="10" fill="#9CA3AF" />
        <circle cx="100" cy="58" r="15" fill="#E5E7EB" />
        <rect x="85" y="83" width="30" height="30" rx="5" fill="#6B7280" />
        <path d="M60 103H40L50 123H70" fill="#9CA3AF" /><path d="M140 103H160L150 123H130" fill="#9CA3AF" />
    </svg>
);

const CteTradesGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#FEFCE8" />
        <path d="M50 113L100 33L150 113H50Z" stroke="#FDE047" strokeWidth="8" />
        <path d="M75 113L100 73L125 113" stroke="#FEF08A" strokeWidth="6" strokeLinecap="round" />
        <rect x="60" y="113" width="80" height="10" fill="#FACC15" />
    </svg>
);

const CteLifeSciGraphic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 133" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="200" height="133" fill="#F0FDF4" />
        <path d="M100 23C70 43 80 83 100 113C130 83 120 43 100 23Z" fill="#86EFAC" />
        <path d="M100 23V113" stroke="#4ADE80" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

const graphicsMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'history-abstract': HistoryGraphic,
    'econ-abstract': EconGraphic,
    'sociology-abstract': SociologyGraphic,
    'psychology-abstract': PsychologyGraphic,
    'biology-abstract': BiologyGraphic,
    'chemistry-abstract': ChemistryGraphic,
    'astronomy-abstract': AstronomyGraphic,
    'maths-abstract': MathsGraphic,
    'ela-abstract': ELAGraphic,
    'cs-abstract': CSGraphic,
    'cte-trades': CteTradesGraphic,
    'cte-trades-2': CteTradesGraphic,
    'cte-tech': CteTechGraphic,
    'cte-tech-2': CteTechGraphic,
    'cte-life-sci': CteLifeSciGraphic,
    'cte-life-sci-2': CteLifeSciGraphic,
};

export const SubjectGraphic: React.FC<{ graphicId: string; className?: string }> = ({ graphicId, className }) => {
    // Check if it's an image path (starts with / or http)
    if (graphicId.startsWith('/') || graphicId.startsWith('http')) {
        return <img src={graphicId} alt="Course icon" className={className} />;
    }
    
    // Otherwise, use the SVG graphics map
    const GraphicComponent = graphicsMap[graphicId] || DefaultGraphic;
    return <GraphicComponent className={className} />;
};