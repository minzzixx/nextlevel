type Point = { x: number; y: number; scale?: number };
const petals = [0, 72, 144, 216, 288];

export function Flower({ face = false }: { face?: boolean }) {
  return <svg viewBox="0 0 100 100" aria-hidden="true"><Blossom x={50} y={50} face={face} /></svg>;
}

function Blossom({ x, y, scale = 1, face = false }: Point & { face?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {petals.map((a) => <ellipse key={a} cx="0" cy="-22" rx="23" ry="27" fill="currentColor" transform={`rotate(${a})`} />)}
    <circle r="18" fill="#f5d388" />{face && <Face />}
  </g>;
}

function Face() {
  return <g fill="#3d4d3a"><circle cx="-6" cy="-2" r="2" /><circle cx="6" cy="-2" r="2" /><path d="M-4 5q4 4 8 0" stroke="#3d4d3a" strokeWidth="1.5" fill="none" /><ellipse cx="-11" cy="5" rx="3" ry="1.8" fill="#df9a84" /><ellipse cx="11" cy="5" rx="3" ry="1.8" fill="#df9a84" /></g>;
}

function Girl({ x, y, scale = 1 }: Point) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cy="111" rx="46" ry="7" fill="#526647" opacity=".17" />
    <path d="M-16 77-17 101M15 77 19 101" stroke="#6f523c" strokeWidth="10" strokeLinecap="round" />
    <path d="M-25 27-48 54M24 28 48 43" stroke="#e6b98d" strokeWidth="10" strokeLinecap="round" />
    <path d="M-24 18-36 80Q0 89 36 80L24 18" fill="#b8634d" />
    <path d="M-25 20Q0 44 25 20L19 16H-19Z" fill="#f4deae" />
    <path d="M-32-14Q-35-57 2-58T33-15L32 22H-31Z" fill="#394b37" />
    <ellipse cy="-13" rx="26" ry="31" fill="#e9c297" />
    <path d="M-29-22Q-8-21 3-45Q12-21 29-18L28-37 0-55-28-37Z" fill="#394b37" />
    <g transform="translate(0 -10)"><Face /></g>
    <path d="M-39-38Q0-83 39-38Z" fill="#d7bd81" /><ellipse cy="-34" rx="48" ry="9" fill="#d7bd81" />
    <path d="M-26-43Q0-55 26-43" stroke="#b8634d" strokeWidth="6" fill="none" />
  </g>;
}

function Tree({ x, y, scale = 1 }: Point) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} color="#cd6150">
    <path d="M0 5 2-163M2-83-35-119M2-103 41-138" stroke="#776b48" strokeWidth="7" fill="none" />
    <ellipse cx="-5" cy="-162" rx="66" ry="96" fill="#496f52" transform="rotate(-12 -5 -162)" />
    <ellipse cx="-34" cy="-133" rx="44" ry="58" fill="#5c7f58" />
    <ellipse cx="37" cy="-146" rx="42" ry="64" fill="#557852" />
    <path d="M-50-150q17-22 38-9-12 27-38 9m62-54q21-20 38-2-16 22-38 2m2 73q19-22 41-9-12 28-41 9" fill="#779163" />
    {[[-34,-187],[23,-174],[-19,-120],[55,-138],[-52,-139],[5,-210]].map(([a,b]) => <Blossom key={a} x={a} y={b} scale={.16} />)}
  </g>;
}

export function Village({ story = false }: { story?: boolean }) {
  const id = story ? "story-grain" : "hero-grain";
  return <svg viewBox="0 0 700 610" role="img" aria-label={story ? "동백숲을 걷는 마을소녀" : "동백나무와 작은 집이 있는 마을 풍경"}>
    <defs><pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#3e573b" opacity=".13" /></pattern></defs>
    <path d="M0 0H700V610H0Z" fill="#e3ebdf" />
    <circle cx="508" cy="125" r="48" fill="#f2d390" />
    <g fill="#fff9e7" opacity=".85"><ellipse cx="187" cy="125" rx="58" ry="13" /><ellipse cx="174" cy="114" rx="29" ry="18" /><ellipse cx="403" cy="184" rx="32" ry="7" /></g>
    <path d="M0 325Q131 223 262 295T478 263T700 268V610H0Z" fill="#a4b99e" />
    <path d="M0 391Q134 289 307 368T700 317V610H0Z" fill="#7e9a7d" />
    <path d="M0 482Q190 369 700 421V610H0Z" fill="#bfc99d" />
    <path d="M389 367Q339 441 436 465T404 610H597Q626 518 470 469T443 367Z" fill="#ece0bd" />
    <path d="M54 499q72-47 170-28M525 515q82-22 137 5" stroke="#9eaf80" strokeWidth="2" fill="none" />
    <Tree x={89} y={405} scale={1.15} /><Tree x={608} y={385} scale={1.06} /><Tree x={536} y={340} scale={.48} />
    <g transform="translate(255 250)">
      <path d="M105 19V-6H125V30" fill="#ad5e4c" />
      <path d="M-6 61H140V146H-6Z" fill="#f4e8ca" />
      <path d="M-26 65 65 5 160 65Z" fill="#ad5e4c" />
      <path d="M65 5 160 65" stroke="#954f43" strokeWidth="6" />
      <path d="M47 146v-40q18-22 37 0v40" fill="#6c8969" />
      <path d="M9 83H29V108H9ZM105 83H125V108H105Z" fill="#9bb2a4" />
      <path d="M19 83v25m96-25v25M9 96h20m76 0h20" stroke="#f4e8ca" strokeWidth="2" />
    </g>
    <g color="#c96954">{[[57,498],[131,526],[613,493],[566,546],[648,562],[487,520],[173,420]].map(([x,y]) => <g key={x}><path d={`M${x} ${y}q-13 14-5 25`} stroke="#6f8a5e" strokeWidth="2" fill="none" /><Blossom x={x} y={y} scale={.16} /></g>)}</g>
    {story && <Girl x={251} y={403} scale={1.12} />}
    <g fill="#557652"><path d="M0 561q49-59 79 5 24-31 69 44H0Zm700-16q-47-51-79 2-26-20-50 63h129Z" /><path d="M0 585q44-34 88 25H0Zm700-4q-27-33-69 29h69Z" fill="#48694d" /></g>
    <path d="M147 369q10-11 18 0m1 0q9-11 18 0" stroke="#62795d" strokeWidth="2" fill="none" />
    <path d="M0 0H700V610H0Z" fill={`url(#${id})`} />
  </svg>;
}
