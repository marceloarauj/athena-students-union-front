# Checklist de Implementação — Motor de Ano Letivo

Endpoints do backend em `D:\Projetos\AthenaStudentsUnionProject\Institution`.

---

## Fase 1 — Dados Mock (Seeds)

- [x] `src/seeds/academic_programs_data.json`
- [x] `src/seeds/subjects_data.json`
- [x] `src/seeds/teachers_data.json`
- [x] `src/seeds/rooms_data.json`
- [x] `src/seeds/shifts_data.json`
- [x] `src/seeds/holidays_data.json`
- [x] `src/seeds/program_edition_data.json`

---

## Fase 2 — Feature: Programas Acadêmicos (`/academic-program`)

Endpoint base: `api/academicprogram`

- [x] `src/features/academicProgram/models/academicProgramModel.ts`
- [x] `src/features/academicProgram/services/academicProgramInterface.ts`
- [x] `src/features/academicProgram/services/academicProgramMockService.ts`
- [x] `src/features/academicProgram/services/academicProgramService.ts`
- [x] `src/features/academicProgram/hooks/useAcademicProgram.ts`
- [x] `src/features/academicProgram/components/AcademicProgramModal.tsx`
- [x] `src/app/[institution]/academic-program/page.tsx`

---

## Fase 3 — Feature: Professores (`/teachers`)

Endpoint base: `api/teacher`

- [x] `src/features/teacher/models/teacherModel.ts`
- [x] `src/features/teacher/services/teacherInterface.ts`
- [x] `src/features/teacher/services/teacherMockService.ts`
- [x] `src/features/teacher/services/teacherService.ts`
- [x] `src/features/teacher/hooks/useTeacher.ts`
- [x] `src/features/teacher/components/TeacherModal.tsx`
- [x] `src/features/teacher/components/TeacherAvailabilityModal.tsx`
- [x] `src/app/[institution]/teachers/page.tsx`

---

## Fase 4 — Feature: Salas (`/rooms`)

Endpoint base: `api/room`

- [x] `src/features/room/models/roomModel.ts`
- [x] `src/features/room/services/roomInterface.ts`
- [x] `src/features/room/services/roomMockService.ts`
- [x] `src/features/room/services/roomService.ts`
- [x] `src/features/room/hooks/useRoom.ts`
- [x] `src/features/room/components/RoomModal.tsx`
- [x] `src/app/[institution]/rooms/page.tsx`

---

## Fase 5 — Feature: Turnos (`/shifts`)

Endpoint base: `api/shift`

- [x] `src/features/shift/models/shiftModel.ts`
- [x] `src/features/shift/services/shiftInterface.ts`
- [x] `src/features/shift/services/shiftMockService.ts`
- [x] `src/features/shift/services/shiftService.ts`
- [x] `src/features/shift/hooks/useShift.ts`
- [x] `src/features/shift/components/ShiftModal.tsx`
- [x] `src/features/shift/components/SlotModal.tsx`
- [x] `src/app/[institution]/shifts/page.tsx`

---

## Fase 6 — Feature: Feriados (`/holidays`)

Endpoint base: `api/holiday`

- [x] `src/features/holiday/models/holidayModel.ts`
- [x] `src/features/holiday/services/holidayInterface.ts`
- [x] `src/features/holiday/services/holidayMockService.ts`
- [x] `src/features/holiday/services/holidayService.ts`
- [x] `src/features/holiday/hooks/useHoliday.ts`
- [x] `src/features/holiday/components/HolidayModal.tsx`
- [x] `src/features/holiday/components/RecessModal.tsx`
- [x] `src/app/[institution]/holidays/page.tsx`

---

## Fase 7 — Feature: Matérias por Programa (`subfeature de academicProgram`)

Endpoint base: `api/subject`

- [x] `src/features/subject/models/subjectModel.ts`
- [x] `src/features/subject/services/subjectInterface.ts`
- [x] `src/features/subject/services/subjectMockService.ts`
- [x] `src/features/subject/services/subjectService.ts`
- [x] `src/features/subject/hooks/useSubject.ts`
- [x] `src/features/subject/components/SubjectModal.tsx`

---

## Fase 8 — Feature: Edição de Programa / Motor de Ano Letivo (`/program-edition`)

Endpoint base: `api/programedition`

### Modelos e Serviços
- [x] `src/features/programEdition/models/programEditionModel.ts`
- [x] `src/features/programEdition/services/programEditionInterface.ts`
- [x] `src/features/programEdition/services/programEditionMockService.ts`
- [x] `src/features/programEdition/services/programEditionService.ts`
- [x] `src/features/programEdition/hooks/useProgramEdition.ts`

### Componentes da Listagem
- [x] `src/features/programEdition/components/CreateEditionModal.tsx`
- [x] `src/features/programEdition/components/EditionStatusBadge.tsx`

### Componentes de Detalhe (Tabs do Motor)
- [x] `src/features/programEdition/components/tabs/OverviewTab.tsx`
- [x] `src/features/programEdition/components/tabs/CurriculumTab.tsx`
- [x] `src/features/programEdition/components/tabs/EnrollmentTab.tsx`
- [x] `src/features/programEdition/components/tabs/PeriodsTab.tsx`
- [x] `src/features/programEdition/components/tabs/CalendarTab.tsx`
- [x] `src/features/programEdition/components/tabs/ClassGroupsTab.tsx`
- [x] `src/features/programEdition/components/tabs/ScheduleTab.tsx`
- [x] `src/features/programEdition/components/tabs/ConflictTab.tsx`
- [x] `src/features/programEdition/components/tabs/ProgressTab.tsx`
- [x] `src/features/programEdition/components/tabs/PublishTab.tsx`

### Páginas
- [x] `src/app/[institution]/program-edition/page.tsx` (listagem de edições por programa)
- [x] `src/app/[institution]/program-edition/[editionId]/page.tsx` (motor de ano letivo)

---

## Fase 9 — Navegação

- [x] Adicionar "Ano Letivo" no drawer → `/program-edition`
- [x] Adicionar "Programas Acadêmicos" no drawer → `/academic-program`
- [x] Adicionar "Professores" no drawer → `/teachers`
- [x] Adicionar "Salas" no drawer → `/rooms`
- [x] Adicionar "Turnos" no drawer → `/shifts`
- [x] Adicionar "Feriados" no drawer → `/holidays`

---

## Resumo dos Endpoints Cobertos

| Controller | Endpoints | Status |
|---|---|---|
| AcademicProgram | POST /, GET /, GET /{id} | ✅ |
| Subject | POST /, GET /{programId} | ✅ |
| Teacher | POST /, GET /, PUT /{id}/subjects, PUT /{id}/availability, GET /{id}/availability | ✅ |
| Room | POST /, GET / | ✅ |
| Shift | POST /, GET /, POST /{id}/slots, GET /{id}/slots | ✅ |
| Holiday | POST /, GET /, DELETE /{id}, POST /recess, GET /recess/{editionId} | ✅ |
| ProgramEdition — CRUD | POST /, GET /{programId}, GET /edition/{id} | ✅ |
| ProgramEdition — Curriculum | PUT /edition/{id}/curriculum, PUT /edition/{id}/curriculum/entry, GET /edition/{id}/curriculum | ✅ |
| ProgramEdition — Enrollment | POST /edition/{id}/enroll, POST /edition/{id}/enroll/bulk, GET /edition/{id}/enrollments, PATCH /edition/{id}/enrollments/{eId} | ✅ |
| ProgramEdition — Periods | POST /edition/{id}/generate-periods, POST /edition/{id}/periods, GET /edition/{id}/periods | ✅ |
| ProgramEdition — Calendar | POST /edition/{id}/generate-calendar, GET /edition/{id}/calendar, GET /edition/{id}/calendar/summary | ✅ |
| ProgramEdition — Class Groups | POST /edition/{id}/class-groups, POST /edition/{id}/class-groups/generate, POST /edition/{id}/class-groups/assign-students, GET /edition/{id}/class-groups, GET /edition/{id}/class-groups/{groupId} | ✅ |
| ProgramEdition — Schedule | POST /edition/{id}/generate-schedule, GET /edition/{id}/class-groups/{groupId}/schedule, GET /edition/{id}/teachers/{teacherId}/schedule | ✅ |
| ProgramEdition — Conflict | POST /edition/{id}/conflict-detection, GET /edition/{id}/conflict-report, PUT /edition/{id}/schedule/{scheduleId} | ✅ |
| ProgramEdition — Progress | POST /edition/{id}/progress, POST /edition/{id}/progress/record, GET /edition/{id}/progress, GET /edition/{id}/promotion/preview, POST /edition/{id}/promotion/run | ✅ |
| ProgramEdition — Publish | POST /edition/{id}/publish-checklist, POST /edition/{id}/publish, POST /edition/{id}/close | ✅ |
