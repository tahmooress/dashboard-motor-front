import jalali from 'jalaali-js';


export default class PersianDate{
    static _weekMap = ["یکشنبه", "دوشنبه" , "سه شنبه" , "چهارشنبه", "پنجشنبه" , "جمعه", "شنبه"]
    static _dayMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "۱۱", "۱۲", "۱۳", "۱۴", "۱۵", "۱۶", "۱۷", "۱۸", "۱۹", "۲۰", "۲۱", "۲۲", "۲۳", "۲۴", "۲۵", "۲۶", "۲۷", "۲۸", "۲۹", "۳۰", "۳۱"]
    static _monthMap = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
    static todayPersian(){
        let today = new Date();
        let w = today.getDay();
        let persian = today.toLocaleDateString('fa-IR');
        let d = this._dayMap.indexOf(persian.slice((persian.lastIndexOf("/") +1)));
        let m = persian.slice(persian.indexOf("/") + 1, persian.lastIndexOf("/"));
        let y = persian.slice(0, persian.indexOf("/"));
        let pMonth = numberPtoE(m)
        let pWeek = this._weekMap[w];
        let pYear = numberPtoE(y);
        return new this(pYear, pMonth, d,pWeek)
    }
    static createTotalMonth(persianFirstDay){
        let week = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه" , "پنجشنبه" , "جمعه"];
        let memo = week.indexOf(persianFirstDay.weekDay)
        let totalMonth = [];
        let index = week.indexOf(persianFirstDay.weekDay)
        let weeksCount;
        if ( (7 - index) >= (persianFirstDay.lastDay % 7)){
            weeksCount = 5
        }else{
            weeksCount = 6
        }
        let fd = persianFirstDay;
        for (let i = 0; i < weeksCount;i++ ){
            let w = [null, null, null ,null, null, null, null];
            w[week.indexOf(fd.weekDay)] = fd
            for (let j=week.indexOf(fd.weekDay) + 1; j < w.length; j++){
                w[j] = w[j - 1].inc()
            }
            totalMonth.push(w)
            fd = totalMonth[i][6].inc()
        }
        if(!totalMonth[0][memo -1]){
            let res = [...totalMonth[0]]
            console.log(totalMonth[0], "log", memo)
            for (let i= memo; i >= 0; i--){
                res[i -1] = res[i].dec();
            }
            totalMonth[0] = res;
        }
        return totalMonth
    }
    constructor(year, month, day, weekDay){
        this.year = year;
        this.month = month;
        this.day = day;
        this.weekDay = weekDay;
    }
    inc(){
        let index = (PersianDate._weekMap.indexOf(this.weekDay) + 1) % 7;
        let w = PersianDate._weekMap[index];
        console.log(index, w)
        if (this.day < this.lastDay){
            return new PersianDate(this.year, this.month, this.day + 1, w)
        }else if (this.day === this.lastDay){
            if(this.month < 12){
                return new PersianDate(this.year, this.month + 1, 1, w)
            }else if (this.month === 12){
                return new PersianDate(this.year + 1, 1, 1, w)
            }
        }
    }
    dec(){
        let i = PersianDate._weekMap.indexOf(this.weekDay);
        let index = (i >= 1 ) ? i-1 : 6;
        console.log(i, index)
        if (this.day > 1){
            return new PersianDate(this.year, this.month, this.day -1,PersianDate._weekMap[index])
        }else if (this.day === 1) {
            if(this.month > 1){
                let date = new PersianDate(this.year, this.month -1, null, PersianDate._weekMap[index]);
                date.day = date.lastDay;
                return date
            }else if (this.month === 1){
                let date = new PersianDate(this.year -1, 12, null, PersianDate._weekMap[index]);
                date.day = date.lastDay;
                return date
            }
        }
    }
    firstDayOfMounth(){
        if(this.day === 1){
            return this
        }else{
            let index = PersianDate._weekMap.indexOf(this.weekDay);
            let step = 7 - ((this.day % 7) - 1 )
            return new PersianDate(this.year, this.month, 1,PersianDate._weekMap[((index + step) % 7 )])
        }
    }
    lastDayOfMounth(){
        if(this.day === this.lastDay){
            return this
        }else{
            let index = PersianDate._weekMap.indexOf(this.weekDay);
            let step =  (this.lastDay - this.day) % 7;
            return new PersianDate(this.year, this.month, this.lastDay, PersianDate._weekMap[((index + step) % 7 )])
        }
    }
    get isLeap(){
        return jalali.isLeapJalaaliYear(this.year)
    }
    get lastDay(){
       let days = this.isLeap ? 30 : 29
       let mapData = [31, 31, 31, 31, 31, 31 ,30, 30, 30, 30, 30, days ];
       let index = this.month - 1;
       return mapData[index];
    }
    get monthName(){
        return PersianDate._monthMap[this.month -1]
    }
}

// numberPtoE is helper function to converts numbers from persian notation to english notaion
export function numberPtoE(s){
    let p = s.split("");
    let e = "";
    for (let i of p){
        e = e.concat(PersianDate._dayMap.indexOf(i))
    }
    return Number(e)
}
