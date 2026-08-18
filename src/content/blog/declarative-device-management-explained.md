---
title: "Declarative Device Management, explained"
description: "How DDM shifts MDM from imperative commands to device-reported status, and what still relies on the legacy protocol."
pubDate: 2026-07-14
tags: ["MDM", "DDM"]
---

For most of its history, Apple's MDM protocol worked the same way: your MDM
server sends a command, the device does the thing, and — if you're lucky —
reports back that it worked. Declarative Device Management (DDM) inverts
that relationship, and it's worth understanding before it quietly becomes
the only way half your fleet actually behaves.

## The old model: push and pray

Classic MDM commands are imperative and synchronous-ish: the server issues
`InstallProfile`, `DeviceLock`, or a dozen other commands, and the device
has to be online, checked in, and responsive to act on them. If a Mac is
asleep, off the network, or just slow to check in, your command sits in a
queue. Multiply that across a few thousand devices and you get the
familiar MDM experience of "it says pending" for a policy that should have
applied hours ago.

## The new model: declare, don't command

With DDM, the server publishes a **declaration** — a statement of desired
state, not an instruction to execute one action. The device evaluates that
declaration locally, on its own schedule, and reports status changes back
proactively. Instead of asking "did this command run yet?" you're getting
told "here's what changed" without polling.

Declarations come in a few flavors:

- **Configurations** — the DDM equivalent of a profile payload.
- **Assets** — references to files or data the device needs (like
  certificates) that live outside the declaration itself.
- **Activations** — conditions under which a configuration should apply.
- **Management status subscriptions** — the device telling you things
  changed, without you asking.

## What this actually changes day to day

The practical upshot for admins: status reporting gets a lot more honest.
Instead of an MDM command hanging in "Pending" indefinitely, DDM-aware
devices report their actual state — applied, failed, or not applicable —
as conditions change, even when they're offline at the moment the
declaration was published.

It also means less server-side polling. Your MDM no longer has to nag the
device to check in constantly to find out if something applied; the
device tells you.

## What still isn't declarative

Not everything has moved over. Software updates gained a declarative
model early, and configuration profiles are steadily migrating, but plenty
of MDM commands — remote lock, remote wipe, several query commands — are
still imperative and probably always will be, since they're
one-time actions rather than persistent state.

If you manage a fleet today, you're running a hybrid: some policies
declarative, some still the old push-and-hope commands. Knowing which is
which saves you from debugging a "stuck" command that was never going to
report back the way you expect.

## Where to look next

If your MDM vendor exposes DDM status in its console, that's the fastest
way to see the shift in action — look for status reporting that updates
without a device check-in event triggering it. That's the tell that you're
looking at a declaration, not a command.
