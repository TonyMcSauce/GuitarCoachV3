// src/pages/Chords.jsx - V2
import React, { useState } from 'react';
import { CHORDS } from '../data/chords';
import { useAuth } from '../services/AuthContext';
import { markChordLearned } from '../services/userService';
import ChordDiagram from '../components/ChordDiagram';
import { XPToast } from '../components/XPToast';
import { playChordSound } from '../services/audioEngine';

function ChordCard({ chord, learned, onSelect }) {
  const categoryColor = {
    open: 'var(--green)', barre: 'var(--gold)', dominant7: 'var(--accent)',
    suspended: '#60c4d4', slash: 'var(--red)',
  }[chord.category] || 'var(--text-3)';

  return (
    <div
      className={`chord-card${learned ? ' learned' : ''}`}
      onClick={() => onSelect(chord)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div className="chord-name">{chord.id}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {learned && <span className="badge badge-green">✓ Learned</span>}
          <span style={{ fontSize: 10, color: categoryColor, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {chord.category}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
        {chord.name}
      </div>
      <div className="chord-svg-wrap">
        <ChordDiagram chord={chord} size={0.85} />
      </div>
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginTop: 12, width: '100%' }}
        onClick={e => { e.stopPropagation(); playChordSound(chord.id); }}
      >
        🔊 Hear Chord
      </button>
    </div>
  );
}

function ChordModal({ chord, learned, onLearn, onClose }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    playChordSound(chord.id);
    setTimeout(() => setPlaying(false), 1200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-accent)',
        borderRadius: 24, padding: 32, maxWidth: 540, width: '100%',
        boxShadow: 'var(--shadow-accent)', maxHeight: '90vh', overflow: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 52, fontStyle: 'italic', fontWeight: 300, letterSpacing: -2, lineHeight: 1 }}>{chord.id}</div>
            <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>{chord.name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <span className={`badge ${chord.difficulty === 'beginner' ? 'badge-green' : 'badge-gold'}`} style={{ textTransform: 'capitalize' }}>{chord.difficulty}</span>
              <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>{chord.category}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div className="chord-svg-wrap" style={{ flex: '0 0 auto' }}>
            <ChordDiagram chord={chord} size={1.1} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 12 }}>Finger Placement</h3>
            {chord.fingers?.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: 13 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, color: '#fff' }}>
                  {f.finger}
                </div>
                <span style={{ color: 'var(--text-2)' }}>String {f.string}, Fret {f.fret}</span>
              </div>
            ))}

            {chord.notes && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Notes</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {chord.notes.map(n => (
                    <span key={n} style={{ padding: '2px 8px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700 }}>{n}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 14, padding: '12px', background: 'var(--bg-2)', borderRadius: 10, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              💡 {chord.tips}
            </div>
          </div>
        </div>

        {/* Audio & action buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={handlePlay}
            style={{ borderColor: playing ? 'var(--accent)' : undefined, color: playing ? 'var(--accent)' : undefined }}
          >
            {playing ? '🎵 Playing...' : '🔊 Play Sound'}
          </button>
          {!learned ? (
            <button className="btn btn-success" style={{ flex: 1 }} onClick={onLearn}>
              +50 XP · Mark as Learned ✓
            </button>
          ) : (
            <div className="badge badge-green" style={{ padding: '10px 20px', flex: 1, justifyContent: 'center', borderRadius: 10, fontSize: 14 }}>
              ✓ You know this chord!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = ['all', 'open', 'barre', 'dominant7', 'suspended', 'slash'];

export default function Chords() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState(null);
  const [xpToast, setXpToast] = useState(null);
  const [filter, setFilter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  const knownChords = userProfile?.knownChords || [];

  const filtered = CHORDS.filter(c => {
    const matchCat = filter === 'all' ? true : filter === 'learned' ? knownChords.includes(c.id) : c.category === filter;
    const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
    const matchSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });

  const handleLearn = async () => {
    if (!selected || !currentUser) return;
    const result = await markChordLearned(currentUser.uid, selected.id);
    await refreshProfile();
    setXpToast({ xp: result.xpGained, message: `${selected.name} learned!`, leveledUp: result.leveledUp, newLevel: result.newLevel });
    setSelected(null);
  };

  const catLabel = (c) => ({
    all: `All (${CHORDS.length})`, open: 'Open', barre: 'Barre',
    dominant7: 'Dom 7th', suspended: 'Sus', slash: 'Slash', learned: `Learned (${knownChords.length})`
  })[c] || c;

  return (
    <div>
      <h1 className="page-title">Chord Library</h1>
      <p className="page-subtitle">Click any chord to see fingering. Hit 🔊 to hear it. Mark chords as learned to unlock songs.</p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="form-input" placeholder="Search chords..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 200 }} />
        <select className="form-input" style={{ maxWidth: 140 }} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[...CATEGORIES, 'learned'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
            {catLabel(f)}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered.map(chord => (
          <ChordCard key={chord.id} chord={chord} learned={knownChords.includes(chord.id)} onSelect={setSelected} />
        ))}
        {filtered.length === 0 && (
          <div style={{ color: 'var(--text-3)', gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>No chords found.</div>
        )}
      </div>

      {selected && (
        <ChordModal chord={selected} learned={knownChords.includes(selected.id)} onLearn={handleLearn} onClose={() => setSelected(null)} />
      )}
      {xpToast && <XPToast {...xpToast} onDone={() => setXpToast(null)} />}
    </div>
  );
}
