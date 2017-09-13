$(document).ready(init);
function init() {
	$("#btnNext").click(showCode);
}
function showCode(){
	if($("#telNumber").val()!=""){
		var random = numRandom(999,100);
		var getRandom = "LAB-"+ Math.floor(random)
		alert(getRandom);
		$("a").attr("href","signUp2.html");
		val = true;
	}
	return val	;
}
function numRandom(a,b){
	return Math.random()*((a-b)+b);
}
