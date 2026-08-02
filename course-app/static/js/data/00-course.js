/* ═══════════════════════════════════════════════════════════
   COURSE DATA
   Block grammar:
     ['p', text]            paragraph   (inline: `code`, **bold**)
     ['h', text]            subheading
     ['ul', [items]]        bullet list
     ['code', lang, src]    highlighted, copyable code block
     ['note', text]         aside
     ['warn', text]         caution aside
     ['tbl', [head], [rows]] table
     ['lab', 'css'|'js', src] live editor
   Exercise: { q, hint, a, code:[lang, src] }
   ═══════════════════════════════════════════════════════════ */
const COURSE = {};


