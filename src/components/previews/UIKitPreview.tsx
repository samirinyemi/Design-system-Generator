import React, { useState } from 'react';
import { Play, Pause, MapPin, Clock, Calendar as CalendarIcon, Cloud, CloudRain, Sun, Zap, ChevronLeft, ChevronRight, User, Plane, Music } from 'lucide-react';
import { getAccessibleColor } from '../../utils/accessibility';

export const UIKitPreview = ({ system, theme, getFont, getRadius, getShadow, shuffledColors }: any) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState<number[]>([14, 15]);

  const [c1, c2, c3, c4, c5, c6] = shuffledColors || [
    theme.primary,
    theme.secondary,
    theme.accent,
    system.colors?.success?.hex || '#28A745',
    system.colors?.warning?.hex || '#FFC107',
    system.colors?.info?.hex || '#17A2B8',
  ];

  const getCardStyle = (color: string) => ({
    background: color,
    borderRadius: '32px',
    boxShadow: getShadow('xl'),
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    aspectRatio: '1/1',
    transition: 'all 0.3s ease',
    color: getAccessibleColor(theme.background, color), // Use accessible color
  });

  const getLightCardStyle = (color: string) => ({
    ...getCardStyle(color),
    background: color,
    color: getAccessibleColor(theme.background, color),
  });

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        
        {/* 1. Music Player */}
        <div style={getCardStyle(c1)} className="group hover:scale-[1.02] !p-0">
          <div className="h-3/5 w-full bg-cover bg-center relative" style={{ backgroundImage: 'url(https://picsum.photos/seed/kendrick/400/400)' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
            <div className="absolute top-4 left-0 right-0 text-center">
              <h2 className="text-5xl font-black text-[#D92D20] tracking-tighter" style={{ fontFamily: getFont('display') }}>DAMN.</h2>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="flex gap-1 mb-2 items-center h-4">
              {[1, 2, 3, 2, 1].map((h, i) => (
                <div key={i} className={`w-0.5 rounded-full bg-white opacity-80 ${isPlaying ? 'animate-pulse' : ''}`} style={{ height: `${h * 25}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <h4 className="font-bold text-sm mb-0.5" style={{ fontFamily: getFont('display') }}>HUMBLE</h4>
            <p className="text-[10px] opacity-60 mb-3" style={{ fontFamily: getFont('body') }}>Kendrick Lamar</p>
            <div className="w-full h-0.5 bg-white/20 rounded-full relative">
              <div className="absolute left-0 top-0 h-full bg-white rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* 2. Flight Info */}
        <div style={getCardStyle(c2)} className="group hover:scale-[1.02]">
          <div className="flex justify-center mb-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-widest">QATAR</span>
              <Plane size={14} className="opacity-80" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute w-full h-px bg-white/20 top-1/2 -translate-y-1/2 border-dashed border-t border-white/30" />
            <Plane size={32} className="relative z-10 text-white transform rotate-45" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
          </div>
          <div className="flex justify-between items-end mt-auto">
            <div>
              <p className="text-[10px] opacity-60 mb-1" style={{ fontFamily: getFont('body') }}>Arrival Time</p>
              <h4 className="font-bold text-lg" style={{ fontFamily: getFont('display') }}>12:45 <span className="text-[10px] opacity-60">PM</span></h4>
            </div>
            <h3 className="font-bold text-2xl" style={{ fontFamily: getFont('display') }}>SFOA</h3>
          </div>
        </div>

        {/* 3. Weather */}
        <div style={getCardStyle(c3)} className="group hover:scale-[1.02]">
          <h2 className="text-4xl font-light mb-1" style={{ fontFamily: getFont('display') }}>28°C <span className="opacity-50">now</span></h2>
          <h3 className="text-2xl font-medium mb-1" style={{ fontFamily: getFont('body') }}>in Chicago</h3>
          <p className="text-lg opacity-60 mb-auto" style={{ fontFamily: getFont('body') }}>feels 38°C</p>
          
          <div className="flex items-center gap-2 mt-auto">
            <Sun size={20} className="text-yellow-400" />
            <p className="font-medium" style={{ fontFamily: getFont('body') }}>sunny <span className="opacity-50">next</span></p>
          </div>
          <p className="font-medium text-xl mt-1" style={{ fontFamily: getFont('body') }}>4 hours</p>
        </div>

        {/* 4. Watched Movies */}
        <div style={getLightCardStyle(c4)} className="group hover:scale-[1.02] !p-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/james/100/100)' }} />
            <div>
              <h4 className="font-bold text-sm" style={{ fontFamily: getFont('display') }}>Hello James!</h4>
              <p className="text-[9px] opacity-50" style={{ fontFamily: getFont('body') }}>Last watched 2 days ago</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: getFont('display') }}>16<span className="text-sm font-normal opacity-50">/24</span></h2>
            <p className="text-[10px] opacity-50 mb-2" style={{ fontFamily: getFont('body') }}>Watched Movies</p>
            <div className="w-full h-1 bg-black/10 rounded-full relative">
              <div className="absolute left-0 top-0 h-full bg-black rounded-full" style={{ width: '66%' }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full" style={{ left: '66%', marginLeft: '-4px' }} />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-auto">
            {[
              { title: 'Dune: Part Two', img: 'https://picsum.photos/seed/dune/100/100' },
              { title: 'Oppenheimer', img: 'https://picsum.photos/seed/opp/100/100' },
              { title: 'Small Things like It', img: 'https://picsum.photos/seed/small/100/100' }
            ].map((movie, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-6 rounded-sm bg-cover bg-center" style={{ backgroundImage: `url(${movie.img})` }} />
                <p className="text-[10px] font-medium truncate" style={{ fontFamily: getFont('body') }}>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Analog Clock */}
        <div style={getLightCardStyle(c5)} className="group hover:scale-[1.02] flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-[12px] border-[#f5f5f5] relative flex items-center justify-center shadow-inner bg-white">
            <span className="absolute top-2 text-[10px] font-bold opacity-80">12</span>
            <span className="absolute bottom-2 text-[10px] font-bold opacity-80">6</span>
            <span className="absolute left-2 text-[10px] font-bold opacity-80">9</span>
            <span className="absolute right-2 text-[10px] font-bold opacity-80">3</span>
            
            {/* Hour hand */}
            <div className="absolute w-1 h-12 bg-black rounded-full origin-bottom" style={{ bottom: '50%', transform: 'rotate(45deg)' }} />
            {/* Minute hand */}
            <div className="absolute w-1 h-16 bg-black rounded-full origin-bottom" style={{ bottom: '50%', transform: 'rotate(120deg)' }} />
            {/* Second hand */}
            <div className="absolute w-0.5 h-16 rounded-full origin-bottom" style={{ bottom: '50%', background: c1, transform: 'rotate(30deg)' }} />
            
            <div className="w-2 h-2 bg-black rounded-full z-10" />
            
            <div className="absolute bottom-8 text-[10px] font-bold tracking-widest" style={{ color: c1 }}>DC 12:18</div>
          </div>
        </div>

        {/* 6. Yoga Invite */}
        <div style={getCardStyle(c6)} className="group hover:scale-[1.02] !p-0">
          <div className="p-6 flex flex-col items-center text-center border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <User size={20} />
            </div>
            <h4 className="font-bold text-sm mb-1" style={{ fontFamily: getFont('display') }}>Chloe Anne</h4>
            <p className="text-[11px] opacity-70 mb-2" style={{ fontFamily: getFont('body') }}>is going to join you for:</p>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm" style={{ fontFamily: getFont('body') }}>Yoga: Sunset class</p>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">🧘‍♀️</div>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center text-center opacity-60 bg-white/5 flex-1 justify-center">
            <p className="text-[11px] mb-1" style={{ fontFamily: getFont('body') }}>Sun Mar12</p>
            <p className="text-[11px] mb-1" style={{ fontFamily: getFont('body') }}>8:00 pm - 9:00 pm</p>
            <p className="text-[11px]" style={{ fontFamily: getFont('body') }}>Brooklyn studio</p>
          </div>
        </div>

        {/* 7. Battery / Progress */}
        <div style={getCardStyle(c1)} className="group hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-auto">
            <div>
              <h2 className="text-4xl font-bold mb-1" style={{ fontFamily: getFont('display') }}>68%</h2>
              <p className="text-[9px] opacity-60 tracking-widest uppercase" style={{ fontFamily: getFont('body') }}>45 MIN LEFT</p>
            </div>
            <Zap size={20} style={{ color: c3 }} fill={c3} />
          </div>
          
          <div className="flex items-end justify-between h-24 mt-8 relative">
            <div className="absolute bottom-0 left-0 w-full h-px bg-white/20" />
            <span className="absolute -bottom-5 left-0 text-[9px] opacity-50">0</span>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] opacity-50">50</span>
            <span className="absolute -bottom-5 right-0 text-[9px] opacity-50">100</span>
            
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 rounded-t-sm" 
                style={{ 
                  height: i < 10 ? `${40 + Math.random() * 60}%` : `${20 + Math.random() * 30}%`,
                  background: i < 10 ? c3 : 'rgba(255,255,255,0.1)',
                  opacity: i < 10 ? 1 : 0.5
                }} 
              />
            ))}
          </div>
        </div>

        {/* 8. Movie Poster */}
        <div style={getCardStyle(c2)} className="group hover:scale-[1.02] !p-0">
          <div className="w-full h-full bg-cover bg-center relative" style={{ backgroundImage: 'url(https://picsum.photos/seed/steve/400/400)' }}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-[8px] tracking-[0.3em] opacity-70 mb-2 uppercase" style={{ fontFamily: getFont('body') }}>A Danny Boyle Film</p>
              <h2 className="text-4xl font-bold tracking-tight leading-none mb-4" style={{ fontFamily: getFont('display') }}>STEVE<br/>JOBS</h2>
              <div className="w-8 h-12 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://picsum.photos/seed/jobs/100/200)' }} />
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
          </div>
        </div>

        {/* 9. Product Launch */}
        <div style={getCardStyle(c3)} className="group hover:scale-[1.02] !p-0">
          <div className="w-full h-full bg-cover bg-center relative" style={{ backgroundImage: 'url(https://picsum.photos/seed/tech/400/400)' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-xl font-bold mb-4 leading-tight" style={{ fontFamily: getFont('display') }}>Product Launch<br/>Keynote</h3>
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <CalendarIcon size={14} className="mt-0.5 opacity-80" />
                  <div>
                    <p className="text-[10px] font-bold mb-0.5" style={{ fontFamily: getFont('body') }}>Config 2025</p>
                    <p className="text-[8px] opacity-60 leading-tight" style={{ fontFamily: getFont('body') }}>5678 Tasty Avenue, Flavor<br/>City, 12345</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold mb-0.5" style={{ fontFamily: getFont('body') }}>8:00 PM</p>
                  <p className="text-[8px] opacity-60" style={{ fontFamily: getFont('body') }}>GMT</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 10. Calendar */}
        <div style={getLightCardStyle(c4)} className="group hover:scale-[1.02] !p-5">
          <div className="flex justify-between items-center mb-4">
            <ChevronLeft size={14} className="opacity-50" />
            <h4 className="text-xs font-bold" style={{ fontFamily: getFont('display') }}>February 2025</h4>
            <ChevronRight size={14} className="opacity-50" />
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] mb-2 opacity-50" style={{ fontFamily: getFont('body') }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-4" style={{ fontFamily: getFont('body') }}>
            <div className="py-1 opacity-30">7</div>
            <div className="py-1 rounded-full text-white font-bold" style={{ background: c3 }}>8</div>
            <div className="py-1">9</div>
            <div className="py-1">10</div>
            <div className="py-1">11</div>
            <div className="py-1">12</div>
            <div className="py-1">13</div>
          </div>
          
          <div className="flex flex-col gap-3 mt-auto">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-md bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/dune2/100/100)' }} />
              <div className="flex-1">
                <h5 className="text-[10px] font-bold mb-1" style={{ fontFamily: getFont('body') }}>Dune: Part Two</h5>
                <div className="flex justify-between text-[8px] opacity-50">
                  <span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-md bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/moon/100/100)' }} />
              <div className="flex-1">
                <h5 className="text-[10px] font-bold mb-1" style={{ fontFamily: getFont('body') }}>Moonlight</h5>
                <div className="flex justify-between text-[8px] opacity-50">
                  <span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 11. Cinema Seats */}
        <div style={getCardStyle(c5)} className="group hover:scale-[1.02] !p-5">
          <p className="text-[9px] tracking-widest text-center opacity-50 mb-4" style={{ fontFamily: getFont('body') }}>SCENE</p>
          <div className="w-full h-4 border-t-2 border-white/20 rounded-[50%] mb-6" />
          
          <div className="grid grid-cols-7 gap-1.5 mb-auto px-2">
            {[...Array(28)].map((_, i) => {
              const isSelected = selectedSeat.includes(i);
              const isOccupied = i === 5 || i === 12 || i === 22;
              return (
                <div 
                  key={i} 
                  onClick={() => {
                    if (isOccupied) return;
                    if (isSelected) setSelectedSeat(selectedSeat.filter(s => s !== i));
                    else setSelectedSeat([...selectedSeat, i]);
                  }}
                  className={`w-full aspect-square rounded-sm cursor-pointer transition-colors ${
                    isSelected ? '' : isOccupied ? 'bg-white/10' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  style={isSelected ? { background: c3 } : {}}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between items-end mt-4">
            <div>
              <h4 className="font-bold text-sm" style={{ fontFamily: getFont('display') }}>$120.00</h4>
              <p className="text-[9px] opacity-50" style={{ fontFamily: getFont('body') }}>{selectedSeat.length} seats</p>
            </div>
            <button className="px-4 py-1.5 bg-white text-black text-[10px] font-bold rounded-full hover:opacity-90 transition-opacity">
              Book Now
            </button>
          </div>
        </div>

        {/* 12. Mountain Temp */}
        <div style={getCardStyle(c6)} className="group hover:scale-[1.02] !p-0 bg-[#e5e5e5] flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-cover bg-center relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/mountain/400/400)' }}>
            <div className="absolute inset-0 bg-black/20" />
            <h2 className="text-5xl font-bold text-white relative z-10 tracking-tighter" style={{ fontFamily: getFont('display'), textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>-20°C</h2>
          </div>
        </div>

      </div>
    </div>
  );
};
