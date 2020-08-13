var crypto = require("crypto")
var moment = require('moment')

function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('');
}

function formatDateYYYY(date) {
	var d = new Date(date)
	return d.getFullYear()
}
function formatDateHH(date) {
	var d = new Date(date)
	return d.getHours()
}
function formatDateMM(date) {
	var d = new Date(date)
  var m = d.getMonth()+1
	return m 
}
function formatDateWW(d) {
  return moment(d).week()
}
function formatDateDOW(d) {
  return moment(d).day()
}


function uniqueID(){
   return crypto.randomBytes(16).toString("hex")
}
function uuid() {
   function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
   }
   return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
}

function getRandomArbitrary(min, max) {
   return Math.ceil(Math.random() * (max - min) + min);
}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
module.exports.asyncForEach = asyncForEach;
module.exports.uuid = uuid;
module.exports.uniqueID = uniqueID
module.exports.formatDate = formatDate
module.exports.formatDateHH = formatDateHH
module.exports.formatDateMM = formatDateMM
module.exports.formatDateYYYY = formatDateYYYY
module.exports.formatDateWW = formatDateWW
module.exports.formatDateDOW = formatDateDOW
