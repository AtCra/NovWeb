
export const fillZero=function(num){
	let str=num.toString();
	let toFill=13-str.length;
	console.log('1---'+str+'size='+str.length)
	if(str.length<13)
	{
		for(let i=0;i<toFill;i++){
			str='0'+str;
		}
	}
	console.log('2---'+str+'size='+str.length)
	
	return str;
}

export const formatTime=function(timeStamp){
	// console.log(timeStamp);
	let d=new Date(Number.parseInt(timeStamp))
	// console.log(d)
	let str=d.getFullYear()+'.'+d.getMonth()+'.'+d.getDay()+'-'+d.getHours()+':'+d.getMinutes();
	return str
}