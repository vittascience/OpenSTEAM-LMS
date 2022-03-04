/**
 * Returns the path to profile picture.
 * 
 * @param {string} str - The string to process
 * @return {string} - The path to profile picture
 */
function getProfilePicturePath(str) {
    // Array which contains letters and corresponding patterns
    let patterns = [
        [ /[AÀÁÂÃÄÅÆ]/ , 'A' ], // /[AÀÁÂÃÄÅĀĂĄÆẦẰẢẨẲẪẴẤẮẠẬẶǍ]/
        [ /[B]/ , 'B' ],
        [ /[CÇ]/ , 'C' ], // /[CÇĆĈĊČƇ]/
        [ /[D]/ , 'D' ], // /[DĎĐƉƊ]/
        [ /[EÈÉÊË]/ , 'E' ], // /[EÈÉÊËÐĒĔĖĘĚỀẺỂẼỄẾẸỆ]/
        [ /[F]/ , 'F' ],
        [ /[G]/ , 'G' ], // /[GĜĞĠĢ]/
        [ /[H]/ , 'H' ], // /[HĤĦ]/
        [ /[IÌÍÎÏ]/ , 'I' ], // /[IÌÍÎÏĨĪĬĮİĲỈỊǏ]/
        [ /[J]/ , 'J' ], // /[JĴ]/
        [ /[K]/ , 'K' ], // /[KĶ]/
        [ /[L]/ , 'L' ], // /[LĹĻĽĿŁ]/
        [ /[M]/ , 'M' ],
        [ /[NÑ]/ , 'N' ], // /[NÑŃŅŇŊ]/
        [ /[OÒÓÔÕÖŒ]/ , 'O' ], // /[OÒÓÔÕÖŌŎŐŒƠỒỜỎỔỞỖỠỐỚỌỘỢǑØ]/
        [ /[P]/ , 'P' ],
        [ /[Q]/ , 'Q' ],
        [ /[R]/ , 'R' ], // /[RŔŖŘ]/
        [ /[S]/ , 'S' ], // /[SŚŜŞŠȘ]/
        [ /[T]/ , 'T' ], // /[TŢŤŦÞȚ]/
        [ /[UÙÚÛÜ]/ , 'U' ], // /[UÙÚÛÜŨŪŬŮŰŲƯỪỦỬỮỨỤỰǕǗǓǙ]/
        [ /[V]/ , 'V' ],
        [ /[W]/ , 'W' ], // / [WŴ]/
        [ /[X]/ , 'X' ],
        [ /[YÝŸ]/ , 'Y' ], // /[YÝŶŸỲỶỸ]/
        [ /[Z]/ , 'Z' ] // /[ZŹŻŽ]/
    ];

    // Get the first letter of str and convert it to uppercase
    let firstChar = str.slice(0, 1).toUpperCase();
    
    let path = 'assets/media/alphabet/';

    for (let i = 0; i < patterns.length; i++) {
        // Check if pattern pattern[i][0] is present or not in firstChar
        if (patterns[i][0].test(firstChar)) {
            path += patterns[i][1] + '.png';
            break;
        }
    }
    return path;
}
