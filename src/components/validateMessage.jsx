export function ValidatedMessage({message}) {
    return (
        <>
            <div className="mt-3" >
                <span className="text-md text-red-500">
                    {message}
                </span>
            </div>
        </>
    );
}