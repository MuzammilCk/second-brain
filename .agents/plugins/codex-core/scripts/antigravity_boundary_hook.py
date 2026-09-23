import os, sys
target = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "scripts", "antigravity_boundary_hook.py"))
with open(target, 'rb') as f:
    code = compile(f.read(), target, 'exec')
exec(code, {'__file__': target, '__name__': '__main__'})
