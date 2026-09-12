# RealMe Decision Log

Decision journal and architectural audit trail for the RealMe 3D Portfolio project.

## 2026-07-28 — DR-RM-01: Secure Edge Contact Form
**Context:** The portfolio contact form originally used a plain `mailto:` link which exposed the user's email address to web scrapers and required the client to boot a native mail assistant.
**Decision:** Rewrote the contact form to point to a Vercel Edge Function linked to the Resend API. Integrated a hidden honeypot spam protection input field to filter out automated submissions.
**Alternatives considered:** Using Web3Forms or EmailJS (avoided to retain serverless control and maintain clean performance payloads).
**Status:** active

## 2026-07-28 — DR-RM-02: Verlet Page Turn Physics Integration
**Context:** A sophisticated Verlet cloth physics module (`PagePhysics.tsx` inside `DiaryHero.tsx`) was written but left unmounted, resulting in static 2D page transitions that undermined the depth of the 3D paper concept.
**Decision:** Revived and mounted the cloth-physics animation nodes, mapping mouse gesture events to pull points in the vertex array to simulate tactile page bends.
**Alternatives considered:** Standard CSS 3D page folds or Framer Motion transitions (avoided because they do not react dynamically to pointer coordinate paths).
**Status:** active

## 2026-07-28 — DR-RM-03: PostProcessingLite for Performance Scaling
**Context:** Standard full-screen post-processing effects (bloom, SSAO, chromatic aberration) ran poorly on CPU-only laptops or mobile devices, causing severe frame drops.
**Decision:** Configured a selective `PostProcessingLite` component that disables expensive shadow shaders and reduces raycast counts if the device's render loop runs under 40 FPS.
**Alternatives considered:** Disabling post-processing entirely (avoided as it strips the dark room atmosphere of its stylistic lighting).
**Status:** active

## 2026-07-28 — DR-RM-04: Mounting Scroll and Gyro Cameras
**Context:** The page layout felt flat and 2D. Investigation showed that `ScrollCamera` and `GyroCamera` components were implemented in code but not imported into the main canvas scene, resulting in a locked static viewpoint.
**Decision:** Formally imported and mounted the camera controls into the Canvas, binding the camera view matrices to scroll offset percentages and device mobile gyroscope feeds.
**Alternatives considered:** OrbitControls (avoided to prevent users from rotating outside the intended desk scene boundaries).
**Status:** active
