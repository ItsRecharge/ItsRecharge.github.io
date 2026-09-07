// Demo seed for drummajor-portal running on PGlite (no DATABASE_URL).
// Copy to <repo>/scripts/demo-seed.mjs and run with the server STOPPED:
//   node scripts/demo-seed.mjs
// Everything here is fictional: "Northfield High School", @example.edu people.
import { PGlite } from "@electric-sql/pglite";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const db = new PGlite({ dataDir: "./.pglite" });
await db.waitReady;

const cuid = () => "c" + randomBytes(12).toString("hex");
const now = new Date();
const daysFromNow = (d, h = 9) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + d, h));
const q = (sql, params = []) => db.query(sql, params);

const { rows: existing } = await q(`SELECT count(*)::int AS n FROM "User"`);
if (existing[0].n > 0) {
  console.log("demo-seed already applied (users exist)");
  await db.close();
  process.exit(0);
}

const PASS = await bcrypt.hash("DemoPass1!", 12);

// --- org + settings ---
await q(
  `INSERT INTO "Organization" (id,"schoolName","bandName",slug,"baseUrl","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,now(),now())`,
  [cuid(), "Northfield High School", "Northfield Marching Band", "northfield-band", "http://localhost:3102"],
);
await q(
  `INSERT INTO "AppSettings" (id,"approvalRequired","setupComplete","createdAt","updatedAt") VALUES ($1,false,true,now(),now())`,
  [cuid()],
);

// --- users ---
const users = {
  admin: { id: cuid(), name: "Alex Morgan", email: "alex.morgan@example.edu", role: "ADMIN", gradYear: 2026, instrument: "Trumpet" },
  dm1: { id: cuid(), name: "Priya Shah", email: "priya.shah@example.edu", role: "DRUM_MAJOR", gradYear: 2026, instrument: "Clarinet" },
  dm2: { id: cuid(), name: "Leo Martinez", email: "leo.martinez@example.edu", role: "DRUM_MAJOR", gradYear: 2027, instrument: "Percussion" },
  lib: { id: cuid(), name: "Maya Thompson", email: "maya.thompson@example.edu", role: "LIBRARIAN", gradYear: 2027, instrument: "Flute" },
};
for (const u of Object.values(users)) {
  await q(
    `INSERT INTO "User" (id,name,email,role,"passwordHash","gradYear",instrument,"emailVerified","createdAt","updatedAt")
     VALUES ($1,$2,$3,$4::"Role",$5,$6,$7,now(),now(),now())`,
    [u.id, u.name, u.email, u.role, PASS, u.gradYear, u.instrument],
  );
}

// --- groups + contacts ---
const groups = {};
for (const [name, builtIn] of [["Everyone", true], ["Marching", true], ["Concert", true], ["Jazz", true], ["Section Leaders", false], ["Pep Band", false]]) {
  const id = cuid();
  groups[name] = id;
  await q(`INSERT INTO "Group" (id,name,"builtIn","createdAt") VALUES ($1,$2,$3,now())`, [id, name, builtIn]);
}
const CONTACTS = [
  ["Avery Chen", "Flute", 12, ["Marching", "Concert", "Section Leaders"]],
  ["Jordan Patel", "Alto Sax", 12, ["Marching", "Jazz", "Section Leaders"]],
  ["Riley Nguyen", "Trumpet", 11, ["Marching", "Concert", "Jazz", "Pep Band"]],
  ["Sam Okafor", "Trombone", 11, ["Marching", "Jazz"]],
  ["Taylor Kim", "Clarinet", 10, ["Marching", "Concert"]],
  ["Morgan Rivera", "Snare", 10, ["Marching", "Pep Band"]],
  ["Casey Brooks", "Tuba", 9, ["Marching", "Concert"]],
  ["Jamie Lee", "Mellophone", 9, ["Marching"]],
  ["Dana Whitfield", "Bass Clarinet", 12, ["Concert"]],
  ["Robin Alvarez", "Baritone", 11, ["Marching", "Concert", "Pep Band"]],
  ["Quinn Foster", "Tenor Sax", 10, ["Jazz", "Marching"]],
  ["Skyler Haddad", "Piano", 11, ["Jazz"]],
  ["Emerson Vale", "Oboe", 10, ["Concert"]],
  ["Harper Diaz", "Trumpet", 9, ["Marching", "Pep Band"]],
  ["Rowan Ellis", "Bass Drum", 12, ["Marching"]],
  ["Parker Singh", "Cymbals", 9, ["Marching"]],
];
for (const [name, inst, grade, gs] of CONTACTS) {
  const id = cuid();
  const email = name.toLowerCase().replace(" ", ".") + "@example.edu";
  await q(`INSERT INTO "Contact" (id,name,email,instrument,grade,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,now(),now())`, [id, name, email, inst, grade]);
  for (const g of ["Everyone", ...gs]) {
    await q(`INSERT INTO "ContactGroup" ("contactId","groupId") VALUES ($1,$2)`, [id, groups[g]]);
  }
}

// --- library tree ---
const folder = async (name, parentId = null, note = null) => {
  const id = cuid();
  await q(
    `INSERT INTO "LibraryItem" (id,name,type,"parentId",note,"syncState","uploadedById","createdAt","updatedAt")
     VALUES ($1,$2,'FOLDER'::"LibraryItemType",$3,$4,'SYNCED'::"SyncState",$5,now(),now())`,
    [id, name, parentId, note, users.lib.id],
  );
  return id;
};
const file = async (name, parentId, size, note = null) => {
  const id = cuid();
  await q(
    `INSERT INTO "LibraryItem" (id,name,type,"parentId","mimeType","sizeBytes",note,"syncState","uploadedById","createdAt","updatedAt")
     VALUES ($1,$2,'FILE'::"LibraryItemType",$3,'application/pdf',$4,$5,'SYNCED'::"SyncState",$6,now(),now())`,
    [id, name, parentId, size, note, users.lib.id],
  );
  return id;
};
const marching = await folder("Marching Band 2026", null, "Field show + stands tunes for the fall season.");
const show = await folder("Field Show — “Skyline”", marching);
for (const [n, s] of [["01 Opener — Full Score.pdf", 812345], ["01 Opener — Flute.pdf", 90312], ["01 Opener — Trumpet 1.pdf", 88210], ["01 Opener — Percussion.pdf", 120900], ["02 Ballad — Full Score.pdf", 640022], ["03 Closer — Full Score.pdf", 733411]]) {
  await file(n, show, s);
}
const stands = await folder("Stands Tunes", marching);
for (const [n, s] of [["Seven Nation Army.pdf", 44012], ["Land of 1000 Dances.pdf", 51230], ["Fight Song.pdf", 38800]]) {
  await file(n, stands, s);
}
const concert = await folder("Concert Band", null, "Winter + spring concert repertoire.");
for (const [n, s] of [["Holst — First Suite in E♭ (Score).pdf", 1250000], ["Ticheli — Shenandoah (Score).pdf", 900122], ["Sousa — The Thunderer (Parts).pdf", 2210000]]) {
  await file(n, concert, s);
}
const jazz = await folder("Jazz Ensemble", null);
for (const [n, s] of [["Sing Sing Sing.pdf", 410000], ["Moanin' (Mingus).pdf", 380000], ["Birdland.pdf", 455000]]) {
  await file(n, jazz, s);
}
const vault = await folder("Document Vault", null, "Forms, itineraries, and leadership docs.");
await file("Fall Trip Itinerary.pdf", vault, 210000, "Bus assignments on page 2.");
await file("Uniform Care Guide.pdf", vault, 98000);

// --- announcements ---
const ann = async (subject, body, status, opts = {}) => {
  const id = cuid();
  await q(
    `INSERT INTO "Announcement" (id,subject,"bodyHtml",status,"scheduledAt","sentAt","authorId","createdAt","updatedAt")
     VALUES ($1,$2,$3,$4::"AnnouncementStatus",$5,$6,$7,$8,$8)`,
    [id, subject, body, status, opts.scheduledAt ?? null, opts.sentAt ?? null, opts.author ?? users.admin.id, opts.createdAt ?? now],
  );
  for (const g of opts.groups ?? ["Everyone"]) {
    await q(`INSERT INTO "AnnouncementRecipientGroup" ("announcementId","groupId") VALUES ($1,$2)`, [id, groups[g]]);
  }
  for (const item of opts.music ?? []) {
    await q(`INSERT INTO "AnnouncementMusic" ("announcementId","libraryItemId") VALUES ($1,$2)`, [id, item]);
  }
  return id;
};
const a1 = await ann(
  "Skyline field show music is posted",
  "<p>Hi band,</p><p>Full parts for the <b>Skyline</b> field show are in the library. Please print your part and bring it to Tuesday's rehearsal. Section leaders: run a 10-minute read-through in sectionals.</p><p>— Alex</p>",
  "SENT",
  { sentAt: daysFromNow(-9, 18), createdAt: daysFromNow(-9, 17), groups: ["Marching"], music: [show] },
);
const a2 = await ann(
  "Homecoming call time + uniform check",
  "<p>Call time Friday is <b>4:45 PM</b> in the band room. Full uniform, black socks, gloves. Stands tunes folder attached — memorize the first three.</p>",
  "SENT",
  { sentAt: daysFromNow(-3, 15), createdAt: daysFromNow(-3, 14), groups: ["Marching", "Pep Band"], music: [stands], author: users.dm1.id },
);
await ann(
  "Winter concert rehearsal schedule",
  "<p>Concert band rehearsals move to Mon/Wed 2:30–4:00 starting next week. Shenandoah and First Suite are in the library.</p>",
  "SCHEDULED",
  { scheduledAt: daysFromNow(2, 16), groups: ["Concert"], music: [concert], author: users.dm2.id },
);
await ann(
  "Jazz night fundraiser — volunteers needed",
  "<p>We need 6 volunteers for the merch table and 4 for setup. Reply to this email or sign up on the tasks board.</p>",
  "PENDING_APPROVAL",
  { groups: ["Jazz", "Section Leaders"], author: users.dm2.id },
);
await ann("Spring trip interest form", "<p>Draft — add the form link once the itinerary is final.</p>", "DRAFT", { groups: ["Everyone"] });

// deliveries for sent announcements (opens tracked)
const { rows: contactRows } = await q(`SELECT email FROM "Contact"`);
for (const [aid, openRate] of [[a1, 0.7], [a2, 0.55]]) {
  for (const [i, c] of contactRows.entries()) {
    await q(
      `INSERT INTO "EmailDelivery" (id,"announcementId","recipientEmail","trackingToken","sentAt","openedAt") VALUES ($1,$2,$3,$4,$5,$6)`,
      [cuid(), aid, c.email, randomBytes(16).toString("hex"), daysFromNow(-3, 15), i / contactRows.length < openRate ? daysFromNow(-2, 20) : null],
    );
  }
}

for (const [name, subject, body] of [
  ["Call time", "Call time for {{event}}", "<p>Call time is <b>{{time}}</b> in the band room. Full uniform.</p>"],
  ["Music posted", "{{piece}} is posted", "<p>Parts for <b>{{piece}}</b> are in the library. Print before rehearsal.</p>"],
  ["Weekly update", "Band update — week of {{date}}", "<p>Here's what's happening this week…</p>"],
]) {
  await q(`INSERT INTO "AnnouncementTemplate" (id,name,subject,"bodyHtml","createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),now())`, [cuid(), name, subject, body]);
}

// --- events, tasks, notes, handoff ---
for (const [title, d, time, desc, notify] of [
  ["Homecoming Game — Field Show", 4, "7:00 PM", "Call time 4:45 PM. Full uniform.", true],
  ["Sectionals — Brass", 6, "2:30 PM", "Skyline opener mm. 1–48.", false],
  ["Regional Marching Festival", 12, "10:00 AM", "Buses leave 7:15 AM. Itinerary in the vault.", true],
  ["Winter Concert", 34, "7:00 PM", "Concert black. Call time 6:00 PM.", true],
  ["Jazz Night Fundraiser", 41, "6:30 PM", "Merch table + setup volunteers needed.", false],
  ["Leadership Handoff Meeting", 120, "3:00 PM", "Outgoing + incoming drum majors.", false],
]) {
  await q(`INSERT INTO "Event" (id,title,description,date,time,notify,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,now(),now())`, [cuid(), title, desc, daysFromNow(d, 12), time, notify]);
}
for (const [title, status, who] of [
  ["Print Skyline parts for new members", "COMPLETED", "lib"],
  ["Confirm bus count with transportation", "IN_PROGRESS", "admin"],
  ["Collect uniform sizes from freshmen", "IN_PROGRESS", "dm1"],
  ["Book PA system for jazz night", "TODO", "dm2"],
  ["Update stands-tunes order on the drill chart", "TODO", "dm1"],
  ["Scan missing Shenandoah parts", "TODO", "lib"],
  ["Draft spring trip interest form", "TODO", "admin"],
  ["Send thank-you to volunteer parents", "COMPLETED", "dm2"],
]) {
  await q(`INSERT INTO "Task" (id,title,status,"assigneeId","createdAt","updatedAt") VALUES ($1,$2,$3::"TaskStatus",$4,now(),now())`, [cuid(), title, status, users[who].id]);
}
const notes = [];
for (const [text, color, cat, x, y, who, anon] of [
  ["Add a metronome click to the stands-tunes practice tracks", "#fff3a0", "Rehearsal", 40, 60, "dm1", false],
  ["Rotate who calls the warm-up so everyone learns to lead", "#c8f7c5", "Leadership", 320, 90, "dm2", false],
  ["Water station at the 50 during August camp — it was too far last year", "#ffd6e7", "Logistics", 600, 40, "admin", true],
  ["Section shout-outs in the weekly email", "#cde7ff", "Culture", 120, 300, "lib", false],
  ["Post the drill chart as a PDF, not a photo", "#fff3a0", "Communication", 420, 330, "dm1", true],
  ["Freshman buddy system for the first two weeks", "#c8f7c5", "Culture", 700, 280, "dm2", false],
  ["Ask the boosters for a second tuba stand", "#ffd6e7", "Equipment", 250, 520, "admin", false],
]) {
  const id = cuid();
  notes.push(id);
  await q(`INSERT INTO "Note" (id,text,color,category,x,y,anonymous,"authorId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())`, [id, text, color, cat, x, y, anon, users[who].id]);
}
for (const [ni, who] of [[0, "admin"], [0, "dm2"], [1, "admin"], [1, "lib"], [1, "dm1"], [2, "dm1"], [5, "admin"], [5, "lib"]]) {
  await q(`INSERT INTO "NoteVote" ("noteId","userId") VALUES ($1,$2)`, [notes[ni], users[who].id]);
}
await q(`INSERT INTO "NoteComment" (id,"noteId","authorId",text,"createdAt") VALUES ($1,$2,$3,$4,now())`, [cuid(), notes[1], users.admin.id, "Love this — let's start next week."]);
await q(`INSERT INTO "NoteComment" (id,"noteId","authorId",text,"createdAt") VALUES ($1,$2,$3,$4,now())`, [cuid(), notes[2], users.dm2.id, "Boosters said they can lend a second cooler."]);

for (const [year, cat, title, body, who] of [
  [2025, "WHAT_WORKED", "Sectionals before full rehearsal", "<p>Running 15-minute sectionals first meant full rehearsal started with everyone already warmed up and on the same page.</p>", "admin"],
  [2025, "WHAT_DIDNT", "Group chat for announcements", "<p>Messages got buried. Moving to the portal's email announcements fixed it — everyone gets the same info with the music attached.</p>", "admin"],
  [2025, "TIP", "Post music the same day it's chosen", "<p>Mention the piece in the announcement and the library folder attaches automatically. Don't wait for the whole show.</p>", "dm1"],
  [2026, "WHAT_WORKED", "Freshman buddies", "<p>Pairing each freshman with a junior cut first-week confusion way down.</p>", "dm2"],
  [2026, "WHAT_DIDNT", "Last-minute bus changes", "<p>Confirm bus counts a week out. Transportation needs lead time.</p>", "dm1"],
  [2026, "TIP", "Use the tasks board for fundraisers", "<p>Assign volunteers in tasks instead of collecting names by email.</p>", "lib"],
]) {
  await q(`INSERT INTO "HandoffNote" (id,year,category,title,"bodyHtml","authorId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,now(),now())`, [cuid(), year, cat, title, body, users[who].id]);
}

for (const [type, payload, read] of [
  ["announcement.pending", { subject: "Jazz night fundraiser — volunteers needed", by: "Leo Martinez" }, false],
  ["task.assigned", { title: "Confirm bus count with transportation" }, false],
  ["note.comment", { note: "Rotate who calls the warm-up", by: "Maya Thompson" }, true],
  ["announcement.sent", { subject: "Homecoming call time + uniform check", recipients: contactRows.length }, true],
]) {
  await q(`INSERT INTO "Notification" (id,"userId",type,payload,"readAt","createdAt") VALUES ($1,$2,$3,$4::jsonb,$5,now())`, [cuid(), users.admin.id, type, JSON.stringify(payload), read ? now : null]);
}

for (const [who, action, target, meta, d] of [
  ["admin", "announcement.send", "Skyline field show music is posted", { recipients: 16 }, -9],
  ["lib", "library.upload", "01 Opener — Full Score.pdf", { folder: "Field Show — “Skyline”" }, -10],
  ["dm1", "announcement.send", "Homecoming call time + uniform check", { recipients: 16 }, -3],
  ["admin", "roster.import", "Marching roster", { added: 16 }, -30],
  ["admin", "invite.create", "quinn.foster@example.edu", { role: "DRUM_MAJOR" }, -2],
  ["dm2", "announcement.submit", "Jazz night fundraiser — volunteers needed", { status: "PENDING_APPROVAL" }, -1],
  ["admin", "settings.update", "approvalRequired", { value: false }, -20],
  ["lib", "library.folder.create", "Document Vault", null, -25],
]) {
  await q(`INSERT INTO "AuditLog" (id,"actorId",action,target,metadata,"createdAt") VALUES ($1,$2,$3,$4,$5::jsonb,$6)`, [cuid(), users[who].id, action, target, meta ? JSON.stringify(meta) : null, daysFromNow(d, 14)]);
}

for (const [email, role, d] of [["quinn.foster@example.edu", "DRUM_MAJOR", 5], ["skyler.haddad@example.edu", "LIBRARIAN", 6]]) {
  await q(`INSERT INTO "Invite" (id,email,role,token,"invitedById","expiresAt","createdAt") VALUES ($1,$2,$3::"Role",$4,$5,$6,now())`, [cuid(), email, role, randomBytes(24).toString("base64url"), users.admin.id, daysFromNow(d)]);
}

console.log("drummajor demo seeded: admin alex.morgan@example.edu / DemoPass1! (also priya.shah, leo.martinez, maya.thompson)");
await db.close();
