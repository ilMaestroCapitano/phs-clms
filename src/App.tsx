import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import seedData from "./data.json";
import hiddenFace from "./assets/hidden-face.png";
import phsLogo from "./assets/phs-logo.png";

type Role = "Administrator" | "Teacher" | "Student";
type Status = "Available" | "In Use" | "Maintenance";
type Equipment = {
  id: string;
  lab: string;
  specs: string;
  user: string;
  status: Status;
  category: "Lab Computer" | "Laptop & Tablet Set" | "Laptop";
};
type Issue = {
  id: string;
  issue: string;
  by: string;
  time: string;
  level: string;
  state: string;
};
type IconName = "grid" | "computer" | "users" | "wrench" | "chart" | "settings" | "bell" | "search" | "plus" | "arrow" | "check" | "clock" | "alert" | "menu" | "close" | "class" | "logout";

const icons: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  computer: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 21h8M12 16v5" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  wrench: <><path d="M14.7 6.3a4 4 0 0 0-5-5L7 4 4 1a4 4 0 0 0 5 5l-7 7a2 2 0 0 0 3 3l7-7a4 4 0 0 0 5-5l-2.3 2.3Z" transform="translate(2 3) scale(.85)" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m7 16 4-5 4 3 5-7" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l-2.8 2.8A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.6h-4a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-2.8-2.8A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14v-4a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l2.8-2.8A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3h4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l2.8 2.8a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1v4a1.7 1.7 0 0 0-1.6 1Z" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  alert: <><path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.8 3h16a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  class: <><path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5" /><path d="M2 20h20M8 9h8M8 13h5" /></>,
  logout: <path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />,
};

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

function playInterfaceClick() {
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(520, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(390, context.currentTime + 0.045);
  gain.gain.setValueAtTime(0.025, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.05);
  oscillator.addEventListener("ended", () => context.close());
}

const labSections = ["Grade 7 – Hope", "Grade 8 – Diligence", "Grade 9 – Strength", "Grade 10 – Excellence", "STEM – A"];
const labComputers: Equipment[] = Array.from({ length: 5 }, (_, room) =>
  Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 7 }, (_, seat) => {
      const position = row * 7 + seat;
      const status: Status = position < 42 ? "Available" : position < 54 ? "In Use" : "Maintenance";
      return {
        id: `LAB${room + 1}-${String.fromCharCode(65 + row)}${seat + 1}`,
        lab: `Computer Room ${room + 1}`,
        specs: position % 2 === 0 ? "Intel Core i5 · 8GB · 256GB SSD" : "AMD Ryzen 5 · 16GB · 512GB SSD",
        user: status === "In Use" ? labSections[room] : status === "Maintenance" ? "Under diagnosis" : "Unassigned",
        status,
        category: "Lab Computer" as const,
      };
    }),
  ).flat(),
).flat();
const jhsPortableEquipment: Equipment[] = Array.from({ length: 46 }, (_, index) => {
  const maintenance = [2, 8, 15, 23, 31, 38, 44].includes(index);
  return {
    id: `JHS-SET-${String(index + 1).padStart(2, "0")}`,
    lab: "JHS Portable Equipment Pool",
    specs: "Laptop & tablet set · For JHS immersion",
    user: maintenance ? "Immersion maintenance" : "Unassigned",
    status: maintenance ? "Maintenance" : "Available",
    category: "Laptop & Tablet Set",
  };
});
const shsLaptops: Equipment[] = Array.from({ length: 30 }, (_, index) => {
  const maintenance = [4, 12, 21, 27].includes(index);
  return {
    id: `SHS-LAP-${String(index + 1).padStart(2, "0")}`,
    lab: "Computer Room 5 · SHS",
    specs: "SHS laptop · 8GB · 256GB SSD",
    user: maintenance ? "Immersion maintenance" : "Unassigned",
    status: maintenance ? "Maintenance" : "Available",
    category: "Laptop",
  };
});
const initialEquipment = [...labComputers, ...jhsPortableEquipment, ...shsLaptops];
const EQUIPMENT_STORAGE_KEY = "phs-clms-equipment-v1";
const ISSUES_STORAGE_KEY = "phs-clms-issues-v1";

function loadStoredRecords<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}
const initialIssues: Issue[] = seedData.issues;
const nav = {
  Administrator: [{ label: "Dashboard", icon: "grid" }, { label: "Lab Scheduling", icon: "class" }, { label: "Computer Units", icon: "computer" }, { label: "User Management", icon: "users" }, { label: "Maintenance", icon: "wrench" }, { label: "Reports", icon: "chart" }, { label: "Settings", icon: "settings" }],
  Teacher: [{ label: "Dashboard", icon: "grid" }, { label: "My Classes", icon: "class" }, { label: "Lab Reservations", icon: "clock" }, { label: "Computer Units", icon: "computer" }, { label: "Seating Plans", icon: "grid" }],
  Student: [],
} satisfies Record<Role, { label: string; icon: IconName }[]>;

function AuthScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const capture = new URLSearchParams(window.location.search).get("capture");
  const [mode, setMode] = useState<"login" | "register">(capture === "register" ? "register" : "login");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [introPhase, setIntroPhase] = useState<"show" | "exit" | "done">(capture && capture !== "intro" ? "done" : "show");

  useEffect(() => {
    if (capture) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const reducedTimer = window.setTimeout(() => setIntroPhase("done"), 120);
      return () => window.clearTimeout(reducedTimer);
    }
    const exitTimer = window.setTimeout(() => setIntroPhase("exit"), 3400);
    const finishTimer = window.setTimeout(() => setIntroPhase("done"), 3900);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    if (!showEasterEgg) return;
    const closeEasterEgg = () => setShowEasterEgg(false);
    window.addEventListener("popstate", closeEasterEgg);
    return () => window.removeEventListener("popstate", closeEasterEgg);
  }, [showEasterEgg]);

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = String(new FormData(event.currentTarget).get("id")).trim().toLowerCase();
    if (id === "666") {
      window.history.pushState({ easterEgg: true }, "");
      setShowEasterEgg(true);
    }
    else if (id === "admin") onLogin("Administrator");
    else if (id === "teacher") onLogin("Teacher");
    else if (id === "student") onLogin("Student");
    else setError("The employee ID or password you entered is incorrect.");
  };
  const register = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistered(true);
  };

  if (showEasterEgg) return <div className="easter-egg" role="dialog" aria-label="Hidden Easter egg">
    <img src={hiddenFace} alt="A shadowed face" />
  </div>;

  if (introPhase !== "done") return <div className={`opening-screen ${introPhase === "exit" ? "is-exiting" : ""}`} aria-label="Pinagbuhatan High School Computer Laboratory Management System">
    <div className="opening-content">
      <div className="opening-logo"><img src={phsLogo} alt="Pinagbuhatan High School seal" /></div>
      <div className="opening-line" />
      <p>PINAGBUHATAN HIGH SCHOOL</p>
      <h1>Welcome</h1>
      <span>Computer Laboratory Management System</span>
    </div>
  </div>;

  return <div className="auth-page">
    <section className="auth-hero">
      <div className="auth-brand"><img src={phsLogo} alt="Pinagbuhatan High School seal" /><div><strong>PINAGBUHATAN</strong><span>HIGH SCHOOL</span></div></div>
      <div className="auth-message"><p>COMPUTER LABORATORY</p><h1>Haven of Excellence!<br />Performing to the Highest Standard!</h1><span>Manage every computer, class assignment, and maintenance request from one secure campus system.</span></div>
      <div className="auth-metrics"><div><strong>280</strong><span>Laboratory computers</span></div><div><strong>5</strong><span>Computer laboratories</span></div><div><strong>76</strong><span>Portable devices</span></div></div>
    </section>
    <section className="auth-panel">
      <div className="auth-box">
        <div className="auth-mobile-brand"><img src={phsLogo} alt="" /><strong>PHS CLMS</strong></div>
        <p className="eyebrow">{mode === "login" ? "WELCOME BACK" : "REQUEST ACCESS"}</p>
        <h2>{mode === "login" ? "Let's get started" : "Create an account"}</h2>
        <p className="auth-copy">{mode === "login" ? "Enter your campus credentials to continue." : "Complete the form below to request access to the system."}</p>
        <div className="auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setRegistered(false); }}>Log in</button><button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Register</button></div>
        {mode === "login" && <div className="auth-access-note" role="note">Use &quot;Teacher&quot;, &quot;Admin&quot;, or &quot;Student&quot; as the Employee ID and type any password to open the corresponding prototype workspace.</div>}
        {mode === "login" ? <form className="auth-form" onSubmit={login}>
          <label>Employee ID<input name="id" required autoFocus placeholder="Enter your employee ID" onChange={() => setError("")} /></label>
          <label>Password<input name="password" required type="password" placeholder="Enter your password" /></label>
          <div className="auth-options"><label><input type="checkbox" /> Remember me</label><button type="button">Forgot password?</button></div>
          {error && <div className="auth-error"><Icon name="alert" size={15} />{error}</div>}
          <button className="primary-button auth-submit" type="submit">Sign in <Icon name="arrow" size={17} /></button>
        </form> : registered ? <div className="registration-result"><span><Icon name="check" size={22} /></span><h3>Request submitted</h3><p>Your registration request has been received and is pending administrator approval. You’ll be notified through your school email.</p><button className="primary-button" onClick={() => { setMode("login"); setRegistered(false); }}>Return to login</button></div> : <form className="auth-form" onSubmit={register}>
          <div className="form-row"><label>First name<input required placeholder="First name" /></label><label>Last name<input required placeholder="Last name" /></label></div>
          <label>School email<input required type="email" placeholder="name@phs.edu.ph" /></label>
          <label>Requested role<select><option>Teacher</option><option>Administrator</option></select></label>
          <label>Password<input required type="password" minLength={8} placeholder="At least 8 characters" /></label>
          <button className="primary-button auth-submit" type="submit">Submit registration <Icon name="arrow" size={17} /></button>
        </form>}
        <footer>Pinagbuhatan High School · Pasig City</footer>
      </div>
    </section>
  </div>;
}

function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="page-title"><div><p className="eyebrow">PHS COMPUTER LABORATORY</p><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function StudentDesktop({ onLogout, onReportIssue }: { onLogout: () => void; onReportIssue: (equipmentId: string, description: string) => string }) {
  const [secondsRemaining, setSecondsRemaining] = useState(2 * 60 * 60);
  const [locked, setLocked] = useState(false);
  const [notice, setNotice] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          setLocked(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const sessionTime = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  const restrictedApp = (name: string) => {
    setNotice(`${name} is unavailable in the restricted student workspace.`);
    window.setTimeout(() => setNotice(""), 2400);
  };
  const submitIssue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = onReportIssue(String(form.get("equipmentId")).trim().toUpperCase(), String(form.get("description")).trim());
    setNotice(result);
    if (result.startsWith("Report sent")) {
      setReportOpen(false);
      event.currentTarget.reset();
    }
    window.setTimeout(() => setNotice(""), 3200);
  };

  return <div className="student-desktop">
    <div className="desktop-session"><span>LAB SESSION REMAINING</span><strong>{sessionTime}</strong><small>Locks automatically when the period ends</small></div>
    <div className="desktop-icons">
      {[["computer", "This PC"], ["class", "Class Files"], ["grid", "Learning Apps"], ["search", "Web Browser"], ["settings", "Settings"]].map(([icon, label]) => <button key={label} onClick={() => restrictedApp(label)}><span><Icon name={icon as IconName} size={27} /></span><small>{label}</small></button>)}
      <button onClick={() => setReportOpen(true)}><span className="issue-app"><Icon name="alert" size={27} /></span><small>Report Issue</small></button>
    </div>
    <div className="desktop-welcome"><img src={phsLogo} alt="Pinagbuhatan High School seal" /><div><p>PINAGBUHATAN HIGH SCHOOL</p><h1>Student Laboratory Workspace</h1><span>Administrative controls, software installation, and system settings are restricted for this session.</span></div></div>
    <div className="desktop-taskbar">
      <button title="Start" onClick={() => restrictedApp("Start menu")}><Icon name="grid" size={20} /></button>
      <div className="taskbar-search"><Icon name="search" size={15} /><span>Search applications</span></div>
      <button title="Class files" onClick={() => restrictedApp("Class Files")}><Icon name="class" size={19} /></button>
      <button title="Browser" onClick={() => restrictedApp("Web Browser")}><Icon name="search" size={19} /></button>
      <button title="Report equipment issue" onClick={() => setReportOpen(true)}><Icon name="alert" size={19} /></button>
      <div className="taskbar-spacer" />
      <button className="taskbar-lock" onClick={() => setLocked(true)}><Icon name="logout" size={17} /> Lock</button>
    </div>
    {reportOpen && <div className="student-report-backdrop" onMouseDown={() => setReportOpen(false)}><section className="student-report-panel" onMouseDown={(event) => event.stopPropagation()}>
      <button className="student-report-close" onClick={() => setReportOpen(false)} aria-label="Close"><Icon name="close" size={18} /></button>
      <div className="student-report-mark"><Icon name="wrench" size={23} /></div>
      <p>TECHNICAL ASSISTANCE</p>
      <h2>Report an equipment issue</h2>
      <span>Send the affected computer or device directly to the laboratory administrators.</span>
      <form onSubmit={submitIssue}>
        <label>Equipment ID<input name="equipmentId" required placeholder="Example: LAB1-A1 or JHS-SET-01" /></label>
        <label>Problem description<textarea name="description" required placeholder="Describe what is not working…" /></label>
        <button type="submit"><Icon name="alert" size={16} /> Send report to Admin</button>
      </form>
    </section></div>}
    {notice && <div className="desktop-notice">{notice}</div>}
    {locked && <div className="desktop-lock">
      <img src={phsLogo} alt="" />
      <p>PINAGBUHATAN HIGH SCHOOL</p>
      <h2>Session locked</h2>
      <span>{secondsRemaining === 0 ? "Your two-hour laboratory period has ended." : "This workstation was locked manually."}</span>
      <button onClick={onLogout}>Sign in again</button>
    </div>}
  </div>;
}

function Inventory({ records, query, setQuery, filter, setFilter, onReportIssue }: { records: Equipment[]; query: string; setQuery: (v: string) => void; filter: "All" | Status; setFilter: (v: "All" | Status) => void; onReportIssue: (id: string) => void }) {
  const filtered = useMemo(() => records.filter((u) => (filter === "All" || u.status === filter) && `${u.id} ${u.lab} ${u.specs} ${u.user} ${u.category}`.toLowerCase().includes(query.toLowerCase())), [records, query, filter]);
  return <section className="panel inventory-panel">
    <div className="table-tools"><label className="search-field"><Icon name="search" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search unit, lab, or user…" /></label><div className="filters">{(["All", "Available", "In Use", "Maintenance"] as const).map((v) => <button className={filter === v ? "active" : ""} onClick={() => setFilter(v)} key={v}>{v}</button>)}</div></div>
    <div className="table-scroll"><table><thead><tr><th>EQUIPMENT</th><th>SPECIFICATIONS</th><th>ASSIGNED USER</th><th>STATUS</th><th>ISSUE</th></tr></thead><tbody>{filtered.map((u) => <tr key={u.id}><td><div className="unit-cell"><span><Icon name="computer" size={17} /></span><div><strong>{u.id}</strong><small>{u.lab}</small></div></div></td><td>{u.specs}</td><td>{u.user}</td><td><span className={`status ${u.status.toLowerCase().replace(" ", "-")}`}>{u.status}</span></td><td><button className="report-unit-button" disabled={u.status === "Maintenance"} onClick={() => onReportIssue(u.id)}><Icon name="alert" size={14} />{u.status === "Maintenance" ? "Under maintenance" : "Report issue"}</button></td></tr>)}</tbody></table>{!filtered.length && <div className="empty-state">No equipment matches your search.</div>}</div>
  </section>;
}

export default function App() {
  const capture = new URLSearchParams(window.location.search).get("capture");
  const captureParts = capture?.split(":") ?? [];
  const [role, setRole] = useState<Role | null>(() => captureParts[0] === "admin" ? "Administrator" : captureParts[0] === "teacher" ? "Teacher" : null);
  const [active, setActive] = useState(() => captureParts[1] ? decodeURIComponent(captureParts[1]) : "Dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [equipment, setEquipment] = useState<Equipment[]>(() => loadStoredRecords(EQUIPMENT_STORAGE_KEY, initialEquipment));
  const [issueReports, setIssueReports] = useState<Issue[]>(() => loadStoredRecords(ISSUES_STORAGE_KEY, initialIssues));
  const [toast, setToast] = useState("");
  const [registerModal, setRegisterModal] = useState(captureParts[2] === "register-user");
  const [notificationsOpen, setNotificationsOpen] = useState(captureParts[2] === "notifications");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  useEffect(() => {
    const clickSound = (event: MouseEvent) => {
      if ((event.target as Element).closest("button")) playInterfaceClick();
    };
    document.addEventListener("click", clickSound);
    return () => document.removeEventListener("click", clickSound);
  }, []);
  useEffect(() => {
    window.localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(equipment));
  }, [equipment]);
  useEffect(() => {
    window.localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issueReports));
  }, [issueReports]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3000); };
  if (!role) return <AuthScreen onLogin={(nextRole) => { setRole(nextRole); setActive("Dashboard"); }} />;

  const go = (label: string) => { setActive(label); setSidebar(false); setNotificationsOpen(false); };
  const reportEquipmentIssue = (id: string, description = "Equipment issue reported from inventory") => {
    const equipmentRecord = equipment.find((item) => item.id === id);
    if (!equipmentRecord) return `Equipment ID ${id} was not found. Check the label and try again.`;
    setEquipment((current) => current.map((item) => item.id === id ? { ...item, status: "Maintenance", user: "Issue reported · Awaiting diagnosis" } : item));
    setIssueReports((current) => [{ id, issue: description, by: "Student workstation user", time: "Just now", level: "MEDIUM", state: "Open" }, ...current.filter((item) => item.id !== id)]);
    notify(`${id} issue sent to Admin and equipment marked under maintenance`);
    return `Report sent to Admin. ${id} is now marked under maintenance.`;
  };
  const deleteIssueReport = (id: string) => {
    setIssueReports((current) => current.filter((item) => item.id !== id));
    setEquipment((current) => current.map((item) => item.id === id ? { ...item, status: "Available", user: "Unassigned" } : item));
    notify(`${id} issue record deleted and equipment returned to available`);
  };
  if (role === "Student") return <StudentDesktop onLogout={() => setRole(null)} onReportIssue={reportEquipmentIssue} />;
  const availableCount = equipment.filter((item) => item.status === "Available").length;
  const inUseCount = equipment.filter((item) => item.status === "In Use").length;
  const maintenanceCount = equipment.filter((item) => item.status === "Maintenance").length;
  const operationalPercent = Math.round(((equipment.length - maintenanceCount) / equipment.length) * 100);
  const reservationForm = <form className="working-form" onSubmit={(e) => { e.preventDefault(); notify("Lab reservation and request letter sent for Admin approval"); (e.currentTarget as HTMLFormElement).reset(); }}><div className="form-row"><label>Date<input required type="date" /></label><label>Computer room<select><option>Computer Room 1 · JHS</option><option>Computer Room 2 · JHS</option><option>Computer Room 3 · JHS</option><option>Computer Room 4 · JHS</option><option>Computer Room 5 · SHS</option></select></label></div><div className="form-row"><label>Class period<select><option>7:30 – 8:30 AM</option><option>8:30 – 9:30 AM</option><option>10:00 – 11:00 AM</option><option>1:00 – 2:00 PM</option><option>2:00 – 3:00 PM</option></select></label><label>Grade and section<select required><optgroup label="Junior High School"><option>Grade 7 – Hope</option><option>Grade 8 – Diligence</option><option>Grade 9 – Strength</option><option>Grade 10 – Excellence</option></optgroup><optgroup label="Senior High School">{["HUMSS", "ABM", "STEM"].flatMap((strand) => ["A", "B", "C", "D", "E", "F"].map((letter) => <option key={`${strand}-${letter}`}>{strand} – {letter}</option>))}</optgroup></select></label></div><label>Subject<input required placeholder="Subject or class activity" /></label><label>Signed request letter <input required type="file" accept=".pdf,.doc,.docx,image/*" /><small className="field-help">A signed request letter is required before a laboratory schedule can be approved.</small></label><button className="primary-button" type="submit">Submit request with letter <Icon name="arrow" size={16} /></button></form>;

  const dashboard = <div className="dashboard-page"><section className="welcome"><div><p className="eyebrow">{role.toUpperCase()} WORKSPACE</p><h1>Good morning, {role === "Administrator" ? "Ma'am Maria" : "Sir Juan"}.</h1><p>{role === "Administrator" ? "Here’s an overview of all computer laboratories today." : "Laboratory 1 is ready for your Grade 10 class at 10:00 AM."}</p></div><div className="date-card"><span>MONDAY</span><strong>24</strong><p>June 2025</p></div></section>
    <section className="role-brief"><Icon name={role === "Administrator" ? "settings" : "class"} size={20} /><p>{role === "Administrator" ? "Manage four JHS computer laboratories, one SHS laboratory, 46 JHS laptop-and-tablet sets, 30 SHS laptops, request-letter approvals, and maintenance tagging." : "Submit a signed request letter to reserve a laboratory, view equipment availability in real time, and organize structured student seating arrangements."}</p></section>
    <section className="stats-grid">{[
      ["Lab Computers", "280", "56 in each of 5 laboratories", "computer", "blue"], [role === "Administrator" ? "Portable Devices" : "Currently Available", role === "Administrator" ? "76" : String(availableCount), role === "Administrator" ? "46 JHS sets · 30 SHS laptops" : "Across computers and devices", "check", "green"], ["In Use", String(inUseCount), "Active class assignments", "clock", "yellow"], [role === "Administrator" ? "Under Maintenance" : "Reserved Classes", role === "Administrator" ? String(maintenanceCount) : "3", role === "Administrator" ? "Includes immersion devices" : "Today’s approved slots", role === "Administrator" ? "alert" : "class", "red"],
    ].map(([label, value, detail, icon, tone]) => <article className={`stat-card ${tone}`} key={label}><div className="stat-icon"><Icon name={icon as IconName} size={21} /></div><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div></article>)}</section>
    {role === "Teacher" && <section className="teacher-banner"><div className="class-time"><span>10:00</span><small>AM</small></div><div><p className="eyebrow">UP NEXT</p><h3>Grade 10 – Excellence · ICT Fundamentals</h3><p>Computer Room 1 · JHS · 42 students · 42 units available</p></div><button onClick={() => go("My Classes")}>View class <Icon name="arrow" size={16} /></button></section>}
    <div className="section-grid"><section className="panel"><div className="panel-heading"><div><h2>Equipment overview</h2><p>Five laboratories and portable-device inventory</p></div><button className="text-button" onClick={() => go("Computer Units")}>View all <Icon name="arrow" size={15} /></button></div><Inventory records={capture ? equipment.slice(0, 30) : equipment} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} onReportIssue={reportEquipmentIssue} /></section>{role === "Administrator" ? <section className="panel issues-panel"><div className="panel-heading"><div><h2>Student-reported issues</h2><p>Equipment is isolated for maintenance</p></div><span className="issue-count">{issueReports.length} open</span></div><div className="issue-list">{issueReports.map((i) => <div className="issue-item" key={i.id}><div className={`priority-dot ${i.level.toLowerCase()}`} /><div><div><strong>{i.id}</strong><span className={`priority ${i.level.toLowerCase()}`}>{i.level}</span></div><p>{i.issue}</p><small>Reported by {i.by} · {i.time}</small></div></div>)}</div><button className="outline-button" onClick={() => go("Maintenance")}><Icon name="wrench" size={16} /> Open issue tracker</button></section> : <section className="panel issues-panel"><div className="panel-heading"><div><h2>Reservation overview</h2><p>Your approved lab slots</p></div><span className="issue-count">3 today</span></div><div className="reservation-list"><div className="reservation-summary"><strong>10:00 AM</strong><p>Grade 10 – Excellence</p><span>Computer Room 1 · JHS · Approved</span></div><div className="reservation-summary"><strong>1:00 PM</strong><p>STEM – A</p><span>Computer Room 5 · SHS · Approved</span></div><div className="reservation-summary"><strong>3:00 PM</strong><p>Grade 8 – Diligence</p><span>Computer Room 2 · JHS · Approved</span></div></div><button className="outline-button" onClick={() => go("Lab Reservations")}><Icon name="plus" size={16} /> Reserve a lab</button></section>}</div></div>;

  const renderPage = () => {
    if (active === "Dashboard") return dashboard;
    if (active === "Computer Units") return <><PageTitle title="Computer Units & Devices" subtitle="Monitor 280 laboratory computers and 76 portable devices across JHS and SHS." action={role === "Administrator" && <button className="primary-button" onClick={() => notify("New equipment record opened")}><Icon name="plus" size={16} /> Add equipment</button>} /><Inventory records={capture ? equipment.slice(0, 30) : equipment} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} onReportIssue={reportEquipmentIssue} /></>;
    if (active === "Lab Scheduling") return <><PageTitle title="Lab Scheduling" subtitle="Review request letters and approve access to four JHS laboratories and one SHS laboratory." /><div className="class-list">{[["8:30 AM", "Grade 8 – Hope", "Computer Room 1 · JHS", "Pending · Letter attached"], ["10:00 AM", "Grade 10 – Excellence", "Computer Room 4 · JHS", "Approved · Letter verified"], ["1:00 PM", "ABM – B", "Computer Room 5 · SHS", "Approved · Letter verified"], ["2:00 PM", "STEM – F", "Computer Room 5 · SHS", "Pending · Letter attached"]].map((c) => <article className="panel class-card" key={`${c[0]}${c[1]}`}><div><strong>{c[0]}</strong><span>Today</span></div><div><h3>{c[1]}</h3><p>{c[2]}</p></div><b>{c[3]}</b><button onClick={() => notify(`${c[1]} request letter reviewed`)}>Review <Icon name="arrow" size={15} /></button></article>)}</div></>;
    if (active === "User Management") return <><PageTitle title="User Management" subtitle="Control teacher, coordinator, and system administrator access." action={<button className="primary-button" onClick={() => setRegisterModal(true)}><Icon name="plus" size={16} /> Register user</button>} /><section className="panel"><div className="panel-heading"><div><h2>Active accounts</h2><p>3 registered campus users</p></div></div><div className="user-list">{[["Maria A. Santos", "PHS-A001", "Admin", "ICT Coordinator"], ["Juan R. Dela Cruz", "PHS-T018", "Teacher", "Computer Teacher"], ["Ann A. Lia", "PHS-A025", "Admin", "System Administrator"]].map((u) => <div className="user-row" key={u[1]}><span>{u[0].split(" ").map((n) => n[0]).slice(0, 2).join("")}</span><div><strong>{u[0]}</strong><small>{u[1]} · {u[3]}</small></div><b>{u[2]}</b><button onClick={() => notify(`${u[0]} selected`)}>View</button></div>)}</div></section></>;
    if (active === "Maintenance") return <><PageTitle title="Issue Tracking & Maintenance" subtitle="Reported equipment is automatically tagged under maintenance until cleared by Admin." /><div className="maintenance-grid">{issueReports.map((i) => <article className="panel maintenance-card" key={i.id}><div><span className={`priority ${i.level.toLowerCase()}`}>{i.level} PRIORITY</span><b>{i.state}</b></div><h3>{i.issue}</h3><p>{i.id} · Student report by {i.by}</p><div className="maintenance-actions"><button className="outline-button" onClick={() => { setEquipment((current) => current.map((item) => item.id === i.id ? { ...item, status: "Maintenance", user: "Issue reported · Awaiting diagnosis" } : item)); setIssueReports((current) => current.map((item) => item.id === i.id ? { ...item, state: "In progress" } : item)); notify(`${i.id} marked under maintenance`); }}><Icon name="wrench" size={15} /> Update status</button><button className="delete-issue-button" onClick={() => deleteIssueReport(i.id)}>Delete report</button></div></article>)}</div></>;
    if (active === "Reports") return <><PageTitle title="Reports & Analytics" subtitle="Utilization and equipment health across five laboratories and both portable-device programs." /><div className="report-grid"><section className="panel report-card"><h2>Weekly utilization</h2>{[["Monday", 72], ["Tuesday", 86], ["Wednesday", 64], ["Thursday", 91], ["Friday", 58]].map(([d, v]) => <div className="bar-row" key={d}><span>{d}</span><i><b style={{ width: `${v}%` }} /></i><strong>{v}%</strong></div>)}</section><section className="panel report-card"><h2>Equipment health</h2><div className="health-ring">{operationalPercent}%<span>Operational</span></div><p>{equipment.length - maintenanceCount} of {equipment.length} computers and portable devices are operational.</p></section></div></>;
    if (active === "Settings") return <><PageTitle title="System Settings" subtitle="Update laboratory preferences and notifications." /><section className="panel settings-panel"><form className="working-form" onSubmit={(e) => { e.preventDefault(); notify("Settings saved"); }}><label>School name<input defaultValue="Pinagbuhatan High School" /></label><label>ICT coordinator email<input type="email" defaultValue="ict@phs.edu.ph" /></label><label className="switch-line"><span><b>Maintenance notifications</b><small>Email administrators when a high-priority issue is submitted.</small></span><input type="checkbox" defaultChecked /></label><button className="primary-button">Save changes</button></form></section></>;
    if (active === "My Classes") return <><PageTitle title="My Classes" subtitle="Today’s approved lab schedule and seating arrangements." /><div className="class-list">{[["10:00 AM", "Grade 10 – Excellence", "ICT Fundamentals", "Computer Room 1 · JHS", "42"], ["1:00 PM", "Grade 9 – Diligence", "Computer Systems", "Computer Room 3 · JHS", "38"], ["3:00 PM", "HUMSS – A", "Digital Literacy", "Computer Room 5 · SHS", "30"]].map((c) => <article className="panel class-card" key={c[0]}><div><strong>{c[0]}</strong><span>Today</span></div><div><h3>{c[1]}</h3><p>{c[2]} · {c[3]}</p></div><b>{c[4]} students</b><button onClick={() => go("Seating Plans")}>Seating plan <Icon name="arrow" size={15} /></button></article>)}</div></>;
    if (active === "Lab Reservations") return <><PageTitle title="Lab Reservations" subtitle="Submit a signed request letter to reserve one of the school’s five computer laboratories." /><section className="panel form-panel">{reservationForm}</section></>;
    if (active === "Seating Plans") return <><PageTitle title="Seating Plans" subtitle="Arrange students across rows A–H and stations 1–7." /><section className="panel seating-panel"><div className="seating-head"><div><h2>Grade 10 – Excellence</h2><p>Computer Room 1 · 10:00 AM</p></div><span>Teacher station</span></div><div className="seat-grid">{Array.from({ length: 8 }, (_, row) => Array.from({ length: 7 }, (_, seat) => <button key={`${row}-${seat}`} onClick={() => notify(`Station ${String.fromCharCode(65 + row)}${seat + 1} selected`)}><strong>{String.fromCharCode(65 + row)}{seat + 1}</strong><span>{row * 7 + seat < 42 ? `Student ${row * 7 + seat + 1}` : "Open"}</span></button>))}</div></section></>;
    return null;
  };

  const notifications = role === "Administrator"
    ? [
        { title: "High-priority issue reported", detail: "LAB2-H6 · Monitor has no display", time: "18 min" },
        { title: "Reservation awaiting approval", detail: "STEM – F · Computer Room 5 · Letter attached", time: "42 min" },
        { title: "Inventory record updated", detail: "LAB1-A3 specifications changed", time: "2 hr" },
      ]
    : [
        { title: "Reservation approved", detail: "Grade 10 – Excellence · Room 1", time: "12 min" },
        { title: "Room assignment confirmed", detail: "HUMSS – A · Computer Room 5 · SHS", time: "1 hr" },
        { title: "Workstation availability updated", detail: "42 units available in Room 1", time: "2 hr" },
      ];

  return <div className="app-shell"><aside className={`sidebar ${sidebar ? "open" : ""}`}><div className="brand"><img src={phsLogo} alt="Pinagbuhatan High School seal" /><div><strong>PHS</strong><span>Computer Lab System</span></div></div><button className="mobile-close" onClick={() => setSidebar(false)}><Icon name="close" /></button><div className="signed-role"><span>Signed in as</span><strong>{role === "Administrator" ? "Admin" : "Teacher"}</strong></div><nav><p className="nav-label">MAIN MENU</p>{nav[role].map((item) => <button key={item.label} className={active === item.label ? "active" : ""} onClick={() => go(item.label)}><Icon name={item.icon} /><span>{item.label}</span>{active === item.label && <i />}</button>)}</nav><div className="sidebar-footer"><div className="profile-avatar">{role === "Administrator" ? "MA" : "JR"}</div><div><strong>{role === "Administrator" ? "Maria A. Santos" : "Juan R. Dela Cruz"}</strong><span>{role === "Administrator" ? "ICT Coordinator · Admin" : "Computer Teacher"}</span></div><button title="Log out" onClick={() => setRole(null)}><Icon name="logout" size={18} /></button></div></aside>{sidebar && <button className="backdrop" onClick={() => setSidebar(false)} />}
    <main><header><button className="menu-button" onClick={() => setSidebar(true)}><Icon name="menu" /></button><div className="header-title"><span>Pinagbuhatan High School</span><strong>{active}</strong></div><div className="header-actions"><div className="notification-wrap"><button className="notification" aria-expanded={notificationsOpen} aria-label="View notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Icon name="bell" />{unreadNotifications > 0 && <i>{unreadNotifications}</i>}</button>{notificationsOpen && <div className="notification-panel"><div className="notification-head"><div><strong>Notifications</strong><span>{unreadNotifications} unread</span></div><button onClick={() => setUnreadNotifications(0)}>Mark all as read</button></div><div className="notification-list">{notifications.map((item, index) => <button key={item.title} onClick={() => { if (unreadNotifications > 0) setUnreadNotifications(Math.max(0, unreadNotifications - 1)); notify(item.title); }}><i className={index < unreadNotifications ? "unread" : ""} /><div><strong>{item.title}</strong><span>{item.detail}</span></div><time>{item.time}</time></button>)}</div><button className="notification-footer" onClick={() => setNotificationsOpen(false)}>Close notifications</button></div>}</div>{role === "Administrator" ? <button className="primary-button compact" onClick={() => setRegisterModal(true)}><Icon name="plus" size={17} /> Register user</button> : <button className="primary-button compact" onClick={() => go("Lab Reservations")}><Icon name="plus" size={17} /> Reserve lab</button>}</div></header><div className="content">{renderPage()}</div></main>
    {registerModal && <div className="modal-backdrop" onMouseDown={() => setRegisterModal(false)}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setRegisterModal(false)}><Icon name="close" /></button><div className="modal-mark"><Icon name="users" size={24} /></div><p className="eyebrow">USER REGISTRATION</p><h2>Register a new user</h2><p className="modal-copy">Create campus access for a teacher, coordinator, or system administrator.</p><form onSubmit={(e) => { e.preventDefault(); setRegisterModal(false); notify("Registration submitted successfully"); }}><div className="form-row"><label>First name<input required /></label><label>Last name<input required /></label></div><label>School email<input required type="email" placeholder="name@phs.edu.ph" /></label><div className="form-row"><label>Role<select><option>Teacher</option><option>Admin · ICT Coordinator</option><option>Admin · System Administrator</option></select></label><label>Employee ID<input required placeholder="PHS-0000" /></label></div><button className="primary-button form-submit">Register user</button></form></div></div>}
    {toast && <div className="toast"><span><Icon name="check" size={16} /></span>{toast}</div>}</div>;
}
