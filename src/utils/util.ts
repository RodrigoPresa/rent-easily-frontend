export function TestCPF(strCPF: string) {
    var Soma = 0;
    var Resto = 0;
    strCPF = strCPF.replace(/(\.|-)/g, '');
    if (Number(strCPF) === 0 || Number(strCPF) === 99999999999) return false;
    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

export function getFirstLettersToAvatar(name: string) {
    if (name){
        var matches = name.toUpperCase().match(/\b(\w)/g) as string[];
        if (matches !== null) {
            matches = matches.slice(0, 2);
            return matches.join('');
        }
    }
}