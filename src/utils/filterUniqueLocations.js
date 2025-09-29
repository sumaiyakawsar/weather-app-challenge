export function filterUniqueLocations(results) {
    const unique = [];
    const seen = new Set();

    for (const r of results) {
        const key = `${r.name.toLowerCase()}-${r.country.toLowerCase()}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(r);
        }
    }

    return unique;
}