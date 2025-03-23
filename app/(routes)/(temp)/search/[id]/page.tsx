type Props = {
    params: {
        id: Promise<string>
    };
};

export default async function SearchPage({ params }: Props) {
    const id = await params.id;

    return (
        <div className="search-page">
            <h1>Search Results for: {id}</h1>
            {/* Add your search results component here */}
        </div>
    );
}