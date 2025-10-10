const cachedLRUObjects = new Map();
export  const itemsPerPage = 15;
const MAX_CACHE_SIZE = 10*itemsPerPage;



export function fetchObjectDataUsingID(id) {
    if (cachedLRUObjects.has(id)) {
        return Promise.resolve(cachedLRUObjects.get(id));
    }

    return fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        .then(res => res.json())
        .then(data => {
            if (cachedLRUObjects.size >= MAX_CACHE_SIZE) {
                const oldestKey = cachedLRUObjects.keys().next().value; // Delete last object
                cachedLRUObjects.delete(oldestKey);
            }
            cachedLRUObjects.set(id, data);
            return data;
        });
}
