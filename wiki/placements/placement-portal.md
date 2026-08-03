# Placement Portal Configuration

This placement portal tracker documents validation rules, account boundaries, and submitted descriptions for KTU (Kerala Technological University) placement workflows.

## Validation Errors and Solutions
- **Field Limit**: Academic declaration text box is capped at exactly **150 characters**.
- **Common Error**: Form validation triggers "Please enter valid academic project declaration."
- **Resolution**:
  - The form expects a highly structured layout: `Title: ... | Tech: ... | Description: ...` or a direct concise academic statement.
  - The "Have you undertaken academic projects?" toggle must be switched to **Yes** before the text box validation activates.
  - Validator glitches may persist visually on typing but resolve upon saving/submitting the full container.

## Official Submission Descriptions

### MetaTune AutoML Platform
- **Draft 1 (134 characters)**:
  `MetaTune: AutoML hyperparameter optimization platform. Built neural meta-learner with bilevel optimization using Python, PyTorch, Streamlit.`
- **Draft 2 (Structured)**:
  `Title: MetaTune | Tech: Python, Streamlit, PyTorch | Description: Developed an AutoML platform with meta-learner & bilevel optimization.`

### User Profile Association
- Connects to [[wiki/people/muzammil-ck|Muzammil Ck]].
- Projects declared: [[wiki/projects/metatune|MetaTune]].

## Sources
- `raw/claude-exports/Metatune-academic-project-completion.md`
