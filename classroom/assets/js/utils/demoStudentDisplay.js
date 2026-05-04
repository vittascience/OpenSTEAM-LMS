/**
 * demoStudentDisplay.js
 *
 * Provides the display name for the demo student account.
 * The name is purely cosmetic: the backend pseudo (used for DB lookups,
 * CSV exports filtering, statistics filtering, "reservedNickname" validation)
 * is never modified.
 *
 * Priority chain:
 *   1. DEMOSTUDENT_DISPLAY (.env, client-wide, exposed via home.php / login.php)
 *   2. VS_DEMOSTUDENT (.env, backend value)
 *   3. 'demostudent' (hardcoded fallback)
 *
 * The global `demoStudentName` MUST remain the source of truth
 * for any backend-related logic. Use it for comparisons.
 *
 * For UI display only, use:
 *   - getDemoStudentDisplayName()
 *   - getCapitalizedDemoStudentDisplayName()
 */

function getDemoStudentDisplayName() {
    // Client-wide override from .env DEMOSTUDENT_DISPLAY (exposed by home.php / login.php)
    if (typeof demoStudentDisplayDefault !== 'undefined' && demoStudentDisplayDefault && demoStudentDisplayDefault.trim()) {
        return demoStudentDisplayDefault.trim();
    }
    return typeof demoStudentName !== 'undefined' && demoStudentName
        ? demoStudentName
        : 'demostudent';
}

function getCapitalizedDemoStudentDisplayName() {
    const name = getDemoStudentDisplayName();
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
}
