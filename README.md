# z-commerce wallet

The customer's wallet: it holds the credential issued to them and produces the proofs the
shop and the courier ask for.

Part of [z-Commerce](https://github.com/ermolaev1337/z-commerce); it is not meant to run
on its own.

## What it does

The credential carries attributes — a date of birth, an address — signed by an issuer the
verifier trusts. The wallet never hands those attributes over. Asked for a proof of age,
it builds a zero-knowledge range proof: a statement that the birth date lies before some
threshold, verifiable against the issuer's public key and worthless for learning anything
else.

The exchange is always the same three steps: accept the connection invitation from the
order, receive the proof request, submit the proof.

## Layout

| Part | What it is | Port |
| --- | --- | --- |
| `frontend` | Expo app, runs in the browser for the demo | 19006 |
| `backend` | Talks to the holder's Heimdall instance and builds the proofs | 8286 |

An Expo app, so the same front end could run on a phone; the demo uses the web target so
that everything stays on one machine.

## Note on dependencies

The versions here are pinned deliberately and are not current. Expo SDK 52 with this exact
dependency tree is what the app was verified against — the security advisories GitHub
reports for this repository are known, and upgrading breaks the build.
