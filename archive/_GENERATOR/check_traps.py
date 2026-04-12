#!/usr/bin/env python3
"""
Trap Tracker Analyzer for IdoBooking Generator.

Reads trap_tracker.json and reports:
1. Traps with >= 2 clients that are NOT in CSS_BASE.css
2. Traps in CSS_BASE.css that only appear in 1 client (candidate for removal)
3. Summary stats

Usage:
    python check_traps.py                    # report only
    python check_traps.py --add-trap         # interactive: add new trap
    python check_traps.py --post-mortem mp   # fill post-mortem for client prefix
"""

import json
import sys
from pathlib import Path
from datetime import date

SCRIPT_DIR = Path(__file__).parent
TRACKER = SCRIPT_DIR / "trap_tracker.json"
CSS_BASE = SCRIPT_DIR / "templates" / "CSS_BASE.css"


def load_tracker():
    with open(TRACKER, "r", encoding="utf-8") as f:
        return json.load(f)


def save_tracker(data):
    data["_updated"] = str(date.today())
    with open(TRACKER, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Saved {TRACKER.name}")


def report():
    data = load_tracker()
    traps = data["traps"]

    print(f"\n  Trap Tracker Report ({data['_updated']})")
    print(f"  {'='*50}")
    print(f"  Total traps tracked: {len(traps)}")

    in_base = [t for t in traps if t["in_base"]]
    not_in_base = [t for t in traps if not t["in_base"]]

    print(f"  In CSS_BASE.css:     {len(in_base)}")
    print(f"  Not in CSS_BASE.css: {len(not_in_base)}")

    # Traps that SHOULD be in base (>= 2 clients, not in base)
    promote = [t for t in not_in_base if len(t["clients"]) >= 2]
    if promote:
        print(f"\n  PROMOTE TO CSS_BASE.css ({len(promote)} traps with >= 2 clients):")
        for t in promote:
            print(f"    {t['id']}: {t['selector']}")
            print(f"      Clients: {', '.join(t['clients'])}")
            print(f"      Reason: {t['reason']}")

    # Traps in base with only 1 client (review candidates)
    review = [t for t in in_base if len(t["clients"]) == 1]
    if review:
        print(f"\n  REVIEW (in base but only 1 client — may be too specific):")
        for t in review:
            print(f"    {t['id']}: {t['clients'][0]}")

    # Stats per client
    all_clients = set()
    for t in traps:
        all_clients.update(t["clients"])
    print(f"\n  Clients tracked: {len(all_clients)}")

    client_counts = {}
    for c in all_clients:
        client_counts[c] = len([t for t in traps if c in t["clients"]])
    for c, count in sorted(client_counts.items(), key=lambda x: -x[1]):
        print(f"    {c}: {count} traps")

    # Most common traps
    print(f"\n  Most universal traps (all {len(all_clients)} clients):")
    universal = [t for t in traps if len(t["clients"]) == len(all_clients)]
    for t in universal:
        print(f"    {t['id']}")

    print()


def add_trap():
    data = load_tracker()

    print("\n  Add new trap")
    trap_id = input("  ID (snake_case): ").strip()
    selector = input("  Selector/fix: ").strip()
    reason = input("  Reason: ").strip()
    clients_str = input("  Clients (comma-separated prefixes): ").strip()
    clients = [c.strip() for c in clients_str.split(",") if c.strip()]

    in_base = len(clients) >= 2
    if len(clients) >= 2:
        answer = input(f"  Add to CSS_BASE.css? [{len(clients)} clients, recommended: yes] (y/n): ").strip().lower()
        in_base = answer != "n"

    new_trap = {
        "id": trap_id,
        "selector": selector,
        "reason": reason,
        "in_base": in_base,
        "clients": clients
    }

    data["traps"].append(new_trap)
    save_tracker(data)

    if in_base:
        print(f"\n  Added '{trap_id}' — REMEMBER to add the fix to templates/CSS_BASE.css!")
    else:
        print(f"\n  Added '{trap_id}' (not yet in base, {len(clients)} client(s))")


def add_client_to_trap(trap_id: str, client: str):
    data = load_tracker()
    for trap in data["traps"]:
        if trap["id"] == trap_id:
            if client not in trap["clients"]:
                trap["clients"].append(client)
                save_tracker(data)
                if len(trap["clients"]) >= 2 and not trap["in_base"]:
                    print(f"  '{trap_id}' now has {len(trap['clients'])} clients — PROMOTE to CSS_BASE.css!")
                else:
                    print(f"  Added '{client}' to trap '{trap_id}'")
            else:
                print(f"  '{client}' already in trap '{trap_id}'")
            return
    print(f"  Trap '{trap_id}' not found")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--add-trap":
            add_trap()
        elif sys.argv[1] == "--add-client" and len(sys.argv) >= 4:
            add_client_to_trap(sys.argv[2], sys.argv[3])
        else:
            print(f"Usage: python check_traps.py [--add-trap | --add-client <trap_id> <client>]")
    else:
        report()
