import * as fns from 'date-fns';
import { TreeEntity } from '../components/TreeView';

/**
* @param {Array<T>} array
* @param {keyof T| (keyof T)[]} propName
* @param compareFn
*/
export function sortObjectArrayByProp(array, propName, compareFn) {
    return array.sort((a, b) => {
        if (Array.isArray(propName)) {
            for (var i = 0; i < propName.length; i++) {
                var p = propName[i];
                if (typeof compareFn === 'function') {
                    const result = compareFn(a[p], b[p]);
                    if (result !== 0) return result;
                }
                if (a[p] > b[p]) {
                    return 1;
                }
                if (a[p] < b[p]) {
                    return -1;
                }
            }
        } else {
            if (typeof compareFn === 'function') {
                return compareFn(a[propName], b[propName]);
            }
            if (a[propName] > b[propName]) {
                return 1;
            }
            if (a[propName] < b[propName]) {
                return -1;
            }
        }
        return 0;
    });
}

export function sortObjectArrayByPropDate(array, propname, desc = false) {
    return array.sort((a, b) => {
        var dateA = new Date(a[propname]);
        var dateB = new Date(b[propname]);
        if (dateA > dateB) {
            return desc ? -1 : 1;
        }
        if (dateA < dateB) {
            return desc ? 1 : -1;
        }
        return 0;
    });
}

/**
 * 
 * @param {Map<any,T>} map 
 * @returns {T[]}
 */
export function MapToArray(map) {
    return Array.from(map).map(([key, value]) => value);
}

/**
 * 
 * @param {Array<T>} array 
 * @param {string} prop 
 * @returns {Map<string,T[]>}
 */
export function groupByProp(array, prop) {
    var map = new Map();
    array.forEach(item => {
        var value = item[prop];
        var val = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (map.has(val)) {
            map.get(val).push(item);
        } else {
            map.set(val, [item]);
        }
    });
    return map;
}

/**
 * 
 * @param {Array<T>} array 
 * @returns {Array<T>}
 */
export function removeDuplicated(array) {
    return array.filter((v, i, a) => a.lastIndexOf(v) === i);
}

/**
 * 
 * @param {TreeEntity<T>} tree 
 */
export function treeToList(tree) {
    const list = [];
    const children = tree.children;
    if (Array.isArray(children) && children.length > 0) {
        children.forEach(child => {
            list.push(...(treeToList(child)));
        });
    }
    Object.assign(tree, { children: undefined });
    return [tree, ...list];
}

/**
 * 
 * @param {TreeEntity[]} list 
 * @param {*} rootGuid 
 */
export function listToTree(list, rootGuid) {
    if (Array.isArray(list)) {
        const root = list.find(node => node.guid === rootGuid);
        if (!root) return null;
        root.children = list
            .filter(child => child.parentGuid === root.guid)
            .map(child => listToTree(list, child.guid));
        return root;
    }
    return null;
}

export function accentedPhrase(phrase) {
    const phraseArray = String(phrase).toLowerCase().split(' ');
    const phraseSanitized = phraseArray.map(sanitizePhrase);
    console.log(phraseSanitized);
}

function sanitizePhrase(phrase) {
    const charArray = String(phrase).toLowerCase().split('');
    const charsAccented = charArray.map(char => chars(char));
    const phraseCount = charArray.length;
    const phrases = [phrase];

    for (var phraseIndex = 0; phraseIndex < phraseCount; phraseIndex++) {
        var char = charsAccented[phraseIndex];
        if (char) {
            var charCount = char.length;
            for (var charIndex = 0; charIndex < charCount; charIndex++) {
                if (phraseIndex === 0) {
                    phrases.push(char[charIndex] + String(phrase).substr(1, phraseCount));
                } else {
                    phrases.push(String(phrase).substr(0, phraseIndex) + char[charIndex] + String(phrase).substr(phraseIndex + 1, phraseCount));
                }
            }
        }
    }
    return phrases;
}

function chars(char) {
    const charsAccented = {
        'a': ['á', 'â', 'ã'],
        'á': ['a', 'â', 'ã'],
        'â': ['á', 'a', 'ã'],
        'ã': ['á', 'â', 'a'],

        'e': ['é', 'ê'],
        'é': ['e', 'ê'],
        'ê': ['é', 'e'],

        'i': ['í', 'î'],
        'í': ['i', 'î'],
        'î': ['í', 'i'],

        'o': ['ó', 'ô', 'õ'],
        'ó': ['o', 'ô', 'õ'],
        'ô': ['ó', 'o', 'õ'],
        'õ': ['ó', 'ô', 'o'],

        'u': ['ú', 'û'],
        'ú': ['u', 'û'],
        'û': ['ú', 'u'],

        'c': ['ç'],
        'ç': ['c'],

        'n': ['ñ'],
        'ñ': ['n'],
    }
    return charsAccented[char];
}

export async function delay(milliseconds) {
    return new Promise((resolve, reject) => {
        window.setTimeout(resolve, milliseconds);
    });
}

export function objectEquals(a, b) {
    const _objectEquals = (a, b, deepCount) => {
        if (!a && !b) return true;
        if (typeof a !== 'object' || typeof b !== 'object') {
            return a === b;
        }
        if (deepCount > 50) return false;
        const props = Object.getOwnPropertyNames(a);
        for (var i = 0; i < props.length; i++) {
            var propName = props[i];
            var propA = a[propName], propB = b[propName];
            if (propA === propB) {
                continue;
            }
            if (typeof propA === 'object' && typeof propB === 'object') {
                if (_objectEquals(propA, propB, deepCount + 1)) {
                    continue;
                }
            }
            return false;
        }
        return true;
    }
    try {
        return _objectEquals(a, b, 1) && _objectEquals(b, a, 1);
    } catch (e) {
        return false;
    }
}

/**
 * 
 * @param {Object} source 
 * @returns {Object}
 */
export function objectClone(source) {
    if (Array.isArray(source)) {
        return source.map(v => objectClone(v));
    } else if (source !== null && typeof source === 'object') {
        var clone = {};
        for (var prop in source) {
            Object.assign(clone, { [prop]: objectClone(source[prop]) });
        }
        return clone;
    } else {
        return source;
    }
}

export function objectFilter(raw, allowed) {
    return Object.keys(raw)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
            obj[key] = raw[key];
            return obj;
        }, {});
}

export const ipRegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * 
 * @param {()=>boolean} predicate 
 * @param {number} timeout 
 * @param {number} step 
 */
export async function asyncPredicate(predicate, timeout = 1000, step = 10) {
    if (typeof predicate !== 'function') return false;
    for (var i = 0; i < (timeout / step); i++) {
        if (predicate()) return true;
        await delay(step);
    }
    return false;
}

/**
 * 
 * @param {string} message 
 * @param {Function} onclick 
 * @returns {Promise<Boolean>}
 */
export async function windowNotity(message, onclick) {
    var permission = window.Notification.permission;
    if (permission !== 'granted') {
        permission = await window.Notification.requestPermission();
    }
    if (permission === 'granted') {
        const notification = new window.Notification('Commbox SafeAccess Lite', { body: message });
        notification.onclick = onclick;
        return true;
    }
    return false;
}

export function getReactElementText(element) {
    const pieces = [];
    if (typeof element === 'string' || typeof element === 'number') {
        pieces.push(element);
    } else if (typeof element === 'object') {
        if (!element) return '';
        const { props } = element;
        if (typeof props === 'object') {
            const { children } = props;
            if (Array.isArray(children)) {
                pieces.push(...children.map(c => getReactElementText(c)));
            } else if (typeof children === 'string') {
                pieces.push(children);
            }
        }
    }
    return pieces.join('');
}

export function popupwindow(url, title, w, h) {
    var left = (window.screen.width / 2) - (w / 2);
    var top = (window.screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

export function downloadBlob(blob, type, filename) {
    var a = window.document.createElement("a");
    var url = window.URL.createObjectURL(blob, { type });
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * 
 * @param {Date} dtIni 
 * @param {Date} dtEnd 
 * @returns {Date[]}
 */
export function getDateDays(dtIni, dtEnd) {
    var diferencaDias = parseInt(fns.differenceInDays(dtEnd, dtIni), 10);
    var dates = [];
    var currentDate = dtIni;
    for (var d = 0; d <= diferencaDias; d++) {
        dates.push(currentDate);
        currentDate = fns.addDays(currentDate, 1);
    }
    return dates;
}

/**
 * 
 * @param {string} strCPF 
 */
export function TestCPF(strCPF) {
    var Soma = 0;
    var Resto = 0;
    strCPF = strCPF.replace(/(\.|-)/g, '');
    if (Number(strCPF) == 0 || Number(strCPF) == 99999999999) return false;
    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

/**
 * 
 * @param {string} strCnpj
 */
export function TestCNPJ(strCnpj) {
    var cnpj = strCnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    var tamanho = cnpj.length - 2
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

export const fnsFormatFullDate = 'dd/MM/yyyy HH:mm:ss';

export const safePasswordRegex = /^(((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/; //Letras e numeros, minimo oito caracteres

/**
 * 
 * @param {string} strMacAddress 
 */
export function TestMacAddress(strMacAddress) {
    if (/^([0-9a-fA-F]{2}-){5}[0-9a-fA-F]{2}$/.exec(strMacAddress)) {
        return true;
    }
    return false;
}

/**
 * 
 * @param {Array} array 
 * @param {any} item 
 * @returns {Array}
 */
export function insertBetween(array, item) {
    var result = [];
    array.forEach((v, i) => {
        if (i > 0) {
            result.push(item);
        }
        result.push(v);
    });
    return result;
};

/**
 * 
 * @param {string} value 
 * @returns {string}
 */
export function firstUppercase(value) {
    if (value === '') return '';
    var f = value[0];
    return f.toUpperCase() + value.substring(1);
}

/**
 * 
 * @param {string} value 
 * @returns {string}
 */
export function firstLowercase(value) {
    if (value === '') return '';
    var f = value[0];
    return f.toLowerCase() + value.substring(1);
}

/**
 *
 * @param {string} s
 * @returns {string}
 */
export function utf8Encode(s) {
    for (var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
        s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
    );
    return s.join("");
}

/**
 *
 * @param {string} s
 * @returns {string}
 */
export function utf8Decode(s) {
    for (var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
        ((a = s[i][c](0)) & 0x80) &&
        (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
            o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
    );
    return s.join("");
}

export function getFirstLettersToAvatar(name) {
    var matches = name.toUpperCase().match(/\b(\w)/g).slice(0, 2);
    return matches.join('');
}

/**
 *
 * @param {string} s
 * @returns {string}
 */
export function removerAcentos(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 *
 * @param {string} dateString
 * @returns {boolean}
 */
export function validateDate(dateString) {
    // First check for the pattern -- mm/dd/yyyy
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

/**
 * 
 * @param {string} url 
 * @returns {Record<string,string>}
 */
export function parseQueryString(url) {
    const queryString = url.slice(url.indexOf('?') + 1);
    const paramArr = queryString.split('&');
    const result = {};
    paramArr.map(param => {
        const [key, val] = param.split('=');
        result[key] = decodeURIComponent(val);
    })
    return result;
}

/**
 *
 * @param {string} base64Image
 * @returns {Blob}
 */

export function convertBase64ToBlob(base64Image) {
    // Split into two parts
    base64Image = "data:image/png;base64," + base64Image;
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
}

/**
 *
 * @param {Blob | File} data
 * @returns {string}
 */

export function blobFileToBase64(data) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(data);
    });
}