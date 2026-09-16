import { createFileRoute } from "@tanstack/react-router";
import {
  Bell, BookOpen, CalendarDays, ChevronDown, CircleDollarSign, ClipboardCheck,
  GraduationCap, LayoutDashboard, Menu, MoreHorizontal, Plus, Search, Settings,
  UserRound, Users, X, FileText, Clock3, Download, Filter, CheckCircle2,
} from "lucide-react";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurora UMS — School Management" },
      { name: "description", content: "Manage students, attendance, fees, exams, timetables, and school notices." },
      { property: "og:title", content: "Aurora UMS — School Management" },
      { property: "og:description", content: "A focused school management workspace for administrators, teachers, and students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Role = "Admin" | "Teacher" | "Student";
type Icon = ComponentType<{ className?: string }>;
type NavItem = { label: string; icon: Icon };

const roleMenus: Record<Role, NavItem[]> = {
  Admin: [
    { label: "Dashboard", icon: LayoutDashboard }, { label: "Students", icon: GraduationCap },
    { label: "Teachers", icon: Users }, { label: "Classes", icon: BookOpen },
    { label: "Attendance", icon: ClipboardCheck }, { label: "Fees", icon: CircleDollarSign },
    { label: "Exams & Results", icon: FileText }, { label: "Timetable", icon: CalendarDays },
    { label: "Notices", icon: Bell }, { label: "Settings", icon: Settings },
  ],
  Teacher: [
    { label: "Dashboard", icon: LayoutDashboard }, { label: "My Classes", icon: BookOpen },
    { label: "Attendance", icon: ClipboardCheck }, { label: "Exams & Results", icon: FileText },
    { label: "Timetable", icon: CalendarDays }, { label: "Notices", icon: Bell },
  ],
  Student: [
    { label: "Dashboard", icon: LayoutDashboard }, { label: "My Attendance", icon: ClipboardCheck },
    { label: "My Fees", icon: CircleDollarSign }, { label: "My Results", icon: FileText },
    { label: "Timetable", icon: CalendarDays }, { label: "Notices", icon: Bell },
  ],
};

const students = [
  ["Aarav Mehta", "A-1007", "Grade 10 · A", "Rakesh Mehta", "+91 98765 43021", "Active"],
  ["Diya Sharma", "A-1012", "Grade 10 · A", "Anita Sharma", "+91 98112 67741", "Active"],
  ["Kabir Singh", "B-2041", "Grade 9 · B", "Harpreet Singh", "+91 99584 12008", "Active"],
  ["Meera Nair", "C-3022", "Grade 11 · C", "Vijay Nair", "+91 98990 44320", "Inactive"],
  ["Rohan Gupta", "B-2054", "Grade 9 · B", "Neha Gupta", "+91 99718 32210", "Active"],
];

const teachers = [
  ["Ananya Rao", "Mathematics", "10-A, 10-B", "ananya@aurora.edu", "Active"],
  ["Rahul Iyer", "Physics", "11-A, 12-A", "rahul@aurora.edu", "Active"],
  ["Priya Kapoor", "English", "8-B, 9-A", "priya@aurora.edu", "Active"],
  ["Dev Malhotra", "Chemistry", "11-B, 12-B", "dev@aurora.edu", "On leave"],
];

function Index() {
  const [role, setRole] = useState<Role>("Admin");
  const [page, setPage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<string | null>(null);
  const menus = roleMenus[role];
  const switchRole = (next: Role) => { setRole(next); setPage("Dashboard"); };

  return (
    <div className="app-shell min-h-screen font-body text-foreground">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="ambient ambient-three" />
      <div className="relative flex min-h-screen">
        <Sidebar role={role} page={page} menus={menus} open={mobileOpen} onClose={() => setMobileOpen(false)} onSelect={(label) => { setPage(label); setMobileOpen(false); }} />
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7">
          <header className="glass-panel flex h-16 items-center gap-3 rounded-2xl px-3 sm:px-5">
            <button aria-label="Open navigation" className="icon-button md:hidden" onClick={() => setMobileOpen(true)}><Menu className="size-5" /></button>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold sm:text-lg">{page === "Dashboard" ? `Good morning, ${role === "Student" ? "Aarav" : role === "Teacher" ? "Ms. Rao" : "Dr. Vane"}` : page}</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Wednesday, 16 September · Academic year 2026–27</p>
            </div>
            <label className="glass-subtle ml-auto hidden h-9 w-64 items-center gap-2 rounded-full px-3 lg:flex">
              <Search className="size-4 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search students, fees…" />
            </label>
            <div className="hidden items-center rounded-lg border border-glass-border bg-surface/55 p-1 sm:flex">
              {(["Admin", "Teacher", "Student"] as Role[]).map((item) => <button key={item} onClick={() => switchRole(item)} className={`role-tab ${role === item ? "role-tab-active" : ""}`}>{item}</button>)}
            </div>
            <button aria-label="Notifications" className="icon-button relative"><Bell className="size-4" /><span className="notification-dot" /></button>
            <div className="avatar">{role === "Student" ? "AM" : role === "Teacher" ? "AR" : "EV"}</div>
          </header>
          <div className="mt-5 animate-in fade-in slide-in-from-bottom-2 duration-300" key={`${role}-${page}`}>
            <PageContent role={role} page={page} query={query} openDialog={setDialog} />
          </div>
        </main>
      </div>
      {dialog && <DemoDialog title={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}

function Sidebar({ role, page, menus, open, onClose, onSelect }: { role: Role; page: string; menus: NavItem[]; open: boolean; onClose: () => void; onSelect: (page: string) => void }) {
  return <>
    {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-overlay md:hidden" onClick={onClose} />}
    <aside className={`glass-sidebar fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col p-4 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center gap-3 px-2 pb-5 pt-1">
        <div className="brand-mark">A</div><div><p className="font-display text-[15px] font-bold leading-none">Aurora UMS</p><p className="mt-1 text-[10px] font-semibold uppercase text-muted-foreground">Academy OS</p></div>
        <button aria-label="Close navigation" onClick={onClose} className="icon-button ml-auto md:hidden"><X className="size-4" /></button>
      </div>
      <p className="nav-label">Workspace</p>
      <nav className="flex flex-col gap-1">
        {menus.map(({ label, icon: ItemIcon }) => <button key={label} onClick={() => onSelect(label)} className={`nav-item ${page === label ? "nav-item-active" : ""}`}><ItemIcon className="size-4" /><span>{label}</span>{label === "Notices" && <span className="ml-auto rounded-full bg-brand/10 px-2 text-[10px] text-brand">3</span>}</button>)}
      </nav>
      <div className="glass-subtle mt-auto rounded-xl p-3">
        <div className="flex items-center gap-2"><div className="mini-avatar">{role.slice(0, 1)}</div><div><p className="text-xs font-semibold">{role} workspace</p><p className="text-[11px] text-muted-foreground">Term 1 · Week 8</p></div><ChevronDown className="ml-auto size-4 text-muted-foreground" /></div>
      </div>
    </aside>
  </>;
}

function PageContent({ role, page, query, openDialog }: { role: Role; page: string; query: string; openDialog: (title: string) => void }) {
  if (page === "Dashboard") return <Dashboard role={role} />;
  if (page === "Students") return <DataPage title="Students" subtitle="1,284 enrolled students across 36 class sections" columns={["Student", "Roll no.", "Class / Section", "Guardian", "Contact", "Status"]} rows={students} query={query} action="Add student" onAction={() => openDialog("Add student")} />;
  if (page === "Teachers") return <DataPage title="Teachers" subtitle="64 faculty members and their class assignments" columns={["Teacher", "Subject", "Assigned classes", "Email", "Status"]} rows={teachers} query={query} action="Add teacher" onAction={() => openDialog("Add teacher")} />;
  if (page.includes("Attendance")) return <AttendancePage editable={role !== "Student"} />;
  if (page.includes("Fees")) return <FeesPage role={role} onAction={() => openDialog("Record payment")} />;
  if (page.includes("Results") || page.includes("Exams")) return <ResultsPage editable={role !== "Student"} />;
  if (page === "Timetable") return <TimetablePage role={role} />;
  if (page === "Notices") return <NoticesPage role={role} onAction={() => openDialog("Post notice")} />;
  if (page === "Classes" || page === "My Classes") return <ClassesPage />;
  return <SettingsPage />;
}

function Dashboard({ role }: { role: Role }) {
  if (role === "Student") return <>
    <SectionHeading title="My dashboard" subtitle="Your academic snapshot for Grade 10 · Section A" />
    <Stats items={[["Attendance this month", "94.2%", "2 days absent"], ["Fee due", "₹12,500", "Due 30 Sep"], ["Latest result", "A−", "Mathematics · 86/100"], ["Class rank", "08", "of 42 students"]]} />
    <DashboardGrid role={role} />
  </>;
  if (role === "Teacher") return <>
    <SectionHeading title="Teaching overview" subtitle="Your classes, schedule, and pending academic tasks" />
    <Stats items={[["Assigned classes", "4", "142 students"], ["Today's periods", "5", "Next at 10:20"], ["Attendance", "92.8%", "Across your classes"], ["Marks pending", "2", "Due this Friday"]]} />
    <DashboardGrid role={role} />
  </>;
  return <>
    <SectionHeading title="School overview" subtitle="A live summary of Aurora Academy today" />
    <Stats items={[["Enrolled students", "1,284", "+38 this term"], ["Active teachers", "64", "3 on leave"], ["Attendance today", "94.2%", "17 absences"], ["Pending fees", "₹12.2L", "78% collected"]]} />
    <DashboardGrid role={role} />
  </>;
}

function SectionHeading({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) {
  return <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-display text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>{action && <button className="primary-button" onClick={onAction}><Plus className="size-4" />{action}</button>}</div>;
}

function Stats({ items }: { items: string[][] }) {
  return <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">{items.map(([label, value, detail], index) => <div key={label} className="glass-panel rounded-2xl p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{label}</p><span className={`status-light status-${index}`} /></div><p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{value}</p><p className="mt-1 text-[11px] font-medium text-muted-foreground">{detail}</p></div>)}</section>;
}

function DashboardGrid({ role }: { role: Role }) {
  const classes = role === "Student" ? [["Mathematics", "10:20", "Ms. Rao", "Room 204"], ["English", "11:15", "Ms. Kapoor", "Room 108"], ["Physics", "13:00", "Mr. Iyer", "Lab 2"]] : [["Grade 10 · Mathematics", "28 present · 2 absent", "93%", "93%"], ["Grade 9 · English", "31 present · 1 absent", "97%", "97%"], ["Grade 11 · Chemistry", "24 present · 5 absent", "83%", "83%"]];
  return <div className="mt-4 grid gap-4 xl:grid-cols-3">
    <section className="glass-panel rounded-2xl p-5 xl:col-span-2"><div className="flex items-center justify-between"><h2 className="panel-title">{role === "Student" ? "Today's timetable" : role === "Teacher" ? "My class attendance" : "Today's attendance"}</h2><span className="text-[11px] text-muted-foreground">16 September</span></div><div className="mt-4 space-y-2.5">{classes.map((item, i) => <div key={item[0]} className="glass-row"><div className={`class-icon class-${i}`}>{role === "Student" ? <Clock3 className="size-4" /> : `${i + 1}${String.fromCharCode(65 + i)}`}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{item[0]}</p><p className="text-[11px] text-muted-foreground">{item[1]}</p></div><div className="ml-auto text-right"><p className="text-xs font-semibold text-accent">{item[2]}</p><p className="text-[10px] text-muted-foreground">{item[3]}</p></div></div>)}</div></section>
    <section className="glass-panel rounded-2xl p-5"><div className="flex items-center justify-between"><h2 className="panel-title">Latest notices</h2><Bell className="size-4 text-muted-foreground" /></div><div className="mt-4 space-y-3">{[["Mid-term exams begin Monday", "Academics · 2h ago"], ["Fee deadline extended to 30 Sep", "Finance office · 6h ago"], ["Science fair venue moved", "Activities · 1d ago"]].map(([title, meta]) => <div key={title} className="glass-row block"><p className="text-sm font-medium">{title}</p><p className="mt-1 text-[11px] text-muted-foreground">{meta}</p></div>)}</div></section>
  </div>;
}

function DataPage({ title, subtitle, columns, rows, query, action, onAction }: { title: string; subtitle: string; columns: string[]; rows: string[][]; query: string; action: string; onAction: () => void }) {
  const filtered = useMemo(() => rows.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase())), [rows, query]);
  return <><SectionHeading title={title} subtitle={subtitle} action={action} onAction={onAction} /><Toolbar /><Table columns={columns} rows={filtered} /></>;
}

function Toolbar() { return <div className="glass-panel mb-3 flex flex-wrap items-center gap-2 rounded-xl p-2"><label className="flex h-9 min-w-52 flex-1 items-center gap-2 px-2"><Search className="size-4 text-muted-foreground" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Search records…" /></label><button className="secondary-button"><Filter className="size-4" />Filter</button><button className="icon-button" aria-label="More options"><MoreHorizontal className="size-4" /></button></div>; }

function Table({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return <div className="glass-panel overflow-hidden rounded-2xl"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr>{columns.map((col) => <th key={col}>{col}</th>)}<th aria-label="Actions" /></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={`${row[0]}-${i}`}>{i === 0 ? <div className="flex items-center gap-3"><div className="mini-avatar">{cell.split(" ").map((part) => part[0]).join("").slice(0,2)}</div><span className="font-medium">{cell}</span></div> : i === row.length - 1 ? <Status value={cell} /> : cell}</td>)}<td><button className="icon-button" aria-label={`More actions for ${row[0]}`}><MoreHorizontal className="size-4" /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-glass-border px-4 py-3 text-xs text-muted-foreground"><span>Showing {rows.length} records</span><span>Page 1 of 1</span></div></div>;
}

function Status({ value }: { value: string }) { return <span className={`status-badge ${value.toLowerCase().replace(" ", "-")}`}>{value}</span>; }

function AttendancePage({ editable }: { editable: boolean }) {
  const [present, setPresent] = useState([true, true, false, true, true]);
  const names = ["Aarav Mehta", "Diya Sharma", "Kabir Singh", "Rohan Gupta", "Sara Khan"];
  return <><SectionHeading title={editable ? "Attendance" : "My attendance"} subtitle={editable ? "Mark and review daily student attendance" : "Your monthly attendance record and summary"} /><div className="grid gap-4 xl:grid-cols-[1fr_280px]"><section className="glass-panel rounded-2xl p-5"><div className="flex flex-wrap items-center gap-2"><select className="field"><option>Grade 10 · Section A</option></select><input type="date" defaultValue="2026-09-16" className="field" />{editable && <button className="secondary-button ml-auto" onClick={() => setPresent(names.map(() => true))}><CheckCircle2 className="size-4" />Mark all present</button>}</div><div className="mt-5 divide-y divide-glass-border">{names.map((name, index) => <div className="flex items-center gap-3 py-3" key={name}><div className="mini-avatar">{name.split(" ").map(x => x[0]).join("")}</div><div><p className="text-sm font-medium">{name}</p><p className="text-[11px] text-muted-foreground">Roll A-{1007 + index}</p></div><button disabled={!editable} onClick={() => setPresent((old) => old.map((value, i) => i === index ? !value : value))} className={`attendance-toggle ml-auto ${present[index] ? "is-present" : "is-absent"}`}>{present[index] ? "Present" : "Absent"}</button></div>)}</div>{editable && <button className="primary-button mt-4">Save attendance</button>}</section><aside className="glass-panel rounded-2xl p-5"><p className="panel-title">September summary</p><div className="progress-ring mt-6"><strong>{editable ? "94%" : "94.2%"}</strong><span>attendance</span></div><dl className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Present</dt><dd className="font-semibold">18 days</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Absent</dt><dd className="font-semibold">2 days</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Working days</dt><dd className="font-semibold">20 days</dd></div></dl></aside></div></>;
}

function FeesPage({ role, onAction }: { role: Role; onAction: () => void }) { const rows = [["Aarav Mehta", "Grade 10-A", "₹85,000", "₹72,500", "₹12,500", "Partial"], ["Diya Sharma", "Grade 10-A", "₹85,000", "₹85,000", "₹0", "Paid"], ["Kabir Singh", "Grade 9-B", "₹78,000", "₹0", "₹78,000", "Unpaid"], ["Sara Khan", "Grade 10-A", "₹85,000", "₹85,000", "₹0", "Paid"]]; return <><SectionHeading title={role === "Student" ? "My fees" : "Fees"} subtitle={role === "Student" ? "Fee balance and recent payment history" : "Track collections, dues, and student payments"} action={role === "Admin" ? "Record payment" : undefined} onAction={onAction} /><Stats items={[["Total fee", "₹85,000", "Academic year 2026–27"], ["Paid", "₹72,500", "3 payments received"], ["Due", "₹12,500", "Due 30 September"], ["Last payment", "₹25,000", "Online · 18 August"]]} /><div className="mt-4"><Table columns={["Student", "Class", "Total fee", "Paid", "Due", "Status"]} rows={role === "Student" ? rows.slice(0,1) : rows} /></div></>; }

function ResultsPage({ editable }: { editable: boolean }) { const rows = [["Mid-Term Examination", "Mathematics", "86 / 100", "A", "Published"], ["Mid-Term Examination", "English", "91 / 100", "A+", "Published"], ["Unit Test II", "Physics", "43 / 50", "A", "Published"], ["Unit Test II", "Chemistry", "39 / 50", "B+", "Draft"]]; return <><SectionHeading title={editable ? "Exams & Results" : "My results"} subtitle={editable ? "Manage exams, marks entry, and report cards" : "Review scores and download report cards"} action={editable ? "Create exam" : undefined} /><Table columns={["Exam", "Subject", "Score", "Grade", "Status"]} rows={rows} /><button className="secondary-button mt-3"><Download className="size-4" />Download report card</button></>; }

function TimetablePage({ role }: { role: Role }) { const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; const periods = ["Mathematics", "English", "Physics", "Computer Sci.", "Chemistry"]; return <><SectionHeading title="Timetable" subtitle={role === "Admin" ? "Weekly schedule for Grade 10 · Section A" : "Your weekly class schedule"} /><div className="glass-panel overflow-hidden rounded-2xl"><div className="overflow-x-auto"><div className="timetable min-w-[800px]"><div className="timetable-head">Day / Period</div>{["08:30", "09:25", "10:20", "11:15", "13:00"].map(time => <div className="timetable-head" key={time}>{time}</div>)}{days.flatMap((day, d) => [<div className="timetable-day" key={day}>{day}</div>, ...periods.map((subject, p) => <div className="timetable-cell" key={`${day}-${subject}`}><strong>{periods[(p+d)%periods.length]}</strong><span>{["A. Rao", "P. Kapoor", "R. Iyer", "N. Shah", "D. Malhotra"][(p+d)%5]}</span></div>)])}</div></div></div></>; }

function NoticesPage({ role, onAction }: { role: Role; onAction: () => void }) { return <><SectionHeading title="Notices" subtitle="Announcements for the Aurora Academy community" action={role !== "Student" ? "Post notice" : undefined} onAction={onAction} /><div className="grid gap-3 lg:grid-cols-2">{[["Mid-term examination schedule", "The Mid-term examinations will begin Monday, 21 September. The detailed timetable is now available.", "All", "Today, 9:30 AM"], ["Fee payment deadline extended", "The final date for Term 1 fee payment has been extended to 30 September.", "Students", "Yesterday"], ["Science fair venue update", "The annual science fair will now be held in the main auditorium.", "All", "14 September"], ["Faculty development workshop", "Teaching staff are requested to attend the workshop this Saturday at 10 AM.", "Teachers", "12 September"]].map(([title, body, audience, date]) => <article key={title} className="glass-panel rounded-2xl p-5"><div className="flex items-start gap-3"><div className="notice-icon"><Bell className="size-4" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="panel-title">{title}</h2><span className="status-badge active">{audience}</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p><p className="mt-3 text-[11px] text-muted-foreground">Registrar's Office · {date}</p></div></div></article>)}</div></>; }

function ClassesPage() { const rows = [["Grade 10", "Section A", "Ananya Rao", "42", "Active"], ["Grade 10", "Section B", "Rahul Iyer", "39", "Active"], ["Grade 11", "Section A", "Priya Kapoor", "34", "Active"], ["Grade 12", "Section B", "Dev Malhotra", "31", "Active"]]; return <><SectionHeading title="Classes" subtitle="Class sections, teachers, and student strength" action="Add class" /><Table columns={["Class", "Section", "Class teacher", "Students", "Status"]} rows={rows} /></>; }

function SettingsPage() { return <><SectionHeading title="Settings" subtitle="Manage school information and academic preferences" /><div className="glass-panel max-w-3xl rounded-2xl p-5"><h2 className="panel-title">Institute information</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Institute name" value="Aurora Academy" /><Field label="Academic year" value="2026–27" /><Field label="Email" value="office@aurora.edu" /><Field label="Phone" value="+91 11 4567 8900" /><div className="sm:col-span-2"><Field label="Address" value="21 Knowledge Park, New Delhi" /></div></div><button className="primary-button mt-5">Save changes</button></div></>; }

function Field({ label, value }: { label: string; value: string }) { return <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span><input className="field w-full" defaultValue={value} /></label>; }

function DemoDialog({ title, onClose }: { title: string; onClose: () => void }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4" onMouseDown={onClose}><section className="glass-dialog w-full max-w-lg rounded-2xl p-5" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close"><X className="size-4" /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Name / title" value="" /><Field label="Class / category" value="" /><Field label="Date" value="16 September 2026" /><Field label="Status" value="Active" /></div><div className="mt-5 flex justify-end gap-2"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={onClose}>Save</button></div></section></div>; }