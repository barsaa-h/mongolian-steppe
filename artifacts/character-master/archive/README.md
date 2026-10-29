# Character archive

Retired from the active character workflow on 28 October 2026. Files were moved,
not deleted. The [manifest](../production/organization-manifest.json) records
original paths, destination paths, byte sizes and SHA-256 hashes; every moved
file was checked after the move.

| Folder | Why it is archived |
| --- | --- |
| `prototypes/lisa-study/` | Earlier LISA reference experiment; not the selected MakeHuman source. |
| `prototypes/ps2-horror-character/` | Earlier standalone horror character pipeline; replaced by the shared DNA system. |
| `ganaa-designs/` | Nine superseded appearance/face/age/eye/production candidate builds. Active identity/build stay in `artifacts/episode-1-cast/dna/ganaa.json` and `artifacts/episode-1-cast/ganaa/`. |
| `documents-before-organization/` | Exact document bytes saved before this cleanup, including pre-existing local edits. |

Archived scripts and embedded scene paths describe their original locations.
Treat them as history; use the active shared builder for new work. Do not run an
archived builder against its old output path. Restore a folder to its manifest
`from` location only if that location is unoccupied, or inspect it in scratch.

The previously deleted `character-remaster`, `psx-casual-guy` and
`shearling-field-guy` files were already absent at intake. This cleanup did not
restore or delete them again. Their existing Git deletions remain unchanged.
