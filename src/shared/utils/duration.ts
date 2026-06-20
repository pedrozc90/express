/**
 * duration.ts
 * Utilities for parsing and formatting duration strings.
 *
 * Examples:
 *   parseDuration("1h", "s")         → 3600
 *   parseDuration("3 days", "ms")    → 259200000
 *   parseDuration("2w", "h")         → 336
 *
 *   formatDuration(3600, "s")        → "1 hour"
 *   formatDuration(3600, "s", { style: "short" })  → "1h"
 *   formatDuration(90, "m")          → "1 hour, 30 minutes"
 *   formatDuration(90, "m", { parts: 1 }) → "1 hour"
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimeUnit =
    | "ms"
    | "milliseconds"
    | "s"
    | "seconds"
    | "m"
    | "minutes"
    | "h"
    | "hours"
    | "d"
    | "days"
    | "w"
    | "weeks"
    | "mo"
    | "months"
    | "y"
    | "years";

export type FormatStyle = "long" | "short";

export interface FormatOptions {
    /** "long" → "1 hour, 30 minutes" | "short" → "1h 30m"  (default: "long") */
    style?: FormatStyle;
    /** Max number of parts to include, e.g. 1 → only the largest unit (default: all) */
    parts?: number;
}

// ---------------------------------------------------------------------------
// Internal unit map  (all values in milliseconds)
// ---------------------------------------------------------------------------

interface UnitDef {
    ms: number;
    short: string; // canonical short symbol
    long: string; // singular long name
    longPlural: string;
    aliases: string[]; // accepted aliases for parsing (lower-case)
}

const UNITS: UnitDef[] = [
    {
        ms: 1,
        short: "ms",
        long: "millisecond",
        longPlural: "milliseconds",
        aliases: ["ms", "millisecond", "milliseconds"],
    },
    {
        ms: 1_000,
        short: "s",
        long: "second",
        longPlural: "seconds",
        aliases: ["s", "sec", "secs", "second", "seconds"],
    },
    {
        ms: 60_000,
        short: "m",
        long: "minute",
        longPlural: "minutes",
        aliases: ["m", "min", "mins", "minute", "minutes"],
    },
    {
        ms: 3_600_000,
        short: "h",
        long: "hour",
        longPlural: "hours",
        aliases: ["h", "hr", "hrs", "hour", "hours"],
    },
    {
        ms: 86_400_000,
        short: "d",
        long: "day",
        longPlural: "days",
        aliases: ["d", "day", "days"],
    },
    {
        ms: 604_800_000,
        short: "w",
        long: "week",
        longPlural: "weeks",
        aliases: ["w", "wk", "wks", "week", "weeks"],
    },
    {
        ms: 2_592_000_000, // 30-day month approximation
        short: "mo",
        long: "month",
        longPlural: "months",
        aliases: ["mo", "mon", "month", "months"],
    },
    {
        ms: 31_536_000_000, // 365-day year approximation
        short: "y",
        long: "year",
        longPlural: "years",
        aliases: ["y", "yr", "yrs", "year", "years"],
    },
];

// Lookup: alias → UnitDef
const ALIAS_MAP = new Map<string, UnitDef>();
for (const def of UNITS) {
    for (const alias of def.aliases) {
        ALIAS_MAP.set(alias, def);
    }
}

function resolveUnit(unit: TimeUnit): UnitDef {
    const def = ALIAS_MAP.get(unit.toLowerCase());
    if (!def) throw new Error(`Unknown time unit: "${unit}"`);
    return def;
}

// ---------------------------------------------------------------------------
// parseDuration
// ---------------------------------------------------------------------------

/**
 * Parse a human-readable duration string and return its value in the
 * requested unit.
 *
 * @param input  - e.g. "3 days", "3d", "1h", "90 seconds", "2w"
 * @param unit   - the unit you want the result in, e.g. "s", "ms", "h"
 * @returns      - numeric value in the requested unit (may be fractional)
 *
 * @example
 *   parseDuration("1h", "s")        // 3600
 *   parseDuration("3 days", "ms")   // 259200000
 *   parseDuration("2w", "d")        // 14
 */
export function parseDuration(input: string, unit: TimeUnit): number {
    const trimmed = input.trim();

    // Match patterns like "3d", "3 days", "1.5h", "1 hour"
    const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
    if (!match) {
        throw new Error(`Cannot parse duration string: "${input}". ` + `Expected format like "3d", "1 hour", "2.5 weeks".`);
    }

    const value = parseFloat(match[1]!);
    const unitStr = match[2]!.toLowerCase();

    const fromDef = ALIAS_MAP.get(unitStr);
    if (!fromDef) {
        throw new Error(`Unknown duration unit: "${match[2]}"`);
    }

    const toDef = resolveUnit(unit);

    // Convert: value → ms → target unit
    const ms = value * fromDef.ms;
    return ms / toDef.ms;
}

// ---------------------------------------------------------------------------
// formatDuration
// ---------------------------------------------------------------------------

/**
 * Format a numeric duration value into a human-readable string.
 *
 * @param value   - the numeric duration
 * @param unit    - the unit of `value`, e.g. "s", "ms", "h"
 * @param options - formatting options (style, max parts)
 * @returns       - human-readable string
 *
 * @example
 *   formatDuration(3600, "s")                    // "1 hour"
 *   formatDuration(3600, "s", { style: "short" }) // "1h"
 *   formatDuration(90,   "m")                    // "1 day, 6 hours"
 *   formatDuration(90,   "m", { parts: 1 })      // "1 day"
 */
export function formatDuration(value: number, unit: TimeUnit, options: FormatOptions = {}): string {
    const { style = "long", parts: maxParts } = options;

    const fromDef = resolveUnit(unit);
    let remainingMs = Math.round(value * fromDef.ms);

    if (remainingMs < 0) {
        return `-${formatDuration(-value, unit, options)}`;
    }
    if (remainingMs === 0) {
        return style === "short" ? `0${fromDef.short}` : `0 ${fromDef.longPlural}`;
    }

    // Walk units from largest to smallest, collecting parts
    const collected: { amount: number; def: UnitDef }[] = [];

    // Walk from largest to smallest unit; no upper cap — 3600s should show as "1 hour"
    const relevantUnits = [...UNITS].reverse();

    for (const def of relevantUnits) {
        if (remainingMs <= 0) break;
        const amount = Math.floor(remainingMs / def.ms);
        if (amount > 0) {
            collected.push({ amount, def });
            remainingMs -= amount * def.ms;
        }
    }

    const limited = maxParts ? collected.slice(0, maxParts) : collected;

    return limited
        .map(({ amount, def }) => {
            if (style === "short") return `${amount}${def.short}`;
            const label = amount === 1 ? def.long : def.longPlural;
            return `${amount} ${label}`;
        })
        .join(style === "short" ? " " : ", ");
}
