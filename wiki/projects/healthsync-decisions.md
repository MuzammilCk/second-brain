# HealthSync - Decision Log

Chronological record of design decisions and security implementations.

## 2026-04-10 — httpOnly Cookies + Ownership Middleware for Double-Guard Security
**Context:** Role-Based Access Control (RBAC) handles macro permissions (e.g., patient vs. doctor) but does not natively prevent ID-harvesting URL attacks. For instance, a patient with a valid token could query `/api/patients/123/records` with another patient's ID.
**Decision:** Configured a dual-guard auth system:
1. Store JWT session tokens inside secure `httpOnly` cookies (preventing client XSS script thefts).
2. Deployed an `ensureOwnPatientData` and `validateAppointmentOwnership` middleware that explicitly matches request route parameters with the decoded token client ID.
**Alternatives considered:** Custom payload hashes (rejected due to overhead).
**Status:** active

## 2026-04-15 — Development Sandbox for Stripe Checkout
**Context:** Local developers frequently lack stable internet access, or need to run automated integration code without exhausting sandbox rate thresholds or requiring external Stripe requests.
**Decision:** Scaffolded an offline-first mock checkout router. The client detects the `NODE_ENV` environment variable; if set to `development` and credentials are omitted, it routes transaction payloads to a local simulated gateway that instantly returns mock success responses, updating the MongoDB billing state.
**Status:** active
