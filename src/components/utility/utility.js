
// thousend seprator for numbers
export const seprator = (num) =>{
    if( typeof num === String){
        num = Number(num);
    }
    if((num / 1000) < 1){ 
        return num
    }else{
        let c = (num % 1000) === 0 ? "000" : num % 1000; 
        num = seprator(Math.floor(num / 1000)) + "," + c;
    }
    return num
}

// converting persian numbers to english digit
export const digitConvertor = (str) => {
    let paterns = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g ];
    let reference = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for(let i=0; i <10; i++){
       str = str.replace(paterns[i], reference[i])
    }
    return str
}