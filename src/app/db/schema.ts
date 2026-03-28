import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userRolesEnum = pgEnum("user_roles", ["admin", "doctor", "user"]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: userRolesEnum("role").notNull().default("user"),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  updatedAt: timestamp("updated_at").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const usersClinicsTable = pgTable("users_clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  specialty: text("specialty").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
});

export const patientSexEnum = pgEnum("patient_sex", [
  "male",
  "female",
  "other",
]);

export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  sex: patientSexEnum("sex").notNull(),
});

export const appointmentStatusesEnum = pgEnum("appointment_statuses", [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "canceled",
  "no_show",
]);

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  doctorId: uuid("doctor_id")
    .references(() => doctorsTable.id, { onDelete: "cascade" })
    .notNull(),
  patientId: uuid("patient_id")
    .references(() => patientsTable.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  status: appointmentStatusesEnum("status").notNull(),
});

export const clinicalEntryTypeEnum = pgEnum("clinical_entry_type", [
  "anamnesis",
  "prescription",
  "exam",
  "note",
]);

export const clinicalEntriesTable = pgTable("clinical_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),
  patientId: uuid("patient_id")
    .references(() => patientsTable.id, { onDelete: "cascade" })
    .notNull(),
  doctorId: uuid("doctor_id")
    .references(() => doctorsTable.id, { onDelete: "cascade" })
    .notNull(),
  type: clinicalEntryTypeEnum("type").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const clinicRelations = relations(clinicsTable, ({ many }) => ({
  usersClinics: many(usersClinicsTable),
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  clinicalEntries: many(clinicalEntriesTable),
}));

export const userRelations = relations(usersTable, ({ many }) => ({
  usersClinics: many(usersClinicsTable),
}));

export const usersClinicsRelations = relations(
  usersClinicsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [usersClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
    user: one(usersTable, {
      fields: [usersClinicsTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const doctorRelations = relations(doctorsTable, ({ one, many }) => ({
  clinic: one(clinicsTable, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTable.id],
  }),
  appointments: many(appointmentsTable),
  clinicalEntries: many(clinicalEntriesTable),
}));

export const patientRelations = relations(patientsTable, ({ one, many }) => ({
  clinic: one(clinicsTable, {
    fields: [patientsTable.clinicId],
    references: [clinicsTable.id],
  }),
  appointments: many(appointmentsTable),
  clinicalEntries: many(clinicalEntriesTable),
}));

export const appointmentRelations = relations(appointmentsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    fields: [appointmentsTable.clinicId],
    references: [clinicsTable.id],
  }),
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.id],
  }),
  patient: one(patientsTable, {
    fields: [appointmentsTable.patientId],
    references: [patientsTable.id],
  }),
}));

export const clinicalEntryRelations = relations(
  clinicalEntriesTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [clinicalEntriesTable.clinicId],
      references: [clinicsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [clinicalEntriesTable.doctorId],
      references: [doctorsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [clinicalEntriesTable.patientId],
      references: [patientsTable.id],
    }),
  }),
);
