import React, { useState, useEffect, useRef } from "react";
import {
  Home, Timer as TimerIcon, CheckSquare, BarChart2, MoreHorizontal,
  Play, Pause, Square, Plus, Search, Bell, Settings as SettingsIcon,
  ChevronLeft, ChevronRight, Users, Trophy, Target, Sparkles, Flame,
  Award, MessageCircle, UserPlus, Check, X, LogOut, Lock, User,
  Palette, Moon, Sun, Shield, Eye, EyeOff, ArrowRight, Calendar as CalendarIcon,
  TrendingUp, Clock, BookOpen, Star, Zap, ChevronDown, Edit2, Trash2,
  GraduationCap, Wifi, WifiOff
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Tooltip, LineChart, Line, CartesianGrid
} from "recharts";

/* ----------------------------- Design tokens ----------------------------- */
const BRAND = "#6C5CE7";
const BRAND_DARK = "#4B3FBF";
const BG = "#F7F7FC";

const SUBJECT_COLORS = {
  DSA: "#6C5CE7",
  DBMS: "#00B894",
  OS: "#FDCB6E",
  Other: "#FD79A8",
};

/* ----------------------------- Mock data ----------------------------- */
const initialTasks = [
  { id: 1, title: "Solve 50 DSA Questions", subject: "DSA", priority: "High", due: "Today", done: false },
  { id: 2, title: "Complete DBMS Unit 3", subject: "DBMS", priority: "Medium", due: "Tomorrow", done: false },
  { id: 3, title: "Read OS Chapter 5", subject: "OS", priority: "Low", due: "14 May", done: false },
  { id: 4, title: "Revise OS Notes", subject: "OS", priority: "Medium", due: "16 May", done: true },
];

const initialSubjects = [
  { name: "DSA", hours: 42, goal: 60, color: SUBJECT_COLORS.DSA },
  { name: "DBMS", hours: 28, goal: 40, color: SUBJECT_COLORS.DBMS },
  { name: "OS", hours: 18, goal: 30, color: SUBJECT_COLORS.OS },
  { name: "Other", hours: 12, goal: 20, color: SUBJECT_COLORS.Other },
];

const weeklyData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 4.1 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 5.0 },
  { day: "Fri", hours: 3.2 },
  { day: "Sat", hours: 4.6 },
  { day: "Sun", hours: 4.3 },
];

const friendsList = [
  { id: 1, name: "Rahul Sharma", handle: "rahul_25", status: "online", note: "Studying DSA", hours: 32, streak: 18, avatar: "R", color: "#6C5CE7" },
  { id: 2, name: "Aman Verma", handle: "aman_v", status: "online", note: "Studying DSA", hours: 29, streak: 10, avatar: "A", color: "#00B894" },
  { id: 3, name: "Priya Singh", handle: "priya_s", status: "offline", note: "Last seen 2h ago", hours: 26, streak: 14, avatar: "P", color: "#FD79A8" },
  { id: 4, name: "Neha Patel", handle: "neha_p", status: "offline", note: "Last seen 1d ago", hours: 22, streak: 8, avatar: "N", color: "#FDCB6E" },
];

const suggestedFriends = [
  { id: 5, name: "Sourabh Jain", handle: "sourabh_j", avatar: "S", color: "#0984E3" },
  { id: 6, name: "Vivek Kumar", handle: "vivek_k", avatar: "V", color: "#E17055" },
  { id: 7, name: "Kajal Reddy", handle: "kajal_r", avatar: "K", color: "#00B894" },
  { id: 8, name: "Aditya Raj", handle: "aditya_r", avatar: "A", color: "#6C5CE7" },
];

const leaderboardData = [
  { rank: 1, name: "Rahul Sharma", hours: "35h 20m", you: false },
  { rank: 2, name: "Kartik (You)", hours: "32h 45m", you: true },
  { rank: 3, name: "Aman Verma", hours: "29h 10m", you: false },
  { rank: 4, name: "Priya Singh", hours: "26h 05m", you: false },
  { rank: 5, name: "Neha Patel", hours: "22h 40m", you: false },
];

const challengesData = [
  { id: 1, title: "7 Days Study Challenge", desc: "Study 35 hours in 7 days", progress: 24, goal: 35, unit: "h", endsIn: "3d" },
  { id: 2, title: "DSA Problem Solver", desc: "Solve 200 DSA problems", progress: 160, goal: 200, unit: "", endsIn: "5d" },
];

const roomMembers = [
  { name: "Kartik (You)", status: "focus", color: "#6C5CE7" },
  { name: "Rahul Sharma", status: "focus", color: "#00B894" },
  { name: "Aman Verma", status: "focus", color: "#FDCB6E" },
  { name: "Priya Singh", status: "break", color: "#FD79A8" },
];

/* ----------------------------- Small UI helpers ----------------------------- */
function Avatar({ children, color = BRAND, size = 40 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size / 2.4 }}
    >
      {children}
    </div>
  );
}

function StatPill({ icon, label, value, tint = "#EEEDFE", fg = BRAND }) {
  return (
    <div className="flex-1 rounded-2xl p-3 flex flex-col gap-1" style={{ background: tint }}>
      <div className="flex items-center gap-1" style={{ color: fg }}>
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-800">{value}</span>
    </div>
  );
}

function ProgressBar({ value, max, color = BRAND, height = 8 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full rounded-full bg-slate-100 overflow-hidden" style={{ height }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 ${className} ${onClick ? "active:scale-[0.98] cursor-pointer transition-transform" : ""}`}
    >
      {children}
    </div>
  );
}

function Header({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-4 pt-5 pb-3 sticky top-0 bg-[#F7F7FC] z-10">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function PrimaryButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 rounded-xl text-white font-semibold text-sm active:scale-[0.98] transition-transform ${className}`}
      style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
    >
      {children}
    </button>
  );
}

function FieldInput({ label, type = "text", placeholder, value, onChange, icon }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div className="mb-3">
      {label && <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
        {icon}
        <input
          type={isPw && !show ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-transparent outline-none text-sm flex-1 text-slate-700 placeholder:text-slate-400"
        />
        {isPw && (
          <button type="button" onClick={() => setShow(!show)} className="text-slate-400">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

function BottomNav({ screen, go }) {
  const items = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "timer", label: "Timer", icon: TimerIcon },
    { key: "tasks", label: "Tasks", icon: CheckSquare },
    { key: "analytics", label: "Analytics", icon: BarChart2 },
    { key: "more", label: "More", icon: MoreHorizontal },
  ];
  const mainKeys = items.map((i) => i.key);
  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-100 flex justify-around py-2 px-1">
      {items.map(({ key, label, icon: Icon }) => {
        const active = screen === key || (key === "more" && !mainKeys.includes(screen));
        return (
          <button
            key={key}
            onClick={() => go(key)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg"
          >
            <Icon size={20} color={active ? BRAND : "#A0A0B0"} fill={active && key === "home" ? BRAND : "none"} />
            <span className="text-[10px] font-medium" style={{ color: active ? BRAND : "#A0A0B0" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PageShell({ children, screen, go, noNav }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-2">{children}</div>
      {!noNav && <BottomNav screen={screen} go={go} />}
    </div>
  );
}

/* ----------------------------- Screens ----------------------------- */

function SplashScreen({ go }) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center text-white px-8"
      style={{ background: `linear-gradient(160deg, ${BRAND_DARK}, ${BRAND})` }}
    >
      <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
        <GraduationCap size={40} />
      </div>
      <h1 className="text-3xl font-bold mb-1">StudySync</h1>
      <p className="text-white/70 text-sm text-center mb-10">AI-Powered Student Productivity Platform</p>
      <div className="w-24 h-1.5 rounded-full bg-white/25 overflow-hidden">
        <div className="h-full bg-white rounded-full animate-pulse" style={{ width: "60%" }} />
      </div>
      <button onClick={() => go("onboarding")} className="mt-10 text-white/70 text-xs underline">
        Tap to continue
      </button>
    </div>
  );
}

function OnboardingScreen({ go }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ background: `linear-gradient(160deg, ${BRAND_DARK}, ${BRAND})` }}>
        <div className="w-full aspect-square max-w-[220px] rounded-3xl bg-white/10 flex items-center justify-center mb-8">
          <BookOpen size={72} className="text-white/80" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2 text-center">Achieve more every day</h2>
        <p className="text-white/70 text-sm text-center leading-relaxed">
          Track, plan, focus, and analyze your goals with StudySync.
        </p>
      </div>
      <div className="p-5 bg-white">
        <PrimaryButton onClick={() => go("login")}>Get started</PrimaryButton>
      </div>
    </div>
  );
}

function LoginScreen({ go }) {
  return (
    <div className="h-full bg-white flex flex-col px-6 pt-14">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
      <p className="text-slate-400 text-sm mb-6">Login to continue</p>
      <FieldInput label="Email address" placeholder="you@example.com" icon={<User size={16} className="text-slate-400" />} />
      <FieldInput label="Password" type="password" placeholder="••••••••" icon={<Lock size={16} className="text-slate-400" />} />
      <div className="text-right mb-5">
        <span className="text-xs font-medium" style={{ color: BRAND }}>Forgot password?</span>
      </div>
      <PrimaryButton onClick={() => go("dashboard")}>Login</PrimaryButton>
      <div className="flex items-center gap-2 my-5">
        <div className="h-px bg-slate-100 flex-1" /><span className="text-xs text-slate-400">or</span><div className="h-px bg-slate-100 flex-1" />
      </div>
      <button className="w-full py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 flex items-center justify-center gap-2">
        Continue with Google
      </button>
      <p className="text-center text-xs text-slate-400 mt-6">
        Don't have an account? <span className="font-semibold" style={{ color: BRAND }} onClick={() => go("signup")}>Sign up</span>
      </p>
    </div>
  );
}

function SignupScreen({ go }) {
  return (
    <div className="h-full bg-white flex flex-col px-6 pt-14 overflow-y-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Create account</h1>
      <p className="text-slate-400 text-sm mb-6">Let's get you started</p>
      <FieldInput label="Full name" placeholder="Kartik Mehta" icon={<User size={16} className="text-slate-400" />} />
      <FieldInput label="Email address" placeholder="you@example.com" icon={<User size={16} className="text-slate-400" />} />
      <FieldInput label="Password" type="password" placeholder="••••••••" icon={<Lock size={16} className="text-slate-400" />} />
      <FieldInput label="Confirm password" type="password" placeholder="••••••••" icon={<Lock size={16} className="text-slate-400" />} />
      <PrimaryButton onClick={() => go("dashboard")} className="mt-2">Sign up</PrimaryButton>
      <p className="text-center text-xs text-slate-400 mt-6 mb-6">
        Already have an account? <span className="font-semibold" style={{ color: BRAND }} onClick={() => go("login")}>Login</span>
      </p>
    </div>
  );
}

function DashboardScreen({ go, tasks }) {
  const pending = tasks.filter((t) => !t.done);
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pt-5 pb-4">
        <div>
          <p className="text-slate-400 text-xs">Hello,</p>
          <h1 className="text-lg font-bold text-slate-800">Kartik 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"><Bell size={16} className="text-slate-500" /></button>
          <Avatar color={BRAND} size={36}>K</Avatar>
        </div>
      </div>

      <Card className="mb-4" onClick={() => go("timer")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">Today's study time</p>
            <p className="text-2xl font-bold text-slate-800">4h 28m <span className="text-sm font-normal text-slate-400">/ 6h goal</span></p>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#EEEDFE" }}>
            <Play size={22} color={BRAND} fill={BRAND} />
          </div>
        </div>
        <div className="mt-3"><ProgressBar value={4.47} max={6} /></div>
      </Card>

      <div className="flex gap-3 mb-4">
        <StatPill icon={<Flame size={14} />} label="Streak" value="18 days" tint="#FFF1E6" fg="#E17055" />
        <StatPill icon={<Star size={14} />} label="XP points" value="2,450" tint="#EAF7EF" fg="#00B894" />
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-slate-700">Today's tasks</h2>
        <span className="text-xs font-medium" style={{ color: BRAND }} onClick={() => go("tasks")}>See all</span>
      </div>
      <Card className="mb-4">
        <p className="text-xs text-slate-400 mb-2">3/6 completed</p>
        <ProgressBar value={3} max={6} color="#00B894" />
        <div className="mt-3 flex flex-col gap-2">
          {pending.slice(0, 2).map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-slate-300" />
              <span className="text-xs text-slate-600 flex-1">{t.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: SUBJECT_COLORS[t.subject] + "22", color: SUBJECT_COLORS[t.subject] }}>{t.subject}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4" onClick={() => go("aiCoach")}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#EEEDFE" }}>
            <Sparkles size={16} color={BRAND} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 mb-0.5">AI insight</p>
            <p className="text-xs text-slate-500 leading-relaxed">You study best between 7-10 PM. Try scheduling DBMS revision then this week.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { icon: CalendarIcon, label: "Calendar", key: "calendar" },
          { icon: Users, label: "Friends", key: "friends" },
          { icon: Trophy, label: "Leaderboard", key: "leaderboard" },
          { icon: Target, label: "Challenges", key: "challenges" },
        ].map(({ icon: Icon, label, key }) => (
          <button key={key} onClick={() => go(key)} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center"><Icon size={18} color={BRAND} /></div>
            <span className="text-[10px] text-slate-500 font-medium text-center">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TimerScreen({ go }) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [subject, setSubject] = useState("DSA");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = 1 - seconds / (25 * 60);

  return (
    <div className="px-4">
      <Header title="Study timer" onBack={() => go("dashboard")} />
      <div className="flex flex-col items-center mt-4">
        <p className="text-xs text-slate-400 mb-4">Pomodoro session</p>
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90">
            <circle cx="112" cy="112" r="100" stroke="#EEEDFE" strokeWidth="12" fill="none" />
            <circle
              cx="112" cy="112" r="100" stroke={BRAND} strokeWidth="12" fill="none"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - pct)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold text-slate-800">{mm}:{ss}</span>
            <span className="text-xs text-slate-400 mt-1">{subject}</span>
          </div>
        </div>
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setRunning(!running)}
            className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-md"
            style={{ background: BRAND }}
          >
            {running ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
          </button>
          <button
            onClick={() => { setRunning(false); setSeconds(25 * 60); }}
            className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center"
          >
            <Square size={20} fill="#ef4444" />
          </button>
        </div>

        <Card className="w-full">
          <p className="text-xs font-bold text-slate-600 mb-2">Choose subject</p>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(SUBJECT_COLORS).map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{
                  background: subject === s ? SUBJECT_COLORS[s] : "white",
                  color: subject === s ? "white" : SUBJECT_COLORS[s],
                  borderColor: SUBJECT_COLORS[s],
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <Card className="w-full mt-3">
          <p className="text-xs font-bold text-slate-600 mb-2">Sessions today</p>
          <div className="flex justify-between text-center">
            <div><p className="text-lg font-bold text-slate-800">6</p><p className="text-[10px] text-slate-400">Sessions</p></div>
            <div><p className="text-lg font-bold text-slate-800">2h 30m</p><p className="text-[10px] text-slate-400">Focus time</p></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TasksScreen({ go, tasks, setTasks }) {
  const [filter, setFilter] = useState("All");
  const toggle = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const filtered = tasks.filter((t) => filter === "All" || (filter === "Pending" && !t.done) || (filter === "Completed" && t.done));
  const priorityColor = { High: "#EF4444", Medium: "#FDCB6E", Low: "#00B894" };

  return (
    <div className="px-4">
      <Header title="My tasks" />
      <div className="flex gap-2 mb-4">
        {["All", "Pending", "Completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: filter === f ? BRAND : "#F1F0FA", color: filter === f ? "white" : "#8887A3" }}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {filtered.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start gap-3">
              <button onClick={() => toggle(t.id)} className="mt-0.5">
                {t.done ? (
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: BRAND }}>
                    <Check size={13} className="text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-md border-2 border-slate-300" />
                )}
              </button>
              <div className="flex-1">
                <p className={`text-sm font-medium ${t.done ? "line-through text-slate-400" : "text-slate-700"}`}>{t.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: SUBJECT_COLORS[t.subject] + "22", color: SUBJECT_COLORS[t.subject] }}>{t.subject}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: priorityColor[t.priority] + "22", color: priorityColor[t.priority] }}>{t.priority}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">{t.due}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-xs text-slate-400 py-8">No tasks here.</p>}
      </div>
      <button
        className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mb-4"
        style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
        onClick={() => setTasks([{ id: Date.now(), title: "New task", subject: "Other", priority: "Medium", due: "Today", done: false }, ...tasks])}
      >
        <Plus size={16} /> Add task
      </button>
    </div>
  );
}

function CalendarScreen({ go }) {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const intensity = (d) => (d % 7 === 0 ? "none" : d % 4 === 0 ? "high" : d % 3 === 0 ? "mid" : "low");
  const colorFor = { none: "#F1F0FA", low: "#CECBF6", mid: "#8B7FE8", high: "#4B3FBF" };
  return (
    <div className="px-4">
      <Header title="Calendar" />
      <div className="flex items-center justify-between mb-4">
        <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center"><ChevronLeft size={16} /></button>
        <span className="text-sm font-bold text-slate-700">May 2025</span>
        <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center"><ChevronRight size={16} /></button>
      </div>
      <Card>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((d) => <div key={d} className="text-center text-[10px] text-slate-400 font-medium">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dates.map((d) => (
            <div key={d} className="aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium"
              style={{ background: colorFor[intensity(d)], color: intensity(d) === "high" ? "white" : "#514F6B" }}>
              {d}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-slate-400">Less</span>
          {["none", "low", "mid", "high"].map((k) => <div key={k} className="w-3 h-3 rounded" style={{ background: colorFor[k] }} />)}
          <span className="text-[10px] text-slate-400">More</span>
        </div>
      </Card>
      <Card className="mt-3">
        <p className="text-xs font-bold text-slate-600 mb-2">14 May 2025</p>
        <div className="flex justify-between">
          <div><p className="text-sm font-bold text-slate-800">4h 28m</p><p className="text-[10px] text-slate-400">Study time</p></div>
          <div><p className="text-sm font-bold text-slate-800">6h</p><p className="text-[10px] text-slate-400">Goal</p></div>
          <div><p className="text-sm font-bold text-slate-800">3/6</p><p className="text-[10px] text-slate-400">Tasks</p></div>
        </div>
      </Card>
    </div>
  );
}

function AnalyticsScreen({ go, subjects }) {
  const [range, setRange] = useState("This Week");
  const pieData = subjects.map((s) => ({ name: s.name, value: s.hours, color: s.color }));
  return (
    <div className="px-4">
      <Header title="Analytics" right={
        <select value={range} onChange={(e) => setRange(e.target.value)} className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-600">
          <option>This Week</option><option>This Month</option><option>All Time</option>
        </select>
      } />
      <Card className="mb-3">
        <p className="text-xs text-slate-400 mb-1">Total study time</p>
        <p className="text-2xl font-bold text-slate-800 mb-3">32h 46m <span className="text-xs font-semibold text-emerald-500">↑ 18% vs last week</span></p>
        <div style={{ width: "100%", height: 140 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#A0A0B0" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "#F7F7FC" }} />
              <Bar dataKey="hours" fill={BRAND} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mb-3">
        <p className="text-xs font-bold text-slate-600 mb-3">Subject-wise breakdown</p>
        <div className="flex items-center gap-4">
          <div style={{ width: 110, height: 110 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={30} outerRadius={50} paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {subjects.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-slate-600 flex-1">{s.name}</span>
                <span className="font-semibold text-slate-700">{s.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatPill icon={<Clock size={14} />} label="Longest session" value="2h 45m" />
        <StatPill icon={<TrendingUp size={14} />} label="Productivity score" value="82/100" tint="#EAF7EF" fg="#00B894" />
      </div>
    </div>
  );
}

function FriendsScreen({ go, setSelectedFriend }) {
  return (
    <div className="px-4">
      <Header title="Friends" right={<button onClick={() => go("addFriend")} className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: BRAND }}><UserPlus size={15} /></button>} />
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 mb-4">
        <Search size={15} className="text-slate-400" />
        <input placeholder="Search by name or email" className="text-sm outline-none flex-1 placeholder:text-slate-400" />
      </div>
      <div className="flex gap-4 mb-3 text-xs font-semibold text-slate-400">
        <span style={{ color: BRAND }}>All (86)</span>
        <span>Online (3)</span>
        <span>Requests</span>
      </div>
      <div className="flex flex-col gap-2">
        {friendsList.map((f) => (
          <Card key={f.id} onClick={() => { setSelectedFriend(f); go("friendProfile"); }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar color={f.color}>{f.avatar}</Avatar>
                {f.status === "online" && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">{f.name}</p>
                <p className="text-[11px] text-slate-400">{f.note}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddFriendScreen({ go }) {
  return (
    <div className="px-4">
      <Header title="Add friend" onBack={() => go("friends")} />
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 mb-5">
        <Search size={15} className="text-slate-400" />
        <input placeholder="Search by name or email" className="text-sm outline-none flex-1 placeholder:text-slate-400" />
      </div>
      <p className="text-xs font-bold text-slate-500 mb-2">People you may know</p>
      <div className="flex flex-col gap-2">
        {suggestedFriends.map((f) => (
          <Card key={f.id}>
            <div className="flex items-center gap-3">
              <Avatar color={f.color}>{f.avatar}</Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">{f.name}</p>
                <p className="text-[11px] text-slate-400">@{f.handle}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: BRAND }}>Add</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FriendProfileScreen({ go, friend }) {
  const f = friend || friendsList[0];
  return (
    <div className="px-4">
      <Header title="Profile" onBack={() => go("friends")} right={<button className="text-xs text-red-500 font-medium">Logout</button>} />
      <Card className="flex flex-col items-center text-center py-6 mb-4">
        <Avatar color={f.color} size={64}>{f.avatar}</Avatar>
        <p className="text-base font-bold text-slate-800 mt-3">{f.name}</p>
        <p className="text-xs text-slate-400">@{f.handle}</p>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed px-4">Engineering student · DSA enthusiast. Loves consistency and discipline.</p>
        <button className="mt-4 px-6 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-2" style={{ background: BRAND }}>
          <MessageCircle size={13} /> Message
        </button>
      </Card>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatPill icon={<Flame size={13} />} label="Streak" value={f.streak} tint="#FFF1E6" fg="#E17055" />
        <StatPill icon={<Clock size={13} />} label="Hours" value={f.hours} />
        <StatPill icon={<Award size={13} />} label="Badges" value="25" tint="#EAF7EF" fg="#00B894" />
      </div>
      <Card>
        <p className="text-xs font-bold text-slate-600 mb-3">Weekly progress</p>
        <div style={{ width: "100%", height: 100 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData}>
              <Bar dataKey="hours" fill={f.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <button onClick={() => go("comparison")} className="w-full py-3 mt-4 rounded-xl border text-sm font-semibold" style={{ borderColor: BRAND, color: BRAND }}>
        Compare with me
      </button>
    </div>
  );
}

function ComparisonScreen({ go, friend }) {
  const f = friend || friendsList[0];
  const rows = [
    { label: "Study time", you: "32h 45m", them: "28h 30m" },
    { label: "Streak", you: "18 days", them: "12 days" },
    { label: "Tasks completed", you: "24", them: "19" },
    { label: "Avg daily", you: "4h 40m", them: "4h 04m" },
  ];
  return (
    <div className="px-4">
      <Header title="Comparison" onBack={() => go("friendProfile")} />
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center flex-1">
            <Avatar color={BRAND} size={48}>K</Avatar>
            <p className="text-xs font-semibold text-slate-700 mt-2">Kartik (You)</p>
            <p className="text-lg font-bold" style={{ color: BRAND }}>32h 45m</p>
          </div>
          <span className="text-xs font-bold text-slate-300">VS</span>
          <div className="flex flex-col items-center flex-1">
            <Avatar color={f.color} size={48}>{f.avatar}</Avatar>
            <p className="text-xs font-semibold text-slate-700 mt-2">{f.name}</p>
            <p className="text-lg font-bold text-slate-700">28h 30m</p>
          </div>
        </div>
      </Card>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <Card key={r.label}>
            <p className="text-[11px] text-slate-400 mb-1 text-center">{r.label}</p>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>{r.you}</span><span>{r.them}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LeaderboardScreen({ go }) {
  const [tab, setTab] = useState("Global");
  return (
    <div className="px-4">
      <Header title="Leaderboard" />
      <div className="flex gap-2 mb-4">
        {["Global", "Friends", "This Week"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: tab === t ? BRAND : "#F1F0FA", color: tab === t ? "white" : "#8887A3" }}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {leaderboardData.map((row) => (
          <Card key={row.rank} className={row.you ? "!border-2" : ""} >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: row.rank <= 3 ? "#FFF1E6" : "#F1F0FA", color: row.rank <= 3 ? "#E17055" : "#8887A3" }}>
                {row.rank}
              </div>
              <Avatar color={row.you ? BRAND : "#B4B2A9"} size={36}>{row.name[0]}</Avatar>
              <p className="text-sm font-semibold flex-1 text-slate-700">{row.name}</p>
              <p className="text-sm font-bold text-slate-800">{row.hours}</p>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-center text-[11px] text-slate-400 mt-4">Leaderboard resets in 4d 12h</p>
    </div>
  );
}

function StudyRoomScreen({ go }) {
  const [seconds, setSeconds] = useState(45 * 60);
  return (
    <div className="px-4">
      <Header title="DSA focus room" onBack={() => go("more")} right={<span className="text-[11px] text-slate-400">4 members</span>} />
      <div className="flex justify-center gap-3 mb-6 mt-2">
        {roomMembers.map((m) => (
          <div key={m.name} className="flex flex-col items-center gap-1">
            <div className="relative">
              <Avatar color={m.color} size={48}>{m.name[0]}</Avatar>
              {m.status === "focus" ? (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center"><Wifi size={8} className="text-white" /></div>
              ) : (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center"><WifiOff size={8} className="text-white" /></div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 max-w-[52px] truncate">{m.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>
      <Card className="flex flex-col items-center py-8">
        <p className="text-4xl font-bold text-slate-800 mb-1">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>
        <p className="text-xs text-slate-400 mb-4">On break</p>
        <button className="px-6 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold">End session</button>
      </Card>
    </div>
  );
}

function ChallengesScreen({ go }) {
  const [tab, setTab] = useState("All");
  return (
    <div className="px-4">
      <Header title="Challenges" />
      <div className="flex gap-2 mb-4">
        {["All", "Active", "Completed"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: tab === t ? BRAND : "#F1F0FA", color: tab === t ? "white" : "#8887A3" }}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 mb-4">
        {challengesData.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-slate-700">{c.title}</p>
                <p className="text-[11px] text-slate-400">{c.desc}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 font-medium shrink-0">Ends {c.endsIn}</span>
            </div>
            <ProgressBar value={c.progress} max={c.goal} color="#00B894" />
            <p className="text-[11px] text-slate-400 mt-1.5">{c.progress}/{c.goal}{c.unit} completed</p>
          </Card>
        ))}
      </div>
      <button className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
        <Plus size={16} /> Create challenge
      </button>
    </div>
  );
}

function AICoachScreen({ go }) {
  const suggestions = [
    "You study best between 7 PM - 10 PM",
    "Try to focus more on DBMS this week",
    "Take short breaks after 2 study sessions",
  ];
  return (
    <div className="px-4">
      <Header title="AI study coach" onBack={() => go("more")} />
      <Card className="mb-4 text-center py-6">
        <p className="text-xs text-slate-400 mb-1">Your productivity score</p>
        <p className="text-4xl font-bold" style={{ color: BRAND }}>82<span className="text-lg text-slate-400">/100</span></p>
        <p className="text-xs text-emerald-500 font-medium mt-1">Great job! Keep it up.</p>
      </Card>
      <p className="text-xs font-bold text-slate-500 mb-2">AI suggestions</p>
      <div className="flex flex-col gap-2 mb-4">
        {suggestions.map((s, i) => (
          <Card key={i}>
            <div className="flex items-start gap-2">
              <Zap size={14} color={BRAND} className="mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600">{s}</p>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={() => go("aiCoach")} className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
        <Sparkles size={16} /> Ask AI anything
      </button>
    </div>
  );
}

function SettingsScreen({ go, dark, setDark }) {
  const rows = [
    { icon: User, label: "Profile settings" },
    { icon: Shield, label: "Account" },
    { icon: Palette, label: "Preferences" },
    { icon: Bell, label: "Notifications" },
    { icon: Lock, label: "Privacy" },
    { icon: SettingsIcon, label: "Change password" },
  ];
  return (
    <div className="px-4">
      <Header title="Settings" onBack={() => go("more")} />
      <div className="flex flex-col gap-1 mb-4">
        {rows.map(({ icon: Icon, label }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-slate-500" />
              <span className="text-sm text-slate-700 flex-1">{label}</span>
              <ChevronRight size={15} className="text-slate-300" />
            </div>
          </Card>
        ))}
        <Card>
          <div className="flex items-center gap-3">
            {dark ? <Moon size={16} className="text-slate-500" /> : <Sun size={16} className="text-slate-500" />}
            <span className="text-sm text-slate-700 flex-1">Theme</span>
            <button onClick={() => setDark(!dark)} className="w-10 h-5.5 rounded-full relative transition-colors" style={{ background: dark ? BRAND : "#E2E1F0" }}>
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: dark ? 22 : 3 }} />
            </button>
          </div>
        </Card>
      </div>
      <button onClick={() => go("login")} className="w-full py-3 rounded-xl border border-red-200 text-red-500 font-semibold text-sm flex items-center justify-center gap-2">
        <LogOut size={15} /> Logout
      </button>
    </div>
  );
}

function MoreScreen({ go }) {
  const items = [
    { icon: Users, label: "Friends", key: "friends", tint: "#EEEDFE", fg: BRAND },
    { icon: Trophy, label: "Leaderboard", key: "leaderboard", tint: "#FFF1E6", fg: "#E17055" },
    { icon: Users, label: "Study room", key: "studyRoom", tint: "#EAF7EF", fg: "#00B894" },
    { icon: Target, label: "Challenges", key: "challenges", tint: "#FDF2E9", fg: "#FDCB6E" },
    { icon: Sparkles, label: "AI study coach", key: "aiCoach", tint: "#FBEAF0", fg: "#D4537E" },
    { icon: CalendarIcon, label: "Calendar", key: "calendar", tint: "#E6F1FB", fg: "#378ADD" },
    { icon: SettingsIcon, label: "Settings", key: "settings", tint: "#F1EFE8", fg: "#5F5E5A" },
  ];
  return (
    <div className="px-4">
      <Header title="More" />
      <div className="grid grid-cols-3 gap-3">
        {items.map(({ icon: Icon, label, key, tint, fg }) => (
          <button key={key} onClick={() => go(key)} className="flex flex-col items-center gap-2 bg-white rounded-2xl shadow-sm border border-slate-100 py-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: tint }}>
              <Icon size={18} color={fg} />
            </div>
            <span className="text-[11px] font-medium text-slate-600 text-center px-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- App shell ----------------------------- */
export default function StudySyncApp() {
  const [screen, setScreen] = useState("splash");
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [dark, setDark] = useState(false);

  const go = (key) => setScreen(key);

  const noNavScreens = ["splash", "onboarding", "login", "signup", "timer", "calendar", "friends", "addFriend", "friendProfile", "comparison", "leaderboard", "studyRoom", "challenges", "aiCoach", "settings", "more"];
  const showNav = !noNavScreens.includes(screen) || ["friends", "leaderboard", "studyRoom", "challenges", "aiCoach", "settings", "more", "calendar"].includes(screen);

  let content;
  switch (screen) {
    case "splash": content = <SplashScreen go={go} />; break;
    case "onboarding": content = <OnboardingScreen go={go} />; break;
    case "login": content = <LoginScreen go={go} />; break;
    case "signup": content = <SignupScreen go={go} />; break;
    case "dashboard": content = <DashboardScreen go={go} tasks={tasks} />; break;
    case "timer": content = <TimerScreen go={go} />; break;
    case "tasks": content = <TasksScreen go={go} tasks={tasks} setTasks={setTasks} />; break;
    case "calendar": content = <CalendarScreen go={go} />; break;
    case "analytics": content = <AnalyticsScreen go={go} subjects={initialSubjects} />; break;
    case "friends": content = <FriendsScreen go={go} setSelectedFriend={setSelectedFriend} />; break;
    case "addFriend": content = <AddFriendScreen go={go} />; break;
    case "friendProfile": content = <FriendProfileScreen go={go} friend={selectedFriend} />; break;
    case "comparison": content = <ComparisonScreen go={go} friend={selectedFriend} />; break;
    case "leaderboard": content = <LeaderboardScreen go={go} />; break;
    case "studyRoom": content = <StudyRoomScreen go={go} />; break;
    case "challenges": content = <ChallengesScreen go={go} />; break;
    case "aiCoach": content = <AICoachScreen go={go} />; break;
    case "settings": content = <SettingsScreen go={go} dark={dark} setDark={setDark} />; break;
    case "more": content = <MoreScreen go={go} />; break;
    default: content = <SplashScreen go={go} />;
  }

  const chromeScreens = ["splash", "onboarding", "login", "signup"];
  const isChrome = chromeScreens.includes(screen);
  const bottomNavScreens = ["dashboard", "timer", "tasks", "analytics", "calendar", "friends", "addFriend", "friendProfile", "comparison", "leaderboard", "studyRoom", "challenges", "aiCoach", "settings", "more"];

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-6" style={{ background: "#E7E6F5" }}>
      <div className="relative w-[390px] h-[780px] bg-black rounded-[46px] p-2 shadow-2xl">
        <div className="w-full h-full rounded-[38px] overflow-hidden relative" style={{ background: isChrome ? "transparent" : BG }}>
          <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-28 h-6 bg-black rounded-full" />
          </div>
          <div className="w-full h-full">
            {isChrome ? content : (
              <PageShell screen={screen} go={go} noNav={!bottomNavScreens.includes(screen)}>
                {content}
              </PageShell>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
