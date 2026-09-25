const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'materials');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function createPdf(filename, title, subtitle) {
  const content = 
`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 280 >>
stream
BT
/F1 18 Tf
50 720 Td
(FIVE EDUCATION - RDSO PSYCHO CBT PREPARATION) Tj
0 -36 Td
/F1 13 Tf
(${title}) Tj
0 -26 Td
/F1 10 Tf
(${subtitle}) Tj
0 -30 Td
(Official syllabus-aligned study document for Indian Railways CBT.) Tj
0 -20 Td
(Visit: https://fiveeducation.in for online mock batteries and video classes.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000577 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
648
%%EOF`;

  fs.writeFileSync(path.join(dir, filename), content.trim());
  console.log('Created:', filename);
}

createPdf('rdso-t-score-formula-guide.pdf', 'RDSO Official T-Score Formula & Normalization Guide', 'Score Calculation, Mean, SD & Cutoff Criteria 42.0+');
createPdf('rdso-memory-shortcuts.pdf', 'Spatial Association & 12-Figure Recall Mnemonics', 'High-Speed Grid Association Techniques for ALP Psycho');
createPdf('rrb-alp-pyq-papers.pdf', 'RRB ALP Previous Year Psycho CBT Solved Papers', 'Compilation of 2018 - 2024 Actual Examination Memory Patterns');
createPdf('rdso-battery-notes.pdf', 'RDSO Psycho 5-Battery Comprehensive Notes', 'Full Theory, Rules & Sectional Qualifying Instructions');
createPdf('brick-test-geometry-rules.pdf', 'Brick Depth Perception 3D Contact Rules', 'Formula & Rapid Counting Method for 50 Questions in 5 Mins');
createPdf('clock-direction-tricks.pdf', 'Direction Test Clock & Table Rapid Navigation', 'Mental Compass Rotation Without Pen & Paper');
createPdf('concentration-yes-no-pairs.pdf', 'Concentration Yes-No Test Error Reduction Guide', '96 Questions in 4 Minutes - Elimination Strategy');
createPdf('perceptual-speed-scanning.pdf', 'Perceptual Speed & Hexagonal Scanning Drills', 'Rapid Visual Discrimination & Matching Shortcuts');
