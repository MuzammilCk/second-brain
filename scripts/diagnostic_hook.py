#!/usr/bin/env python3
import json
import sys
import os
from datetime import datetime, timezone

LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diagnostic-log.jsonl")

def main():
    raw = sys.stdin.read()
    entry = {'captured_at': datetime.now(timezone.utc).isoformat(), 'raw_stdin': raw}
    try:
        entry['parsed'] = json.loads(raw)
    except Exception as exc:
        entry['parse_error'] = str(exc)

    try:
        with open(LOG_PATH, 'a', encoding='utf-8') as f:
            f.write(json.dumps(entry) + '\n')
    except Exception as exc:
        print(f'diagnostic hook: failed to write log: {exc}', file=sys.stderr)

    print(json.dumps({'decision': 'allow'}))
    sys.exit(0)

if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'diagnostic hook error (ignored): {exc}', file=sys.stderr)
        print(json.dumps({'decision': 'allow'}))
        sys.exit(0)
