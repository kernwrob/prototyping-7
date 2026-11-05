"""Optional helper: regenerate the original SVG illustrations. No extra packages."""
from pathlib import Path
from html import escape

OUTPUT = Path(__file__).resolve().parents[1] / "static" / "images"
OUTPUT.mkdir(parents=True, exist_ok=True)


def poster(filename, top, bottom, accent, lines, tagline, art):
    title = "".join(f'<text x="240" y="{576+i*43}" text-anchor="middle" font-family="Georgia,serif" font-size="{37 if len(line)<20 else 29}" letter-spacing="2" fill="#f5edda">{escape(line)}</text>' for i, line in enumerate(lines))
    stars = "".join(f'<circle cx="{(i*139+27)%480}" cy="{(i*83+19)%510}" r="{0.5+(i%3)*0.35}" fill="#fff4d8" opacity="{.2+(i%5)*.12}"/>' for i in range(45))
    source = f'''<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720" viewBox="0 0 480 720">
<defs>
 <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="{top}"/><stop offset="100%" stop-color="{bottom}"/></linearGradient>
 <radialGradient id="glow"><stop offset="0%" stop-color="{accent}" stop-opacity=".65"/><stop offset="100%" stop-color="{accent}" stop-opacity="0"/></radialGradient>
 <linearGradient id="shade" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#080c0d" stop-opacity="0"/><stop offset="65%" stop-color="#080c0d" stop-opacity=".3"/><stop offset="100%" stop-color="#080c0d" stop-opacity=".96"/></linearGradient>
 <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".12"/></feComponentTransfer></filter>
</defs>
<rect width="480" height="720" fill="url(#sky)"/>
{stars}
<text x="240" y="49" text-anchor="middle" fill="#f5edda" opacity=".8" font-family="Arial,sans-serif" font-size="8" letter-spacing="4">A SCREENSTACK ORIGINAL STORY</text>
{art}
<rect y="410" width="480" height="310" fill="url(#shade)"/>
<rect width="480" height="720" filter="url(#grain)" opacity=".32"/>
<text x="240" y="522" text-anchor="middle" fill="{accent}" font-family="Arial,sans-serif" font-size="8" letter-spacing="2">{escape(tagline)}</text>
{title}
<path d="M205 663h70" stroke="{accent}" opacity=".7"/>
<text x="240" y="687" text-anchor="middle" fill="#c2c8c0" font-family="Arial,sans-serif" font-size="7" letter-spacing="3">AN IMAGINED FILM · A REAL ESCAPE</text>
<rect x="13" y="13" width="454" height="694" fill="none" stroke="#f5edda" stroke-opacity=".15"/>
</svg>'''
    (OUTPUT / filename).write_text(source, encoding="utf-8")


poster("sternenwanderer.svg", "#091c31", "#214e58", "#99e8ec", ["STERNEN", "WANDERER"], "BEYOND THE LAST KNOWN STAR", '''
<ellipse cx="250" cy="260" rx="260" ry="240" fill="url(#glow)"/>
<circle cx="245" cy="250" r="132" fill="#102632" stroke="#8de5df" stroke-width="3"/>
<circle cx="245" cy="250" r="122" fill="none" stroke="#94ded8" stroke-opacity=".25"/>
<ellipse cx="245" cy="250" rx="206" ry="36" fill="none" stroke="#c7ece8" stroke-width="3" transform="rotate(-31 245 250)"/>
<path d="M0 470 90 391 170 453 252 378 350 445 420 401 480 466V720H0Z" fill="#101d24"/>
<path d="m257 434-8 46h21l-7-46Z" fill="#071017"/><circle cx="260" cy="425" r="8" fill="#071017"/>
<path d="m260 450 1-88" stroke="#d5ffff" stroke-opacity=".3"/>
''')

poster("altura.svg", "#102e2e", "#406056", "#e5dba2", ["DAS GEHEIMNIS", "VON ALTURA"], "SOME WORLDS ARE WAITING TO BE FOUND", '''
<circle cx="240" cy="210" r="170" fill="url(#glow)"/><circle cx="240" cy="175" r="67" fill="#e7dca8" opacity=".8"/>
<path d="M0 356 75 269 145 332 235 210 318 316 393 243 480 346V610H0Z" fill="#264944"/>
<path d="M149 349h185l-35 71-53 36-58-35Z" fill="#172e2e"/>
<g fill="#102c2c" stroke="#aebc8d" stroke-width=".5"><path d="M183 349V280h26v69m18 0V248h25v101m16 0v-83h23v83m15 0v-57h14v57"/><path d="m179 280 17-32 17 32m10-32 17-43 17 43m7 18 15-37 16 37"/></g>
<path d="M0 422q90-48 182 3t298-11M0 461q100-40 251 3t229-21" fill="none" stroke="#c8d5ba" stroke-width="20" opacity=".16"/>
<path d="M0 500 90 439 160 478 210 463 315 485 410 433 480 475v245H0Z" fill="#0b2122"/>
''')

poster("letzte-station.svg", "#281e29", "#78504b", "#f8b47a", ["DIE LETZTE", "STATION"], "THE LAST TRAIN DOES NOT WAIT", '''
<ellipse cx="245" cy="327" rx="205" ry="240" fill="url(#glow)"/>
<path d="M0 100 225 290 225 500 0 540ZM480 100 255 290 255 500 480 540Z" fill="#171c22"/>
<path d="M44 0 230 290M435 0 250 290M0 560 230 326M480 560 250 326" stroke="#b1795a" stroke-width="3"/>
<path d="M115 0v195m250-195v195M68 218l111 89M412 218l-111 89" stroke="#edb277" stroke-width="4" opacity=".6"/>
<rect x="218" y="290" width="45" height="67" rx="10" fill="#c69a7e"/><rect x="225" y="300" width="30" height="24" fill="#181b21"/>
<path d="M230 357 135 540m116-183 96 183" stroke="#d69b73" stroke-width="3"/>
<path d="m186 402-9 55h23l-8-55Z" fill="#080e12"/><circle cx="189" cy="393" r="8" fill="#080e12"/>
''')

poster("fremde-sterne.svg", "#262040", "#6d5775", "#e7bac8", ["UNTER FREMDEN", "STERNEN"], "FAR FROM HOME. NEVER ALONE.", '''
<circle cx="275" cy="233" r="180" fill="url(#glow)"/><circle cx="287" cy="205" r="109" fill="#d2a7af"/><circle cx="321" cy="181" r="102" fill="#403751"/>
<circle cx="110" cy="115" r="23" fill="#e1c8bd" opacity=".8"/>
<path d="M0 408Q120 332 240 402T480 360v360H0Z" fill="#3c344d"/><path d="M0 466Q140 389 272 453T480 427v293H0Z" fill="#252535"/>
<g fill="#121b28"><circle cx="225" cy="389" r="13"/><rect x="214" y="402" width="23" height="44" rx="6"/><path d="m219 439-7 37h8l7-33 8 33h8l-9-37Z"/><circle cx="277" cy="415" r="9"/><path d="m270 424-7 34h25l-6-34Z"/></g>
''')

poster("echo.svg", "#09202b", "#095364", "#87e0c9", ["ECHO", "DER TIEFE"], "SOMETHING BELOW IS LISTENING", '''
<path d="M90 55 210 460h45L180 55M350 55 240 470h30L420 55" fill="#8bdec9" opacity=".07"/>
<circle cx="242" cy="306" r="145" fill="none" stroke="#80cebe" opacity=".15"/><circle cx="242" cy="306" r="105" fill="none" stroke="#80cebe" opacity=".25"/><circle cx="242" cy="306" r="64" fill="none" stroke="#80cebe" opacity=".4"/>
<ellipse cx="240" cy="330" rx="180" ry="160" fill="url(#glow)"/>
<path d="M193 300h89l30 20-30 20h-89l-20-20Z" fill="#133842" stroke="#adddc8"/><rect x="222" y="288" width="24" height="12" fill="#adddc8" opacity=".7"/><circle cx="285" cy="320" r="5" fill="#f1e8be"/>
<path d="M0 464 75 408 126 458 174 425 220 482 307 422 371 455 445 398 480 442v278H0Z" fill="#081e28"/>
''')

poster("berge.svg", "#88736e", "#e4b28d", "#fce4aa", ["MORGEN HINTER", "DEN BERGEN"], "EVERY RETURN IS A NEW BEGINNING", '''
<circle cx="305" cy="198" r="82" fill="#f3d39e"/>
<path d="M0 367 124 178 257 359 377 224 480 335v385H0Z" fill="#777a79"/>
<path d="m76 251 48-73 55 75-50-24Z" fill="#e4d9c4"/><path d="m335 278 42-54 49 53-45-13Z" fill="#e4d9c4"/>
<path d="M0 420 106 319 223 424 348 336 480 432v288H0Z" fill="#485b56"/>
<path d="M0 489q140-105 285-30t195 8v253H0Z" fill="#253d36"/>
<path d="M267 505q-60-38-24-68t-39-55" fill="none" stroke="#c1b48d" stroke-width="9"/>
<path d="M119 430v-31h31v31Zm-7-31 23-21 24 21Z" fill="#273e35"/><rect x="130" y="409" width="7" height="11" fill="#edc184"/>
''')

poster("kompass.svg", "#343022", "#958054", "#eed398", ["DER GOLDENE", "WEG"], "FOLLOW WHAT YOU CANNOT FORGET", '''
<circle cx="240" cy="270" r="190" fill="url(#glow)"/>
<g fill="none" stroke="#dbc48b"><circle cx="240" cy="270" r="138" stroke-width="2"/><circle cx="240" cy="270" r="124" opacity=".4"/><circle cx="240" cy="270" r="101" opacity=".3"/><path d="M240 109v322M79 270h322M126 156l228 228m0-228L126 384" opacity=".4"/></g>
<path d="m240 143 25 102 102 25-102 25-25 102-25-102-102-25 102-25Z" fill="#d8c28a"/><path d="m240 143 0 127 25-25Zm0 127 127 0-102 25Zm0 0v127l-25-102Zm0 0H113l102-25Z" fill="#786940"/><circle cx="240" cy="270" r="13" fill="#473e29"/>
<path d="M0 484 70 420 140 461 222 404 285 456 390 401 480 461v259H0Z" fill="#282d26"/>
''')

poster("stadt.svg", "#22263d", "#57445d", "#f6cda0", ["ALS DIE STADT", "SCHLIEF"], "ONE NIGHT. A THOUSAND POSSIBILITIES.", '''
<circle cx="342" cy="155" r="44" fill="#e3ccb0"/><circle cx="326" cy="141" r="41" fill="#292b43"/>
<path d="M0 254h38v-56h41v97h34V182h57v109h34v-69h38v92h40V170h55v112h29v-70h54v98h25v-62h35v472H0Z" fill="#252b3d"/>
<g fill="#f1c297" opacity=".75">''' + "".join(f'<rect x="{35+i*45}" y="{260+j*36}" width="7" height="12"/>' for i in range(10) for j in range(4) if (i+j)%3 != 0) + '''</g>
<path d="M0 438q240-50 480 0v282H0Z" fill="#171f2e"/><path d="M0 446q240-49 480 0" fill="none" stroke="#d5b897" stroke-width="2"/>
<g fill="#0b1421"><circle cx="204" cy="408" r="8"/><path d="m198 418-7 41h24l-7-41Z"/><circle cx="245" cy="412" r="8"/><path d="m239 422-7 37h24l-7-37Z"/><circle cx="284" cy="405" r="8"/><path d="m278 415-7 44h24l-7-44Z"/></g>
''')

print(f"Created 8 SVG posters in {OUTPUT}")
