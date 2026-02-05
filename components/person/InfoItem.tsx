interface InfoItemProps {
    label: string;
    value: string | null | undefined;
}

export function InfoItem({ label, value }: InfoItemProps) {
    if (!value) return null;
    return (
        <div className="mb-4">
            <h4 className="font-bold text-sm text-gray-900">{label}</h4>
            <p className="text-sm text-gray-600">{value}</p>
        </div>
    );
}
