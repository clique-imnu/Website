import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { buildIcosahedron, drawIcosahedron, sizeCanvasToDisplay } from '../lib/icosahedron';
import { getStoredAccent } from '../hooks/useAccent';
import { useScramble } from '../hooks/useScramble';
import { useMagnetic } from '../hooks/useMagnetic';
import { fireConfetti } from '../lib/confetti';
import { isSheetConfigured, submitRegistration, type Registration } from '../lib/registration';
import { INSTAGRAM_URL } from '../lib/content';
import { FilmGrain } from '../components/FilmGrain';
import { Logo } from '../components/Logo';

const SKILLS = ['Poster Making', 'Video Making', 'Content Writing', 'Public Speaking', 'Social Media', 'Event Planning', 'Sponsorship Pitching'];
const SECTIONS = [
  'MBA-FT Section A',
  'MBA-FT Section B',
  'MBA-FT Section C',
  'MBA-FT Section D',
  'MBA-FT Section E',
  'MBA-FT Section F',
  'MBA-HRM',
  'MBA-FBE',
  'IMBA',
];
const RESIDENCES = ['Hostel H1', 'Hostel H2', 'Hostel H3', 'Hostel H4', 'Outside Campus'];

const AURA_RANKS: [number, string][] = [
  [1, 'CERTIFIED CLIQUE MATERIAL ✦'],
  [0.8, 'PROTAGONIST DETECTED'],
  [0.6, 'MAIN CHARACTER LOADING…'],
  [0.4, 'SIDE CHARACTER ARC'],
  [0.2, 'BACKGROUND CHARACTER'],
  [0, 'NPC ENERGY (fixable)'],
];

const SENDING_LINES = [
  'BRIBING THE CAMPUS WIFI…',
  'CONSULTING THE GROUP CHAT…',
  'RUNNING VIBE DIAGNOSTICS…',
  'NOTARIZING UR AURA…',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mono: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.18em',
};

// Label > placeholder > typed-text is the reader's scan order; boost the label
// so the "what is this field" reads first, then the hint.
const fieldLabel: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.14em',
  fontSize: 12,
  fontWeight: 500,
  color: '#F5F3F0',
  display: 'block',
  marginBottom: 10,
};

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#0B0B0B',
  border: '1px dashed #FFFFFF33',
  borderRadius: 12,
  color: '#F5F3F0',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 15,
  padding: '13px 16px',
  outline: 'none',
};

function GroupTag({ children }: { children: string }) {
  return (
    <div style={{ ...mono, fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 12, margin: '34px 0 18px 0' }}>
      {children}
      <span style={{ flex: 1, height: 1, background: '#FFFFFF14' }} />
    </div>
  );
}

// little ✦ burst when a chip is toggled on
function starBurst(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const colors = ['var(--accent)', 'var(--lime)', 'var(--pink)'];
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('span');
    s.textContent = '✦';
    const a = (i / 6) * Math.PI * 2;
    s.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;z-index:9999;pointer-events:none;font-size:${10 + Math.random() * 8}px;color:${colors[i % 3]};`;
    document.body.appendChild(s);
    s.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * 60 - 50}%, ${Math.sin(a) * 60 - 50}%) translate(${Math.cos(a) * 46}px, ${Math.sin(a) * 46}px) scale(0.2) rotate(120deg)`, opacity: 0 },
      ],
      { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    ).onfinish = () => s.remove();
  }
}

export function JoinPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const [form, setForm] = useState({
    name: '',
    rollNo: '',
    section: '',
    email: '',
    whatsapp: '',
    residence: '',
    hometown: '',
    experience: '',
    whyClub: '',
    goodFit: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [sendLine, setSendLine] = useState(0);

  useScramble(headingRef);
  useScramble(successRef, "You're in the loop.");
  useMagnetic();

  // ---- completion score: drives the icosahedron assembly + aura meter ----
  const cleanPhone = form.whatsapp.replace(/[\s-]/g, '');
  const nameOk = form.name.trim().length > 1;
  const rollOk = form.rollNo.trim().length >= 2;
  const sectionOk = form.section.trim().length > 0;
  const emailOk = EMAIL_RE.test(form.email.trim());
  const whatsappOk = /^\d{10}$/.test(cleanPhone);
  const residenceOk = form.residence.trim().length > 0;
  const skillsOk = skills.length > 0;
  const experienceOk = form.experience.trim().length > 0;
  const whyOk = form.whyClub.trim().length > 0;
  const score =
    (nameOk ? 0.12 : 0) +
    (rollOk ? 0.1 : 0) +
    (sectionOk ? 0.1 : 0) +
    (emailOk ? 0.12 : 0) +
    (whatsappOk ? 0.12 : 0) +
    (residenceOk ? 0.1 : 0) +
    (skillsOk ? 0.12 : 0) +
    (experienceOk ? 0.1 : 0) +
    (whyOk ? 0.12 : 0);
  const rank = AURA_RANKS.find(([min]) => score >= min)![1];

  const scoreRef = useRef(score);
  const statusRef = useRef(status);
  useEffect(() => {
    scoreRef.current = score;
    statusRef.current = status;
  }, [score, status]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // cycling transmit messages
  useEffect(() => {
    if (status !== 'sending') return;
    const t = window.setInterval(() => setSendLine((i) => (i + 1) % SENDING_LINES.length), 500);
    return () => window.clearInterval(t);
  }, [status]);

  // ---- the star of the show: exploded icosahedron that assembles as the
  // form fills in. explode 0.9 (empty form) → 0 (complete). Cursor tilts it.
  useEffect(() => {
    const canvas = canvasRef.current;
    const mini = miniCanvasRef.current;
    if (!canvas) return;
    const ico = buildIcosahedron();
    sizeCanvasToDisplay(canvas);
    if (mini) sizeCanvasToDisplay(mini);
    let rot = 2.2;
    let explodeCur = 0.9;
    let nmy = 0;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      nmy = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove);
    const tick = () => {
      const done = statusRef.current === 'done';
      const targetExplode = done ? 0 : 0.9 * (1 - scoreRef.current);
      explodeCur += (targetExplode - explodeCur) * 0.06; // springy settle
      rot += 0.003 + scoreRef.current * 0.006 + (done ? 0.012 : 0);
      if (canvas.width > 2) {
        drawIcosahedron(ico, canvas, rot, {
          color: getStoredAccent(),
          scale: 0.3,
          rings: explodeCur < 0.35, // rings only appear once mostly assembled
          explode: explodeCur,
          tilt: nmy * 0.5,
        });
      }
      if (mini && mini.width > 2) {
        drawIcosahedron(ico, mini, -rot * 0.7, { color: getStoredAccent(), scale: 0.3, explode: explodeCur * 0.5 });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => {
      sizeCanvasToDisplay(canvas);
      if (mini) sizeCanvasToDisplay(mini);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // subtle 3D tilt on the form card
  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transition = 'border-color 0.3s';
    card.style.transform = `perspective(1400px) rotateX(${-py * 2.4}deg) rotateY(${px * 3}deg)`;
  };
  const onCardLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform = 'none';
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleSkill = (tag: string, el: HTMLElement) => {
    setSkills((cur) => {
      const on = cur.includes(tag);
      if (!on) starBurst(el);
      return on ? cur.filter((t) => t !== tag) : [...cur, tag];
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!nameOk) errs.name = 'we need a name bestie';
    if (!rollOk) errs.rollNo = 'drop your roll no';
    if (!sectionOk) errs.section = 'pick your section';
    if (!emailOk) errs.email = 'that email looks sus';
    if (!whatsappOk) errs.whatsapp = '10 digits, no cap';
    if (!residenceOk) errs.residence = 'where you crashing?';
    if (!skillsOk) errs.skills = 'pick at least one skill';
    if (!experienceOk) errs.experience = 'this one is required bestie';
    if (!whyOk) errs.whyClub = 'this one is required bestie';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async () => {
    if (status === 'sending') return;
    if (!validate()) return;
    // open Instagram in the same user gesture so the popup isn't blocked
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    setStatus('sending');
    const payload: Registration = {
      name: form.name.trim(),
      rollNo: form.rollNo.trim(),
      section: form.section,
      email: form.email.trim(),
      whatsapp: cleanPhone,
      residence: form.residence,
      hometown: form.hometown.trim(),
      skills: skills.join(', '),
      experience: form.experience.trim(),
      whyClub: form.whyClub.trim(),
      goodFit: form.goodFit.trim(),
    };
    try {
      // minimum 2s so the transmit theater gets its moment
      await Promise.all([submitRegistration(payload), new Promise((r) => setTimeout(r, 2000))]);
      setStatus('done');
      fireConfetti('APPLICATION RECEIVED ✦');
    } catch {
      setStatus('idle');
      setErrors({ submit: 'network said no — try again in a sec' });
    }
  };

  const errText = (key: string) =>
    errors[key] ? (
      <div style={{ ...mono, fontSize: 10, color: 'var(--pink)', marginTop: 6 }}>{errors[key].toUpperCase()}</div>
    ) : null;

  // live sass reactions
  const reaction = (text: string, color = 'var(--lime)') => (
    <div style={{ ...mono, fontSize: 10, color, marginTop: 6 }}>{text}</div>
  );
  const emailReaction = emailOk
    ? form.email.includes('nirmauni')
      ? reaction('CAMPUS CERTIFIED ✦')
      : reaction('USE UR NIRMA EMAIL BESTIE', 'var(--pink)')
    : null;
  const whatsappReaction = !whatsappOk && cleanPhone.length > 0 && /^\d+$/.test(cleanPhone) && !errors.whatsapp
    ? reaction(`${cleanPhone.length}/10 DIGITS… KEEP GOING BESTIE`, '#6E6862')
    : whatsappOk
      ? reaction('PERFECT. SCREENSHOT THIS MOMENT.')
      : null;
  const expLen = form.experience.trim().length;
  const experienceReaction = expLen === 0 ? null : expLen < 40 ? reaction('COOKING…', '#6E6862') : expLen < 150 ? reaction('CHEF MODE ACTIVATED') : reaction('OK SHAKESPEARE, WE SEE YOU', 'var(--pink)');
  const whyLen = form.whyClub.trim().length;
  const whyReaction = whyLen === 0 ? null : whyLen < 40 ? reaction('COOKING…', '#6E6862') : whyLen < 150 ? reaction('CHEF MODE ACTIVATED') : reaction('OK SHAKESPEARE, WE SEE YOU', 'var(--pink)');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0B0B',
        color: '#F5F3F0',
        fontFamily: "'Space Grotesk', sans-serif",
        overflowX: 'clip',
        position: 'relative',
      }}
    >
      <FilmGrain />

      {/* main assembling icosahedron */}
      <div style={{ position: 'fixed', top: '-2%', right: '-8%', width: 'min(60vw, 780px)', height: 'min(60vw, 780px)', pointerEvents: 'none', opacity: 0.55 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        <div data-mhide="true" style={{ position: 'absolute', bottom: '18%', right: '16%', ...mono, fontSize: 10, color: '#6E6862', textAlign: 'right', lineHeight: 1.9 }}>
          FIG. 08.1 — THE NETWORK
          <br />
          STATE: {status === 'done' ? 'ASSEMBLED ✦' : `${Math.round(score * 100)}% ASSEMBLED`}
          <br />
          FUEL: UR ANSWERS
        </div>
      </div>
      {/* mini counter-rotating one, bottom-left */}
      <div style={{ position: 'fixed', bottom: '-6%', left: '-6%', width: 'min(34vw, 360px)', height: 'min(34vw, 360px)', pointerEvents: 'none', opacity: 0.22 }}>
        <canvas ref={miniCanvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-10%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in oklab, var(--pink) 14%, transparent), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* top bar */}
      <div data-mpad="true" style={{ padding: '22px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <Link to="/" className="hover-accent" style={{ ...mono, fontSize: 12, color: '#9A948C', textDecoration: 'none' }}>
          ← BACK TO THE CLIQUE
        </Link>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex' }} aria-label="CLIQUE — home">
          <Logo size={32} withWordmark wordmarkSize={16} />
        </Link>
      </div>

      <main data-mpad="true" style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(20px, 5vh, 60px) 32px 90px 32px', boxSizing: 'border-box', position: 'relative', zIndex: 2 }}>
        {status !== 'done' ? (
          <>
            <div style={{ ...mono, fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
              FIG. 08
              <span style={{ width: 34, height: 1, background: '#3A3630', display: 'inline-block' }} />
              RECRUITMENT PROTOCOL
              {!isSheetConfigured() && (
                <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6E6862', border: '1px dashed #FFFFFF33', borderRadius: 100, padding: '4px 10px' }}>
                  DEMO MODE
                </span>
              )}
            </div>

            <div style={{ position: 'relative', width: 'fit-content' }}>
              <h1
                ref={headingRef}
                style={{
                  margin: '20px 0 8px 0',
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(42px, 8vw, 96px)',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                Lock in.
              </h1>
              <div
                data-rsticker="true"
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -40,
                  rotate: '8deg',
                  background: 'var(--lime)',
                  color: '#0B0B0B',
                  fontFamily: "'Shantell Sans', cursive",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: '7px 14px',
                  borderRadius: 100,
                  border: '2px solid #0B0B0B',
                  boxShadow: '4px 4px 0 #00000080',
                  animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ display: 'inline-block', animation: 'wiggle 3s ease-in-out infinite' }}>no interview, just vibes ✦</span>
              </div>
            </div>

            <p style={{ margin: '10px 0 34px 0', maxWidth: 480, color: '#9A948C', fontSize: 16, lineHeight: 1.65 }}>
              See that shattered shape floating there? →<br />
              That&apos;s the network without you in it. Every answer you fill pulls it back together. No pressure.
            </p>

            {/* form card w/ 3D tilt */}
            <div
              ref={cardRef}
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              style={{
                border: '1px solid #FFFFFF14',
                borderRadius: 22,
                background: '#FFFFFF08',
                backdropFilter: 'blur(14px)',
                padding: 'clamp(22px, 4vw, 40px)',
                position: 'relative',
                animation: 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <div style={{ position: 'absolute', top: 12, right: 18, ...mono, fontSize: 10, color: '#4A443C' }}>FORM_v2.0 · ENCRYPTED (trust)</div>

              {/* aura meter */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ ...mono, fontSize: 11, color: '#6E6862' }}>AURA METER</span>
                  <span style={{ ...mono, fontSize: 11, color: score >= 0.8 ? 'var(--lime)' : score >= 0.4 ? 'var(--accent)' : '#9A948C' }}>
                    {Math.round(score * 100)}% — {rank}
                  </span>
                </div>
                <div style={{ marginTop: 8, height: 8, borderRadius: 100, background: '#FFFFFF10', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(2, score * 100)}%`,
                      borderRadius: 100,
                      background: 'linear-gradient(90deg, var(--accent), var(--pink), var(--lime))',
                      boxShadow: '0 0 12px color-mix(in oklab, var(--accent) 60%, transparent)',
                      transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                </div>
              </div>

              <GroupTag>FIELD 01 — IDENTITY</GroupTag>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
                <div>
                  <label style={fieldLabel}>NAME *</label>
                  <input value={form.name} onChange={set('name')} placeholder="main character name" maxLength={60} className="join-input" style={inputStyle} />
                  {errText('name')}
                </div>
                <div>
                  <label style={fieldLabel}>ROLL NO. *</label>
                  <input value={form.rollNo} onChange={set('rollNo')} placeholder="e.g. 24MBA123 (flex it)" maxLength={20} className="join-input" style={inputStyle} />
                  {errText('rollNo')}
                </div>
                <div>
                  <label style={fieldLabel}>SECTION *</label>
                  <select value={form.section} onChange={set('section')} className="join-input" style={{ ...inputStyle, cursor: 'pointer', color: form.section ? '#F5F3F0' : '#6E6862' }}>
                    <option value="" disabled style={{ background: '#111' }}>select your section</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s} style={{ background: '#111', color: '#F5F3F0' }}>{s}</option>
                    ))}
                  </select>
                  {errText('section')}
                </div>
              </div>

              <GroupTag>FIELD 02 — CAMPUS</GroupTag>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
                <div>
                  <label style={fieldLabel}>NIRMA E-MAIL *</label>
                  <input value={form.email} onChange={set('email')} placeholder="you@nirmauni.ac.in" type="email" maxLength={80} className="join-input" style={inputStyle} />
                  {errText('email') || emailReaction}
                </div>
                <div>
                  <label style={fieldLabel}>WHATSAPP NUMBER *</label>
                  <input value={form.whatsapp} onChange={set('whatsapp')} placeholder="10 digits, we'll ping you" inputMode="numeric" maxLength={14} className="join-input" style={inputStyle} />
                  {errText('whatsapp') || whatsappReaction}
                </div>
                <div>
                  <label style={fieldLabel}>RESIDENCE *</label>
                  <select value={form.residence} onChange={set('residence')} className="join-input" style={{ ...inputStyle, cursor: 'pointer', color: form.residence ? '#F5F3F0' : '#6E6862' }}>
                    <option value="" disabled style={{ background: '#111' }}>where you crashing?</option>
                    {RESIDENCES.map((r) => (
                      <option key={r} value={r} style={{ background: '#111', color: '#F5F3F0' }}>{r}</option>
                    ))}
                  </select>
                  {errText('residence')}
                </div>
                <div>
                  <label style={fieldLabel}>HOMETOWN</label>
                  <input value={form.hometown} onChange={set('hometown')} placeholder="Eg. Ahmedabad, Gujarat" maxLength={60} className="join-input" style={inputStyle} />
                </div>
              </div>

              <GroupTag>FIELD 03 — SKILL SET</GroupTag>
              <label style={fieldLabel}>CHOOSE YOUR SKILL SET * (PICK ANY)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 6, position: 'relative' }}>
                {SKILLS.map((tag, i) => {
                  const on = skills.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={(e) => toggleSkill(tag, e.currentTarget)}
                      type="button"
                      style={{
                        cursor: 'pointer',
                        ...mono,
                        fontSize: 12,
                        padding: '9px 18px',
                        borderRadius: 100,
                        border: on ? '2px solid #0B0B0B' : '1px dashed #FFFFFF33',
                        background: on ? 'var(--lime)' : 'transparent',
                        color: on ? '#0B0B0B' : '#9A948C',
                        fontWeight: on ? 700 : 400,
                        rotate: on ? `${(i % 2 === 0 ? -1 : 1) * 2}deg` : '0deg',
                        boxShadow: on ? '3px 3px 0 #00000080' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      {tag} {on ? '✦' : '+'}
                    </button>
                  );
                })}
              </div>
              {skills.length === SKILLS.length && (
                <div
                  style={{
                    width: 'fit-content',
                    rotate: '-2deg',
                    background: 'var(--pink)',
                    color: '#0B0B0B',
                    fontFamily: "'Shantell Sans', cursive",
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '6px 13px',
                    borderRadius: 100,
                    border: '2px solid #0B0B0B',
                    boxShadow: '3px 3px 0 #00000080',
                    marginTop: 8,
                    animation: 'fadeUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                  }}
                >
                  overachiever detected 💀 (we respect it)
                </div>
              )}
              {errText('skills')}

              <GroupTag>FIELD 04 — EXPERIENCE &amp; EXPECTATIONS</GroupTag>
              <div>
                <label style={fieldLabel}>
                  BRIEFLY DESCRIBE YOUR PREVIOUS EXPERIENCE IN CLUBS, COMMITTEES, EVENTS, LEADERSHIP ROLES, AND OTHER RELEVANT ACTIVITIES. *
                </label>
                <textarea
                  value={form.experience}
                  onChange={set('experience')}
                  placeholder="cook here… (be real)"
                  maxLength={600}
                  rows={4}
                  className="join-input"
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Space Grotesk', sans-serif" }}
                />
                {errText('experience') || experienceReaction}
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={fieldLabel}>
                  WHY DO YOU WANT TO BECOME A PART OF CLUB? WHAT WOULD YOU CONTRIBUTE AND GAIN FROM THE CLUB? *
                </label>
                <textarea
                  value={form.whyClub}
                  onChange={set('whyClub')}
                  placeholder="cook here… (rizz optional)"
                  maxLength={600}
                  rows={4}
                  className="join-input"
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Space Grotesk', sans-serif" }}
                />
                {errText('whyClub') || whyReaction}
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={fieldLabel}>WHAT MAKES YOU A GOOD FIT FOR CLUB? (OPTIONAL)</label>
                <textarea
                  value={form.goodFit}
                  onChange={set('goodFit')}
                  placeholder="sell yourself… (we're listening)"
                  maxLength={600}
                  rows={4}
                  className="join-input"
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>

              {errText('submit')}

              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, flexWrap: 'wrap' }}>
                <button
                  onClick={submit}
                  disabled={status === 'sending'}
                  data-magnet="true"
                  style={{
                    cursor: 'pointer',
                    background: 'var(--accent)',
                    color: '#0B0B0B',
                    border: 'none',
                    ...mono,
                    fontSize: 13,
                    fontWeight: 500,
                    padding: '17px 36px',
                    borderRadius: 100,
                    willChange: 'translate',
                    opacity: status === 'sending' ? 0.75 : 1,
                    minWidth: 260,
                  }}
                >
                  {status === 'sending' ? SENDING_LINES[sendLine] : 'SUBMIT APPLICATION →'}
                </button>
                <span style={{ ...mono, fontSize: 10, color: '#6E6862' }}>NO SPAM. ONLY BANGERS.</span>
              </div>
            </div>
          </>
        ) : (
          /* success state */
          <div style={{ textAlign: 'center', paddingTop: '8vh' }}>
            <div
              style={{
                width: 'fit-content',
                margin: '0 auto 26px auto',
                rotate: '-3deg',
                background: 'var(--pink)',
                color: '#0B0B0B',
                fontFamily: "'Shantell Sans', cursive",
                fontWeight: 700,
                fontSize: 14,
                padding: '8px 16px',
                borderRadius: 100,
                border: '2px solid #0B0B0B',
                boxShadow: '4px 4px 0 #00000080',
                animation: 'fadeUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both',
              }}
            >
              achievement unlocked: applied to CLIQUE ✦
            </div>
            <div style={{ ...mono, fontSize: 12, color: 'var(--lime)', marginBottom: 24 }}>STATUS: RECEIVED ✦ NETWORK: 100% ASSEMBLED</div>
            <h1
              ref={successRef}
              style={{
                margin: 0,
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(38px, 7vw, 84px)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              You&apos;re in the loop.
            </h1>
            <p style={{ margin: '24px auto 36px auto', maxWidth: 420, color: '#9A948C', fontSize: 16, lineHeight: 1.65 }}>
              The shape is whole again — that was you. We&apos;ll slide into your inbox soon (check spam, email is ancient tech).
            </p>
            <pre
              style={{
                margin: '0 auto 40px auto',
                ...mono,
                letterSpacing: '0.02em',
                fontSize: 12,
                lineHeight: 1.9,
                color: '#D9C4A3',
                background: '#0B0B0BCC',
                border: '1px solid #FFFFFF12',
                borderRadius: 12,
                padding: '16px 22px',
                width: 'fit-content',
                textAlign: 'left',
              }}
            >
              {JSON.stringify(
                { applicant: form.name.trim() || 'you', status: 'received', aura_rank: rank.toLowerCase(), vibe: 'immaculate', response_eta: 'soon™' },
                null,
                2,
              )}
            </pre>
            <Link
              to="/"
              data-magnet="true"
              style={{
                background: 'var(--lime)',
                color: '#0B0B0B',
                ...mono,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: 100,
                display: 'inline-block',
                willChange: 'translate',
              }}
            >
              BACK TO THE LORE ←
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
