import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  Bookmark, 
  Check, 
  Search, 
  Tag
} from 'lucide-react';
import { SummitSession } from '../types';

interface SummitAgendaProps {
  onAskGemini: (prompt: string) => void;
}

const SUMMIT_SESSIONS: SummitSession[] = [
  {
    id: 's-101',
    time: '09:00 - 10:30 AM',
    title: 'Keynote: 1.4nm Angstrom Era, High-NA EUV & The Physical Limits of Silicon',
    speaker: 'Dr. Evelyn Vance & ASML Chief Technologist',
    company: 'ASML / GlobalFoundries Consortium',
    track: 'High-NA EUV',
    status: 'Live Now',
    room: 'Hall A (Grand Ballroom)'
  },
  {
    id: 's-102',
    time: '11:00 - 12:15 PM',
    title: 'CoWoS-L vs 3D Hybrid Bonding: Scaling HBM4 to 2 TB/s per Socket',
    speaker: 'Kuan-Wei Lin, VP Advanced Packaging',
    company: 'TSMC Packaging Research Labs',
    track: 'Advanced Packaging',
    status: 'Upcoming',
    room: 'Silicon Stage B'
  },
  {
    id: 's-103',
    time: '01:30 - 02:45 PM',
    title: 'Neuromorphic Compute & In-Memory Analog Matrix Acceleration for 500B Models',
    speaker: 'Prof. Hiroshi Tanaka',
    company: 'Tokyo Institute of Tech & RIKEN',
    track: 'Neuromorphic Silicon',
    status: 'Upcoming',
    room: 'Symposium C'
  },
  {
    id: 's-104',
    time: '03:15 - 04:30 PM',
    title: 'Tackling the 1,000-Watt AI Chip: Direct Microfluidic Cooling & BS-PDN',
    speaker: 'Dr. Sarah Al-Mansoor',
    company: 'Hyperscale Silicon Engineering',
    track: 'Energy Efficient HPC',
    status: 'Upcoming',
    room: 'Hall A (Grand Ballroom)'
  },
  {
    id: 's-105',
    time: '05:00 - 06:15 PM',
    title: 'Optical Interconnects: Co-Packaged Optics (CPO) Replacing Copper in 800G Clusters',
    speaker: 'Marcus Aurelius Sterling',
    company: 'Silicon Photonics Alliance',
    track: 'Energy Efficient HPC',
    status: 'Upcoming',
    room: 'Photonics Room 4'
  }
];

export const SummitAgenda: React.FC<SummitAgendaProps> = ({ onAskGemini }) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['s-101', 's-102']);

  const tracks = ['All', 'High-NA EUV', 'Advanced Packaging', 'Neuromorphic Silicon', 'Energy Efficient HPC'];

  const filteredSessions = SUMMIT_SESSIONS.filter(session => {
    const matchesTrack = selectedTrack === 'All' || session.track === selectedTrack;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                AISemiCon 2026 WORLD SUMMIT
              </span>
              <span className="text-xs text-slate-400">March 24-26, 2026</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-cyan-400" />
              Summit Technical Tracks & Keynote Schedule
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Connect with leading foundry executives, lithography researchers, and AI chip architects. Use Gemini to prepare technical questions for any speaker.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <span className="text-xs font-mono text-cyan-300 px-3 py-1">
              {bookmarkedIds.length} Sessions Saved
            </span>
          </div>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, speaker, or foundry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-100 pl-9 pr-3 py-2 rounded-xl focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {tracks.map(track => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition border ${
                  selectedTrack === track
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session Cards */}
      <div className="space-y-4">
        {filteredSessions.map((session) => {
          const isBookmarked = bookmarkedIds.includes(session.id);
          const isLive = session.status === 'Live Now';

          return (
            <div 
              key={session.id}
              className={`p-5 rounded-2xl border transition-all ${
                isLive
                  ? 'bg-gradient-to-r from-[#111A30] to-[#0E172A] border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-[#0F172A] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isLive ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span> LIVE NOW
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {session.time}
                    </span>
                  )}
                  <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30">
                    {session.track}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      const prompt = `Give me 3 deep technical architectural questions to ask the speaker "${session.speaker}" regarding their AISemiCon 2026 talk: "${session.title}". Include considerations for 2nm High-NA EUV, packaging, or thermal limits.`;
                      onAskGemini(prompt);
                    }}
                    className="flex items-center gap-1 text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 px-3 py-1.5 rounded-xl transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Prep Q&A with Gemini</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(session.id)}
                    className={`p-2 rounded-xl border transition ${
                      isBookmarked
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-3 hover:text-cyan-300 transition">
                {session.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  {session.speaker} ({session.company})
                </span>

                <span className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {session.room}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
