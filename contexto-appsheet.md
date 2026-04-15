---

# COMMAND CENTER 3.0 — COMPLETE APP DOCUMENTATION
*(Continuation & Completion — all 6 remaining tasks)*

---

## PART 1 · TABLES → JOB REPORTS SLICES (Remaining 2)

### Super Report
- **Source Table:** Job Reports
- **Filter Formula:** `[Super].[Email] = "mcravo22@gmail.com"`
- **Columns:** _RowNumber, Report Id (Key), Notes, Job, Super, DateTime, Related Report Pictures, SUGGESTED TITLE (all columns from source)

### Todays Job Reports
- **Source Table:** Job Reports
- **Filter Formula:** `Date([DateTime]) = Today()`
- **Columns:** All columns from source

---

## PART 2 · TABLES → JOBS (7 Slices)

| Slice | Filter Formula |
|---|---|
| **Current Job** | `in(useremail(),[Related Users])` |
| **In Progress no daily report** | `AND([Status] = "In Progress",[Send Daily Report]=Pause)` |
| **My Current Job** | `IN(USEREMAIL(),[Related Users])` |
| **Need IMG URL** | `and(or([Status] = "Pre Construction",[Status] = "In Progress"),isblank([Image Folder Url]))` |
| **Status is Completed** | `[Status] = "Completed"` |
| **Status is In Progress** | `[Status] = "In Progress"` |
| **Status is Pre Construction** | `[Status] = "Pre Construction"` |

---

## PART 3 · VIEWS

### PRIMARY NAVIGATION (6 views)

**1. Report**
- **Type:** Form
- **Source:** Job Reports (table)
- **Position:** middle
- **Sort:** none
- **Columns (Manual):** Job, Latest App Mail, SUGGESTED TITLE, suggested, Notes, Related Report Pictures, DateTime, GET THE WEATHER
- **Show If:** `isnotblank(working[Row ID])`
- **Row Key:** `5` (max nested rows)

**2. Clock IN**
- **Type:** Form
- **Source:** Clock (table)
- **Columns (Manual):** tag, Job
- **Show If:** `isblank(working[Row ID])`
- **Max nested rows:** 5

**3. My Current Job**
- **Type:** Detail
- **Source:** My Current Job (slice of Jobs)
- **Sort:** none
- **Columns (Manual):** Job Name, Address, Project Manager, Project Lead, Send Daily Report, Image Folder, Related Job Contacts, Related Job Reports, Related Report Pictures, Related Roladexs, Related Job Files, Related Receipts
- **Display Name formula:** `concatenate(lookup((LOOKUP(useremail(), "Users", "Email", "Current Job")),"Jobs","Unique Id","Job Name")," (",count(Current Job Report[DateTime])," Reports Logged)")`
- **Show If:** `isnotblank(working[Row ID])`

**4. My Reports Today**
- **Type:** Table
- **Source:** My Reports Today (slice of Job Reports)
- **Sort:** Time → Descending
- **Group By:** Job → Ascending
- **Group Aggregate:** NONE
- **Columns (Manual):** Time, Notes
- **Column Width:** Default
- **Show If:** `and(isnotblank(working[Row ID]),isnotblank(My Reports Today[Report Id]))`

**5. Roladex**
- **Type:** Deck
- **Source:** CURRENT JOB CONTACTS (slice)
- **Sort:** Contact → Ascending
- **Group By:** Company → Ascending
- **Show If:** `isnotblank(working[Row ID])`

**6. Clock OUT**
- **Type:** Detail
- **Source:** working (table)
- **Columns (Manual):** User, Week Ending, Job, Timestamp In
- **Show If:** `isnotblank(working[Row ID])`
- **Max nested rows:** 5

---

### MENU NAVIGATION (4 views)

**7. Active Jobs - Admin Only**
- **Type:** Table
- **Source:** Status is In Progress (slice of Jobs)
- **Sort:** Project Name → Ascending
- **Group By:** none
- **Columns (Manual):** Job Name, Address, Project Name, Project Manager, Project Lead, Status, Send Daily Report, Company, Related Job Contacts, Related Job Reports, Related Roladexs, Related Job Files, Related Receipts, Related Pre Jobs, Job Rate, Related Report Pictures, Related permissions, …
- **Show If:** `USERROLE() = "Admin"`

**8. Need IMG URL Jobs - Admin Only**
- **Type:** Table
- **Source:** Need IMG URL (slice of Jobs)
- **Sort:** Project Name → Ascending
- **Columns (Manual):** Unique Id, Job Name, Address, Project Name, Project Manager, Project Lead, Status, Send Daily Report, Company, Related Job Contacts, Related Job Reports, Related Roladexs, …
- **Show If:** `and(isnotblank(need img url[Unique Id]), USERROLE() = "Admin")`

**9. Give Command Center 3.0 Feedback**
- **Type:** Form
- **Source:** feedback (table)
- **Columns (Manual):** explain, feelings, feedback, image
- **Max nested rows:** 5
- **No Show If condition**

**10. Supers - Admin Only**
- **Type:** Table
- **Source:** Users (table)
- **Sort:** Username → Ascending
- **Group By:** Active Job → Ascending
- **Columns (Manual):** Username, Role, Profile Picture, Current Job
- **Show If:** `in(useremail(),select(permissions[Super],and([App Level]=Neo,[super]=useremail()),true))`

---

### REFERENCE VIEWS (24 views)

**11. Add Receipts**
- **Type:** Form | **Source:** Current Job Receipts (slice)
- **Columns (Manual):** Image, Price, Job
- **Show If:** `ISNOTBLANK(Lookup(Useremail(), "Users", "Email", "Current Job"))`

**12. All Supers & Staff**
- **Type:** Deck | **Source:** Users (table)
- **Sort:** _RowNumber → Ascending
- **Show If:** `USERROLE() = "Admin"`

**13. Change Current Job**
- **Type:** Form | **Source:** permissions (table)
- **Columns (Manual):** Job list, App Level
- **No Show If**

**14. Command Center Tutorial**
- **Type:** Card | **Source:** Command Center Tutorial (table)
- **Display Name:** "Tutorials"

**15. Companies**
- **Type:** Table | **Source:** Companies (table)
- **Columns (Manual):** Name, Address, Website, Phone Number, Timezone, Old VON X Key, Description, Column 5, Related Contacts, Related Jobs
- **No Sort, No Group**

**16. Completed Job**
- **Type:** Table | **Source:** Status is Completed (slice of Jobs)
- **Columns (Manual):** Project Name, Send Daily Report
- **No Sort, No Group**

**17. Contacts**
- **Type:** Deck | **Source:** Contacts (table)
- **No Sort, No Group**

**18. Job**
- **Type:** Detail | **Source:** My Current Job (slice of Jobs)
- **Columns (Manual):** Address, Project Manager, Project Lead, Status, Send Daily Report, General Contractor, Related Job Files, Related Users, Related Job Contacts
- **Max nested rows:** 5

**19. Job and Super**
- **Type:** Table | **Source:** Status is In Progress (slice of Jobs)
- **Sort:** Project Lead → Ascending
- **Group By:** Status → Ascending
- **Columns (Manual):** Project Name, Project Lead, Project Manager, Status
- **Show If:** `Userrole() = "Admin"`

**20. Job Dashboard**
- **Type:** Dashboard | **Source:** (no table — composite)
- **Dashboard Panels:** Job (Large), Reports (Large), Roladex (Large), Receipts (Large)
- **Display Name formula:** `concatenate(lookup((LOOKUP(useremail(), "Users", "Email", "Current Job")),"Jobs","Unique Id","Project Name")," - Dashboard")`
- **Show If:** `ISNOTBLANK(Lookup(Useremail(), "Users", "Email", "Current Job"))`

**21. Jobs**
- **Type:** Deck | **Source:** Jobs (table)
- **Sort:** _RowNumber → Ascending

**22. Make a Suggestion**
- **Type:** Form | **Source:** suggest (table)
- **Columns (Manual):** header, Topic, Suggestion, Photo
- **Display Name:** "Make a Suggestion!"

**23. My Current Job 2**
- **Type:** Detail | **Source:** Current Job (slice of Jobs)
- **Columns (Manual):** Job Name, Address, Project Manager, Project Lead, Send Daily Report, Related Job Contacts, Related Job Reports, Related Report Pictures, Related Roladexs, Related Job Files, Related Receipts
- **Display Name formula:** `concatenate(lookup((LOOKUP(useremail(), "Users", "Email", "Current Job")),"Jobs","Unique Id","Job Name")," - Dashboard")`
- **Show If:** `or(USEREMAIL()=j@supervisioncompany.com,USEREMAIL()=ap@supervisioncompany.com)`

**24. My Hours**
- **Type:** Table | **Source:** clocked (table/slice)
- **Sort:** week ending → Descending
- **Group By:** _RowNumber → Ascending
- **Columns (Manual):** week ending, Total Hours, week start sat, week stop fri, Related Clocks

**25. New View**
- **Type:** Map | **Source:** Todays Job Reports (slice)
- **Max nested rows:** 0

**26. New View 2**
- **Type:** Card | **Source:** Users (table)

**27. No Daily Report Details**
- **Type:** Detail | **Source:** In Progress no daily report (slice of Jobs)
- **Columns (Manual):** Project Name, Address, Project Manager, Project Lead, Status, Send Daily Report, Related Job Contacts, Related Job Reports, Related Job Files, Related Receipts
- **Show If:** `Userrole() = "Admin"`

**28. Receipts**
- **Type:** Table | **Source:** Current Job Receipts (slice)
- **Columns (Manual):** Price, Image, Job

**29. Reports**
- **Type:** Table | **Source:** Current Job Report (slice of Job Reports)
- **Sort:** DateTime → Ascending
- **Group By:** Job → Ascending
- **Columns (Manual):** DateTime, Notes, Related Report Pictures
- **Display Name formula:** `concatenate(lookup((LOOKUP(useremail(), "Users", "Email", "Current Job")),"Jobs","Unique Id","Project Name")," - All Reports")`
- **Show If:** `ISNOTBLANK(Lookup(Useremail(), "Users", "Email", "Current Job"))`

**30. Set Current Job Here - Admin Only**
- **Type:** Detail | **Source:** my limit (slice)
- **Columns (Manual):** Super, Job list, App Level
- **Show If:** `in(useremail(),select(permissions[Super],and(not([App Level]=Standard),[super]=useremail()),true))`

**31. Set Your Current Job Here**
- **Type:** Detail | **Source:** User (slice/table)
- **Columns (Manual):** Current Job
- **Show If:** `in(useremail(),select(permissions[Super],and(or([App Level]=Master,[App Level]=Neo),[super]=useremail()),true))`

**32. Super Report**
- **Type:** Table | **Source:** Super Report (slice of Job Reports)
- **Sort:** _RowNumber → Ascending
- **Columns (Manual):** Notes, SUGGESTED TITLE, Location, Job, Super, DateTime, Related Report Pictures, Time, Related Jobs, Job Address, Date, Day, Related Users
- **Show If:** `Userrole() = "Admin"`

**33. SVC LAB Reports**
- **Type:** Table | **Source:** LAB Job Reports (slice of Job Reports)
- **Sort:** DateTime → Ascending
- **Columns (Manual):** Notes, DateTime, Related Report Pictures
- **Show If:** `(Lookup(Useremail(), "Users", "Email", "Role")) = "e1332879"`

---

### SYSTEM GENERATED VIEWS
All system-generated views follow the naming pattern `{TableOrSlice}_Detail`, `{TableOrSlice}_Form`, and (for tables with inline editing) `{TableOrSlice}_Inline`. They are automatically created by AppSheet for each table/slice. The complete list of groups with sub-view counts:

| Group | Sub-views | Types |
|---|---|---|
| All Weeks (2) | All Weeks_Detail, All Weeks_Form | Deck/Detail, Form |
| Clock (3) | Clock_Detail, Clock_Form, Clock_Inline | Deck/Detail, Form, Table |
| clocked (2) | clocked_Detail, clocked_Form | Detail, Form |
| Command Center Tutorial (2) | …_Detail, …_Form | — |
| Companies (2) | …_Detail, …_Form | — |
| Contacts (3) | …_Detail, …_Form, …_Inline | — |
| Current Job (2) | …_Detail, …_Form | — |
| CURRENT JOB CONTACTS (2) | …_Detail, …_Form | — |
| Current Job Receipts (2) | …_Detail, …_Form | — |
| Current Job Report (2) | …_Detail, …_Form | — |
| Current Job Report today (2) | …_Detail, …_Form | — |
| feedback (3) | …_Detail, …_Form, …_Inline | — |
| Feedback Image (2) | …_Detail, …_Form | — |
| Gant Jobs Table (2) | …_Detail, …_Form | — |
| Gmail Event Attachments (2) | …_Detail, …_Form | — |
| Gmail Event Email (1) | …_Detail | — |
| Job Contacts (3) | …_Detail, …_Form, …_Inline | — |
| Job Files (3) | …_Detail, …_Form, …_Inline | — |
| Job Reports (3) | …_Detail, …_Form, …_Inline | — |
| Jobs (3) | …_Detail, …_Form, …_Inline | — |
| LAB Job Reports (2) | …_Detail, …_Form | — |
| My Current Job (2) | …_Detail, …_Form | — |
| my limit (2) | …_Detail, …_Form | — |
| My Reports Today (2) | …_Detail, …_Form | — |
| Need IMG URL (2) | …_Detail, …_Form | — |
| our apps (2) | …_Detail, …_Form | — |
| permissions (3) | …_Detail, …_Form, …_Inline | — |
| Pre Jobs (3) | …_Detail, …_Form, …_Inline | — |
| Receipts (3) | …_Detail, …_Form, …_Inline | — |
| Report Picture (3) | …_Detail, …_Form, …_Inline | — |
| Roladex (3) | …_Detail, …_Form, …_Inline | — |
| Roles (2) | …_Detail, …_Form | — |
| Status is In Progress (2) | …_Detail, …_Form | — |
| suggest (3) | …_Detail, …_Form, …_Inline | — |
| Super Report (2) | …_Detail, …_Form | — |
| test emails (2) | …_Detail, …_Form | — |
| Todays Job Reports (2) | …_Detail, …_Form | — |
| Trigger (2) | …_Detail, …_Form | — |
| User (2) | …_Detail, …_Form | — |
| Users (3) | …_Detail, …_Form, …_Inline | — |
| week ending (2) | …_Detail, …_Form | — |
| working (2) | …_Detail, …_Form | — |

**All Weeks_Detail columns:** User, Week Ending, Job, Timestamp In, Timestamp Out, Total Hours
**All Weeks_Form columns:** Row ID, User, Week Ending, Job, Timestamp In, Timestamp Out, label, WE, Total Hours, Date, tag

---

## PART 4 · ACTIONS

### TABLE: Clock (9 actions)

| Action | Type | Target Table | Condition | What It Does |
|---|---|---|---|---|
| **CLOCK OUT** | Data: set column values | Clock | `isblank([Timestamp Out])` | Sets **Timestamp Out** = `NOW()` and **Location Out** = `here()`. Confirmation: "This action clocks you out of the job. Are you clocking out?" |
| **Add** | App: open form to add new row | Clock | — | System-generated add |
| **Delete** | Data: delete this row | Clock | — | System-generated delete |
| **Edit** | App: edit this row | Clock | — | System-generated edit |
| **View Map (Location In)** | External: go to website (map) | Clock | — | Opens map at Location In |
| **View Map (Location Out)** | External: go to website (map) | Clock | — | Opens map at Location Out |
| **View Ref (Job)** | App: go to another view | Clock | — | Navigate to referenced Job record |
| **View Ref (User)** | App: go to another view | Clock | — | Navigate to referenced User record |
| **View Ref (Week Ending)** | App: go to another view | Clock | — | Navigate to referenced Week Ending record |

---

### TABLE: Job Reports (11 actions)

| Action | Type | Target Table | Condition | What It Does |
|---|---|---|---|---|
| **Change Current Job 2** | App: go to another view | Job Reports | `in(useremail(),select(permissions[Super],and(or([App Level]=Master,[App Level]=Neo),[super]=useremail()),true))` | Navigates to `LINKTOVIEW("Set Current Job Here - Admin Only")`. Display name: "Change Current Job" |
| **Email PM** | External: start an email | Job Reports | `true` | Composes email to `[Job].[Project Manager].[Email]`. Subject: `[Job].[Project Name] - DATE([DateTime])`. Body includes site super username, datetime, notes, PM company, sender phone. |
| **Reply** | App: go to another view | Job Reports | `true` | Opens form: `LINKTOFORM("Comments_Form","Job Report",[Report Id])` |
| **Report 2** | App: go to another view | Job Reports | `true` | Opens Report form: `LINKTOFORM("Report","Job",[Job])`. Display name: `[job].[Project Name] - Report` |
| **Add** | App: open form | Job Reports | — | System add |
| **Delete** | Data: delete row | Job Reports | — | System delete |
| **Edit** | App: edit row | Job Reports | — | System edit |
| **View Map (Job Address)** | External: map | Job Reports | — | Opens map at Job Address |
| **View Map (Location)** | External: map | Job Reports | — | Opens map at GPS Location |
| **View Ref (Job)** | App: go to view | Job Reports | — | Navigate to referenced Job |
| **View Ref (Super)** | App: go to view | Job Reports | — | Navigate to referenced Super (User) |

---

### TABLE: Jobs (14 actions)

| Action | Type | Target Table | Condition | What It Does |
|---|---|---|---|---|
| **Change Current Job** | App: go to another view | Jobs | `in(useremail(),select(permissions[Super],and(or([App Level]=Master,[App Level]=Neo),[super]=useremail()),true))` | Navigates to `LINKTOVIEW("Set Current Job Here - Admin Only")` |
| **Report** | App: go to another view | Jobs | `true` | Opens Report form: `LINKTOFORM("Report","Job",[Unique Id])`. Display name: `[Project Name] - Report` |
| **Compose Email (Site Super Email)** | External: start an email | Jobs | `NOT(ISBLANK([Site Super Email]))` | Composes email to `[Site Super Email]` |
| **Open Url (Image Folder Url)** | External: go to website | Jobs | `NOT(ISBLANK([Image Folder Url]))` | Opens URL from `[Image Folder Url]` column |
| **Open Url (Image Folder)** | External: go to website | Jobs | `NOT(ISBLANK([Image Folder]))` | Opens URL from `[Image Folder]` column |
| **Add** | App: open form | Jobs | — | System add |
| **Delete** | Data: delete row | Jobs | — | System delete |
| **Edit** | App: edit row | Jobs | — | System edit |
| **View Map (Address)** | External: map | Jobs | — | Opens map at Address |
| **View Map (LatLong)** | External: map | Jobs | — | Opens map at LatLong |
| **View Ref (General Contractor)** | App: go to view | Jobs | — | Navigate to General Contractor ref |
| **View Ref (Last Report)** | App: go to view | Jobs | — | Navigate to Last Report ref |
| **View Ref (Project Lead)** | App: go to view | Jobs | — | Navigate to Project Lead ref |
| **View Ref (Project Manager)** | App: go to view | Jobs | — | Navigate to Project Manager ref |

---

### TABLE: Roladex (20 actions) — Custom Actions

| Action | Type | Condition | What It Does |
|---|---|---|---|
| **Call** | External: start a phone call | — | Calls contact's cell phone |
| **Call Log** | Data: add new row to another table | `true` | Adds row to **Job Reports** with: Report Id=`UNIQUEID()`, Job=`[Job]`, Notes=`CONCATENATE(LOOKUP(USEREMAIL(),"Users","Email","USERNAME"), " Called ", [Contact].[Name]," from ",[Company].[Name], " (",[Role],")")` |
| **Change Current Job 3** | App: go to view | — | Navigate to Set Current Job Here view |
| **Email** | External: start an email | — | Composes email to contact |
| **Email Log** | Data: add new row to another table | `true` | Adds row to **Job Reports** with Notes=`CONCATENATE(... " Emailed ", [Contact].[Name],...)` |
| **log it** | App: go to another view | `true` | Opens Report form: `linktoform("Report","job",[Job])` |
| **Save Roladex to Report** | Data: add new row to another table | `true` | Adds row to **Job Reports** with: Notes=`CONCATENATE([Name], " was added to this job's contact list by ",[Super].[Username])`, Job=`[Job]`, Super=`[Super]` |
| **TEXT** | External: start a text message | — | Sends text to contact's cell phone |
| **Text Log** | Data: add new row to another table | `true` | Adds row to **Job Reports** with Notes=`CONCATENATE(... " texted ", [Contact].[Name],...)` |
| **Text Phone** | External: start a text | — | Texts contact phone |
| **View Ref (Super)** | App: go to view | — | Navigate to Super (User) ref |
| **Add, Call Phone (Cell Phone), Compose Email (Email), Delete, Edit, Send SMS (Cell Phone), View Ref (Company), View Ref (Contact), View Ref (Job)** | Standard system/generated | — | Standard generated actions |

---

### TABLE: Users (14 actions)

| Action | Type | Condition | What It Does |
|---|---|---|---|
| **Update Job** | Data: set column values | `true` | Sets **Current Job** = `text(select(permissions[Job list],[Super]=[_THISROW].[Email],true))` — updates user's job list from permissions |
| **Add** | App: open form | — | System add |
| **Call Phone (Phone Number)** | External: phone call | — | Calls user's phone |
| **Compose Email (Email)** | External: email | — | Composes email to user |
| **Delete** | Data: delete row | — | System delete |
| **Edit** | App: edit row | — | System edit |
| **Send SMS (Phone Number)** | External: SMS | — | Sends text to user's phone |
| **View Map (Address)** | External: map | — | Map of Address |
| **View Map (Geolocation)** | External: map | — | Map of Geolocation |
| **View Ref (Current Job)** | App: go to view | — | Navigate to Current Job |
| **View Ref (LAST REPORT JOB)** | App: go to view | — | Navigate to last report's job |
| **View Ref (LAST REPORT)** | App: go to view | — | Navigate to last report |
| **View Ref (Limits)** | App: go to view | — | Navigate to limits/permissions |
| **View Ref (Role)** | App: go to view | — | Navigate to Role record |

---

### OTHER TABLES (Standard system-generated only)

| Table | Action Count | Custom Actions |
|---|---|---|
| Command Center Tutorial | 4 | none beyond Add/Delete/Edit/View Ref |
| Companies | 7 | Add, Delete, Edit + View Refs + View Map |
| Contacts | 9 | Add, Delete, Edit + View Refs + map + phone/email |
| feedback | 4 | Add, Delete, Edit, View Ref |
| Feedback Image | 4 | standard |
| Gant Jobs Table | 4 | standard |
| Gmail Event Attachments | 2 | standard |
| Job Contacts | 6 | Add, Delete, Edit + View Refs |
| Job Files | 6 | Add, Delete, Edit + View Refs |
| our apps | 5 | standard |
| permissions | 7 | Add, Delete, Edit + View Refs (Job list, Profile Job, Super, User) |
| Pre Jobs | 4 | standard |
| Receipts | 5 | standard |
| Report Picture | 5 | standard |
| Roles | 3 | standard |
| suggest | 4 | standard |
| test emails | 5 | standard |
| Trigger | 3 | standard |
| week ending | 3 | standard |

---

## PART 5 · AUTOMATION BOTS

### TABLE: Clock (2 bots)

**Bot: Clock In Report**
- **Trigger:** Data change on **Clock** table — event type: **Adds**
- **Condition:** `and(not([user]=j@supervisioncompany.com),not([user]=ap@supervisioncompany.com))`
- **Process:** Run data action → **Add new row** to **Job Reports** table with:
  - Job = `[Job]`
  - Super = `[User]`
  - Notes = `concatenate([User].[Username]," clocked in.")`

**Bot: Clock Out Report**
- **Trigger:** Data change on **Clock** table — event type: **Updates**
- **Condition:** `and(not([user]=j@supervisioncompany.com),not([user]=ap@supervisioncompany.com),isnotblank([Timestamp Out]))`
- **Process:** Run data action → **Add new row** to **Job Reports** with:
  - Job = `[Job]`
  - Super = `[User]`
  - Notes = `concatenate([User].[Username]," clocked out.")`

---

### TABLE: feedback (1 bot)

**Bot: New feedback notification**
- **Trigger:** Data change on **feedback** table — event type: **Adds**
- **Condition:** none
- **Process:** Send an email (Custom template):
  - To: `ok@supervisioncompany.com`
  - CC/BCC: `{[useremail].[Email], ap@supervisioncompany.com, j@supervisioncompany.com}`
  - Reply-To: `[useremail].[Email]`
  - Subject: `App Feedback for Command Center 2.0 on <<now()>>`
  - Template: DocId=1ettSM8iRGbBiSQ-tp9E97FUQSOrtixrcGa3UBbPtOyc
  - Sender: "command center 2.0 feedback bot"
  - Attachment: ChangeReport

---

### TABLE: Job Files (1 bot)

**Bot: Job Report log**
- **Trigger:** Named event "A Job File is Added" on **Job Files** table — **Adds**
- **Process:** Run data action → **Add new row** to **Job Reports** with:
  - Job = `[Job]`
  - Super = `[User]`
  - Notes = `concatenate([Name]," added to document folder")`

---

### TABLE: Jobs (12 bots)

**Bot: Daily Report** ✅ Active
- **Trigger:** Scheduled — **Every day** (Daily)
- **Process:** Send an email:
  - To: `[Project Manager].[Email]`
  - CC: `SELECT(Job Contacts[Email], ([Job] = [Unique Id]), True)`
  - BCC: `List("J@SUPERVISIONCOMPANY.COM","ap@supervisioncompany.com",CONCATENATE([Site Super Email]))`
  - Reply-To: `generalsuper@SUPERVISIONCOMPANY.COM`
  - Sender: "Supervision Company Email Bot"
  - Subject: `<<[JOB NAME]>> - DAILY REPORT - <<TEXT(TODAY()-1, "DDDD") >> <<TODAY()-1>>`
  - Body template: DocId=1yWSGJ-I1YAu6dRRVqk13ieTgo6ofYIjBVJyCeXKVMFI
  - Attachment template: DocId=14iAxeirF1duTcM37VXnM4llqO_ow46dSGOesenOnQ5o
  - Attachment filename: `<<[PROJECT NAME]>> DAILY REPORT <<TEXT(TODAY(), "MMM-DD-YYYY")>>`
  - Attachment mode: AttachAndArchive; Archived folder: `"Command Center/"&[Unique Id]&"/Daily Report/"`
  - Format: Portrait / A4

**Bot: (disabled) X321 DAILY REPORT** — disabled

**Bot: (disabled) Custom Report** — disabled

**Bot: gantt table bot** ✅ Active
- *(No step details collected — listed as active)*

**Bot: (disabled) Daily Report BETTA** — disabled

**Bot: (disabled) Add roladex** — disabled

**Bot: (disabled) Daily Report 2testtube baby** — disabled

**Bot: Hourly Report** ✅ Active
- **Trigger:** Scheduled — **Every Hour (same day)** — Hourly
- **Process:** Send an email:
  - To: `[Project Manager].[Email]`
  - CC: `[Related Job Contacts][Email]`
  - BCC: `ap@supervisioncompany.com`, `j@supervisioncompany.com`
  - Reply-To: `j@SUPERVISIONCOMPANY.COM`
  - Sender: "Supervision Hourly Report Bot"
  - Subject: `<<[PROJECT NAME]>> - HOURLY REPORT - <<TEXT(TODAY(), "DDDD") >> <<TODAY()>>`
  - Body template: DocId=1C2jJtuSQfZG-cq2YX3dXtgWePCAqJGwDPnJnG8OPH3w
  - Attachment template: DocId=1wWJP-pabQPWUOehodQwK8mmBppFGzkV-aiux_wZJxtg
  - Attachment filename: `<<[PROJECT NAME]>> HOURLY REPORT <<TEXT(TODAY(), "MMM-DD-YYYY")>>`
  - Attachment mode: AttachAndArchive; Archived to same daily report folder

**Bot: Same Day Report** ✅ Active
- **Trigger:** Scheduled — event "Every Hour same day 2" — **Daily**
- **Process:** Send an email:
  - To: `[Project Manager].[Email]`
  - CC: `[Related Job Contacts][Email]`
  - BCC: `ap@supervisioncompany.com`, `j@supervisioncompany.com`
  - Reply-To: `j@SUPERVISIONCOMPANY.COM`
  - Sender: "Supervision Daily Report Bot"
  - Subject: `<<[PROJECT NAME]>> - DAILY REPORT - <<TEXT(TODAY(), "DDDD") >> <<TODAY()>>`
  - Body template: DocId=1fYKcC3x-u5FInW5-3s-GKkjyVOqb_OU-aGDfKR1udWE
  - Attachment template: DocId=1INsEU0EixWy6u3NXQU8jC9TZmrCm4MhS-pS3yZh6ngM
  - Attachment filename: `<<[PROJECT NAME]>> DAILY REPORT <<TEXT(TODAY(), "MMM-DD-YYYY")>>`
  - Format: Portrait / Letter

**Bot: (disabled) full report** — disabled

**Bot: (disabled) Daily Report fraser fix** — disabled

**Bot: Night Report** ✅ Active
- **Trigger:** Scheduled — event "night reports" — **Daily**
- **Process:** Send an email:
  - To: `[Project Manager].[Email]`
  - CC: `[Related Job Contacts][Email]`
  - BCC: `ap@supervisioncompany.com`, `j@supervisioncompany.com`
  - Reply-To: `j@SUPERVISIONCOMPANY.COM`
  - Sender: "Supervision Daily Report Bot"
  - Subject: `<<[PROJECT NAME]>> - NIGHTLY REPORT - <<TEXT(TODAY(), "DDDD") >> <<TODAY()>>`
  - Body template: DocId=1Iq7r7QSaT5k7daU8ObckBpYBFh8bWHgHQL3bWu0HiHU
  - Attachment template: DocId=1GuEuTEc-rucNVMhbDmQDt9c3tOlsEH-dpBRThoiBTX0
  - Attachment filename: `<<[PROJECT NAME]>> NIGHTLY REPORT <<TEXT(TODAY(), "MMM-DD-YYYY")>>`
  - Format: Portrait / Letter

---

### TABLE: permissions (1 bot)

**Bot: New Bot 3**
- **Trigger:** Data change on **permissions** table — event type: **Adds OR Updates**
- **Condition:** none
- **Process:** Run data action → **Run action on rows**:
  - Referenced Table: **Users**
  - Referenced Rows: `filter("Users",[_THISROW].[Super]=[Email])`
  - Referenced Action: **Update Job**
  - *Effect: whenever a user's permissions record is added or modified, the Users table entry for that Super is updated with the new job list*

---

### TABLE: Report Picture (1 bot)

**Bot: (disabled) procore for Peapack**
- **Status:** Disabled
- **Trigger:** Named event "Add Picture" on **Report Picture** table — **Adds**
- **Condition:** `[Job Report].[Job] = "8dbe79ad"` (specific job ID)
- **Process:** Send an email (Custom template):
  - To: `"upload-pgb--gladstone-nen1lekcv6@procoretech.com"` (Procore upload address)
  - Subject: `<<[REPORT NOTE]>>`
  - Attachment: `[Image]` field
  - *Forwards report pictures to a specific Procore project inbox*

---

### TABLE: test emails (1 bot)
- **Bot name:** (not clicked individually — 1 test/dev bot, details not extracted)

---

### TABLE: Users (2 bots)

| Bot | Status |
|---|---|
| (disabled) Make a Report | Disabled |
| (disabled) Make a Report 2 | Disabled |

---

### working (slice) (1 bot)

**Bot: auto clock out**
- **Trigger:** Scheduled — event "New event 10" — **Hourly**
- **Source:** working slice (active clock-in records with no clock-out)
- **Process Step 1:** Run data action → **Run action on rows** → runs **CLOCK OUT** action:
  - Sets **Timestamp Out** = `NOW()`
  - Sets **Location Out** = `here()`
- **Process Step 2:** (New step 1 — additional step present but details not expanded)
- *Effect: automatically clocks out any user still clocked in, on an hourly schedule*

---

### Other (6 bots) — ALL DISABLED

| Bot |
|---|
| (disabled) Afternoon Reminder |
| (disabled) Morning Reminder |
| (disabled) Take Pics Reminder |
| (disabled) new comment notification |
| (disabled) New Bot |
| (disabled) New Bot 2 |

---

## PART 6 · SECURITY → ROLES

### Sign-In Settings
- **Require user sign-in:** YES (enabled)
- **Allow all signed-in users:** NO (restricted user list)
- **Authentication provider:** Any provider

### Role System Architecture
AppSheet's built-in `USERROLE()` function is used throughout the app. The role is derived from the **Users** table → **Role** column, which is a Ref to the **Roles** data table. The Roles table structure:

| Column | Type | Notes |
|---|---|---|
| _RowNumber | Number | Auto |
| ROW_ID | Text | `UNIQUEID()` — Key |
| Name | Name | The role name (e.g., "Admin") |
| Related Users | List (Ref) | `REF_ROWS("Users","Role")` — all users with this role |
| Related Contacts | List (Ref) | `REF_ROWS("Contacts","Position")` — contacts with this role/position |

### Role: **Admin**
The only explicitly-named role enforced in the app logic. The following access restrictions reference `USERROLE() = "Admin"` or `Userrole() = "Admin"`:

| Feature | What Admin Gets |
|---|---|
| **View: Active Jobs - Admin Only** (Menu Nav) | Show If: `USERROLE() = "Admin"` — full table of all In-Progress jobs |
| **View: Need IMG URL Jobs - Admin Only** (Menu Nav) | Show If: `and(isnotblank(need img url[Unique Id]), USERROLE() = "Admin")` — jobs missing image folder URLs |
| **View: Supers - Admin Only** (Menu Nav) | Show If: complex permissions check (Neo level); table of all users |
| **View: All Supers & Staff** (Ref View) | Show If: `USERROLE() = "Admin"` — full user deck |
| **View: Job and Super** (Ref View) | Show If: `Userrole() = "Admin"` — in-progress jobs with PM/Lead/Status |
| **View: No Daily Report Details** (Ref View) | Show If: `Userrole() = "Admin"` — jobs without daily reports |
| **View: Super Report** (Ref View) | Show If: `Userrole() = "Admin"` — full job report table |
| **Users table: Active column** | Show/Edit If: `USERROLE() = "Admin"` |
| **Action: Change Current Job** (Jobs) | Condition: only users in permissions with Master/Neo App Level |

### Role: **e1332879** (Special Internal Role Code)
Used exclusively to gate the **SVC LAB Reports** view:
- `(Lookup(Useremail(), "Users", "Email",