export default function CompareCardSkeleton() {
    return (
        <div className="compare-skeleton-card">
            {/* Remove button skeleton */}
            <div className="skeleton-remove-btn" />

            {/* Weather now section */}
            <div className="skeleton-weather-now">
                <div className="skeleton-location" />
                <div className="skeleton-temperature" />
            </div>

            {/* Stats grid skeleton */}
            <div className="skeleton-stats">
                {Array(8).fill(0).map((_, index) => (
                    <div key={index} className="skeleton-stat-card">
                        <div className="skeleton-stat">
                            <div className="skeleton-stat-label" />
                            <div className="skeleton-stat-value" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}