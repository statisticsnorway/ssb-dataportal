import React from "react";
import styles from "./sort.module.css";
import { Select } from "../select";
import { filter } from "../../utils/constants";
import { SortTypes } from "@/types/tabs";

interface SortFieldsProps {
    sortOptions: { key: string; label: string }[];
    sortValue: string;
    onSortChange: (key: string) => void;
}

const sortLabels: Record<string, string> = {
    titleAsc: filter.sortNameAsc,
    titleDesc: filter.sortNameDesc,
    lastChanged: filter.sortLastUpdated,
};

const SortFields = ({ sortOptions, sortValue, onSortChange }: SortFieldsProps) => {
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value as SortTypes);
    };
    return (
        <section className={styles.sortData}>
            <Select size="sm" aria-label="Select sort" onChange={handleSortChange} value={sortValue}>
                {sortOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                        {opt.label}
                    </option>
                ))}
            </Select>
        </section>
    );
}
export default SortFields;
    
/*
const SortFields: React.FC<SortFieldsProps> = ({ options, value, onChange }) => {
    return (
        <section className={styles.sortContainer}>
            <Select
                size="sm"
                aria-label="Select sort"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                        {opt.label}
                    </option>
                ))}
            </Select>
        </section>
    );
};*/


