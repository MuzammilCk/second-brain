# prediction_system Recent Git History

- **2026-08-19**: Added Dev Container Folder
- **2026-08-18**: fix(plotly): correct axis title font syntax in get_plotly_layout
- **2026-08-18**: feat(ui): modernize dashboard with Streamlit Skills executive dark theme and container cards  - Add .streamlit/config.toml with financial-dashboard dark slate theme, Inter + JetBrains Mono fonts, and 6px border radii - Upgrade app.py with native st.container(border=True) cards and horizontal metric containers - Replace plain emojis with Material Symbols throughout navigation, metrics, and actions - Format candidate rosters and comparison matrices with st.column_config.ProgressColumn - Style Plotly charts to match dark slate canvas - Replace deprecated use_container_width=True with width='stretch'
- **2026-08-18**: chore: configure streamlit skills and add to gitignore
- **2026-08-18**: fix: resolve schema mismatch on custom upload and isolate test artifacts  - Isolate pipeline and benchmark paths in test_schema_analyzer.py using tmp_path to prevent tests from overwriting production models - Add resilient feature alignment and default imputation in data_pipeline.py transform() to prevent ColumnTransformer missing-column crashes - Add auto-healing preprocessor verification in app.py load_system_pipeline() - Wrap cohort probability predictions in error-handling block with user guidance
