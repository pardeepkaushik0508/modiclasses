const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'tests', 'memory');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 12 Base Geometric Shapes (viewBox="0 0 120 120")
const shapes = {
  1: {
    // Concentric Target
    main: `
      <circle cx="60" cy="60" r="46" fill="none" stroke="#dc2626" stroke-width="3.5" />
      <circle cx="60" cy="60" r="30" fill="#fecaca" stroke="#dc2626" stroke-width="2.5" />
      <circle cx="60" cy="60" r="14" fill="#991b1b" />
    `,
    distractors: {
      single: `<circle cx="60" cy="60" r="42" fill="none" stroke="#dc2626" stroke-width="3" /><circle cx="60" cy="60" r="6" fill="#991b1b" />`,
      cross: `<circle cx="60" cy="60" r="42" fill="none" stroke="#dc2626" stroke-width="3" /><circle cx="60" cy="60" r="22" fill="#fecaca" stroke="#dc2626" stroke-width="2" /><line x1="20" y1="60" x2="100" y2="60" stroke="#991b1b" stroke-width="2" /><line x1="60" y1="20" x2="60" y2="100" stroke="#991b1b" stroke-width="2" />`,
      squares: `<rect x="20" y="20" width="80" height="80" fill="none" stroke="#dc2626" stroke-width="3" rx="4" /><rect x="36" y="36" width="48" height="48" fill="#fecaca" stroke="#dc2626" stroke-width="2" /><rect x="52" y="52" width="16" height="16" fill="#991b1b" />`,
    }
  },
  2: {
    // Isometric 3D Cube
    main: `
      <polygon points="60,18 102,39 60,60 18,39" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" />
      <polygon points="18,39 60,60 60,102 18,81" fill="#0284c7" stroke="#0369a1" stroke-width="2.5" />
      <polygon points="60,60 102,39 102,81 60,102" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5" />
    `,
    distractors: {
      flat: `<rect x="25" y="25" width="70" height="70" fill="#bae6fd" stroke="#0284c7" stroke-width="3" rx="4" /><line x1="25" y1="25" x2="95" y2="95" stroke="#0284c7" stroke-width="3" />`,
      column: `<polygon points="60,15 95,30 60,45 25,30" fill="#bae6fd" stroke="#0284c7" stroke-width="2" /><polygon points="25,30 60,45 60,105 25,90" fill="#0284c7" stroke="#0369a1" stroke-width="2" /><polygon points="60,45 95,30 95,90 60,105" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />`,
      inverted: `<polygon points="60,102 102,81 60,60 18,81" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" /><polygon points="18,81 60,60 60,18 18,39" fill="#0284c7" stroke="#0369a1" stroke-width="2.5" /><polygon points="60,60 102,81 102,39 60,18" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5" />`
    }
  },
  3: {
    // Five-Point Star
    main: `
      <polygon points="60,14 72,48 108,48 78,69 90,103 60,82 30,103 42,69 12,48 48,48" fill="#facc15" stroke="#ca8a04" stroke-width="3" />
    `,
    distractors: {
      star4: `<polygon points="60,15 72,48 105,60 72,72 60,105 48,72 15,60 48,48" fill="#facc15" stroke="#ca8a04" stroke-width="3" />`,
      star6: `<polygon points="60,18 96,82 24,82" fill="#facc15" stroke="#ca8a04" stroke-width="2.5" /><polygon points="60,94 96,30 24,30" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" fill-opacity="0.6" />`,
      star8: `<polygon points="60,15 70,42 97,33 88,60 115,70 88,80 97,107 70,98 60,125 50,98 23,107 32,80 5,70 32,60 23,33 50,42" fill="#facc15" stroke="#ca8a04" stroke-width="2" />`
    }
  },
  4: {
    // Hexagonal Clock Dial
    main: `
      <polygon points="60,16 98,38 98,82 60,104 22,82 22,38" fill="#f1f5f9" stroke="#334155" stroke-width="3" />
      <circle cx="60" cy="60" r="5" fill="#dc2626" />
      <line x1="60" y1="60" x2="60" y2="30" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" />
      <line x1="60" y1="60" x2="86" y2="60" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
    `,
    distractors: {
      clock1230: `<polygon points="60,16 98,38 98,82 60,104 22,82 22,38" fill="#f1f5f9" stroke="#334155" stroke-width="3" /><circle cx="60" cy="60" r="5" fill="#dc2626" /><line x1="60" y1="60" x2="60" y2="30" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" /><line x1="60" y1="60" x2="60" y2="86" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />`,
      clock900: `<polygon points="60,16 98,38 98,82 60,104 22,82 22,38" fill="#f1f5f9" stroke="#334155" stroke-width="3" /><circle cx="60" cy="60" r="5" fill="#dc2626" /><line x1="60" y1="60" x2="60" y2="30" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" /><line x1="60" y1="60" x2="34" y2="60" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />`,
      round: `<circle cx="60" cy="60" r="44" fill="#f1f5f9" stroke="#334155" stroke-width="3" /><circle cx="60" cy="60" r="5" fill="#dc2626" /><line x1="60" y1="60" x2="60" y2="30" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" /><line x1="60" y1="60" x2="86" y2="60" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />`
    }
  },
  5: {
    // Crossed Compass / Anchor
    main: `
      <circle cx="60" cy="60" r="44" stroke="#059669" stroke-width="3" fill="none" />
      <polygon points="60,20 68,52 60,45 52,52" fill="#dc2626" />
      <polygon points="60,100 68,68 60,75 52,68" fill="#334155" />
      <line x1="22" y1="60" x2="98" y2="60" stroke="#059669" stroke-width="3" />
    `,
    distractors: {
      south: `<circle cx="60" cy="60" r="44" stroke="#059669" stroke-width="3" fill="none" /><polygon points="60,100 68,68 60,75 52,68" fill="#334155" /><line x1="22" y1="60" x2="98" y2="60" stroke="#059669" stroke-width="3" />`,
      fourway: `<circle cx="60" cy="60" r="44" stroke="#059669" stroke-width="3" fill="none" /><polygon points="60,20 68,50 52,50" fill="#dc2626" /><polygon points="60,100 68,70 52,70" fill="#334155" /><polygon points="20,60 50,68 50,52" fill="#059669" /><polygon points="100,60 70,68 70,52" fill="#059669" />`,
      anchor: `<circle cx="60" cy="30" r="10" stroke="#059669" stroke-width="3" fill="none" /><line x1="60" y1="40" x2="60" y2="95" stroke="#334155" stroke-width="4" /><path d="M26 80 Q60 108 94 80" stroke="#059669" stroke-width="4" fill="none" />`
    }
  },
  6: {
    // Inverted Double Triangle
    main: `
      <polygon points="60,20 102,96 18,96" fill="#f8fafc" stroke="#4f46e5" stroke-width="3" />
      <polygon points="60,100 102,24 18,24" fill="#818cf8" fill-opacity="0.35" stroke="#4f46e5" stroke-width="2.5" />
    `,
    distractors: {
      single: `<polygon points="60,22 102,98 18,98" fill="#f8fafc" stroke="#4f46e5" stroke-width="3" />`,
      sideBySide: `<polygon points="40,30 70,85 10,85" fill="#f8fafc" stroke="#4f46e5" stroke-width="2.5" /><polygon points="80,30 110,85 50,85" fill="#818cf8" fill-opacity="0.35" stroke="#4f46e5" stroke-width="2" />`,
      nested: `<polygon points="60,18 104,98 16,98" fill="none" stroke="#4f46e5" stroke-width="3" /><polygon points="60,40 88,90 32,90" fill="none" stroke="#4f46e5" stroke-width="2" />`
    }
  },
  7: {
    // Railway Semaphore Flag
    main: `
      <rect x="54" y="16" width="12" height="88" fill="#334155" rx="3" />
      <polygon points="66,22 114,22 98,46 66,46" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
      <circle cx="60" cy="94" r="16" fill="#facc15" stroke="#ca8a04" stroke-width="2.5" />
    `,
    distractors: {
      armUp: `<rect x="54" y="16" width="12" height="88" fill="#334155" rx="3" /><polygon points="66,46 106,14 114,24 76,56" fill="#ef4444" stroke="#b91c1c" stroke-width="2" /><circle cx="60" cy="94" r="16" fill="#facc15" stroke="#ca8a04" stroke-width="2.5" />`,
      armDown: `<rect x="54" y="16" width="12" height="88" fill="#334155" rx="3" /><polygon points="66,30 106,62 98,72 66,40" fill="#ef4444" stroke="#b91c1c" stroke-width="2" /><circle cx="60" cy="94" r="16" fill="#facc15" stroke="#ca8a04" stroke-width="2.5" />`,
      doubleArm: `<rect x="54" y="16" width="12" height="88" fill="#334155" rx="3" /><polygon points="66,22 114,22 98,46 66,46" fill="#ef4444" stroke="#b91c1c" stroke-width="2" /><polygon points="54,22 6,22 22,46 54,46" fill="#ef4444" stroke="#b91c1c" stroke-width="2" /><circle cx="60" cy="94" r="16" fill="#facc15" stroke="#ca8a04" stroke-width="2.5" />`
    }
  },
  8: {
    // Diamond with Embedded Cross
    main: `
      <polygon points="60,16 104,60 60,104 16,60" fill="#fed7aa" stroke="#ea580c" stroke-width="3" />
      <line x1="60" y1="28" x2="60" y2="92" stroke="#9a3412" stroke-width="3.5" />
      <line x1="28" y1="60" x2="92" y2="60" stroke="#9a3412" stroke-width="3.5" />
    `,
    distractors: {
      plain: `<polygon points="60,16 104,60 60,104 16,60" fill="#fed7aa" stroke="#ea580c" stroke-width="3" />`,
      diagX: `<polygon points="60,16 104,60 60,104 16,60" fill="#fed7aa" stroke="#ea580c" stroke-width="3" /><line x1="36" y1="36" x2="84" y2="84" stroke="#9a3412" stroke-width="3.5" /><line x1="84" y1="36" x2="36" y2="84" stroke="#9a3412" stroke-width="3.5" />`,
      squareCross: `<rect x="24" y="24" width="72" height="72" fill="#fed7aa" stroke="#ea580c" stroke-width="3" rx="4" /><line x1="60" y1="24" x2="60" y2="96" stroke="#9a3412" stroke-width="3.5" /><line x1="24" y1="60" x2="96" y2="60" stroke="#9a3412" stroke-width="3.5" />`
    }
  },
  9: {
    // Locomotive Wheel
    main: `
      <circle cx="60" cy="60" r="44" fill="#e2e8f0" stroke="#1e293b" stroke-width="3.5" />
      <circle cx="60" cy="60" r="20" fill="#64748b" />
      <path d="M16 60 A44 44 0 0 1 104 60 Z" fill="#991b1b" />
      <circle cx="60" cy="60" r="6" fill="#f8fafc" />
    `,
    distractors: {
      bottomWeight: `<circle cx="60" cy="60" r="44" fill="#e2e8f0" stroke="#1e293b" stroke-width="3.5" /><circle cx="60" cy="60" r="20" fill="#64748b" /><path d="M16 60 A44 44 0 0 0 104 60 Z" fill="#991b1b" /><circle cx="60" cy="60" r="6" fill="#f8fafc" />`,
      spoked: `<circle cx="60" cy="60" r="44" fill="#e2e8f0" stroke="#1e293b" stroke-width="3.5" /><circle cx="60" cy="60" r="16" fill="#64748b" /><line x1="16" y1="60" x2="104" y2="60" stroke="#1e293b" stroke-width="2.5" /><line x1="60" y1="16" x2="60" y2="104" stroke="#1e293b" stroke-width="2.5" />`,
      gear: `<circle cx="60" cy="60" r="38" fill="#e2e8f0" stroke="#1e293b" stroke-width="3" /><circle cx="60" cy="60" r="14" fill="#64748b" /><rect x="55" y="12" width="10" height="96" fill="#1e293b" /><rect x="12" y="55" width="96" height="10" fill="#1e293b" />`
    }
  },
  10: {
    // Royal Blue Shield
    main: `
      <path d="M26 24 L94 24 C94 66 60 98 60 98 C60 98 26 66 26 24 Z" fill="#e0e7ff" stroke="#4338ca" stroke-width="3" />
      <circle cx="60" cy="54" r="14" fill="#f59e0b" stroke="#b45309" stroke-width="2" />
    `,
    distractors: {
      pennant: `<polygon points="25,25 95,60 25,95" fill="#e0e7ff" stroke="#4338ca" stroke-width="3" /><circle cx="48" cy="60" r="10" fill="#f59e0b" />`,
      checkered: `<path d="M26 24 L94 24 C94 66 60 98 60 98 C60 98 26 66 26 24 Z" fill="#e0e7ff" stroke="#4338ca" stroke-width="3" /><line x1="26" y1="56" x2="94" y2="56" stroke="#4338ca" stroke-width="2.5" /><line x1="60" y1="24" x2="60" y2="98" stroke="#4338ca" stroke-width="2.5" />`,
      roundStar: `<circle cx="60" cy="60" r="42" fill="#e0e7ff" stroke="#4338ca" stroke-width="3" /><polygon points="60,32 67,52 88,52 71,64 78,84 60,72 42,84 49,64 32,52 53,52" fill="#f59e0b" />`
    }
  },
  11: {
    // Triangular Prism
    main: `
      <polygon points="24,96 96,96 60,26" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
      <line x1="60" y1="26" x2="60" y2="96" stroke="#ca8a04" stroke-width="2.5" />
      <circle cx="60" cy="72" r="8" fill="#dc2626" />
    `,
    distractors: {
      plainTri: `<polygon points="24,96 96,96 60,26" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />`,
      house: `<polygon points="24,60 96,60 60,18" fill="#fef08a" stroke="#ca8a04" stroke-width="3" /><rect x="34" y="60" width="52" height="42" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />`,
      trapezoid: `<polygon points="36,26 84,26 102,96 18,96" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />`
    }
  },
  12: {
    // Concentric Octagon
    main: `
      <polygon points="60,18 90,30 102,60 90,90 60,102 30,90 18,60 30,30" fill="#ecfdf5" stroke="#059669" stroke-width="3" />
      <polygon points="60,34 78,41 85,60 78,79 60,86 42,79 35,60 42,41" fill="#059669" />
      <circle cx="60" cy="60" r="5" fill="#ffffff" />
    `,
    distractors: {
      hexagon: `<polygon points="60,20 95,40 95,80 60,100 25,80 25,40" fill="#ecfdf5" stroke="#059669" stroke-width="3" /><circle cx="60" cy="60" r="8" fill="#059669" />`,
      solidDark: `<polygon points="60,18 90,30 102,60 90,90 60,102 30,90 18,60 30,30" fill="#059669" stroke="#047857" stroke-width="3" />`,
      spokes: `<polygon points="60,18 90,30 102,60 90,90 60,102 30,90 18,60 30,30" fill="#ecfdf5" stroke="#059669" stroke-width="3" /><line x1="60" y1="18" x2="60" y2="102" stroke="#059669" stroke-width="2" /><line x1="18" y1="60" x2="102" y2="60" stroke="#059669" stroke-width="2" />`
    }
  }
};

function wrapSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><rect width="120" height="120" fill="#ffffff" rx="8" stroke="#e2e8f0" stroke-width="2" />${inner}</svg>`;
}

async function run() {
  const correctOptions = ['A', 'B', 'C', 'D']; // i % 4

  for (let q = 1; q <= 12; q++) {
    const shape = shapes[q];
    const correctLetter = correctOptions[(q - 1) % 4];

    // 1. Generate Target Image: q-{q}-target.png & .svg
    const targetSvg = wrapSvg(shape.main);
    fs.writeFileSync(path.join(outDir, `q-${q}-target.svg`), targetSvg);
    await sharp(Buffer.from(targetSvg)).png().toFile(path.join(outDir, `q-${q}-target.png`));

    // 2. Map Options A, B, C, D
    const distKeyList = Object.keys(shape.distractors);
    let distIdx = 0;
    const optionLetters = ['A', 'B', 'C', 'D'];

    for (const letter of optionLetters) {
      let optInner = '';
      if (letter === correctLetter) {
        optInner = shape.main;
      } else {
        const key = distKeyList[distIdx % distKeyList.length];
        optInner = shape.distractors[key];
        distIdx++;
      }

      const optSvg = wrapSvg(optInner);
      fs.writeFileSync(path.join(outDir, `q-${q}-opt-${letter}.svg`), optSvg);
      await sharp(Buffer.from(optSvg)).png().toFile(path.join(outDir, `q-${q}-opt-${letter}.png`));
    }
  }

  console.log('✅ Generated 12 target graphics and 48 option graphics in public/tests/memory/');
}

run().catch(console.error);
