

export const logger = {
    error: (...messages: unknown[]) => console.log("[Music Box] ", "[ERROR]", ...messages),
    debug: (...messages: unknown[]) => console.log("[Music Box] ", "[DEBUG]", ...messages),
    info: (...messages: unknown[]) => console.log("[Music Box] ", "[INFO]", ...messages),
}