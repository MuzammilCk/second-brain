import os, sys
target = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "scripts", "diagnostic_hook.py"))
with open(target, 'rb') as f:
    code = compile(f.read(), target, 'exec')
exec(code)
