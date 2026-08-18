---
title: "Shell scripts every Mac admin should have"
description: "A working set of scripts for compliance checks, cleanup tasks, and self-service reporting."
pubDate: 2026-06-02
tags: ["Scripting", "Automation"]
---

Every MDM has a scripting or Self Service mechanism, and every fleet ends
up needing roughly the same handful of scripts. Here's the working set I
reach for most, trimmed down to the parts that matter.

## 1. A real compliance check, not just "is it enrolled"

Enrollment status tells you almost nothing about whether a Mac is actually
compliant. A better baseline script checks the things that actually
matter and reports a pass/fail per check rather than a single opaque
result:

```bash
#!/bin/bash
# compliance-check.sh — reports FileVault, firewall, and update status

fv_status=$(fdesetup status | grep -c "FileVault is On")
fw_status=$(defaults read /Library/Preferences/com.apple.alf globalstate)
pending_updates=$(softwareupdate -l 2>&1 | grep -c "\*")

echo "FileVault: $([ "$fv_status" -eq 1 ] && echo PASS || echo FAIL)"
echo "Firewall:  $([ "$fw_status" -ge 1 ] && echo PASS || echo FAIL)"
echo "Updates:   $([ "$pending_updates" -eq 0 ] && echo PASS || echo "FAIL ($pending_updates pending)")"
```

Feed the output into your MDM's extension attributes or inventory fields
so it's queryable at scale instead of something you check one Mac at a
time.

## 2. A safe cache and log cleanup

Disk space complaints are still one of the most common help desk tickets.
A cleanup script that's actually safe to run unattended sticks to caches
and logs, never user documents:

```bash
#!/bin/bash
# safe-cleanup.sh — clears caches/logs without touching user data

rm -rf ~/Library/Caches/* 2>/dev/null
rm -rf /Library/Caches/* 2>/dev/null
find /private/var/log -name "*.log" -mtime +30 -delete 2>/dev/null
echo "Cleanup complete: $(date)"
```

Run this as a scheduled Self Service item rather than silently in the
background — users should know something happened, especially the first
time an app has to rebuild a cache.

## 3. A "what does this Mac think it is" report

When something goes sideways, the fastest debugging step is a single
script that dumps the state you'd otherwise check manually across five
different tools:

```bash
#!/bin/bash
# device-report.sh — quick device state snapshot

echo "Hostname: $(scutil --get ComputerName)"
echo "Serial: $(system_profiler SPHardwareDataType | awk '/Serial/{print $4}')"
echo "OS: $(sw_vers -productVersion)"
echo "MDM enrolled: $(profiles status -type enrollment | grep -c "MDM enrollment: Yes")"
echo "Last check-in: $(defaults read /Library/Managed\ Preferences/com.apple.mdm 2>/dev/null || echo "n/a")"
```

Ship this as a Self Service action users can trigger before opening a
ticket — half the time, the output alone answers the question.

## The pattern behind all three

None of these scripts do anything clever. What makes them useful is that
they're **boring and readable** — anyone on the team can open them, see
exactly what will run, and trust that a scheduled script won't surprise a
user. That's worth more than a cleverer one-liner that nobody wants to
touch six months from now.
