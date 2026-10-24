// Mina's seat. Kept in its own module so the demo build can swap it for src/seat-mina.stub.ts (esbuild alias "@mina-seat") and leave her 230 KB of story out.
import minaConfig from "./content/mina/config.json";
import minaEvents from "./content/mina/events.json";
import minaFlavor from "./content/mina/flavor.json";
import minaUi from "./content/mina/ui.json";
import minaBook from "./content/mina/book.json";
import { makeSeat } from "./seatMake";
import type { Seat } from "./seatMake";

export const minaSeat: Seat | null = makeSeat("mina", minaConfig, minaEvents, minaFlavor, minaUi, minaBook);
