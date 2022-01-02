export default function validateTraduction(allTranslations) {
    const flattenedKeys = {}
    const allDifferences = {}
    
    Object.keys(allTranslations).forEach(lng => {flattenedKeys[lng] = []})
    
    //flattening the keys
    function flatten(obj, prevKey = null, lng) {
        Object.keys(obj).forEach(objKey => {
            const newKey = (prevKey ? `${prevKey}.` : '') + objKey
            
            if (typeof obj[objKey] !== "object") {
                flattenedKeys[lng].push(newKey)
                return newKey
            }
            
            return flatten(obj[objKey],newKey ,lng)
        })
    }

    //init
    Object.keys(allTranslations).forEach(lng => flatten(allTranslations[lng],"",lng))

    //2D analysis
    Object.keys(allTranslations).forEach(lngA => {
        Object.keys(allTranslations).forEach(lngB => {
            if (lngA === lngB) return
            
            //check diffs
            let differences = flattenedKeys[lngA].filter(x => !flattenedKeys[lngB].includes(x));

            //report diffs
            differences.forEach(diff => {
                if (!allDifferences[diff])
                    allDifferences[diff] = [lngA + ' ✔ ']

                allDifferences[diff].push(lngB + ' ❌')
                allDifferences[diff].sort()
            })
        })
    })

    Object.keys(allDifferences).forEach(diffKey => {
        console.warn(diffKey,allDifferences[diffKey])
    })

    return allDifferences
}
    