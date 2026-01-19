import { MetricData } from "./mock-data";

export interface HistoryPoint {
    month: string;
    monthId: string;
    value: number;
    year: string;
}

export interface HistoricalSeries {
    id: string; // The ID of the unit/class/segment being analyzed
    label: string;
    data: HistoryPoint[];
}

// Helper to generate a wavy trend ending in the current value
// Generates 12 months (Jan - Dec) for the current year
export function generateHistoryForMetric(
    targetValue: number,
    year: string = "2026",
    variability: number = 1.0
): HistoryPoint[] {
    const months = [
        { id: "jan", label: "Jan" }, { id: "fev", label: "Fev" },
        { id: "mar", label: "Mar" }, { id: "abr", label: "Abr" },
        { id: "mai", label: "Mai" }, { id: "jun", label: "Jun" },
        { id: "jul", label: "Jul" }, { id: "ago", label: "Ago" },
        { id: "set", label: "Set" }, { id: "out", label: "Out" },
        { id: "nov", label: "Nov" }, { id: "dez", label: "Dez" },
    ];

    // We start from Jan and walk to Dec.
    // Dec (or last known) matches targetValue.
    // We reverse-engineer a random walk.

    let currentVal = targetValue;
    const reversedData: HistoryPoint[] = [];

    // Walk backwards from Dec to Jan
    for (let i = months.length - 1; i >= 0; i--) {
        reversedData.push({
            month: months[i].label,
            monthId: months[i].id,
            value: Number(currentVal.toFixed(1)),
            year: year
        });

        // Mutate for previous month
        // Random change between -variability and +variability
        const delta = (Math.random() * variability * 2) - variability;
        currentVal += delta;

        // Clamp basic logic (e.g. grade 0-10) - hard to know strictly without context limits, 
        // but let's assume valid ranges are generally positive.
        if (currentVal < 0) currentVal = 0;
        if (currentVal > 100) currentVal = 95; // Rough clamp
    }

    return reversedData.reverse();
}

export function getMonthName(id: string): string {
    const map: Record<string, string> = {
        "jan": "Janeiro", "fev": "Fevereiro", "mar": "Março", "abr": "Abril",
        "mai": "Maio", "jun": "Junho", "jul": "Julho", "ago": "Agosto",
        "set": "Setembro", "out": "Outubro", "nov": "Novembro", "dez": "Dezembro"
    };
    return map[id] || id;
}
