import { SearchHitsLayout } from "@/components/search-hits-layout";

export default function Classifications() {
    return (
        <SearchHitsLayout
            infoContent={<h1>Hallo info</h1>}
            mainContent={<h1>Hallo main</h1>}
            filterContent={<h1>Hallo filter</h1>}
        >
            <h1>Hallo klasser</h1>
        </SearchHitsLayout>
    
    )
}