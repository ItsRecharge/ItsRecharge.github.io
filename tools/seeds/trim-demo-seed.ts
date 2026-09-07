/**
 * Extra demo data for the Tri-M / NHS hours apps (run after the app's own seed).
 * All people are fictional; all emails are @demo.local.
 *
 * Copy into <repo>/prisma/demo-seed.ts and run: npx tsx prisma/demo-seed.ts
 * Prints the raw invite token (for /signup?invite=...) on the last line.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const db = new PrismaClient();
const NHS = process.env.DEMO_VARIANT === "nhs";

function day(offset: number): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + offset));
}

const MEMBERS = [
  ["Avery", "Chen", 2026],
  ["Jordan", "Patel", 2026],
  ["Riley", "Nguyen", 2027],
  ["Sam", "Okafor", 2027],
  ["Taylor", "Kim", 2028],
  ["Morgan", "Rivera", 2028],
  ["Casey", "Brooks", 2029],
  ["Jamie", "Lee", 2029],
] as const;

type Slot = { d: number; s: string; e: string; h: number; q: number; done?: boolean };
type DemoEvent = {
  title: string;
  description: string;
  location: string;
  status: string;
  slots: Slot[];
  category: string;
  requestedByMember?: boolean;
};

const EVENTS: DemoEvent[] = [
  {
    title: "Fall Pep Band Setup",
    description: "Haul stands, set the shell, and tune the sound system before the homecoming game.",
    location: "Northfield HS Stadium",
    status: "completed",
    slots: [{ d: -45, s: "15:30", e: "18:00", h: 2.5, q: 8, done: true }],
    category: "general",
  },
  {
    title: "Elementary Instrument Petting Zoo",
    description: "Help 4th graders try flutes, clarinets, and trumpets at the district music night.",
    location: "Lincoln Elementary Gym",
    status: "completed",
    slots: [
      { d: -30, s: "17:00", e: "19:00", h: 2, q: 6, done: true },
      { d: -30, s: "19:00", e: "20:30", h: 1.5, q: 4, done: true },
    ],
    category: "tutoring",
  },
  {
    title: "Community Soup Kitchen Shift",
    description: "Serve dinner and clean up at the downtown soup kitchen.",
    location: "Main Street Community Kitchen",
    status: "active",
    slots: [
      { d: 6, s: "16:30", e: "19:00", h: 2.5, q: 5 },
      { d: 13, s: "16:30", e: "19:00", h: 2.5, q: 5 },
    ],
    category: "soup_kitchen",
  },
  {
    title: "Winter Concert Ushering",
    description: "Greet families, hand out programs, and manage the lobby before and after the concert.",
    location: "Northfield HS Auditorium",
    status: "active",
    slots: [
      { d: 18, s: "18:00", e: "20:30", h: 2.5, q: 6 },
      { d: 18, s: "20:30", e: "21:30", h: 1, q: 4 },
    ],
    category: "general",
  },
  {
    title: "Community Garden Cleanup",
    description: "Rake beds, spread mulch, and prep the garden for spring planting.",
    location: "Riverside Community Garden",
    status: "active",
    slots: [{ d: 25, s: "09:00", e: "12:00", h: 3, q: 10 }],
    category: "gardening",
  },
  {
    title: "Middle School Sectionals Coaching",
    description: "Run 30-minute sectionals for the 7th grade band before their spring assessment.",
    location: "Northfield Middle School",
    status: "pending_approval",
    slots: [{ d: 32, s: "14:30", e: "16:00", h: 1.5, q: 6 }],
    category: "tutoring",
    requestedByMember: true,
  },
  {
    title: "Retirement Home Holiday Caroling",
    description: "Small ensemble caroling for residents (cancelled: venue closed for renovation).",
    location: "Maple Grove Senior Living",
    status: "cancelled",
    slots: [{ d: 40, s: "13:00", e: "15:00", h: 2, q: 8 }],
    category: "general",
  },
];

async function main() {
  const officer = await db.user.findFirst({ where: { role: "officer" }, orderBy: { id: "asc" } });
  if (!officer) throw new Error("run the app's own seed first (bootstrap officer missing)");
  if (await db.user.findUnique({ where: { email: "avery.chen@demo.local" } })) {
    console.log("demo-seed already applied");
    return;
  }
  const hash = await bcrypt.hash("MemberDemo1!", 12);
  const houses = NHS ? await (db as any).house.findMany({ orderBy: { id: "asc" } }) : [];
  if (NHS) {
    // Neutral house names for the public demo.
    const names = ["North House", "East House", "South House", "West House"];
    for (const [i, h] of houses.entries()) {
      await (db as any).house.update({ where: { id: h.id }, data: { name: names[i] ?? h.name } });
    }
  }

  const members = [];
  for (const [i, [first, last, grad]] of MEMBERS.entries()) {
    const data: any = {
      firstName: first,
      lastName: last,
      email: `${first}.${last}@demo.local`.toLowerCase(),
      passwordHash: hash,
      role: "member",
      graduationYear: grad,
      emailVerifiedAt: new Date(),
    };
    if (NHS && houses.length) data.houseId = houses[i % houses.length].id;
    members.push(await db.user.create({ data }));
  }
  // Give the app's own demo member a proper name/class too.
  await db.user.updateMany({
    where: { email: "member1@demo.local" },
    data: { firstName: "Dana", lastName: "Whitfield", graduationYear: 2026 },
  });
  const allMembers = await db.user.findMany({ where: { role: "member" } });

  for (const ev of EVENTS) {
    const data: any = {
      title: ev.title,
      description: ev.description,
      location: ev.location,
      status: ev.status,
      createdById: ev.requestedByMember ? members[2].id : officer.id,
      approvedById: ev.status === "pending_approval" ? null : officer.id,
      timeslots: {
        create: ev.slots.map((s) => ({
          date: day(s.d),
          startTime: s.s,
          endTime: s.e,
          hoursValue: s.h,
          quota: s.q,
          completedAt: s.done ? new Date() : null,
        })),
      },
    };
    if (NHS) data.category = ev.category;
    const created = await db.event.create({ data, include: { timeslots: true } });
    if (ev.status === "cancelled" || ev.status === "pending_approval") continue;
    for (const [si, slot] of created.timeslots.entries()) {
      const pick = allMembers.filter((_, mi) => (mi + si) % 2 === 0).slice(0, slot.quota + 1);
      for (const [pi, m] of pick.entries()) {
        await db.eventSignup.create({
          data: {
            timeslotId: slot.id,
            userId: m.id,
            status: pi < slot.quota ? "confirmed" : "waitlisted",
            attended: !!slot.completedAt && pi < slot.quota && pi % 4 !== 3,
            markedById: slot.completedAt ? officer.id : null,
          },
        });
      }
    }
  }

  const reports: any[] = [
    { m: 0, desc: "Accompanied the middle school choir on piano for their spring concert", d: -12, h: 2, status: "approved" },
    { m: 1, desc: "Taught a beginner ukulele workshop at the public library", d: -20, h: 1.5, status: "approved" },
    { m: 3, desc: "Played trumpet at the Veterans Day ceremony", d: -8, h: 1, status: "pending" },
    { m: 4, desc: "Ran the merch table at the jazz night fundraiser", d: -5, h: 3, status: "pending" },
    { m: 5, desc: "Organized sheet music in the band library", d: -15, h: 2, status: "denied", notes: "Band library work is already credited through the librarian program." },
    { m: 6, desc: "Sang with the community chorus at the tree lighting", d: -3, h: 1.5, status: "pending" },
  ];
  for (const r of reports) {
    const data: any = {
      userId: members[r.m].id,
      description: r.desc,
      notes: r.notes ?? null,
      date: day(r.d),
      hoursRequested: r.h,
      status: r.status,
      reviewedById: r.status === "pending" ? null : officer.id,
      reviewedAt: r.status === "pending" ? null : new Date(),
    };
    if (NHS) {
      data.category = ["general", "tutoring", "soup_kitchen", "gardening"][r.m % 4];
      data.origin = r.m % 2 ? "outside" : "inside";
    }
    await db.hourReport.create({ data });
  }

  const raw = crypto.randomBytes(32).toString("base64url");
  await db.inviteToken.create({
    data: {
      tokenHash: crypto.createHash("sha256").update(raw).digest("hex"),
      createdById: officer.id,
      role: "member",
      expiresAt: day(60),
      maxUses: 25,
      useCount: 3,
    },
  });

  const audit = [
    ["event.create", "Created event “Community Soup Kitchen Shift”", "event"],
    ["event.approve", "Approved member request “Elementary Instrument Petting Zoo”", "event"],
    ["attendance.mark", "Marked attendance for “Fall Pep Band Setup” (7 of 8 attended)", "timeslot"],
    ["report.approve", "Approved 2h hour report from Avery Chen", "hour_report"],
    ["report.deny", "Denied hour report from Morgan Rivera", "hour_report"],
    ["invite.create", "Created member invite link (25 uses, 60 days)", "invite"],
    ["roster.update", "Updated graduation year for Jamie Lee", "user"],
    ["settings.update", "Set yearly hours goal to 10", "settings"],
  ];
  for (const [action, summary, targetType] of audit) {
    await db.auditLog.create({
      data: {
        actorId: officer.id,
        actorName: `${officer.firstName} ${officer.lastName}`.trim(),
        action,
        summary,
        targetType,
      },
    });
  }

  if (NHS) {
    // Organizer account + share links so the organizer/share pages render.
    const organizer = await db.user.create({
      data: {
        firstName: "Robin",
        lastName: "Alvarez",
        email: "organizer@demo.local",
        passwordHash: await bcrypt.hash("OrganizerDemo1!", 12),
        role: "organizer",
        emailVerifiedAt: new Date(),
      },
    });
    const active = await db.event.findMany({ where: { status: "active" }, include: { timeslots: true } });
    for (const ev of active.slice(0, 2)) {
      await (db as any).organizerEvent.create({ data: { organizerId: organizer.id, eventId: ev.id } });
    }
    const rosterRaw = crypto.randomBytes(32).toString("base64url");
    const attRaw = crypto.randomBytes(32).toString("base64url");
    await (db as any).shareLink.create({
      data: {
        tokenHash: crypto.createHash("sha256").update(rosterRaw).digest("hex"),
        kind: "roster",
        organizerName: "Robin Alvarez",
        organizerEmail: "organizer@demo.local",
        createdById: officer.id,
        expiresAt: day(30),
      },
    });
    await (db as any).shareLink.create({
      data: {
        tokenHash: crypto.createHash("sha256").update(attRaw).digest("hex"),
        kind: "attendance",
        eventId: active[0].id,
        organizerName: "Robin Alvarez",
        organizerEmail: "organizer@demo.local",
        createdById: officer.id,
        expiresAt: day(30),
      },
    });
    console.log(`SHARE_ROSTER=${rosterRaw}`);
    console.log(`SHARE_ATTENDANCE=${attRaw}`);
  }
  console.log(`INVITE=${raw}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
