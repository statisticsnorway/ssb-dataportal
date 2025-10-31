import { SearchHitsLayout } from "@/components/search-hits-layout";

export default function Classifications() {
    return (
        <SearchHitsLayout
            infoContent={<h1 style={{padding:"1rem"}}>Hallo info</h1>}
            mainContent={<h1 style={{padding:"1rem"}}>Hallo Klasser</h1>}
            filterContent={<h1 style={{padding:"1rem"}}>Hallo filter</h1>}
        />
    )
}