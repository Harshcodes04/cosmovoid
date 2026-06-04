import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/useAuth";
import { getApod, getAsteroids, getGlobalUpcomingLaunches, getNews, getJournalEntries } from "../api/space";
import { FaRocket, FaImages, FaUserAstronaut, FaNewspaper, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import { GiAsteroid, GiMoonOrbit } from "react-icons/gi";
import { MdEvent } from "react-icons/md";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
.hm { font-family:'Inter',sans-serif; }
.dot-bg { background-image:radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px); background-size:28px 28px; }
.rv,.rvl,.rvr { opacity:0; transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
.rv{transform:translateY(26px)}.rvl{transform:translateX(-26px)}.rvr{transform:translateX(26px)}
.rv.on,.rvl.on,.rvr.on{opacity:1;transform:none}
.d1{transition-delay:.07s}.d2{transition-delay:.15s}.d3{transition-delay:.23s}.d4{transition-delay:.31s}.d5{transition-delay:.39s}
@keyframes hI{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
.ha{animation:hI .8s cubic-bezier(.22,1,.36,1) both}
.ha1{animation-delay:.04s}.ha2{animation-delay:.16s}.ha3{animation-delay:.28s}.ha4{animation-delay:.44s}.ha5{animation-delay:.60s}.ha6{animation-delay:.76s}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mqr{animation:mq 32s linear infinite;white-space:nowrap;display:flex;gap:2.5rem}
@keyframes gp{0%,100%{opacity:.4;transform:scale(.9)}50%{opacity:1;transform:scale(1.2)}}
.gp{animation:gp 2.4s ease-in-out infinite}
@keyframes fl{0%,100%{transform:translate(0,0)}40%{transform:translate(18px,-20px)}70%{transform:translate(-14px,12px)}}
.fl1{animation:fl 18s ease-in-out infinite}.fl2{animation:fl 25s ease-in-out infinite reverse;animation-delay:-10s}
@keyframes si{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:.8;transform:translateY(7px)}}
.si{animation:si 2.1s ease-in-out infinite}
@keyframes cntdown{0%{opacity:1}49%{opacity:1}50%{opacity:.3}99%{opacity:.3}100%{opacity:1}}
.colon{animation:cntdown 1s step-end infinite}
.scanline{background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px)}
.hov-lift{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s}
.hov-lift:hover{transform:translateY(-4px);box-shadow:0 24px 48px rgba(0,0,0,.6)}
.feat-line{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07) 30%,rgba(255,255,255,0.07) 70%,transparent)}
`;

const MQ_WORDS = ["Falcon 9","·","Starship","·","ISS","·","James Webb","·","APOD","·","Asteroids","·","Crew Dragon","·","Artemis","·","SpaceX","·","Mission Control","·","Deep Field","·","Orbital Deck"];

const FEATS = [
  { n:"01", tag:"LAUNCH INTELLIGENCE", h:"Track every mission, live.", p:"SpaceX launches past and future — live countdowns, payload specs, booster landings, and full mission briefs the moment they drop.", to:"/launches", flip:false },
  { n:"02", tag:"NASA IMAGERY", h:"A new universe, every single day.", p:"NASA's Astronomy Picture of the Day in full fidelity. Galaxies, nebulae, solar events, and deep field shots curated into your personal gallery.", to:"/gallery", flip:true },
  { n:"03", tag:"PERSONAL JOURNAL", h:"Your own cosmic archive.", p:"Write private mission logs, attach them to launches or APOD images, tag them by mood, and build a trail of everything that pulled you deeper into space.", to:"/journal", flip:false },
];

const EXPLORE_SECTIONS = [
  { Icon: FaRocket,        label: "Launches",  to: "/launches",  color: "from-cyan-500/15 to-blue-600/5",      border: "border-cyan-400/15",   text: "text-cyan-300" },
  { Icon: GiMoonOrbit,    label: "Rockets",   to: "/rockets",   color: "from-violet-500/15 to-purple-700/5", border: "border-violet-400/15", text: "text-violet-300" },
  { Icon: FaUserAstronaut,label: "Crew",      to: "/crew",      color: "from-emerald-500/15 to-teal-700/5", border: "border-emerald-400/15",text: "text-emerald-300" },
  { Icon: FaImages,        label: "Gallery",   to: "/gallery",   color: "from-pink-500/15 to-rose-700/5",    border: "border-pink-400/15",   text: "text-pink-300" },
  { Icon: GiAsteroid,     label: "Asteroids", to: "/asteroids", color: "from-orange-500/15 to-amber-700/5", border: "border-orange-400/15", text: "text-orange-300" },
  { Icon: MdEvent,        label: "Events",    to: "/events",    color: "from-sky-500/15 to-indigo-700/5",   border: "border-sky-400/15",    text: "text-sky-300" },
  { Icon: FaNewspaper,    label: "News",      to: "/news",      color: "from-yellow-500/15 to-lime-700/5",  border: "border-yellow-400/15", text: "text-yellow-300" },
  { Icon: FaInfoCircle,   label: "About",     to: "/about",     color: "from-zinc-500/15 to-slate-700/5",   border: "border-zinc-400/15",   text: "text-zinc-300" },
  { Icon: FaEnvelope,     label: "Contact",   to: "/contact",   color: "from-fuchsia-500/15 to-purple-700/5",border: "border-fuchsia-400/15",text: "text-fuchsia-300" },
];

function DashMockup({ globalUpcoming, news, asteroids, loading }) {
  const trim = (s, n) => s && s.length > n ? s.slice(0, n) + "…" : s || "—";
  const neos = asteroids.slice(0, 2);
  const next2 = globalUpcoming.slice(0, 2);
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : "TBD";

  return (
    <div className="scanline relative overflow-hidden rounded-3xl border border-white/10 bg-[#080808] shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
      {/* title bar */}
      <div className="flex items-center gap-2.5 border-b border-white/8 px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-3 hidden sm:inline-block text-[10px] uppercase tracking-[0.3em] text-zinc-600">Mission Control</span>
        <span className="ml-auto flex items-center gap-1.5 text-[9px] text-cyan-400 uppercase tracking-widest">
          <span className="gp h-1.5 w-1.5 rounded-full bg-cyan-400" />Live
        </span>
      </div>

      {/* upcoming global missions */}
      <div className="border-b border-white/6 px-5 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-600 mb-3">Upcoming Missions</p>
        {loading ? (
          <div className="space-y-3">{[0,1].map(i => <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />)}</div>
        ) : next2.length ? next2.map((l) => (
          <div key={l.id} className="mb-2.5 rounded-xl border border-white/6 bg-white/3 px-3.5 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-white leading-snug flex-1 min-w-0 break-words">{trim(l.name, 30)}</p>
              <span className="shrink-0 font-mono text-[10px] text-cyan-300">{fmtDate(l.net)}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-zinc-600 truncate">
              {l.launch_service_provider?.abbrev || l.launch_service_provider?.name || "—"}
              {l.rocket?.configuration?.name ? ` · ${trim(l.rocket.configuration.name, 20)}` : ""}
            </p>
          </div>
        )) : <p className="text-xs text-zinc-600">No upcoming missions</p>}
      </div>

      {/* space news headline */}
      <div className="border-b border-white/6 px-5 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-600 mb-3">Latest Headline</p>
        {loading ? (
          <div className="h-10 animate-pulse rounded-lg bg-white/5" />
        ) : news ? (
          <div>
            <p className="text-sm font-medium text-white leading-snug line-clamp-2">{trim(news.title, 72)}</p>
            <p className="mt-1 text-[10px] text-zinc-600">{news.news_site || "Space News"}</p>
          </div>
        ) : <p className="text-xs text-zinc-600">No news available</p>}
      </div>

      {/* asteroid panel */}
      <div className="px-5 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-600 mb-3">Near-Earth Objects</p>
        {loading ? (
          <div className="space-y-2">{[0,1].map(i => <div key={i} className="h-6 animate-pulse rounded bg-white/5" />)}</div>
        ) : neos.length ? neos.map((a) => {
          const miss = Number(a.close_approach_data?.[0]?.miss_distance?.astronomical || 0).toFixed(3);
          const hazard = a.is_potentially_hazardous_asteroid;
          return (
            <div key={a.id} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${hazard ? "bg-red-400" : "bg-zinc-500"}`} />
                <span className="font-mono text-xs text-zinc-300">{trim(a.name, 18)}</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-600">{miss} AU</span>
            </div>
          );
        }) : <p className="text-xs text-zinc-600">No data</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const cta = user ? { to:"/dashboard", label:"Open Mission Control" } : { to:"/signup", label:"Start for free" };
  const sec = user ? { to:"/explore", label:"Browse sections" } : { to:"/login", label:"Sign in" };

  const [liveData, setLiveData] = useState({ launch: null, apod: null, asteroids: [], upcoming: [], globalUpcoming: [], journalEntries: [], launchCount: 0, loading: true });

  useEffect(() => {
    let live = true;

    const neos = (p) => {
      if (!p?.near_earth_objects) return [];
      const [d] = Object.keys(p.near_earth_objects);
      return p.near_earth_objects[d] || [];
    };
    const imports = [getApod(), getAsteroids(), getGlobalUpcomingLaunches(5), getNews()];
    if (user) imports.push(getJournalEntries());
    (async () => {
      const [apodR, astR, globalR, newsR, jR] = await Promise.allSettled(imports);
      if (!live) return;
      const newsArr = newsR.status === "fulfilled" ? newsR.value.data : null;
      setLiveData({
        globalLaunchCount: globalR.status === "fulfilled" ? (globalR.value.data?.count || 0) : 0,
        globalUpcoming: globalR.status === "fulfilled" ? (globalR.value.data?.results || []) : [],
        news: Array.isArray(newsArr) ? newsArr[0] : (newsArr?.results?.[0] || null),
        apod:   apodR.status === "fulfilled" ? apodR.value.data : null,
        asteroids: astR.status === "fulfilled" ? neos(astR.value.data) : [],
        journalEntries: jR?.status === "fulfilled" ? (jR.value.data?.entries || []) : [],
        loading: false,
      });
    })();
    return () => { live = false; };
  }, [user]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf, stars = [];
    const init = () => {
      c.width = c.offsetWidth; c.height = c.offsetHeight;
      const starCount = window.innerWidth < 768 ? 80 : 220;
      stars = Array.from({length:starCount}, () => ({
        x: Math.random()*c.width, y: Math.random()*c.height,
        r: Math.random()*1.1+0.2, o: Math.random()*.6+.1,
        d: (Math.random()>.5?1:-1)*.007,
      }));
    };
    init();
    const tick = () => {
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s => {
        s.o += s.d; if(s.o>.85||s.o<.05) s.d*=-1;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${s.o})`; ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        init();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", handleResize); };
  },[]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => { if(x.isIntersecting) x.target.classList.add("on"); }),
      { threshold:.08, rootMargin:"0px 0px -44px 0px" }
    );
    document.querySelectorAll(".rv,.rvl,.rvr").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  },[]);

  return (
    <>
      <style>{CSS}</style>
      <header><Navbar /></header>
      <main className="hm">

        <section className="relative min-h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="dot-bg absolute inset-0 opacity-60" />
          {/* orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="fl1 absolute -left-40 top-1/4 h-[450px] w-[450px] rounded-full bg-cyan-500/6 blur-[110px]" />
            <div className="fl2 absolute -right-48 top-1/3 h-[500px] w-[500px] rounded-full bg-zinc-500/8 blur-[130px]" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pt-20 pb-16 sm:px-6 md:px-10 lg:grid-cols-2 lg:items-start lg:gap-20 lg:px-16 xl:px-20 lg:pt-28">
            {/* text col */}
            <div>
              <div className="ha ha1">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-zinc-400 backdrop-blur-sm">
                  <span className="gp h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
                  Personal space observatory
                </span>
              </div>
              <h1 className="mt-8 font-light leading-[1.05] tracking-[-0.05em] text-white" style={{fontSize:"clamp(2.6rem,5.8vw,6rem)"}}>
                <span className="ha ha2 block">Your private</span>
                <span className="ha ha3 block text-zinc-500 italic">observatory</span>
                <span className="ha ha4 block">for space.</span>
              </h1>
              <p className="ha ha5 mt-12 max-w-lg text-base leading-7 text-zinc-500 sm:text-lg">
                Live SpaceX launch tracking, high-fidelity NASA imagery, real-time asteroid alerts, and the latest cosmic news. Plus, a private journal to document your journey through the universe.
              </p>
              <div className="ha ha6 mt-8 flex flex-col sm:flex-row gap-3">
                <Link to={cta.to} className="hov-lift group inline-flex justify-center items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-950 w-full sm:w-auto">
                  {cta.label}
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </Link>
                <Link to={sec.to} className="inline-flex justify-center items-center rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white w-full sm:w-auto">
                  {sec.label}
                </Link>
              </div>
            </div>
            {/* mockup col */}
            <div className="ha ha5 lg:self-start lg:mt-8">
              <DashMockup
                globalUpcoming={liveData.globalUpcoming}
                news={liveData.news}
                asteroids={liveData.asteroids}
                loading={liveData.loading}
              />
            </div>
          </div>

          {/* scroll cue */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-700">Scroll</span>
            <div className="si h-6 w-px rounded-full bg-gradient-to-b from-zinc-600 to-transparent" />
          </div>
        </section>

        <div className="overflow-hidden border-y border-white/5 bg-white/2 py-3">
          <div className="mqr">
            {[...MQ_WORDS,...MQ_WORDS].map((w,i) => (
              <span key={i} className={`text-[10px] uppercase tracking-[0.28em] ${w==="·"?"text-zinc-700":"text-zinc-600"}`}>{w}</span>
            ))}
          </div>
        </div>

        <section className="relative px-6 py-28 md:px-10 lg:px-16 xl:px-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="fl1 absolute -right-48 top-0 h-[500px] w-[500px] rounded-full bg-zinc-600/5 blur-[120px]" />
            <div className="fl2 absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-500/4 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <div className="rv mb-10 sm:mb-16">
              <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-700">What's inside</p>
              <h2 className="mt-3 font-light tracking-[-0.05em] text-white" style={{fontSize:"clamp(1.8rem,5vw,4.5rem)"}}>
                Everything the cosmos<br /><span className="text-zinc-600">has to offer.</span>
              </h2>
            </div>

            <div className="space-y-0">
              {FEATS.map((f,i) => (
                <div key={f.n}>
                  <div className="feat-line" />
                  <div className={`group grid gap-6 py-10 sm:py-14 lg:grid-cols-2 lg:items-center`}>
                    <div className={`space-y-4 sm:space-y-5 ${f.flip?"lg:order-2":""}`}>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-5xl font-bold text-white/6 leading-none">{f.n}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-zinc-500">{f.tag}</span>
                      </div>
                      <h3 className="text-3xl font-light tracking-[-0.04em] text-white lg:text-4xl">{f.h}</h3>
                      <p className="max-w-lg text-sm leading-7 text-zinc-500">{f.p}</p>
                      <Link to={f.to} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white">
                        Explore {f.tag.split(" ")[0].toLowerCase()}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                    <div className={`${f.flip?"lg:order-1":""}`}>
                      {i===0 && (
                        <div className="hov-lift rounded-2xl border border-white/8 bg-zinc-950 p-6 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
                          <div className="flex items-center gap-2 mb-5">
                            <span className="gp h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400">Upcoming Launches</span>
                          </div>
                          {liveData.loading ? (
                            [0,1,2].map(k => <div key={k} className="mb-3 h-14 animate-pulse rounded-xl bg-white/4" />)
                          ) : liveData.globalUpcoming.length ? liveData.globalUpcoming.slice(0,3).map((l) => {
                            const d = new Date(l.net);
                            const label = isNaN(d) ? "TBD" : d.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
                            const agencyAbbr = l.launch_service_provider?.abbrev || "—";
                            return (
                              <div key={l.id} className="mb-3 rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                                <div className="flex items-center justify-between mb-1.5 gap-2">
                                  <span className="text-sm font-medium text-white truncate flex-1 min-w-0">{l.name}</span>
                                  <span className="font-mono text-xs text-cyan-300 shrink-0">{label}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1 gap-2">
                                  <p className="text-[10px] text-zinc-500 truncate flex-1 min-w-0">{l.pad?.name || "TBD"}</p>
                                  <span className="text-[9px] uppercase tracking-widest text-zinc-600 shrink-0">{agencyAbbr}</span>
                                </div>
                              </div>
                            );
                          }) : <p className="text-xs text-zinc-600">No upcoming launches found</p>}
                        </div>
                      )}
                      {i===1 && (
                        <div className="hov-lift space-y-3">
                          {liveData.loading ? (
                            <div className="h-48 animate-pulse rounded-2xl bg-white/4" />
                          ) : liveData.apod ? (
                            <>
                              {liveData.apod.media_type === "image" ? (
                                <div className="overflow-hidden rounded-2xl border border-white/8">
                                  <img src={liveData.apod.url} alt={liveData.apod.title} className="h-52 w-full object-cover" />
                                  <div className="p-3">
                                    <p className="text-xs font-medium text-white">{liveData.apod.title}</p>
                                    <p className="text-[10px] text-zinc-600">{liveData.apod.copyright ? `© ${liveData.apod.copyright}` : "NASA / Public Domain"} · Today</p>
                                  </div>
                                </div>
                              ) : liveData.apod.media_type === "video" ? (
                                <div className="overflow-hidden rounded-2xl border border-white/8">
                                  {liveData.apod.url.endsWith(".mp4") ? (
                                    <video src={liveData.apod.url} className="h-52 w-full object-cover bg-black" controls autoPlay muted loop playsInline />
                                  ) : (
                                    <iframe src={liveData.apod.url} title={liveData.apod.title} className="h-52 w-full object-cover" allowFullScreen />
                                  )}
                                  <div className="p-3">
                                    <p className="text-xs font-medium text-white">{liveData.apod.title}</p>
                                    <p className="text-[10px] text-zinc-600">Video · Today</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-900 p-4">
                                  <p className="text-xs font-medium text-white">{liveData.apod.title}</p>
                                  <p className="text-[10px] text-zinc-600 mt-1">Today's APOD · {liveData.apod.media_type}</p>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-2">
                                {[["Launches","/launches"],["Crew","/crew"],["Asteroids","/asteroids"],["News","/news"]].map(([label, to]) => (
                                  <Link key={label} to={to} className="rounded-xl border border-white/6 bg-zinc-950 p-3 transition-colors hover:border-white/12 hover:bg-white/5">
                                    <p className="text-xs font-medium text-white">{label}</p>
                                    <p className="text-[10px] text-zinc-600">Explore →</p>
                                  </Link>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="rounded-2xl border border-white/8 bg-zinc-950 p-4">
                              <p className="text-xs text-zinc-600">APOD unavailable</p>
                            </div>
                          )}
                        </div>
                      )}
                      {i===2 && (
                        <div className="hov-lift space-y-3">
                          {liveData.loading ? (
                            [0,1,2].map(k => <div key={k} className="h-20 animate-pulse rounded-2xl bg-white/4" />)
                          ) : user && liveData.journalEntries.length ? (
                            liveData.journalEntries.slice(0,3).map((e) => (
                              <div key={e._id} className="rounded-2xl border border-white/8 bg-zinc-950 p-4 shadow-[0_8px_24px_rgba(0,0,0,.4)]">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <p className="text-sm font-semibold text-white leading-tight truncate">{e.title}</p>
                                  {e.mood && <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-zinc-500">{e.mood}</span>}
                                </div>
                                <p className="text-xs leading-5 text-zinc-600 line-clamp-2">{e.content}</p>
                              </div>
                            ))
                          ) : (
                            <>
                              {[["Witnessed Starship IFT-6 today","reflective","Incredible footage of the booster catch..."],["Pillars of Creation — APOD","curious","The Webb image dropped today. I've been staring at it for an hour..."],["First journal entry","excited","Starting this log to keep track of every launch I follow..."]].map(([title,mood,body]) => (
                                <div key={title} className="rounded-2xl border border-white/8 bg-zinc-950 p-4 shadow-[0_8px_24px_rgba(0,0,0,.4)]">
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <p className="text-sm font-semibold text-white leading-tight">{title}</p>
                                    <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-zinc-500">{mood}</span>
                                  </div>
                                  <p className="text-xs leading-5 text-zinc-600 line-clamp-2">{body}</p>
                                </div>
                              ))}
                              {!user && <p className="text-center text-[10px] text-zinc-700 pt-1">Sign in to see your own entries</p>}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="feat-line" />
            </div>
          </div>
        </section>

        <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-16 xl:px-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="fl2 absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-violet-500/4 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <div className="rv mb-8 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-700">All sections</p>
                <h2 className="mt-2 sm:mt-3 font-light tracking-[-0.05em] text-white" style={{fontSize:"clamp(1.5rem,4vw,3.5rem)"}}>
                  Every corner of
                  <span className="text-zinc-600"> the platform.</span>
                </h2>
              </div>
              <Link to="/explore" className="shrink-0 rounded-full border border-white/10 bg-white/4 px-5 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/8 hover:text-white sm:mt-0 mt-2">
                Full directory →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
              {EXPLORE_SECTIONS.map((s) => (
                  <Link
                  key={s.to}
                  to={s.to}
                  className={`rv group flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-0.5 ${s.color} ${s.border}`}
                >
                  <span className={`flex size-9 items-center justify-center rounded-xl border bg-black/20 ${s.border} ${s.text}`}>
                    <s.Icon size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{s.label}</p>
                    <p className={`text-[10px] mt-0.5 transition-colors group-hover:opacity-100 opacity-60 ${s.text}`}>Open →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-20">
          <div className="mx-auto max-w-7xl grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {[
              [liveData.loading ? "…" : liveData.globalLaunchCount > 0 ? `${liveData.globalLaunchCount}` : "Live", "Upcoming global missions"],
              [liveData.loading ? "…" : liveData.apod?.title ? "Daily" : "Daily", "NASA APOD imagery"],
              [liveData.loading ? "…" : liveData.asteroids.length > 0 ? `${liveData.asteroids.length}` : "Live", "Near-Earth objects today"],
              [liveData.loading ? "…" : user ? (liveData.journalEntries.length > 0 ? `${liveData.journalEntries.length}` : "0") : "Private", "Your mission journal"],
            ].map(([v,l],i) => (
              <div key={l} className={`rv d${i+1} text-center`}>
                <p className="text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">{v}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-zinc-600 sm:mt-3 sm:tracking-[0.26em]">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-16 xl:px-20">
          <div className="dot-bg absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="fl1 absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/7 blur-[140px]" />
          </div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="rv">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-zinc-600 backdrop-blur-sm">
                <span className="gp h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
                Ready for launch?
              </span>
            </div>
            <h2 className="rv d1 mt-8 font-light tracking-[-0.06em] text-white" style={{fontSize:"clamp(2.8rem,7vw,7rem)",lineHeight:1}}>
              Your orbit<br />starts here.
            </h2>
            <p className="rv d2 mx-auto mt-6 max-w-md text-base leading-7 text-zinc-500">
              Join Cosmovoid — a private, distraction-free window into space. Free forever.
            </p>
            <div className="rv d3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={cta.to} className="hov-lift group inline-flex justify-center items-center gap-2 rounded-full bg-white px-9 py-4 text-sm font-semibold text-zinc-950 w-full sm:w-auto">
                {cta.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
              <Link to="/explore" className="inline-flex justify-center items-center rounded-full border border-white/10 bg-white/4 px-9 py-4 text-sm font-medium text-zinc-400 backdrop-blur-sm transition-all hover:bg-white/8 hover:text-white w-full sm:w-auto">
                Explore first
              </Link>
            </div>
            {!user && (
              <p className="rv d4 mt-8 text-xs text-zinc-700">
                Have an account?{" "}
                <Link to="/login" className="text-cyan-400 transition-colors hover:text-white">Sign in →</Link>
              </p>
            )}
          </div>
        </section>

      </main>
    </>
  );
}
