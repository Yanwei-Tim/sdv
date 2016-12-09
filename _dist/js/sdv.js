(function(){
IX.ns("SDV.Util");

function convertTickToDate(tick){return new Date(tick *1);}
SDV.Util.formatDate = function(tick,isMS, type){
	if (!tick)
		return "";
	var millSeconds = "000"+convertTickToDate(tick).getMilliseconds();
	if(isMS)
		return IX.Date.format(convertTickToDate(tick)) + ":"+millSeconds.substring(millSeconds.length-3);
	else
		return IX.Date.format(convertTickToDate(tick), type);
};
var BIn = {
	"T" : 1024*1024*1024*1024,
	"G" : 1024*1024*1024,
	"M" : 1024*1024,
	"K" : 1024
};
SDV.Util.formatUnit = function(value, total){
	value= value*1;
	if(total){
		if(total/BIn.T>1){
			return Math.round(100*value/BIn.T)/100 + " TB";
		}else if(total/BIn.G>1){
			return Math.round(100*value/BIn.G)/100 + " GB";
		}else if(total/BIn.M>1){
			return Math.round(100*value/BIn.M)/100 + " MB";
		}else if(total/BIn.K>1){
			return Math.round(100*value/BIn.K)/100 + " KB";
		}else{
			return value + "B";
		}
	}else{
		if(value/BIn.T>1){
			return Math.round(100*value/BIn.T)/100 + " TB";
		}else if(value/BIn.G>1){
			return  Math.round(100*value/BIn.G)/100 + " GB";
		}else if(value/BIn.M>1){
			return  Math.round(100*value/BIn.M)/100 + " MB";
		}else if(value/BIn.K>1){
			return  Math.round(100*value/BIn.K)/100 + " KB";
		}else{
			return value + "B";
		}
	}
	//return (value.length > 5) ? ((value/1024).toFixed(4) + "T") : (value + "G");
};
function getBase(value){
	var base = 1;
	if(value>999){
		base = 1;
	}else if(value > 99){
		base = 10;
	}else{
		base = 100;
	}
	return base;
}
SDV.Util.formatFlow = function(flow){
	flow = flow *1;
	var base = 1;var unit = "";
	if(flow > 1024*1024*1024){
		flow = flow/1024/1024/1024;
		unit = "G";
	}else if(flow > 1024*1024){
		flow = flow/1024/1024;
		unit = "M";
	}else if(flow> 1024){
		flow = flow/1024;
		unit = "K";
	}
	base = getBase(flow);
	return Math.ceil(base*flow)/base + "<i>" + unit + "B/s</i>";
};
SDV.Util.formatPeroid = function(tick, type){
	var millSecInDay = 24 * 3600 *1000;
	var millSecInHour = 3600 * 1000;
	var millSecInMin = 60*1000;
	var millSecInSec = 1000;
	tick = tick*1;//convertTickToDate(tick);
	var day = tick > millSecInDay ? parseInt(tick/millSecInDay) : 0;
	var hour = parseInt((tick-day *millSecInDay)/millSecInHour);
	var min = parseInt((tick-day *millSecInDay-hour*millSecInHour)/millSecInMin);//(tick-day *millSecInDay)>millSecInHour ? parseInt((tick-day*millSecInDay-hour*millSecInHour)/millSecInMin) : 0;
	var sec=parseInt((tick-day*millSecInDay-hour*millSecInHour-min*millSecInMin)/millSecInSec);
	var millSec = parseInt(tick%millSecInSec);
	var strDay = day >0 ? day + "脤矛" : "";
	var strHour = hour >0 ? hour + "脨隆脢卤": day > 0 ? "0脨隆脢卤":"";
	var strMin = min >0 ? min+"路脰": (day >0 || hour >0) ?"0路脰": "";
	var strSec = sec > 0 ? sec+"脙毛" : (day >0 || hour >0 || min > 0) ?"0脙毛": "";
	var strMillSec = millSec + "潞脕脙毛";
	if(type === "hour"){
		return strDay + strHour;
	}else if(type === "time"){
		var strH = hour > 9 ? hour : "0" + hour;
		var strM = min > 9 ? min : "0" + min;
		var strS = sec > 9 ? sec : "0" + sec;
		return  strH + ":" + strM + ":" + strS;
	}else{
		return strDay + strHour + strMin + strSec + strMillSec;
	}
};

var CommonQueryInterval = 5000; // 5 seconds
SDV.Util.PeriodicChecker = function(checkFn, interval){
	var isStarted = false;
	var intv = interval || CommonQueryInterval;
	var timers = null;
	function _query(){
		function _imitationInterval(){
			timers = setTimeout(function(){
				if(isStarted) _query();
			}, intv);
		}
		checkFn(_imitationInterval);
	}
	return {
		start : function(){
			if (!isStarted) _query();
			isStarted = true;
		},
		stop : function(){
			isStarted = false;
			clearTimeout(timers);
		}
	};
};

})();
(function(){

/** def : {
	name : ""	
	title : ""
  }
 */
function isInArray(arr, val){
	var str = "," + arr.join(",") + ",";
	return str.indexOf(","+val+",") !==-1;
}
function distinct(arr){
	var ret = [], obj={}, len = arr.length;
	for(var i=0; i<len; i++){
		var val = arr[i];
		if(!obj[val]){
			obj[val] = 1;
			ret.push(val);
		}
	}
	return ret;
}
function ColumnModelBase(def){
	var name = $XP(def, "name"), title = $XP(def, "title", name), isLongStr = $XP(def, "isLongStr"), isSort = $XP(def, "isSort"),
	ifDown = $XP(def, "ifDown");
	return {
		getTitleTpldata : function(){ return {
			html : IX.encodeTXT(title),
			name : name,
			hideClz : isSort ? ifDown ? "up" : "" : "hide",
			sortClz : "up"
		};},
		getCellTpldata : function(item, liHieght){return {
			name : name,
			height : liHieght,
			html : IX.encodeTXT($XP(item, name, "")),
			value : IX.encodeTXT($XP(item, name, "")),
			title : isLongStr ? IX.encodeTXT($XP(item, name, "")) : "",
			longClz : isLongStr ? "longName" : ""

		};}
	};
}

function RowModelBase(rowData, colModels,actions,moreActions, ifactionsEnable){
	var id = rowData.id;
	var tasks = rowData.tasks;
	var liHieght = 34;
	if(IX.isArray(tasks)){
		liHieght = liHieght * tasks.length;
	}
	var tmpActions = jQuery.extend(true, [], actions);
	if(IX.isFn(ifactionsEnable)){
		var obj = ifactionsEnable(rowData);
		if(obj)
			IX.map(tmpActions, function(item){
				if(item.length > 3){
					if(item[0] === "poweron" && obj.poweron) item.pop();
					if(item[0] === "poweroff" && obj.poweroff) item.pop();
					if(item[0] === "restart" && obj.restart) item.pop();
					if(item[0] === "edit" && obj.edit) item.pop();
					if(item[0] === "startup" && obj.startup) item.pop();
					if(item[0] === "shutdown" && obj.shutdown) item.pop();
					if(item[0] === "delete" && obj.delete) item.pop();
					if(item[0] === "distance" && obj.distance) item.pop();
					if((item[0] === "upload" || item[0] === "download") && obj.isNeedAuth) item.pop();
				}
			});
	}
	if($XP(rowData, "isBase")){
		IX.map(tmpActions, function(item){
			if(item[0] === "edit") item.push("disable");
			if(item[0] === "delete") item.push("disable");

		});
	}
	function getCellsTpldata(liHieght){
		return IX.map(colModels, function(colModel){
			return colModel.getCellTpldata(rowData, liHieght);
		});
	}
	function getActionsTpldata(){
		return IX.loop(tmpActions,[],function(acc,item){
			acc.push({
				name : item[0],
				title : item[1],
				html : "",
				disableClz : item.length > 3 ? item[3] : ""
			});
			return acc;
		});
	}

	var tpldata = {
		id : id,
		clz : "",
		actionClz : actions.length >0 ? "" : "hide",
		cells : getCellsTpldata(liHieght),
		actions : getActionsTpldata()//[{name:"delete", html:""},{name:"poweron", html:""},] //TODO:
	};
	return {
		getId : function(){return id;},
		get : function(attrName){return $XP(rowData, attrName);},
		refresh : function(_rowData){
			rowData = _rowData;
			tpldata.cells = getCellsTpldata();
		},
		getTpldata : function(){return tpldata;}
	};
}

var columnModelHT = {};
IX.ns("IXW.Lib");
/** cfg : {
	pageSize : 20, 

	rowModel : function(rowData, colModels)// default is RowModelBase
	columns : [name], 
	actions  : [["name", function(rowModel, rowEl){}], ...]
	dataLoader : function(params, cbFn)
	}
 */
IXW.Lib.GridModel = function(id, cfg){
	var clz =  $XP(cfg, "clz", "");
	var pageSize = $XP(cfg, "pageSize", 20);
	var RowModel = $XP(cfg, "rowModel", RowModelBase);
	var dataLoader = $XF(cfg, "dataLoader");
	var colModels = IX.map($XP(cfg, "columns", []), function(colName){
		return (colName in columnModelHT)?(new columnModelHT[colName]()): null;
	});
	var actions = $XP(cfg, "actions", []);
	var ifactionsEnable = $XF(cfg, "ifactionsEnable");
	var moreActions = $XP(cfg,"moreActions",[]);
	var selectedItmes = [];
	var selectedIds =[];
	var liHieght = 34;

	var tpldata = {
		clz : clz,
		id : id,
		header : IX.map(colModels, function(m){
			return m.getTitleTpldata();}),
		actionClz : actions.length >0 ? "" : "hide",
		rows : []
	};
	var dataModel = new IX.IPagedManager(function(item){
		var selectedCells = jQuery("#" + id).find(".row .selected");
		/*跨页选择*/
		/*var curSelectedIds =  IX.map(selectedCells, function(el){
			var _el = $XH.ancestor(el, "row");
			return _el.id;
		});
		selectedIds =[];
		for(var i=0; i< selectedItmes.length; i++){
			selectedIds = selectedIds.concat(selectedItmes[i].value);
		}
		selectedIds = distinct(selectedIds.concat(curSelectedIds));*/
		selectedIds =  IX.map(selectedCells, function(el){
			var _el = $XH.ancestor(el, "row");
			return _el.id;
		});
		if (isInArray(selectedIds, item.id)){
			item.ischecked = 'selected';
		}else{
			item.ischecked = '';
		}
		return new RowModel(item, colModels,actions,moreActions, ifactionsEnable);
	}, null, dataLoader);

	function _load(pageNo, cbFn,refreshFn){
		dataModel.load(pageNo, pageSize, function(rowModels){
			tpldata.rows = IX.map(rowModels, function(row){
				return row.getTpldata();
			});
			cbFn(rowModels, refreshFn);
		});
	}
	return {
		getDataModel : function(){return dataModel;},
		getTpldata : function(){return tpldata;},
		getPageCount : function(){
			return Math.ceil(dataModel.getTotal()/pageSize);
		},
		resetPage : function(_pageNo, _pageSize, cbFn){
			//var idx = Math.floor(pageSize *  _pageNo/_pageSize);
			pageSize = _pageSize;
			//_load(idx, cbFn);
			_load(_pageNo, cbFn);
		},
		load : function(pageNo, cbFn, refreshFn){_load(pageNo, cbFn, refreshFn);},
		getRow : function(rowId){return dataModel.get(rowId);},
		getFirst : function(){return dataModel.getFirst();},
		setSelectedItems : function(value){selectedItmes = value;},
		getSelectedItems : function(){return selectedItmes;},
		getSelectedIds : function(){ return selectedIds;},
		addItems : function(data){
			dataModel.addItems($XP(data, "ids", []));
		},
		removeItems : function(data){
			dataModel.removeItems($XP(data, "ids",[]));
		}
	};
};
IXW.Lib.GridModel.RowModelBase = RowModelBase;
IXW.Lib.GridModel.ColumnModelBase = ColumnModelBase;
IXW.Lib.GridModel.registerColumnModel = function(name, modelClz){
	columnModelHT[name] = modelClz;
};

})();
(function(){
var GridModel = IXW.Lib.GridModel;
var ColumnModelBase = GridModel.ColumnModelBase;
var registerColumnModel= GridModel.registerColumnModel;

var formatDate = SDV.Util.formatDate;
var formatPeroid = SDV.Util.formatPeroid;
var formatFlow = SDV.Util.formatFlow;

var AllocatHTML= '<span class="rate">{allocated}/{total}</span><span class="allocatbg"><div class="silderbar {clz}" style = "width:{width}"></div><div class="rates"></div></span><span class="percent">{rate}%</span>';
var ProcessHTML= '<span class="allocatbg"><div class="silderbar {clz}" style = "width:{width}"></div><div class="rates"></div></span><span class="percent">{rate}%</span>';
var BInTB = 1024*1024*1024*1024;
var MBInGB = 1024;
function formatMem(memNum){
	memNum = memNum/MBInGB;
	var base = 1;
	if(Math.round(memNum) > 99){
		base = 0;
	}else if(Math.round(memNum) > 9){
		base = 1;
	}else{
		base = 2;
	}
	return memNum.toFixed(base);
}
function getAllcationCellTplData(name, item, isSort){
	var html = "";
	var percent = null, total, used,rate;
	if(name === "cpu"){
		total = $XP(item[name], "total", 0);
		used = $XP(item[name], "used", 0);
		rate = total === 0?0:Math.round((100 * used / total));
	}else{
		total = $XP(item[name], "total", 0);
		used = Math.round($XP(item[name], "used", 0)*100)/100;
		rate = total === 0?0:Math.round((100 * used / total));
	}
	if(name==="cpu" && !isSort){
		html = ProcessHTML.replaceByParams({
			rateClz : rate>90 ? "higher" : rate > 70 ? "high" : "",
			clz : rate>90 ? "higher" : rate > 70 ? "high" : "",
			width : rate + "%",
			rate : rate
		});
	}else{
		html = AllocatHTML.replaceByParams({
			rateClz : rate>90 ? "higher" : rate > 70 ? "high" : "",
			clz : rate>90 ? "higher" : rate > 70 ? "high" : "",
			width : rate + "%",
			allocated : used,
			total : total,
			rate : rate
		});
	}
	return{
		name: name,
	    html : html,
	    value : used,
	    title : "",
		longClz : ""
	};
}
function getAllocationColumn(name, title, isSort){
	var column = new ColumnModelBase({name : name, title : title, isSort : isSort});
	column.getCellTpldata = function(item){return getAllcationCellTplData(name, item, isSort);};
	return column;
}
function getCPUPercent(percent){
	return ProcessHTML.replaceByParams({
				rateClz : percent>90 ? "higher" : percent > 70 ? "high" : "",
				clz : percent>90 ? "higher" : percent > 70 ? "high" : "",
				width : percent + "%",
				rate : percent
			});
}
function getCPUColumn(name, title){
	var column = new ColumnModelBase({name : name, title : title});
	column.getCellTpldata = function(item){
		var cpuInfo = $XP(item, "cpu", {});
		var total = $XP(cpuInfo, "total",0);
		var usable = $XP(cpuInfo, "usable",0);
		var used = $XP(cpuInfo, "used", 0);
		var percent = $XP(cpuInfo, "percent", 0);
		var percentHTML = getCPUPercent(percent);
		var html = "<span class='cpuInfo'><span class='cpuDetail'>"+used+"/"+usable+"/"+total +"</span><div class='cputip hide'><em></em><span><span class='text'>已使用：</span>"+used+
		"</span><span><span class='text'>可用：</span>"+usable+"</span><span><span class='text'>总量：</span>"+total+"</span></div></span><span>使用率: "+percentHTML+"</span>";
		return {
			name : name,
			html : html,
			value : "",
			title : "",
			longClz : ""
		};
	};
	return column;
}
var AllStatus = {
	service : {
		0 : {
			text : "初始化...",
			clz : "middleState"
		},
		1 : {
			text : "开启中...",
			clz : "middleState"
		},
		2 : {
			text : "运行",
			clz : "runState"
		},
		3 : {
			text : "停止中...",
			clz : "middleState"
		},
		4 : {
			text : "已停止",
			clz : "stopState"
		},
		5 : {
			text : "故障",
			clz : "faultState"
		},
		6 : {
			text : "备份中...",
			clz : "middleState"
		},
		7 : {
			text : "恢复中...",
			clz : "middleState"
		},
		8 : {
			text : "重启中...",
			clz : "middleState"
		},
		9 : {
			text : "删除中...",
			clz : "middleState"
		}
	},
	backup : {
		0 :{
			text : "备份中...",
			clz : "middleState"
		},
		1 : {
			text : "备份成功",
			clz : "runState"
		},
		2 : {
			text : "备份失败",
			clz : "stopState"
		}
	},
	server : {
		0 : {
			text : "运行",
			clz : "runState"
		},
		1 : {
			text : "关机",
			clz : "stopState"
		},
		2 : {
			text : "开启中...",
			clz : "middleState"
		},
		3 : {
			text : "关机中...",
			clz : "middleState"
		},
		4 : {
			text : "故障",
			clz : "faultState"
		}
	}
};
function getStatusColumn(type,columnName, title){
	var Status = AllStatus[type];
	var column = new ColumnModelBase({name : "status", title : title});
	var loaderHTML =  new IX.ITemplate({tpl : ['<img src="{loader}">']}).renderData("", {loader : SDV.Global.loader});
	column.getCellTpldata = function(item){
		var status = $XP(item, columnName, "");
		var clz = Status[status].clz;
		var loader = clz === 'middleState' ? loaderHTML: '';
		return{
			name : "status",
			html :  loader + '<span class="' + clz + '">' + Status[status].text + '</span>',
			value : status,
			title : "",
			longClz : ""
		};
	};
	return column;
}
function getFlowColumn(type, title){
	var column = new ColumnModelBase({name : type, title : title, isSort : false});
	column.getCellTpldata = function(item){
		var flow = $XP(item, type, {});
		var up = formatFlow($XP(flow,"up", 0)); //KB/s
		var down = formatFlow($XP(flow, "down", 0));
		return {
			name : type,
			html :"<div class='flowSpeed first'><span class='pic-up'></span>"+up +"</div><div class='flowSpeed'><span class='pic-down'></span>"+ down + "</div>",
			title : "",
			longClz : "longName"
		};
	};
	return column;
}

function getTimeColumn(name, title, isMS, isSort){//是否精确到毫秒，否，则精确到秒
	var column = new ColumnModelBase({name : name, title : title, isSort : isSort});
	column.getCellTpldata = function(item){
		var value = formatDate(IX.encodeTXT($XP(item, name, "")), isMS);
		return {
			name : name,
			html : value,
			value : value,
			title : "",
			longClz : ""
		};
	};
	return column;
}
function getPeriod(name, title, type, isSort){
	var column = new ColumnModelBase({name : name, title : title, isSort : isSort});
	column.getCellTpldata = function(item){
		var value = formatPeroid(IX.encodeTXT($XP(item, name)), type);
		return {
			name : name,
			html : value,
			value : value,
			title : "",
			longClz : "longName"
		};
	};
	return column;
}
function getProcess(value){
	return ProcessHTML.replaceByParams({
		rateClz : value>90 ? "higher" : value > 70 ? "high" : "",
		clz : value>90 ? "higher" : value > 70 ? "high" : "",
		width : value + "%",
		rate : value
	});
}


IX.iterate([
["_checkbox", function(){return {
		getTitleTpldata : function(){ return {
			html :"<a data-href='$ixw.grid.col' data-key='_check'><span class='checkbox'></span></a>",
			name : "_check",
			hideClz : "hide",
			sortClz : "invisible"
		};},
		getCellTpldata : function(item){
		 return {
			name : "_check",
			html : "<span class='checkbox "+$XP(item, "ischecked", "")+"'></span>",
			value : "",
			title : "",
			longClz : ""
		};}
};}],
["_no", "序号"],
["serviceName", {name : "name", title : "服务名称", isLongStr : true}],
["product", {name : "product", title : "所属产品", isLongStr : true}],
["version","产品版本"],
["ip", {name : "ip", title : "IP地址",isLongStr : true}],
["cpuUsage", function(){
	return getAllocationColumn("cpu", "CPU使用率(核)");
}],
["memUsage", function(){
	return getAllocationColumn("mem", "内存使用率(GB)");
}],
["diskUsage", function(){
	return getAllocationColumn("disk", "硬盘使用率(GB)");
}],
["flow", function(){
	return getFlowColumn("flow", "网络流量");
}],
["serviceStatus", function(){
	return getStatusColumn("service","status", "状态");
}],
["bkService", {name : "bkService", title : "备份服务", isLongStr : true}],
["bkIP","备份服务IP"],
["backupTime", {name : "backupTime", title : "备份时间", isSort : true, ifDown : true}],
["cycle", function(){
	var column = new ColumnModelBase({name : "cycle", title : "备份周期", isSort : true});
	column.getCellTpldata = function(item){
		return {
			name : "cycle",
			html : $XP(item, "cycle") + "天",
			value : "",
			title : "",
			longClz : ""
		};
	};
	return column;
}],
["recoveryTime", {name : "recoveryTime", title : "最后恢复时间", isSort : true}],
["recoveryService", function(){
	var column = new ColumnModelBase({name : "recoveryService", title : "最后恢复服务IP"});
	column.getCellTpldata = function(item){
		var value;
		var rs = $XP(item, "recoveryService");
		var id = $XP(rs, "id");
		if(id ===-1){
			value = "本机";
		}else{
			value = $XP(rs, "ip");
		}
		return {
			name : "recoveryService",
			html : value,
			value : value,
			title : value,
			longClz : "longName"
		};
	};
	return column;
}],
["comment",{name : "comment", title : "备注", isLongStr : true}],
["bkStatus", function(){
	return getStatusColumn("backup","status", "状态");
}],
["productName", {name : "name", title : "产品名称", isLongStr : true}],
["serviceAttr", "业务属性"],
["occupyCpu", "占用CPU(核)"],
["virtualCpu", "虚拟CPU(核)"],
["occupyMem", "占用内存(GB)"],
["occupyDisk", "占用硬盘(GB)"],

["servIp", {name : "ip", title : "服务器IP"}],
["allocatedCpu", function(){
	return getAllocationColumn("cpu", "CPU分配率(核)", true);
}],
["allocatedMem", function(){
	return getAllocationColumn("mem", "内存分配率(GB)", true);
}],
["allocatedDisk", function(){
	return getAllocationColumn("disk", "硬盘分配率(TB)", true);
}],
["serverStatus", function(){
	return getStatusColumn("server","status", "状态");
}],
["alarmType", {name : "type", title : "报警种类", isLongStr : true}],
["alarmDetail", {name : "detail", title : "报警详情", isLongStr : true}],
["alarmStatus", function(){
	var statusHT = {
		0 : "未处理",
		1 : "已处理"
	};
	var column  = new ColumnModelBase({name : "status", title : "状态"});
	column.getCellTpldata = function(item){
		var value = statusHT[$XP(item, "status", "")];
		return {
			name : "status",
			html : value,
			value : value,
			title : value,
			longClz : "longName"
		};
	};
	return column;
}],
["alarmDate", {name : "date", title : "报警时间"}],
["msgType", {name : "type", title : "消息类型", isLongStr : true}],
["msgDetail", {name : "detail", title : "消息详情", isLongStr : true}],
["msgDate", function(){
	return getTimeColumn("date", "消息时间", false);
}],
["optDetail", {name : "detail", title : "操作详情", isLongStr : true}],
["optDate", {name : "date", title : "操作时间"}]
], function(col){
	var name = col[0], fn = col[1];
	registerColumnModel(name, IX.isFn(fn)?fn : function(){
		return new ColumnModelBase(IX.isString(fn)?{name : name, title : fn} : fn);
	});
});
})();
(function () {
var globalActionConfig = IXW.Actions.configActions;
var instHT = {};
function getInst(el){
	var  gridEl = $XH.ancestor(el, "ixw-grid");
	if (!gridEl)return null;
	return instHT[gridEl.id];
}

globalActionConfig([["ixw.grid.col", function(params, el){
	var inst = getInst(el);
	if (!inst) return;
	inst.colAction(params.key, el);
}], ["ixw.grid.cell", function(params, el){
	var inst = getInst(el);
	var ulEl = $XH.ancestor(el, "row");
	if (!inst || !ulEl) return;
	inst.cellAction(ulEl.id, params.key, el);
}], ["ixw.grid.action", function(params, el){
	var inst = getInst(el);
	var ulEl = $XH.ancestor(el, "row");
	if (!inst || !ulEl || $XH.hasClass(el,"disable")) return;
	inst.rowAction(ulEl.id, params.key, ulEl);
}]]);


var t_grid = new IX.ITemplate({tpl: [
	'<div id="{id}" class="ixw-grid {clz}">',
		'<ul class="hdr">','<tpl id="header">',
			'<li class="col-{name}">',
				'<span>{html}</span>',
				'<a data-href="$ixw.grid.col" data-key="{name}">',
					'<span class="pic- {hideClz}"></span>',
				'</a>',
			'</li>',
		'</tpl>',
		'<li class="col-actions {actionClz}">',
			'<span>操作</span>',
			'<a data-href="$ixw.grid.col" data-key="actions">',
				'<span class="pic- hide"></span>',
			'</a>',
		'</li>',
		'</ul>',
		'<div class="body" id="itemList">','<tpl id="rows">',
			'<ul id="{id}" class="row {clz}">','<tpl id="cells">',
				'<li class="col-{name}" style="height : {height}px; line-height:{height}px;">',
					'<a class="cell {longClz}" data-href="$ixw.grid.cell" data-key="{name}" data-value="{value}" title = "{title}">{html}</a>',
				'</li>',
			'</tpl>',
				'<li class="col-actions invisible {actionClz}">',
					'<tpl id="actions">',
					'<a class="act-{name} {disableClz}" data-href="$ixw.grid.action" data-key="{name}" title="{title}">{html}</a>',
				'</tpl>','</li>',
			'</ul>',
		'</tpl>','</div>',
	'</div>',
'']});


IX.ns("IXW.Lib");
/** cfg : {
	container : //required if use show function
	id,		// optional

	pageSize : 20,  // optional
	rowModel : function(rowData, colModels)// default is RowModelBase

	columns : [name],
	actions  : [[name, function(rowModel, rowEl){}], ...
	dataLoader :function(params, cbFn)
	}
 */
IXW.Lib.Grid = function(cfg){
	var container = $XP(cfg,  "container");
	var id = cfg.id || IX.id();
	var actionHT = IX.loop(($XP(cfg, "actions", []).concat($XP(cfg, "moreActions",[]))), {}, function(acc, act){
		acc[act[0]] = act[2];
		return acc;
	});
	var model = new IXW.Lib.GridModel(id, cfg);

	function _show(){
		var el = $X(container);
		if(!el) return;
		el.innerHTML = t_grid.renderData("", model.getTpldata());
	}
	function _refresh(onlyData, applyHover){
		var bodyEl = $XH.first($X(id), "body");
		if (!bodyEl || onlyData) return;
		var tpldata = model.getTpldata();
		jQuery($X(bodyEl)).find(".row").unbind("mouseenter").unbind("mouseleave");
		jQuery($X(bodyEl)).find(".cpuInfo").unbind("mouseenter").unbind("mouseleave");
		bodyEl.innerHTML = IX.map(tpldata.rows, function(rowData){
			return t_grid.renderData("rows", rowData);
		}).join("");
		if(IX.isFn(applyHover)) applyHover();
	}
	var self = {
		getHTML : function(){
			return t_grid.renderData("", model.getTpldata());
		},
		getId : function(){return id;},
		getModel : function(){return model;},
		show :function(){model.load(0, _show);},
		refresh : function(onlyData, applyHover){_refresh(onlyData, applyHover);},
		colAction : function(name, colEl){
			// to be overrided;
		},
		cellAction : function(rowId, name, cellEl){
			// to be overrided;
		},
		rowAction : function(rowId, actionName, rowEl){
			actionHT[actionName](model.getRow(rowId), rowEl);
		}
	};
	instHT[id] = self;
	return self;
};
})();
(function(){
IX.ns("SDV.UILib");

var UploadClz = null;
function _init(){
	if (UploadClz)
		return;
	UploadClz = IXW.Lib.FileUploader;
	if (!SDV.Global.fileUploadUrl)
		return alert("没有配置上传路径，文件无法上传");
	UploadClz.init(SDV.Global.fileUploadUrl);
}

/**  
 * id :  dom btn ID, // required
 */
SDV.UILib.FileUploadBtn= function(id, afterLoaded, url, disabelAddbtnFn,failFn){
	_init();
	var fileUploader = null, ifUploading = false;
	function onchangeFn(fileEl){
		var file = (fileEl && "files" in fileEl) ? fileEl.files[0] : null;
		var name = "";
		if(file !== null){
			name = file.name;
		}else{
			name = fileEl.value;
		}
		if(name.indexOf(".") >-1){
			name = name.split(".");
			var len = name.length;
			name = name[len-1];
		}

		if(fileEl && name !=="json")
			return alert("这里只能上传后缀名为json的文件，请重新选择符合条件的文件后重新上传。");
		ifUploading = true;
		if(IX.isFn(disabelAddbtnFn)) disabelAddbtnFn();
		fileUploader.submit(function(data){
			switch(data.retCode){
				case 0 :
					return SDV.Dialog.alert(data.err);
				case -1 :
					SDV.Env.clearSession();
					break;
				default:
					ifUploading = false;
					afterLoaded(data);
			}
		});
	}
	var cfg = {
		trigger : id,
		onchange : onchangeFn
	};
	if (IX.isString(url))
		cfg.fileUploadURL = url;
	fileUploader = new UploadClz(cfg);

	return {
		ifUploading : function(){return ifUploading;}
	};
};
})();
(function () {var t_okcancel = new IX.ITemplate({tpl: [
	'<a class="btn okbtn">确定</a>',
	'<a class="btn cancelbtn">取消</a>',
'']});
var t_editbtns = new IX.ITemplate({tpl: [
	'<a class="btn okbtn">编辑</a>',
	'<a class="btn cancelbtn">关闭</a>',
'']});
var t_alertbtns = new IX.ITemplate({tpl: [
	'<a class="btn confirmbtn">确定</a>',
'']});
var t_confirmAlertbtns = new IX.ITemplate({tpl: [
	'<a class="btn okbtn">是</a>',
	'<a class="btn cancelbtn">否</a>',
'']});
var t_commonDialog = new IX.ITemplate({tpl: [
	'<div class="title">{title}</div>',
	'<div class="area {clz}">{content}</div>',
	'<div class="btns">{btns}</div>',
'']});

var dialog = null, dialogAlert = null;
var dialogCfg = null, dialogCfgAlert = null; // {content(), btns(), okFn(fn), bindOn()}

var okcancelHTML = t_okcancel.renderData("", {});
var editbtnsHTML = t_editbtns.renderData("", {});
var alertbtnsHTML = t_alertbtns.renderData();
var confirmAlertbtnsHTML = t_confirmAlertbtns.renderData();
var globalActionConfig = IXW.Actions.configActions;
function prevent(e){
	IX.Util.Event.preventDefault(e);
}
function clickOnBtn(e){
	var btnEl = $XH.ancestor(e.target, "btn");
	if (!btnEl) return;
	if ($XH.hasClass(btnEl, "cancelbtn")){
		IX.unbind(document.body, {
			mousewheel : prevent
		});
		return dialog.hide();
	}
	if ($XH.hasClass(btnEl, "confirmbtn")){
		IX.unbind(document.body, {
			mousewheel : prevent
		});
		return dialog.hide();
	}
	if($XH.hasClass(btnEl, "disable"))
		return;
	if($XH.hasClass(btnEl, "exportbtn")){
		var exportFn = $XF(dialogCfg, "exportFn");
		exportFn();
		return;
	}
	var okFn = $XF(dialogCfg, "okFn");
	okFn(function(){
		IX.unbind(document.body, {
			mousewheel : prevent
		});
		dialog.hide();
	}, function(){
		$XH.addClass(btnEl, "disable");
	});
}
function clickOnBtn4Alert(e){
	var btnEl = $XH.ancestor(e.target, "btn");
	if (!btnEl) return;
	if ($XH.hasClass(btnEl, "cancelbtn")){
		var cancelFn = $XF(dialogCfgAlert, "cancelFn");
		dialogAlert.hide();
		cancelFn();
		return;
	}
	var okFn = $XF(dialogCfgAlert, "okFn");
	okFn(function(){dialogAlert.hide();});
}

function dialogBodyRefresh(bodyEl){
	var content = dialogCfg.content;
	if (IX.isFn(content))
		content =content();
	var btns = dialogCfg.btns;
	if (IX.isEmpty(btns))
		btns = okcancelHTML;
	else if(IX.isFn(btns))
		btns = btns();

	bodyEl.className = "ixw-body " + dialogCfg.clz;
	bodyEl.innerHTML = t_commonDialog.renderData("", {
		title : dialogCfg.title,
		content : content,
		btns : btns
	});
	IX.bind($XH.first(bodyEl, "btns"), {
		click : clickOnBtn
	});
	var bindOn = $XF(dialogCfg, "bindOn");
	bindOn($XH.first(bodyEl, "area"));
}
function dialogBodyRefresh4Alert(bodyEl){
	var content = dialogCfgAlert.content;
	if (IX.isFn(content))
		content =content();
	var btns = dialogCfgAlert.btns;
	if (IX.isEmpty(btns))
		btns = okcancelHTML;
	else if(IX.isFn(btns))
		btns = btns();

	bodyEl.className = "ixw-body " + dialogCfgAlert.clz;
	bodyEl.innerHTML = t_commonDialog.renderData("", {
		title : "提示",
		content : content,
		btns : btns
	});
	IX.bind($XH.first(bodyEl, "btns"), {
		click : clickOnBtn4Alert
	});
	var bindOn = $XF(dialogCfgAlert, "bindOn");
	bindOn($XH.first(bodyEl, "area"));
}
/** cfg :{
	dialogClz
	content,
	btns,
	okFn,
	bindOn
 * }
 */
function showDialog(cfg){
	var dialogBodyRefreshFn = dialogBodyRefresh;
	if(IX.isFn($XP(cfg, "dialogBodyRefresh"))) dialogBodyRefreshFn = $XF(cfg, "dialogBodyRefresh");
	//if (!dialog){
		dialog = new IXW.Lib.ModalDialog({
			id : "nv-dialog",
			autofit : $XP(cfg, "autofit", true),
			bodyRefresh : dialogBodyRefreshFn
		});
	//}
	dialogCfg = cfg;
	dialog.show();
}
function showDialogAlert(cfg){
	if (!dialogAlert)
		dialogAlert = new IXW.Lib.ModalDialog({
			id : "nv-dialogAlert",
			bodyRefresh : dialogBodyRefresh4Alert
		});
	dialogCfgAlert = cfg;
	dialogAlert.show();
}
IX.ns("SDV.Dialog");
SDV.Dialog.show = showDialog;
SDV.Dialog.hide = function(){if (dialog)dialog.hide();};

var t_confirm = new IX.ITemplate({tpl: [
	'<div class="msg">{msg}</div>',
'']});
var t_alert = new IX.ITemplate({tpl: [
	'<div class="msg">{msg}</div>',
'']});
var t_alertMulti = new IX.ITemplate({tpl: [
	'<div class="briefInfo active"><span>成功{success}个,</span><span>失败{fail}个</span></div>',
	'<div class="msg">{msg}</div>',
	'<div class="active"><a class="btn btnMulti" data-href="$alertMulti.click" data-key="detail">查看详情</a></div>',
'']});
var t_postComment = new IX.ITemplate({tpl: [
	'<div class="title">备注</div>',
	'<div class="area"><div><textarea id="commentArea"></textarea></div></div>',
'']});

SDV.Dialog.confirm = function(title, msg, okFn){showDialog({
	title : IX.encodeTXT(title),
	clz : "confirmDialog",
	content : function(){
		return t_confirm.renderData("", {msg: IX.encodeTXT(msg)});
	},
	okFn : function(cbFn, btndisableFn){
		if(IX.isFn(btndisableFn)) btndisableFn();
		okFn(cbFn);
	}
});};
SDV.Dialog.confirmAlert = function(title, msg, okFn, cancelFn){showDialogAlert({
	title : IX.encodeTXT(title),
	clz : "confirmDialog",
	content : function(){
		return t_confirm.renderData("", {msg: IX.encodeTXT(msg)});
	},
	btns : confirmAlertbtnsHTML,
	okFn : function(cbFn){
		cbFn();
		okFn();
	},
	cancelFn : cancelFn
});};
SDV.Dialog.alert = function(msg, cbFn){showDialogAlert({
	clz : "alertDialog",
	content : function(){
		return t_alert.renderData("", {msg: msg ?msg.replaceAll("\n", "<br>") : ""});
	},
	btns : alertbtnsHTML,
	okFn : function(hidecbFn){
		hidecbFn();
		if(IX.isFn(cbFn)) cbFn();
	}
});};
SDV.Dialog.alertMulti = function(info, msg){
	showDialogAlert({
		clz : "alertMultiDialog",
		content : function(){
			return t_alertMulti.renderData("", IX.inherit(info, {msg: msg ?msg.replaceAll("\n", "<br>") : ""}));
		},
		btns : alertbtnsHTML,
		okFn : function(hidecbFn){
			hidecbFn();
		}
	});
};
function resizeBodyEl(){
	var bodyEl = jQuery("#nv-dialogAlert .ixw-body")[0];
	var posY = ($Xw.getScreen().size[1]- bodyEl.offsetHeight)/2;
	posY = posY > 300? (posY-100): Math.max(posY, 0);
	bodyEl.style.marginTop = (0- bodyEl.offsetHeight- posY) + "px";
}
globalActionConfig([["alertMulti.click", function(params, el){
	var key = params.key;
	if(key === "detail"){
		jQuery("#nv-dialogAlert .briefInfo").removeClass("active");
		jQuery("#nv-dialogAlert .msg").addClass("active");
		el.innerHTML = "收起详情";
		$XD.setDataAttr(el, "key", "brief");
		resizeBodyEl();
	}else if(key === "brief"){
		jQuery("#nv-dialogAlert .briefInfo").addClass("active");
		jQuery("#nv-dialogAlert .msg").removeClass("active");
		el.innerHTML = "查看详情";
		$XD.setDataAttr(el, "key", "detail");
		resizeBodyEl();
	}
}]]);
var postCommentHTML = t_postComment.renderData("", {});
function _tryPostComment(okFn, cbFn){
	var comment = $X('commentArea').value;
	// if(IX.isEmpty(comment)){
	// 	alert("请输入备注信息！");
	// 	return;
	// }
	okFn(comment);
	cbFn();
}
SDV.Dialog.postComment = function (okFn){showDialog({
	clz : "commentDialog",
	content : postCommentHTML,

	okFn : function(cbFn){_tryPostComment(okFn, cbFn);}
});};
})();
(function () {var t_dropdownBox = new IX.ITemplate({tpl: [
	'<span class="dropdown" data-type="{type}">',
		'<input type="hidden" id="{id}" class="{inputClz}" type="text" value="{key}">',
		'<button type="button" class="dropdown-toggle" data-toggle="dropdown">',
			'<span class="value">{value}</span>',
			'<span class="drop-pic"></span>',
		'</button>',
		'<ul class="dropdown-menu {clz}">','<tpl id="availRsrcs">',
			'<li class="dropdown-item" title="{title}"><a data-href="${action}" data-type="{type}" data-key="{key}">{html}</a></li>',
		'</tpl>','</ul>',
	'</span>',
'']});
var t_pageDpBox = new IX.ITemplate({tpl: [
	'<span class="dropdown pageDp" data-type="{type}">',
		'<input type="hidden" id="{id}" class="{inputClz}" type="text" value="{key}">',
		'<button type="button" class="dropdown-toggle" data-toggle="dropdown">',
			'<span class="value">{value}</span>',
			'<span class="drop">选择</span>',
		'</button>',
		'<tpl id="ulItems">','<ul class="dropdown-menu {clz}" data-key="{key}">','<tpl id="availRsrcs">',
			'<li class="dropdown-item" title="{title}"><a data-href="$dropdownBox.chose" data-type="{type}" data-key="{key}">{html}</a></li>',
		'</tpl>','</ul>','</tpl>','<div class="dp-footer">{paginHTML}</div>',
	'</span>',
'']});

function isInputNull(el, dropdownEl){
	var value = el.value;
	$XH[value ? "removeClass" : "addClass"](dropdownEl, "requiredMark");
	return value;
}
function bindonDropdown(el){
	var dropdownEl = $XH.first($XH.ancestor(el, "dropdown"), "dropdown-toggle");
	IX.bind(dropdownEl, {
		blur : function(e){
			setTimeout(function(){isInputNull(el, dropdownEl);}, 150);
		}
	});
}
function prevent(e){
	IX.Util.Event.preventDefault(e);
}
function bindOnMouseWheel(contentEl){
	IX.bind(document.body, {
		mousewheel : prevent
	});
	var dropdownMenu = jQuery(contentEl).find("ul.dropdown-menu");
	IX.map(dropdownMenu, function(item){
		IX.bind(item, {
			mousewheel : function(e){
				e = e || window.event;
				IX.Util.Event.stopPropagation(e);
				var delta = 0;
				if(e.wheelDelta){
					delta = e.wheelDelta;
				}else if(e.detail){
					delta = e.detail;
				}
				var scrollTop = $XH.getScroll(item).scrollTop;
				var innerHeight = jQuery(item).innerHeight();
				if((scrollTop === 0 && delta > 0) || (innerHeight +scrollTop >=item.scrollHeight && delta <0)){
					IX.Util.Event.preventDefault(e);
					return false;
				}
			}
		});
	});
}
var globalActionConfig = IXW.Actions.configActions;
//普通的dropdownBox
//下拉框，弹框和页面的筛选共用。
/*
填写默认值，若baseInfo中有定义，则覆盖默认值，可以避免baseInfo没有该值，导致不能正确渲染。
baseInfo :{//id,inputClz一般是弹框的下拉框中需要设置
	id,//输入框的id，用于提交表单时获取输入框中的值
	inputClz,//输入框的一些限制，用于表单限制的验证，包括required, num, numLimit,textLimit
	type,//同一页面存在多个时，用于区分下拉框属于哪个
	value//下拉框默认值
}
data : [
	{id, name},... 或者name1,name2,...
]
action : 默认为dropdownBox.chose || 自定义的action
*/
function getRsrcHTML(baseInfo, data, action){
	var availRsrc = IX.map(data, function(item){
		var name = "", key="", title="";
		var other = "";
		if(typeof item === "object"){
			name = $XP(item, "name", "");
			key = IX.isEmpty($XP(item, "id")) ? name :$XP(item, "id");
			title = $XP(item, "title") ? $XP(item, "title") : name;
		}else{
			name = item;
			key = item;
		}
		return {
			html : name,
			title : title,
			key : key,
			action : action ? action : "dropdownBox.chose"

	};});
	var clz = $XP(baseInfo, "clz", "");
	return t_dropdownBox.renderData("",IX.inherit({
		type : "",
		id : "",
		clz : clz,
		value : "",
		key : "",
	},baseInfo, {
		availRsrcs : availRsrc
	}));
}
//分页的dropdownBox
function getPageHTML(baseInfo, data){
	var availRsrc=[];
	var ulItems = IX.map(data, function(ul, index){
		availRsrc = IX.map(ul, function(item){
			var name = "", key="";
			name = item;
			key = item;
			return {
				html : name,
				title : name,
				key : key
		};});
		return {
			clz : index === 0 ? "active" : "",
			key : index +1,
			availRsrcs : availRsrc
		};
	});
	var inst = new IXW.Lib.Pagination({
		id : "dp-pagin",
		total : 0,
		current : 0
	});
	inst.apply(0, data.length);
	inst.bind(function(pageNo,clickFn, e){//clickFn没用
		inst.apply(pageNo, data.length);
		var pageDpEl =$XH.ancestor($X('dp-pagin'), "pageDp");
		$XH.removeClass($XH.first(pageDpEl, "active"), "active");
		IX.map(jQuery(pageDpEl).find(".dropdown-menu"), function(item){
			var key = $XD.dataAttr(item, "key");
			if(key-1 === pageNo){
				$XH.addClass(item, "active");
			}
		});
		e.stopPropagation();

	});
	return t_pageDpBox.renderData("",IX.inherit({
		type : "",
		id : "",
		value : "",
		key : "",
	},baseInfo, {
		ulItems : ulItems
	}, {
		paginHTML : inst.getHTML()
	}));
}
globalActionConfig([["dropdownBox.chose", function(params, el){
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if(!dropdownEl) return;
	$XH.removeClass($XH.first(dropdownEl, "dropdown-toggle"), "requiredMark");
	var value = el.innerHTML === "空" ? "" :el.innerHTML;
	var key = $XD.dataAttr(el, "key", "");
	var valueEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "value");
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = key;
	valueEl.innerHTML = value;
}]]);
function compare(){
	var cpuEl = $X('dlgOccupyCpu'), vcpuEl = $X('dlgVirtualCpu');
	var num =parseInt(vcpuEl.value) - parseInt(cpuEl.value *100);
	$XH[num>0 ? "addClass":"removeClass"](vcpuEl, "morelimit");
}
function isNum(el){
	IX.bind(el, {
		keypress : function(e){
			var value = el.value;
			if(e.keyCode<48 || e.keyCode>57){
				e.returnValue = false;
			}
		},
		keyup : function(e){
			el.value = el.value.replace(/\D/g, '');
			if($XH.hasClass(el, "compareNum")) compare();
		}
	});
}
function numLimit(el, min, quota, cbFn){
	IX.bind(el, {
		blur : function(){
			min = parseInt($XD.dataAttr(el, "min",1));
			quota = parseInt($XD.dataAttr(el, "quota",1));
			//if(!isNaN(quota))
			$XH[(parseInt(el.value)< min || (!isNaN(quota) ? parseInt(el.value)>quota : false ) )? "addClass" : "removeClass"](el, "morelimit");
			if(IX.isFn(cbFn)) cbFn();
		}
	});
}
function textLimit(el){
	IX.bind(el, {
		blur : function(){
			var reg = /^([\w@.\/＠．＿\／]|[\u4E00-\u9FA5]){1,18}$/;
			var isFitted = reg.test(el.value);
			if((!isFitted && el.value !=="")){
				$XH.addClass(el, "morelimit");
			}else{
				$XH.removeClass(el, "morelimit");
			}
			return el.value;
		}
	});
}

var t_input = new IX.ITemplate({tpl: [
	'<input id="{id}" name="{id}" class="{inputClz}" type="text" data-min="{min}" data-quota = "{quota}" value = "{value}">',
'']});

IX.ns("SDV.inputBox");
SDV.inputBox.dropdownBox = function(){
	return {
		getHTML : getRsrcHTML,
		bindOnMouseWheelAndHover : bindOnMouseWheel,
		bindonDropdown : bindonDropdown,
		isInputNull : isInputNull
	};
};
SDV.inputBox.pageDpBox = function(){
	return {
		getHTML : getPageHTML
	};
};
SDV.inputBox.inputBox = function(){
	return {
		getHTML : function(baseInfo, value, min){
			return t_input.renderData("",IX.inherit(baseInfo, {value : IX.isEmpty(value) ? "" : value}, min ? {min : min} : {}));
		},
		isInputNull : function(el){
			IX.bind(el, {
				blur : function(){
					var value = el.value;
					$XH[value ? "removeClass" : "addClass"](el, "requiredMark");
					return value;
				}
			});
		},
		isNum : function(el){
			isNum(el);
		},
		numLimit : numLimit,
		textLimit : function(el){
			textLimit(el);
		}

	};
};

})();
(function () {var t_treeNodes = new IX.ITemplate({tpl: [
	'<ul class="{foldClz}">','<tpl id="items">',
		'<li class="{lastClz} {firstClz} {rootClz}">',
			'<span class="line before"></span><a class="{clz} fold" data-href="$tree.click" data-key="{key}" data-id="{id}" >',
				'<span class="pic-expand {hideClz} {foldClz}"></span>',
				'<span>{name}</span>',
			'</a>{popHTML}{HTML}',
		'</li>',
	'</tpl>','<li class="add last {actionClz}"><span class="line before"></span><a data-href="$tree.add"></a></li></ul>',
'']});
var t_pop = new IX.ITemplate({tpl: [
	'<div class="mask">',
		'<a class="icon-edit" data-href="$algo.edit" data-id="{id}" data-name="{name}" data-level="{level}"><span class="act-edit"></span>编辑</a>',
		'<a class="icon-delete" data-href="$algo.delete" data-id="{id}" data-name="{name}" data-level="{level}"><span class="act-delete"></span>删除</a>',
	'</div>',
'']});
var t_rootPop = new IX.ITemplate({tpl: [
	'<div class="rootMask">',
		'<a class="icon-delete" data-href="$algo.delete" data-id="{id}" data-name="{name}" data-level="{level}"><span class="act-delete"></span>删除</a>',
	'</div>',
'']});

var treeActionsConfig = IXW.Actions.configActions;
var treeHT = {};
treeActionsConfig([
	["tree.click", function(params, el){
		if($XH.hasClass(el, "disable")) return;
		var key = params.key;
		var ulEl = $XD.first($XD.ancestor(el, "li"), "ul");
		var spanEl = $XH.first(el, "pic-expand");
		if(key === "view"){
			var id = $XD.dataAttr(el, "id");
			treeHT.view(id);
		}else if(key === "expand"){
			$XH.removeClass(ulEl,"fold");
			$XH.removeClass(spanEl,"fold");
			$XD.setDataAttr(el, "key", "fold");
			SDV.Env.onResize4Body();

		}else if(key === "fold"){
			$XH.addClass(ulEl, "fold");
			$XH.addClass(spanEl, "fold");
			$XD.setDataAttr(el, "key", "expand");
			SDV.Env.onResize4Body();
		}
	}], ["tree.add", function(params, el){
		var liRoot = $XH.ancestor(el, "root");
		var aEl = $XD.first(liRoot, "a");
		var id = $XD.dataAttr(aEl, "id");
		treeHT.add(id);
	}], ["algo.edit", function(params, el){
		var id = $XD.dataAttr(el, "id");
		var name = $XD.dataAttr(el, "name");
		treeHT.edit({id : id, name : name});
	}],["algo.delete", function(params, el){
		var id = $XD.dataAttr(el, "id");
		var name = $XD.dataAttr(el, "name");
		var level = $XD.dataAttr(el, "level");
		treeHT.deleteNode({id : id, name : name, level : level});
	}]
]);
function getPopHtml(userType, level, id, name){
	if(!userType){
		return "";
	}else{
		switch(level){
			case 1:
				return t_pop.renderData("", {id : id, name : name, level : level});
			case 0:
				return t_rootPop.renderData("", {id : id, name : name, level : level});
			default :
				return "";
		}
	}
}
IX.ns("SDV.Lib");
SDV.Lib.Tree = function(cfg){
	var userType = parseInt($XP(cfg, "userType"));
	treeHT.add = $XF(cfg, "add");
	treeHT.edit = $XF(cfg, "edit");
	treeHT.deleteNode = $XF(cfg, "delete");
	treeHT.view = $XF(cfg, "view");
	function getNodesHTML(nodes, len){
		var level = $XP(nodes[0], "level");
		return t_treeNodes.renderData("", {
			items : IX.map(nodes, function(node, index){
				var isHasNodes = $XP(node, "nodes");
				var name = $XP(node, "name");
				var id = $XP(node, "id");
				var HTML = isHasNodes ? getNodesHTML(node.nodes, node.nodes.length) : "";
				var popHTML = getPopHtml(userType, level, id, name);
				return {
					name : name,
					rootClz : $XP(node, "level") ===0 ? "root" : level ===1 ?"level1" : "",
					lastClz : (nodes.length === 1 || nodes.length-1 === index) && (level !==1 || (!userType && level===1))  ? "last" : "",
					firstClz : index ===0 ? "first" : "",
					clz : ((level === 0 ||level === 1) && userType) || (!isHasNodes && level !==0) || (isHasNodes && node.nodes.length >50)  ? "" : "disable",
					hideClz : isHasNodes && node.nodes.length >50 ? "" : "hide",
					foldClz : isHasNodes && node.nodes.length >50 ? "fold" : "expand",
					key : !isHasNodes ? "view" : isHasNodes && node.nodes.length >50 ? "expand" : "",
					id : id,
					popHTML : popHTML,
					HTML : HTML
				};
			}),
			actionClz : level === 1 && userType?"":"hide",
			foldClz : len >10 ? "fold" : "expand"
		});
	}
	return {
		getHTML : function(){return getNodesHTML(cfg.nodes);},
		refresh : function(cfg){return getNodesHTML(cfg.nodes);}
	};
};
})();
(function(){
	IX.ns("SDV.Const");
	SDV.Const.ProductInfo = {
		0 : {
			name : "视云大数据平台",//PVD
			services : ["大数据存储服务OPAQ", "大数据分析服务", "应用服务", "卡口接入服务IOD", "地图服务", "消息队列服务kafka"]
		},
		1 : {
			name : "视云实战平台",//PVA
			services : ["后台服务", "地图服务", "视图库服务PVB", "数据库服务ES"]
		},
		2 : {
			name : "综合运维管理系统",//IMS
			services : ["集群运维管理服务", "Oracle服务", "监测探针服务", "视频诊断服务IPVS", "视频诊断转发服务"]
		},
		3 : {
			name : "视频侦查云平台",//ICP
			services : ["WEB及视频服务", "云存储服务PFS"]
		},
		4 : {
			name : "视频云计算",
			services : ["云计算节点服务PCC_Node", "云计算管理服务PCC_Center"]
		},
		5 :{
			name : "视频云存储",
			services : ["视频云存储服务PFS"]
		},
		6 : {
			name : "视云联网平台",
			services : ["中心管理服务CMS", "媒体转发服务FS", "国标网关服务CS","国标媒体服务MS","国标转码服务TC"]
		},
		7 : {
			name : "集群云存储",
			services : ["存储服务ROFS", "管理服务"]
		}
	};
})();
(function () {var t_ipBox = new IX.ITemplate({tpl: ['<div class="leftSide">',
	'<div class="search">',
		'<input type="text" placeholder="搜索IP地址">',
		'<a class="r pic-search" data-href="${search}"></a>',
	'</div>',
	'<div class="ip-menu"><ul id="ip-box">','<tpl id="availIps">',
		'<li id="menu-{value}"><a class="checkbox" data-href="$ip.select" data-key="{value}"></a><span>{value}</span></li>',
	'</tpl>',
	'</ul></div>',
'</div >',
'<div class="rightSide">',
	'<div class="ip-selected"><ul></ul></div>',
	'<div>',
		'<a class="btn okbtn" data-href="$ip.sure" data-key="ok">确定</a>',
		'<a class="btn cancelbtn" data-href="$ip.sure" data-key="cancle">取消</a>',
	'</div>',
'</div>','']});

var globalActionConfig = IXW.Actions.configActions;
var ipHT = {};
globalActionConfig([["ip.search", function(params, el){
	var inputEl = $XD.first(el.parentNode, "input");
	var value = inputEl.value;
	var leftSideEl = $XH.ancestor(el, "leftSide");
	var ulEl = $XD.first($XH.first(leftSideEl, "ip-menu"), "ul");
	jQuery(ulEl).find("li").removeClass("hide");
	jQuery(ulEl).find("li.added").addClass("hide");
	if(value){
		IX.map(jQuery(ulEl).find("li"), function(item){
			if(item.id.indexOf(value) <0 && item.id.indexOf("added") <0){
				$XH.addClass(item, "hide");
			}
		});
	}
}],["ip.select", function(params, el){
	$XH.toggleClass(el, "selected");
	var key = params.key;
	var cAdditionEL = $XH.ancestor(el, "container-addition");
	var ulEl = jQuery(cAdditionEL).find(".ip-selected ul");
	if($XH.hasClass(el, "selected")){
		ulEl.append("<li id='selected-"+key+"'><span>"+key+"</span><a class='pic-close' data-href='$ip.cancle' data-key='"+key+"'></a></li>");
	}else{
		jQuery($X("selected-"+key)).remove();
	}
}], ["ip.cancle", function(params, el){
	var liEl = $XD.ancestor(el, "li");
	jQuery(liEl).remove();
	var key = params.key;
	var menuLiEl = $X('menu-'+key);
	$XH.removeClass($XH.first(menuLiEl, "checkbox"), "selected");
}], ["ip.sure", function(params, el){
	ipHT.sure(params, el);
}]]);
IX.ns("SDV.addIpBox");
SDV.addIpBox.ipBox = function(cfg){
	ipHT.sure = $XF(cfg, "sureFn");
	function getHTML(){
		var ips = $XP(cfg, "ips", []);
		return t_ipBox.renderData("", {
			availIps : IX.map(ips, function(ip){
					return {
						value : ip
					};
				}),
			search : $XP(cfg, "search", "") === "" ? "ip.search" : $XP(cfg, "search", "")
		});
	}
	return {
		getHTML : getHTML
	};
};
})();
(function () {
var globalActionConfig = IXW.Actions.configActions;
var RowModelBase = IXW.Lib.GridModel.RowModelBase;
var ixwPages = IXW.Pages;
var ixwOptions = IXW.Lib.Options;

var t_pagin = new IX.ITemplate({tpl: [
	'<div id="{id}-indics" class="l">','<tpl id="indics">',
		'从<span>{stx}</span>到<span>{endx}</span>/共<span>{pagex}</span>条数据',
	'</tpl>','</div>',
	'<div class="r">显示 <div class="page">',
		'<div class="dropdown">',
			'<a class="changePage dropdown-toggle" data-toggle="dropdown">',
				'<span id="curPage" class="pagesizeList">{pageInfo}</span>',
				'<span class="pgFrame"><span class="pic-pg"></span></span>',
			'</a>',
			'<ul class="dropdown-menu">','<tpl id="dropdownPg">',
				'<li id = "{id}"><a class="pagesizeList" data-href="$nvgrid.changePageSize" data-key="{nvgridId}" id = "{id}">{html}</a></li>','</tpl>',
			'</ul>',
		'</div></div></div>',
	'<div class="m">{paginHTML}</div>',
'']});

var PagesizeList = [
{id : "page-0",value : 20, text : "每页20条"},
{id : "page-1",value : 50, text : "每页50条"},
{id : "page-2",value : 100, text : "每页100条"},
{id : "page-3",value : 200, text : "每页200条"}
];
var currentPageSize = PagesizeList[0];
var pageSizeChangeListeners = {};
globalActionConfig([["nvgrid.changePageSize",function(params,el){
	var liEl = el.parentNode;
	// if ($XH.hasClass(liEl, "disabled"))
	// 	return;
	var _el = $XH.ancestor(liEl, "dropdown");
	var curpsEl = $XH.first($XD.first(_el, "a"), "pagesizeList");
	curpsEl.innerHTML = el.text;

	var index = el.id.split("-").pop();
	$XH.removeClass($X(currentPageSize.id),"hide");
	currentPageSize = PagesizeList[index];
	$XH.addClass($X(currentPageSize.id),"hide");
	var fn = pageSizeChangeListeners[params.key];
	if (IX.isFn(fn))
		fn(PagesizeList[index].value);
}], ["filter.chose", function(params, el){
	var key = params.key;
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if(!dropdownEl) return;
	var type = $XD.dataAttr(dropdownEl, "type", "");
	var value = el.innerHTML === "空" ? "" :el.innerHTML;
	var valueEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "value");
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = value;
	valueEl.innerHTML = value;
	tryExecuteTool("filter", [{type : type, key : key}]);
}]]);
function getDropdownPg(id){
	return IX.map(PagesizeList,function(item){
		return {
			nvgridId : id,
			id : item.id,
			html : item.text
		};
	});
}

function NVPagination(id){
	var inst = new IXW.Lib.Pagination({
		id : id + "-pagin",
		total : 0,
		current : 0
	});
	var tpldata = {
		id : id,
		indics: [{stx : 0,endx : 0, pagex : 0}],
		paginHTML : inst.getHTML(),
		pageInfo : currentPageSize.text,
		dropdownPg : getDropdownPg(id)
	};
	var curPageNo = 0;
	return {
		getHTML : function(){return t_pagin.renderData("", tpldata);},
		bind : function(pageNoChangedFn, pageSizeChangeFn){
			inst.bind(pageNoChangedFn);
			pageSizeChangeListeners[id] = function(pageSize){
				pageSizeChangeFn(curPageNo, pageSize);
			};
		},
		jump : inst.jump,
		refresh : function(totalPages, currentPageNo, itemNum, totalNum, onlyData){
			inst.apply(currentPageNo, totalPages, onlyData);
			tpldata.paginHTML = inst.getHTML();
			curPageNo = currentPageNo;
			var stx = currentPageNo * currentPageSize.value;
			tpldata.indics = [{stx : itemNum >0 ?stx+1 :stx, endx : stx + itemNum, pagex : totalNum}];
			var el = $X(id + "-indics");
			if (!onlyData && el) el.innerHTML = t_pagin.renderData("indics", tpldata.indics[0]);
		},
		getCurPageNo : function(){return curPageNo +1;}
	};
}

var t_grid = new IX.ITemplate({tpl: [
'<div id="{id}" class="nv-grid {gridClz}">',
	'<div id="{id}-body" class="grid-body">{gridHTML}</div>',
	'<div id="{id}-foot" class="footbar">{paginHTML}</div>',
'</div>',
'']});
var t_pageVhost = new IX.ITemplate({tpl: [
	'<div id="gridContainer" class="nobuttonPage"><img id="refreshLoading" class="loading" src="{imgUrl}"></div>',
'']});


/** cfg : {
	container : //required
	id, // optional

	clz : gridClz,
	usePagination : false; default true;
	
	rowModel : function(rowData, colModels), //optional
	// pageSize : 25, default 20
	columns : [name],
	actions : [[name, function(rowModel, rowEl)]]
	dataLoader : function(params, cbFn)
	onselect : function(),
	clickOnRow : function(rowId)
}
 */
function GridBase(cfg){
	var container = $XP(cfg,  "container");
	var id = cfg.id || IX.id();

	var tools = $XP(cfg, "tools", {});
	var ifEnableSearch = $XP(tools, "search");
	var usePagination = $XP(cfg, "usePagination", true);
	var dataLoader = $XF(cfg, "dataLoader");
	var clickOnRow = $XF(cfg, "clickOnRow");
	var onselect = $XF(cfg, "onselect");
	var sortParams = $XP(cfg, "sortParams",{});
	var searchKey = "";
	var itemPageName = $XP(cfg, "itemPageName", "");
	var selectedItems = [];//保存选中的id，翻页后，再翻回来，也能保持选中。
	var curPageNo =0;

	var grid = new IXW.Lib.Grid(IX.inherit(cfg, {
		id : id + "-grid",
		pageSize : currentPageSize.value,
		rowModel : RowModelBase,
		//selectedIds : selectedIds,
		dataLoader : function(params, cbFn){
			dataLoader(IX.inherit(params, {
				sortInfo : sortParams//JSON.stringify(sortParams),
			}, ifEnableSearch ? {key : searchKey} : {}), cbFn);
		}
	}));
	var model = grid.getModel();

	function applyHover(){
		jQuery($X(container)).find(".row").hover(function(){
			$XH.addClass(this, "hover");
			$XH.removeClass($XH.first(this,"col-actions"),"invisible");
		}, function(){
			$XH.removeClass(this, "hover");
			$XH.addClass($XH.first(this,"col-actions"),"invisible");
		});
		$XH.addClass($X(currentPageSize.id),"hide");
		jQuery($X(container)).find(".cpuInfo").hover(function(){
			//var cpuInfoPanel = initCPUPanel();
			//cpuInfoPanel.trigger(el);
			$XH.removeClass($XH.first(this, "cputip"), "hide");
		},function(){
			$XH.addClass($XH.first(this, "cputip"), "hide");
		});
	}
	var pagin =	null;
	function afterLoaded(pageNo, items, onlyData){
		var total = model.getDataModel().getTotal();
		grid.refresh(onlyData, applyHover);
		if(pagin)
			pagin.refresh(model.getPageCount(), pageNo, items.length,total, onlyData);

	}
	function loadPage(pageNo, clickBtnRefreshFn){
		/*跨页选择*/
		/*if(pagin) curPageNo = pagin.getCurPageNo();
		if(curPageNo){
			var ids = IX.map(getSelectedRows(), function(rowModel){
				return rowModel.getId();
			});
			var pages = [];
			if(selectedItems.length > 0){
				for(var i =0; i< selectedItems.length; i++){
					pages = pages.concat(selectedItems[i].page);
					if(selectedItems[i].page *1 === curPageNo){
						selectedItems[i].value = ids;
					}
				}
				var strpages = pages.join(",") + ",";
				if(strpages.indexOf(curPageNo + ",") <0) selectedItems.push({page : curPageNo, value : ids});
			}else{
				selectedItems.push({page : curPageNo, value : ids});
			}
			model.setSelectedItems(selectedItems);
		}*/
		model.load(pageNo, function(items){
			afterLoaded(pageNo, items);
			if(! ($X('refreshLoading'))) return;
			$XH.addClass($X('refreshLoading'), "hide");
			if(IX.isFn(clickBtnRefreshFn)) clickBtnRefreshFn();
			onselect();
			if(jQuery("#itemList").find(".checkbox").length){
				var isChoseAll = true;
				var choseAllEl = jQuery("#gridContainer").find(".hdr .checkbox")[0];
				jQuery("#itemList").find(".checkbox").each(function(){
					if (!$XH.hasClass(this, "selected")) isChoseAll = false;
				});
				$XH[isChoseAll ? "addClass" : "removeClass"](choseAllEl, "selected");
			}
			SDV.Env.onResize4Body();
		});
	}
	function getSelectedRows(){
		var selectedCells = jQuery("#" + id + "-grid").find(".row .selected");
		return IX.map(selectedCells, function(el){
			var _el = $XH.ancestor(el, "row");
			return model.getRow(_el.id);
		});
	}
	grid.colAction = function(name, colEl){
		if (name == "_check"){
			var $el = jQuery(colEl);
			var ifSelectAll = !$el.find(".checkbox").hasClass("selected");
			var $checkboxs = jQuery(colEl).parents(".ixw-grid").find(".col-_check .checkbox");
			$checkboxs[ifSelectAll?"addClass":"removeClass"]("selected");
			onselect();
		} else { //sort
			var ifDown = !$XH.first(colEl, "up");
			if(ifDown)
				$XH.addClass($XH.first(colEl, "pic-") , "up");
			else
				$XH.removeClass($XH.first(colEl, "pic-") , "up");
			if(name.indexOf('allocated') > -1)
				name = 'sort_'+name.substring(9);
			/*sortParams = IX.Array.remove(sortParams, name, function(elem,item){
				return item.name == name;
			});*/
			sortParams = {name : name, ifDown : ifDown ? 1 :0};
			loadPage(0);
		}
	};
	grid.cellAction = function(rowId, cellName, cellEl){
		if (cellName == "_check"){
			$XH.toggleClass($XH.first(cellEl, "checkbox"), "selected");
			var isChoseAll = true;
			jQuery("#itemList").find(".checkbox").each(function(){
				if (!$XH.hasClass(this, "selected")) isChoseAll = false;
			});
			var choseAllEl = jQuery("#gridContainer").find(".hdr .checkbox")[0];
			$XH[isChoseAll ? "addClass" : "removeClass"](choseAllEl, "selected");
			onselect();
		} else {
			clickOnRow(rowId, cellName, cellEl);
		}
	};

	if (usePagination){
		pagin = new NVPagination(id);
		pagin.bind(loadPage, function(pageNo, pageSize){
			model.resetPage(0, pageSize, function(items){
				afterLoaded(0, items);
				SDV.Env.onResize4Body();
			});
		});
	}
	function _show(items, refreshIntetvalFn){
		var el = $X(container);
		if (!el)
			return;
		if(!$XH.hasClass(document.body, itemPageName) && itemPageName!=="") return;
		afterLoaded(0, items, true);
		el.innerHTML = t_grid.renderData("", {
			id : id,
			gridClz : $XP(cfg, "clz", ""),
			gridHTML : grid.getHTML(),
			paginHTML : pagin?pagin.getHTML() : ""
		});
		$XH.addClass($X('refreshLoading'), "hide");
		SDV.Env.onResize4Body();
		applyHover();
		if(IX.isFn(refreshIntetvalFn)) refreshIntetvalFn();
	}

	return {
		getModel : function(){return model;},
		getSelectedRows : getSelectedRows,
		setSelectedIdsNull : function(){
			jQuery("#" + id + "-grid").find(".selected").removeClass("selected");
			selectedItems = [];
			model.setSelectedItems([]);
		},
		show: function(refreshFn){model.load(0, _show, refreshFn);},
		search : function(key){
			if (key == searchKey)
				return;
			searchKey = key;
			loadPage(0, function(){
				jQuery('#gridContainer .col-_check .checkbox').removeClass("selected");
				jQuery('#gridTools .chkEnable').addClass("disable");
				selectedItems = [];
				model.setSelectedItems([]);
			});
		},
		refresh : function(pageNo, clickBtnRefreshFn){
			if (pagin) pagin.jump(pageNo, clickBtnRefreshFn);
			else loadPage(0, clickBtnRefreshFn, pageNo);
		},
		refreshGrid : function(pageNo){
			$XH.removeClass($X('refreshLoading'), "hide");
			var clickBtnRefreshFn = function(){
				jQuery('#gridContainer .col-_check .checkbox').removeClass("selected");
				jQuery('#gridTools .chkEnable').addClass("disable");
			};
			if (pagin) pagin.jump(pageNo, clickBtnRefreshFn);
			else loadPage(0, clickBtnRefreshFn, pageNo);
		},
		getCurPageNo : function(){return pagin.getCurPageNo();}
	};
}

IX.ns("SDV.Grid");
SDV.Grid.NVGrid = GridBase;

SDV.Grid.CommonGrid = function(container, cfg){
	$X(container).innerHTML = t_pageVhost.renderData("", {imgUrl : SDV.Global.refreshIntervalUrl});
	SDV.Env.onResize4Body();
	return new GridBase(IX.inherit({container : container},cfg.grid));
};
SDV.Grid.currentGrid = null;

var t_MutiTools = new IX.ITemplate({tpl: [
	'<div>',
		'<div class="l dtzone {dtzoonClz}">时间筛选：{dtHTML}</div>',
		'<a class="btn-filter {dtzoonClz}" data-href="$nvgrid.clickTool" data-key="dtp-filter" data-from="{from}" data-to="{to}"><span class="text">筛选</span></a>',
		'<div class="r search {searchClz}">',
			'<input type="text" placeholder="请输入检索内容">',
			'<a class="r pic-search" data-href="$nvgrid.search"></a>',
		'</div>',
	'</div>',
	'<div>',
		'<tpl id="btns">',
			'<a class="btn-{name} {clz}" data-href="$nvgrid.clickTool" data-key="{name}" {dtfromto}>{text}</a>',
		'</tpl>',
		'<tpl id="filter">','<div class="r {clz}"><span class="text">{filterName}：</span>{filterHTML}</div>','</tpl>',
	'</div>',
'']});
var t_tools = new IX.ITemplate({tpl: [
	'<tpl id="btns">',
		'<a class="btn-{name} {clz}" id="{id}" data-href="$nvgrid.clickTool" data-key="{name}" {dtfromto}><span class="pic-"></span><span class="text">{text}</span></a>',
	'</tpl>',
	'<div class="l dtzone {dtzoonClz}">时间筛选：{dtHTML}</div>',
	'<a class="btn-filter {dtzoonClz}" data-href="$nvgrid.clickTool" data-key="dtp-filter" data-from="{from}" data-to="{to}"><span class="text">筛选</span></a>',
	'<div class="r search {searchClz}">',
		'<input type="text" placeholder="请输入检索内容">',
		'<a class="r pic-search" data-href="$nvgrid.search"></a>',
	'</div>',
	'<tpl id="filter">','<div class="r filter {clz}"><span class="text">{filterName}：</span>{filterHTML}</div>','</tpl>',
'']});

var dropdownBox = SDV.inputBox.dropdownBox();
var filterCfg = {
	service : [{id:-1, name : "全部"},{id:2, name : "运行"},{id:4,name:"已停止"},{id:5, name : "故障"}],
	backup : [{id:-1, name : "全部"},{id:1, name : "备份成功"},{id:2, name : "备份失败"}],
//	backupWay : [{id: -1, name: "全部"}, {id: 0, name: "全量备份"}, {id: 1, name: "增量备份"}],
	operation : [{id:-1, name : "全部"},{id:0, name : "运行"},{id:1,name:"关机"},{id:4, name : "故障"}],
	log :[{id:-1, name : "全部"},{id:0, name :"未处理"},{id:1, name:"已处理"}]
};
var AllBtns = {
	"refresh" : false,
	"delete" : true,
	"edit" : true,
	"add" : false,
	"poweron" : true,
	"poweroff" : true,
	"restart" : true,
	"startup" : true,
	"shutdown" : true,
	"mark" : true
};
var AllFilters = {
	"status" : "状态",
	"product" : "所属产品",
//	"backupWay" : "备份方式",
	"serviceAttr" : "业务属性"
};
var btnsTexts = {
	"refresh" : "刷新",
	"add" : "添加",
	"poweron": "运行",
	"poweroff" : "停止",
	"restart" : "重启",
	"startup" : "启动",
	"shutdown": "关机",
	"mark": "标记为已处理"
};
function getLogDpts(filterData){
	var html = "", seprate = "";
	var datePickTriggers = IX.map([
		{type : "from", label : ""},
		{type : "to", label : ""}
	], function(cfg){
		var type = cfg.type;
		var value = $XP(filterData, type, "");
		var dpt = new IXW.Lib.DatePickTrigger(IX.inherit(cfg, {
			id: "dtp-"+type,
			value : value ? parseInt(value / 1000) : "",
			dataAttrs : [["key", type]],
			onchange : function(newValue, inputEl){
				var key = inputEl.id.split("-")[1];
				var filterEl = jQuery('.btn-filter[data-key="dtp-filter"]');
				filterEl.attr("data-"+key, newValue * 1000);
				if(Number(filterEl.attr("data-from")) && Number(filterEl.attr("data-to")))
					filterEl.removeClass("disable");
				else
					filterEl.addClass("disable");
			}
		}));
		seprate = type === "from"? "-" : "";
		html += dpt.getHTML() + seprate;
		return dpt;
	});
	return html;
}
function getFilters(name, moduleType, filterInfo){
	var commonDftData = {type : name, inputId : name, value : "全部"};
	var defaultData;
	if(name === "status")
	{
		defaultData = $XP(filterInfo, "defaultData") || commonDftData;
		return dropdownBox.getHTML(defaultData, filterCfg[moduleType], "filter.chose");
	}
//	else if(name === "backupWay")
//		return dropdownBox.getHTML(commonDftData, filterCfg.backupWay, "filter.chose");
	else{
		var filterData = jQuery.extend(true, [], $XP(filterInfo, "filterData", []));
		filterData.unshift({id : -1, name : "全部"});
		defaultData = $XP(filterInfo, "defaultData") || commonDftData;
		return dropdownBox.getHTML(defaultData,filterData, "filter.chose");
	}
}
function getTriggersHTML(filterData){
	var datePickTriggersHTML = "";
	//if(moduleType === "logs")
		datePickTriggersHTML += getLogDpts(filterData);
	return datePickTriggersHTML;
}
function showGridTools(container, cfg, filterInfo, isMulti){
	var el = $X(container);
	var clz = "";
	if (!el)
		return;
	var type = $XP(cfg, "type", "");
	var btns = IX.map($XP(cfg, "buttons", []), function(name){
		return {
			name : name,
			clz : AllBtns[name]?"chkEnable disable":"",
			id : name === "import" ? "uploadFile" : "",
			dtfromto : name === "filter" ? "data-from = '' data-to=''":"",
			text : btnsTexts[name] || ""
		};
	});
	var filters = IX.map($XP(cfg, "filter", []), function(item){
		return {
			clz : item,
			filterName : AllFilters[item],
			filterHTML : getFilters(item, type, filterInfo)
		};
	});
	var ifEnableSearch = $XP(cfg, "search");
	var ifEnableDt = $XP(cfg, "dpt");
	var ifEnableStatus = $XP(cfg, "status");

	if(isMulti){
		el.innerHTML = t_MutiTools.renderData("", {
			btns : btns,
			clz : AllBtns.more ? "chkEnable disable":"",
			searchClz : ifEnableSearch?"":"hidden",

			dtzoonClz : ifEnableDt?"":"hidden",
			dtHTML : getTriggersHTML(filterInfo),
			filter : filters,
			from : $XP(filterInfo, "from", 0),
			to : $XP(filterInfo, "to", 0)
		});
	}else{
		el.innerHTML = t_tools.renderData("", {
			btns : btns,
			clz : AllBtns.more ? "chkEnable disable":"",
			searchClz : ifEnableSearch?"":"hidden",

			dtzoonClz : ifEnableDt?"":"hidden",
			dtHTML : getTriggersHTML(filterInfo),
			filter : filters,
			from : $XP(filterInfo, "from", 0),
			to : $XP(filterInfo, "to", 0)
		});
	}
	if (ifEnableSearch){
		var inputEl = jQuery(el).find(".search input");
		inputEl.bind("keydown", function(e){
			if (e.which == 13 && !IX.isEmpty(this.value)){
				inputEl.blur();
				tryExecuteTool("search", [this.value]);
			}
		});
		inputEl.bind("blur", function(){
			tryExecuteTool("search", [this.value]);
			jQuery(el).find(".search").removeClass("click");
		});
		inputEl.bind("focus", function(){
			jQuery(el).find(".search").addClass("click");
		});
	}
}
function tryExecuteTool(fname, args){
	var currentGrid = SDV.Grid.currentGrid;
	if (!currentGrid || !(fname in currentGrid))
		return;
	var fn = currentGrid[fname];
	if (IX.isFn(fn))
		fn.apply(null, args);
}

globalActionConfig([["nvgrid.clickTool", function(params, el){
	if ($XH.hasClass(el,"disable")) return;
	if (params.key == "dtp-filter"){
		var fromValue = $XD.attr(el, "data-from");
		var toValue = $XD.attr(el, "data-to");
		if (fromValue > toValue)
			return alert("起始时间应小于结束时间");
		return tryExecuteTool(params.key, [{type: "from", key: fromValue}, {type: "to", key: toValue}]);
	}
	tryExecuteTool(params.key, [el]);
}],["nvgrid.search", function(params, el){
	var inputEl = $XD.first(el.parentNode, "input");
	tryExecuteTool("search", [inputEl.value]);
}],["nvgrid.clearDpt", function(params, el){
	$XH.addClass($XH.ancestor(el, "dttext"),"hidden");
	IX.map(jQuery("#gridTools .ixw-dpt input"), function(item){
		item.value = "";
	});
	var aFilterEl = $XH.first($XH.ancestor(el, "grid-tools"), "btn-filter");
	$XD.setDataAttr(aFilterEl, "from", 0);
	$XD.setDataAttr(aFilterEl, "to", 0);
	$XH.addClass(aFilterEl, "disable");
	tryExecuteTool("filter", ["",{from :0, to : 0}]);
}]]);

IX.ns("SDV.GridTools");
SDV.GridTools.showTools = showGridTools;
SDV.GridTools.enableTools = function(container, ifEnable, arrbtnStatus){
	jQuery($X(container)).find(".chkEnable")[ifEnable?"removeClass":"addClass"]("disable");
	if(arrbtnStatus)
		IX.map(arrbtnStatus, function(btn){
			if(btn) jQuery($X(container)).find(".btn-"+btn+".chkEnable").removeClass("disable");
		});
};

var t_pathNav = new IX.ITemplate({tpl: [
	'<tpl id="paths">',
		'<a class="{clz}" data-href= "{href}">{text}</a>',
		'<div class="node-space">&gt;</div>',
	'</tpl>','<tpl id="curpath">',
		'<div>{text}</div>',
	'</tpl>',
'']});

var navPathTexts = {
	"services" : "服务管理",
	"products" : "产品管理",
	"operations": "运维管理"
};
var navPathHrefs = {
	"services" : "services",
	"products" : "products",
	"operations" : "operation-list"
};
function showPathNav(container, moduleArr, subName){
	var paths = [];
	IX.map(moduleArr, function(module, index){
		paths.push({text : navPathTexts[module],clz : index ===0 ? "name": "", href : ixwPages.createPath(navPathHrefs[module])});
	});
	if(subName){
		paths.push({text : subName, href : ""});
	}
	var curpath = paths.length >0 ? [paths.pop()]:[];
	if($X(container)){
		$X(container).innerHTML = t_pathNav.renderData("", {
			paths : paths,
			curpath : curpath
		});
	}
}
IX.ns("SDV.PathNav");
SDV.PathNav.showPathNav = showPathNav;
})();
(function () {
var globalActionConfig = IXW.Actions.configActions;
var UTCInterval = new Date().getTimezoneOffset() * 60000; //millsec
var cancelIntervalFn = "";
var refreshIntervalFn = "";
function getMaxDayInCurrentMonth(from){
	var date = null;
	if (from !== undefined){
		date = new Date(from * 1000);
	}else{
		date = new Date();
	}
	var nextMonthFirstDay=new Date(date.getFullYear(),date.getMonth() + 1,1);
	date = new Date(nextMonthFirstDay.getTime()-1000);
	var date1 = new Date(0);
	return date.getDate();
}
var SecInDay = 24*3600;
var MilliSecInDay = SecInDay*1000;
function getBaseDate4FirstDay(xType){
	var date = new Date();
	var ms = date.getTime() ;
	ms = ms - (ms % MilliSecInDay);
	var d = xType==="month"?(date.getDate() -1):(xType==="week"?(date.getDay()=== 0 ? 6 : date.getDay()-1):0);
	date = new Date(ms - d * MilliSecInDay  + UTCInterval);
	return date;
}
function getDate4FirstDay(xType){
	var date = getBaseDate4FirstDay(xType);
	return [date.getFullYear(), date.getMonth(), date.getDate()];
}
function getSecTime4FirstDay(xType){
	var date = getBaseDate4FirstDay(xType);
	return Math.round(date.getTime()/1000);
}
function getSecTime4LastDay(){
	var date = new Date();
	return Math.round(date.getTime()/1000);
}

function getPrevSecTime4FirstDay(xType, from){
	var date = new Date(from*1000);
	var ms = date.getTime();
	if (xType === "month"){
		date = new Date(date.getFullYear(), date.getMonth()-1, 1);
	}else if(xType === "week"){
		date = new Date(from*1000 - 7*MilliSecInDay);
	}else{
		date = new Date(from*1000 -MilliSecInDay);
	}
	return Math.round(date.getTime()/1000);
}
function getPrevSecTime4LastDay(from){
	var date = new Date(from * 1000-1000);
	return Math.round(date.getTime()/1000);
}
function getNextSecTime4FirstDay(to){
	var date = new Date(to * 1000 + 1000);
	return Math.round(date.getTime()/1000);
}
function getNextSecTime4LastDay(xType, to){
	var date = new Date(to*1000);
	if (xType === "month"){
		date = new Date(date.getFullYear(), date.getMonth()+2, 1);
		date = new Date(date.getTime() - 1000);
	}else if(xType === "week"){
		date = new Date(to*1000 + 7*MilliSecInDay);
	}else{
		date = new Date(to*1000 +MilliSecInDay);
	}
	var curDate = new Date(), time = 0;
	if(date.getTime() > curDate.getTime()) {time =curDate.getTime()/1000;}else {time = date.getTime()/1000;}
	return Math.round(time);
}
function getJumpedDate4FirstDay(xType, from){
	var date = new Date(from*1000);
	return [date.getFullYear(), date.getMonth(), date.getDate()];
}
Highcharts.setOptions({
	symbols: ['circle', 'circle', 'circle', 'circle'],
	colors: ['#72D1EE', '#CCE7F6', '#4b5d69', '#9fdbea'],
	lang:{
		loading: '加载中...',
		months: '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月'.split(','),
		shortMonths: '1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月'.split(','),
		weekdays: '周日,周一,周二,周三,周四,周五,周六'.split(","),
		decimalPoint: '.',
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
		resetZoom: '回复原始图表',
		resetZoomTitle: '回复原始图表',
		thousandsSep: ' '
	},
	chart: {zoomType: ''},
	title: {text: null},
	legend: {enabled: false},
	credits: { enabled: false },
	plotOptions: {
		areaspline: { fillOpacity: 0.8 },
		series: {
			marker: { enabled: false},
			lineWidth: 0
		}
    },
	tooltip: {
		shared: true,
		valueSuffix : "%",
		crosshairs:[{color:"#E0E0E0"}]
	}
});

var XAxisConfig = {
	"month" : {
		type: 'datetime',
		endOnTick : true,
		labels: { step:2 },
		lineWidth:4,
		showLastLabel : false,
		dateTimeLabelFormats: { day : '%Y-%m-%d'}
	},
	"week"  :{
		type: 'datetime',
		endOnTick : false,
		labels: { step:2 },
		lineWidth:4,
		showLastLabel : false,
		dateTimeLabelFormats: { day : '%Y-%m-%d<br>%A'}
	},
	"24h" : {
		type: 'datetime',
		endOnTick : false,
		labels: { step:1 },
		lineWidth:4,
		showLastLabel : false,
		dateTimeLabelFormats: { day : '%Y-%m-%d<br>%A', hour: '%H:%M'}
	}
};
function getPlotLines(intv){
	var plotLines = [], i=0;
	for(i=1; i<=10;i++)
		plotLines.push({
			color: '#EEEEEE',
			dashStyle: 'solid',
			value : i* intv,
			width: 1
		});
	return plotLines;
}
var YAxisConfig = {
	"resource" : {
		title: {text: "使用率"},
		labels : {format:"{value}%"},
		min:0,
		max:100,
		tickInterval: 10,
		plotLines : getPlotLines(10),
		lineColor: "#D8D8D8",
		lineWidth : 1
	},
	"flow" : {
		min:0,
		max : 100,
		title : {text : "带宽"},
		labels : {format: "{value}Kbps"},
		tickInterval : 10,
		plotLines : getPlotLines(10),
		lineColor: "#D8D8D8",
		lineWidth : 1
	}
};
var TBinKB = 1024 * 1024 * 1024 * 1024;
var GBinKB = 1024 * 1024 * 1024;
var MBinKB = 1024 * 1024;
var KBinKB = 1024;
function calYAxis4Flow(data){
	var flowData=data;
	var maxY = 100, unity = "", base = 1, i =0;
	var maxNum =Math.max.apply(Math, flowData);
	
	var n = Math.max(2, Math.floor(Math.log10(maxNum))), y = Math.pow(10, n);
	if (maxNum > y)
		maxY = Math.ceil(maxNum / y) * y;

	if (n >= 12) {
		maxY  = maxY / 1000000000000;
		unity = "T";
		base = TBinKB;
	} else if (n>=9){
		maxY  = maxY / 1000000000;
		unity = "G";
		base = GBinKB;
	} else if (n>=6){
		maxY  = maxY / 1000000;
		unity = "M";
		base = MBinKB;
	}else if (n>=3){
		maxY  = maxY / 1000;
		unity = "K";
		base = KBinKB;
	}
	if (base !== 1)
		for (i = 0; i < flowData.length; i++)
			flowData[i]=Math.ceil(100* flowData[i] / base) / 100;

	return {
		max : maxY,
		unity : unity,
		data : flowData
	};
}

function getSeriesDataItem(xType, name, intv, arr, from, strJump){
	var _arr = [];
	var firstDay = [], maxDay = 0;
	if(strJump === "prev"){
		firstDay = getJumpedDate4FirstDay(xType, from);
		maxDay = getMaxDayInCurrentMonth(from);
	}else if(strJump === "next"){
		firstDay = getJumpedDate4FirstDay(xType, from);
		maxDay = getMaxDayInCurrentMonth(from);
	}else{
		firstDay = getDate4FirstDay(xType);
		maxDay = getMaxDayInCurrentMonth();
	}
	var utcTick = Date.UTC.apply(null, firstDay);
	var len = xType=="24h"?1: (xType=="week"?7:maxDay);
	len =  len * SecInDay / Math.max(intv, 1);
	for (var i =0; i<len; i++)
		_arr.push(i>=arr.length? null : arr[i]);
	return {
		type:"areaspline",
		name : name,
		pointStart : utcTick,
		pointInterval : intv * 1000,
		data : _arr
	};
}
function format4FlowChart(data, strJump){
	var yaxisDataR = calYAxis4Flow(data.flowR);
	var yaxisDataT = calYAxis4Flow(data.flowT);
	var max = 0, unity = "";
	if (yaxisDataR.max > yaxisDataT.max){
		max = yaxisDataR.max;
		unity = yaxisDataR.unity + "bps";
	}else{
		max = yaxisDataT.max;
		unity = yaxisDataT.unity + "bps";
	}
	var intv = max/10;
	return {
		tooltip : {valueSuffix : unity},
		xAxis: XAxisConfig[data.xType],
		yAxis : {
			min:0,
			max : max,
			title : {text : "带宽"},
			labels : {format: "{value}" + unity},
			tickInterval : intv,
			plotLines : getPlotLines(intv),
			lineColor: "#D8D8D8",
			lineWidth : 1
		},
		series : [
			getSeriesDataItem(data.xType, "上行", data.intv, calYAxis4Flow(data.flowT).data, data.from, strJump),
			getSeriesDataItem(data.xType, "下行", data.intv, calYAxis4Flow(data.flowR).data, data.from, strJump)
		]
	};
}

function format4Resources(data, strJump){
	return {
        xAxis: XAxisConfig[data.xType],
        yAxis: YAxisConfig[data.srcType],
        series: [
        	getSeriesDataItem(data.xType, "CPU", data.intv, data.cpu, data.from, strJump),
        	getSeriesDataItem(data.xType, "内存", data.intv, data.mem, data.from, strJump)
        ]
    };
}

var t_area = new IX.ITemplate({tpl: [
'<div class="nv-chart">',
	'<div class="nvc-type minitor">',
		'<a class="actived" data-href="$nvcharts.pick" data-key="resource">资源使用率</a>',
		'<a data-href="$nvcharts.pick" data-key="flow">网络流量</a>',
	'</div>',
	'<div class="nvc-type stat">',
		'<a class="actived" data-href="$nvcharts.pick" data-key="host">主机</a>',
		'<a data-href="$nvcharts.pick" data-key="vhost">虚拟机</a>',
	'</div>',
	'<div class="nvc-date">',
		'<a data-href="$nvcharts.pick" data-key="24h">近24h</a>',
	  	'<a class="actived" data-href="$nvcharts.pick" data-key="week">本周</a>',
		'<a data-href="$nvcharts.pick" data-key="month">本月</a>',
	'</div>',
	'<div class="nvc-area"></div>',
	'<div class="nvc-foot">',
		'<span class="cpu"></span><span class="cpu-txt">CPU</span>',
		'<span class="mem"></span><span class="mem-txt">内存</span>',
	'</div>',
	'<div class="chartbtn prev"><a data-href="$nvChart.jump" data-key="prev" data-value=""></a></div>',
	'<div class="chartbtn next hide"><a data-href="$nvChart.jump" data-key="next" data-value=""></a></div>',
'</div>',

'']});


var loader = IX.emptyFn;
IXW.Actions.configActions([["nvcharts.pick", function(params, el){
	if ($XH.hasClass(el, "actived") && $XH.hasClass(el, "curActived"))
		return;

	var pNode = el.parentNode;
	$XH.removeClass($XH.first(pNode, "actived"), "actived");
	$XH.removeClass($XH.first(pNode, "curActived"), "curActived");
	$XH.addClass(el, "actived");

	var _el = $XH.ancestor(el, "nv-chart");
	var _type = $XD.dataAttr($XH.first(jQuery(_el).find(".nvc-type.actived")[0], "actived"), "key");
	var _date = $XD.dataAttr($XH.first($XH.first(_el, "nvc-date"), "actived"), "key");

	$XH[_type=="flow"?"addClass":"removeClass"]($XH.first(_el, "nvc-foot"), "hide");
	if (_type === "flow"){
		jQuery(".cpu-txt").html("上行");
		jQuery(".mem-txt").html("下行");
	}else if(_type === "resource"){
		jQuery(".cpu-txt").html("CPU");
		jQuery(".mem-txt").html("内存");
	}
	var from = getSecTime4FirstDay(_date);
	var to  = getSecTime4LastDay(_date);
	if(_type === "host" || _type === "vhost"){
		loader("resource", _date, _type, from, to, "", refreshIntervalFn, cancelIntervalFn);
	}else{
		loader(_type, _date, "", from, to, "", refreshIntervalFn, cancelIntervalFn);
	}
}],["nvChart.jump", function(params, el){
	var key = params.key;
	var module = "";
	var _el = $XH.ancestor(el, "nv-chart");
	var _type = $XD.dataAttr($XH.first($XH.first(_el, "nvc-type"), "actived"), "key");
	var _date = $XD.dataAttr($XH.first($XH.first(_el, "nvc-date"), "actived"), "key");
	if(_type === "host" || _type === "vhost"){
		_type = "resource";
		module = _type;
	}
	$XH[_type=="flow"?"addClass":"removeClass"]($XH.first(_el, "nvc-foot"), "hide");
	if (key === "prev"){
		var from = parseInt($XD.dataAttr(el, "value"));
		var prevFrom = getPrevSecTime4FirstDay(_date, from);
		var prevTo = getPrevSecTime4LastDay(from);
		loader(_type, _date, module, prevFrom,prevTo,key, "", cancelIntervalFn);
	}else if (key === "next"){
		var to = parseInt($XD.dataAttr(el, "value"));
		var nextFrom = getNextSecTime4FirstDay(to);
		var nextTo = getNextSecTime4LastDay(_date, to);
		loader(_type, _date, module, nextFrom,nextTo,key, refreshIntervalFn, cancelIntervalFn);
	}
}]]);

IX.ns("SDV.Chart");
/** cfg :{
	container:areaContainers
	dataLoader:function(params, cbFn)
} */
SDV.Chart.NVCharts = function(cfg){
	var chart = null;
	var container = $XP(cfg,  "container");
	var chartType = $XP(cfg, "type", "");
	var module = "";
	if(chartType === "stat") module = "host";
	var el = $X(container);
	if (!el)
		return;
	var from = 0;
	var to = 0;
	from = getSecTime4FirstDay("week");
	to = getSecTime4LastDay("week");
	var date = new Date(from * 1000);
	var dataLoader = $XF(cfg, "dataLoader");
	refreshIntervalFn = $XF(cfg, "refreshIntervalFn");
	cancelIntervalFn = $XF(cfg, "cancelIntervalFn");
	var nowSrcType = "", nowxType = "", nowModule = "";
	loader = function(srcType, xType, module, from, to, strJump,refreshIntervalFn,cancelIntervalFn){
		$XD.setDataAttr(jQuery(".prev a")[0], "value", from);
		$XD.setDataAttr(jQuery(".next a")[0], "value", to);
		var el = $XH.first(jQuery(".nvc-date")[0], "actived");
		if (new Date(to*1000).getDate() === new Date().getDate()){
			jQuery(".next").addClass("hide");
			$XH.addClass(el, "curActived");
		}else{
			jQuery(".next").removeClass("hide");
			$XH.removeClass(el, "curActived");
		}
		dataLoader({
			module : module,
			srcType : srcType,
			xType : xType,
			from : from,
			to : to
		}, function(data){
			var chartCfg = (data.srcType === "flow"? format4FlowChart : format4Resources)(IX.inherit(data, {from:from, to: to}), strJump);
			chart =jQuery($X(container)).find(".nvc-area").highcharts(chartCfg);
			nowSrcType = srcType;
			nowxType = xType;
			nowModule = module;
			if(IX.isFn(cancelIntervalFn)) cancelIntervalFn();
			if(IX.isFn(refreshIntervalFn)) refreshIntervalFn();
		});

	};

	$X(container).innerHTML = t_area.renderData();
	if(chartType) jQuery(".nvc-type." + chartType).addClass("actived");
	loader("resource", "week", module, from, to, "", refreshIntervalFn, cancelIntervalFn);
	return {
		refresh : function(){
			var from = getSecTime4FirstDay(nowxType);
			var to = getSecTime4LastDay(nowxType);
			$XD.setDataAttr(jQuery(".prev a")[0], "value", from);
			$XD.setDataAttr(jQuery(".next a")[0], "value", to);
			//loader(nowSrcType, nowxType, from, to, "");
			dataLoader({
				module : nowModule,
				srcType : nowSrcType,
				xType : nowxType,
				from : from,
				to : to
			}, function(data){
					var seriesData = (data.srcType === "flow"? format4FlowChart : format4Resources)(IX.inherit(data, {from:from, to: to}), "").series;
					chart.series[0].setData(seriesData[0].data, true, true);
					chart.series[1].setData(seriesData[1].data, true, true);
			});
		}
	};
};
})();
(function () {var t_login = new IX.ITemplate({tpl: [
	'<div class="bg login-bg"><img src="{background}"></div>',
	'<div id="c0"></div>',
	'<div class="layout" id="layoutbg"><img src="{layoutbg}"></div>',
	'<div class="container">',
		'<ul id="loginDialog" class="{animationClz}">',
			'<li class="title">',
				'<div class="light"></div>',
				'<div class="text"></div>',
			'</li>',
			'<ul class="loginInfo"><li>',
				'<span class="pic-user"></span>',
				'<input type="text" id="account" tabindex="1" >',
				'<label id="account-p">请输入用户名</label>',
			'</li>',
			'<li>',
				'<span class="pic-psd"></span>',
				'<input type="password" id="password" tabindex="2">',
				'<label id="password-p">请输入密码</label>',
			'</li>',
			'<li class="check">',
				'<div id="rememberpw" class="l"><a data-href="$login.rember" data-key="psd"><i class="unchecked"></i><span>记住密码</span></a></div>',
				'<div id="autologon" class="r"><a data-href="$login.rember" data-key="auto"><i class="unchecked"></i><span>自动登录</span></a></div>',
			'</li>',
			'<li class="btn">',
				'<a id="submit" tabindex="3" data-href="$login">登录</a>',
			'</li></ul>',
			'<li class="mouse">',
				'<div class="icon-mouseup"><span></span></div>',
				'<div class="points">',
					'<span class="point1"></span><span class="point2"></span><span class="point3"></span>',
				'</div>',
				'<div class="icon-mouse"><span></span></div>',
			'</li>',
		'</ul>',
	'</div>',
	'<div class="footer">',
		'<div class="copy">',
		'</div>',
	'</div>',
'']});

var waveBG = null;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function initParticle( particle, delay ) {
	particle = this instanceof THREE.Sprite ? this : particle;
	delay = delay !== undefined ? delay : 0;

	particle.position.set( 0, 0, 0 );
	particle.scale.x = particle.scale.y = Math.random() * 32 + 16;

	new TWEEN.Tween( particle )
		.delay( delay )
		.to( {}, 10000 )
		.onComplete( initParticle )
		.start();

	new TWEEN.Tween( particle.position )
		.delay( delay )
		.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
		.start();

	new TWEEN.Tween( particle.scale )
		.delay( delay )
		.to( { x: 0.01, y: 0.01 }, 10000 )
		.start();
}
function WaveBackground(container){
	var enabled = true;
	var mouseX = 0, mouseY = 0;
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;
	var scene = new THREE.Scene();
	var material = new THREE.SpriteMaterial( {
		map: new THREE.CanvasTexture( generateSprite() ),
		blending: THREE.AdditiveBlending
	} );
	var particle;
	for ( var i = 0; i < 1000; i++ ) {
		particle = new THREE.Sprite( material );
		initParticle( particle, i * 10 );
		scene.add( particle );
	}

	var renderer = new THREE.CanvasRenderer();
	//renderer.setClearColor( 0x000080 );
	renderer.setClearColor(0x0a2a40,1.0);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	function generateSprite() {
		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 16;

		var context = canvas.getContext( '2d' );
		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
		gradient.addColorStop( 0, '#8ef6ff' );
		gradient.addColorStop( 0.2, '#34c0c5' );
		gradient.addColorStop( 0.4, 'rgba(0,0,10,1)' );
		gradient.addColorStop( 1, 'rgba(0,0,0,0.5)' );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );
		return canvas;
	}
	function animate() {
		if (!enabled) return;
		requestAnimationFrame( animate );
		render();
	}
	function render(){
		TWEEN.update();
		camera.position.x += ( mouseX - camera.position.x ) * 0.05;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
	}
	function resize(w,h){
		windowHalfX = w / 2;
		windowHalfY = h / 2;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}
	function move(evt){
		mouseX = evt.clientX - windowHalfX;
		mouseY = evt.clientY - windowHalfY;
	}
	animate();
	return {
		disable : function(){enabled = false;},
		resize : resize,
		move : move
	};
}
function saveUserInfoCookie(data){
	var rememberpw = $XP(data, "rememberpw");
	var autologon = $XP(data, "autologon");
	var username = $XP(data, "username");
	var password = $XP(data, "password");
	var type = $XP(data, "type", 0);
	var version = $XP(data, "version", "1.0");
	var id = $XP(data, "id");
	if(rememberpw){
		jQuery.cookie("rememberpw", "true", { expires: 7 });
		jQuery.cookie("account", username, { expires: 7 });
		jQuery.cookie("password", password, { expires: 7 });
		jQuery.cookie("type", type, { expires: 7 });
		jQuery.cookie("version", version, { expires: 7 });
		jQuery.cookie("id", type, { expires: 7 });
	}else{
		jQuery.cookie("rememberpw", "true");
		jQuery.cookie("account", username);
		jQuery.cookie("password", password);
		jQuery.cookie("type", type);
		jQuery.cookie("version", version);
		jQuery.cookie("id", id);
	}
	if(autologon){
		jQuery.cookie("autologon", "true", { expires: 7 });
	}else{
		jQuery.cookie("autologon", "true");
	}
}
function clearCookie(){
	jQuery.cookie("account", "", { expires: -1 });
	jQuery.cookie("password", "", { expires: -1 });
	jQuery.cookie("type", "", {expires : -1});
	jQuery.cookie("version", "", {expires : -1});
	jQuery.cookie("id", "", {expires : -1});
	jQuery.cookie("autologon", "false", { expires: -1 });
	jQuery.cookie("rememberpw", "false", { expires: -1 });
}
var ixwPages = IXW.Pages;
IXW.Actions.configActions([["login", function(){
	var username = $X('account').value;
	var password = $X('password').value;
	var rememberpw = jQuery("#rememberpw i").hasClass("checked");
	var autologon = jQuery("#autologon i").hasClass("checked");
	SDV.Global.entryCaller("login", {
		username :username,
		password : password
	}, function(data){
			saveUserInfoCookie(IX.inherit(data, {username : username, password : password, rememberpw : rememberpw, autologon : autologon}));
			SDV.Env.resetSession(data);
			ixwPages.load("");
	});
}], ["login.rember", function(params, el){
	var key = params.key;
	var checked = jQuery(el).find("i");	
	if(checked.hasClass("unchecked")){
		checked.removeClass("unchecked");
		checked.addClass("checked");
		if(key === "auto"){
			var pswChecked = jQuery('#rememberpw i');
			if(pswChecked.hasClass('unchecked')){
				pswChecked.removeClass('unchecked');
				pswChecked.addClass('checked');
			}
		}
	}else{
		checked.removeClass("checked");
		checked.addClass("unchecked");
	}
}]]);
function onResize4Body(){
	var screenY = document.documentElement.clientHeight-80;
	var height = jQuery("#loginDialog").height();
	var marginY = Math.round((screenY - 319)/2);
	jQuery("#loginDialog").css("marginTop" , marginY+"px");
}
$Xw.bind({"resize" : function(){
	if (!waveBG) return;
	waveBG.resize(window.innerWidth, window.innerHeight);
}});
IX.ns("SDV.Entry");
SDV.Entry.clearCookie = clearCookie;
SDV.Entry.init = function(pageCfg, pageParams, cbFn){
	pageCfg.switchOut = function(curContext,nextContext){
		if (waveBG) waveBG.disable();
		waveBG = null;
	};
	if (SDV.Env.hasSession() /*|| jQuery.cookie("account")*/){
		/*SDV.Env.resetSession({id :  jQuery.cookie("id"), name : jQuery.cookie("account"), type : jQuery.cookie("type"), version : jQuery.cookie("version")});*/
		ixwPages.load("");
		return;
	}
	document.body.innerHTML = t_login.renderData("",{
		background: SDV.Global.backgroundUrl,
		layoutbg : SDV.Global.layoutbgUrl,
		animationClz : IX.isChrome ? "animationLogin" : ""
	});
	if(jQuery.cookie("rememberpw") == "true"){
		jQuery("#rememberpw i").removeClass("unchecked");
		jQuery("#rememberpw i").addClass("checked");
		$X('account').value = jQuery.cookie("account");
		$X('password').value = jQuery.cookie("password");
		jQuery('#account-p').hide();
		jQuery('#password-p').hide();
	}
	if(IX.isChrome){
		waveBG = new WaveBackground($X('c0'));
		IX.bind($X('layoutbg'), {
			"mousemove" : waveBG.move
		});
		jQuery("#loginDialog").hover(function(){
			$XH.addClass(this, "hover");
		},function(){
			$XH.removeClass(this, "hover");
		});
		jQuery("#loginDialog").bind("click", function(){
			jQuery("#loginDialog .mouse").addClass("hide");
			jQuery("#loginDialog .loginInfo").addClass("active");
			jQuery("#loginDialog .title").addClass("active");
		});
	}
	onResize4Body();
	$Xw.bind({"resize" : onResize4Body});
	var aEl = $X("submit");
	jQuery('#account-p').bind("click",function(){
		jQuery('#account').focus();
	});
	jQuery('#password-p').bind("click",function(){
		jQuery('#password').focus();
	});

	jQuery('#account').bind("keydown", function(e){
		if ( e.which == 13)
			$X('password').focus();
	});
	jQuery('#password').bind("keydown", function(e){
		if ( e.which == 13)
			ixwPages.jump(aEl);
	});
	jQuery('#account').bind("focus", function(){
		var liEl = $XD.ancestor($X('account'), "li");
		$XH.addClass(liEl, "focus");
		jQuery('#account-p').hide();
	});
	jQuery('#account').bind("blur", function(){
		var liEl = $XD.ancestor($X('account'), "li");
		$XH.removeClass(liEl, "focus");
		if(this.value.length === 0){
			jQuery('#account-p').show();
		}
	});
	jQuery('#password').bind("focus", function(){
		var liEl = $XD.ancestor($X('password'), "li");
		$XH.addClass(liEl, "focus");
		jQuery('#password-p').hide();
	});
	jQuery('#password').bind("blur", function(){
		var liEl = $XD.ancestor($X('password'), "li");
		$XH.removeClass(liEl, "focus");
		if(this.value.length === 0){
			jQuery('#password-p').show();
		}
	});
};
})();
(function () {
IX.ns("SDV.ErrPage");
SDV.ErrPage.init = function(pageCfg, pageParams, cbFn){
	document.body.innerHTML = "ERROR";

};
})();
(function () {
var caller = SDV.Global.serviceCaller;
var sdvDialog = SDV.Dialog;
var showDialog = SDV.Dialog.show;
var hideDialog = SDV.Dialog.hide;
var globalActionConfig = IXW.Actions.configActions;
var dropdownBox = SDV.inputBox.dropdownBox();
var inputBox = SDV.inputBox.inputBox();
var productHT = IX.IListManager(), versionHT = IX.IListManager(), serviceHT = IX.IListManager(), hostHT = IX.I1ToNManager();
var distanceUrl;
var ips=[];
var hosts=[];
var productConst = SDV.Const.ProductInfo;
var hostRestRsc={}, origHostRestRsc = {};

var t_addServicePart = new IX.ITemplate({tpl: [
	'<div class="contentRow">',
		'<span class="label">产品</span>{productHTML}<span class=\'mark\'>*</span>',
	'</div>',
	'<div class="version contentRow opacity">',
		'<span class="label">版本</span>{versionHTML}<span class=\'mark\'>*</span>',
		'<div class="rowMask"></div>',
	'</div>',
	'<div class="service contentRow opacity">',
		'<span class="label">服务</span>{serviceHTML}<span class=\'mark\'>*</span>',
		'<div class="prompt centerRed {hideClz}"></div>',
		'<div class="rowMask"></div>',
	'</div>',
'']});
var t_addService4OVPart = new IX.ITemplate({tpl: [
	'<input type="hidden" id="dlgProduct" value = "{pValue}">',
	'<input type="hidden" id="dlgVersion" value = "{vValue}">',
	'<input type="hidden" id="dlgService" value = "{sValue}">',
'']});
var t_addService = new IX.ITemplate({tpl: [
	'<div class="container-body active">{partHTML}',
		'<div class="contentRow addBtn1 {opacityClz}">',
			'<span class="label">IP地址</span><a class="addBtn" data-href="$serviceDialog.addIP">添加</a><span class=\'mark\'>*</span>',
			'<div class="rowMask"></div>',
		'</div>',
		'<div class="ipsAndHosts">{addedIPsHTML}</div>',
		'<div class="contentRow addBtn2 hide">',
			'<span class="label"></span><a class="addBtn" data-href="$serviceDialog.addIP">添加</a>',
		'</div>',
		'<div class="ConfigDetail opacity {hideClz}" id="dlgConfigDetail">{configDetailHTML}<div class="rowMask"></div></div>',
		'<div class="rscConfig contentRow {hideClz}">',
			'<input type="hidden" id="dlgRscConfig" value="0">',
			'<div class="default">',
				'<a data-href="$check.select" data-key = "0" ><span class="checkbox selected"></span></a><span class="text">默认</span>',
			'</div>',
			'<div class="custom">',
				'<a data-href="$check.select" data-key = "1"><span class="checkbox"></span></a><span class="text">自定义</span>',
			'</div>',
		'</div>',
	'</div>',
	'<div class="container-addition">{additionHTML}</div>',
'']});
var t_addedIPsContainer = new IX.ITemplate({tpl: ['<tpl id="addedIPs">','<div class="group">',
	'<div class="ip contentRow">',
		'<input id="dlgIp-{idNum}" type="hidden" value="{value}">',
		'<span class="label">IP（{num}）</span><span class="value">{value}</span>',
		'<a class=\'pic-close\' data-href=\'$ip.delete\' data-key="value"></a>',
	'</div>',
	'<div class="host contentRow">',
		'<span class="label">所属主机</span>{hostHTML}<span class=\'mark\'>*</span>',
	'</div></div>',
'</tpl>','']});
var t_availRsrcsContainer = new IX.ITemplate({tpl: ['<tpl id="availRsrcs">',
	'<li class="dropdown-item" title="{title}"><a data-href="$serviceDialog.chose"  data-key="{key}">{html}</a></li>',
'</tpl>','']});
var t_ipsContainer = new IX.ITemplate({tpl: ['<tpl id="availIps">',
	'<li id="menu-{value}"><a class="checkbox" data-href="$ip.select" data-key="{value}"></a><span>{value}</span></li>',
'</tpl>','']});
var t_editService = new IX.ITemplate({tpl: ['<div class="ConfigDetail">{configDetailHTML}</div>','']});
var t_ConfigDetail = new IX.ITemplate({tpl: [
	'<div class="contentRow">',
		'<span class="label">占用CPU</span>{occupyCpu}核<span class=\'mark\'>*</span><span class="prompt">{pmt4occupyCpu}</span>',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">虚拟CPU</span>{virtualCpu}核<span class=\'mark\'>*</span><span class="prompt">{pmt4virutalCpu}</span>',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">内存</span>{mem}GB<span class=\'mark\'>*</span><span class="prompt">{pmt4mem}</span>',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">硬盘</span>{disk}GB<span class=\'mark\'>*</span><span class="prompt">请输入大于等于 {min} 的数值</span>',
	'</div>',
'']});

var t_recovery = new IX.ITemplate({tpl: [
	'<div class="prompt {hideClz}" style="color:#ffba00"><span class="ico-prompt"></span>全量备份恢复，运行中的服务会自动关机</div>',
	'<div class="contentRow">',
		'<span class="label">恢复对象</span>{recoveryObjHTML}<span class=\'mark\'>*</span>',
	'</div>',
'']});
var t_vncDialog = new IX.ITemplate({tpl: [
	'<div class="vncbtns">',
		'<a class="r clostbtn" data-href="$serviceDialog.close"></a>',
		'<a id="openInNewWindow" class="r" target="_blank" title="在新窗口打开" data-href="$serviceDialog.close">新窗口打开</a>',
	'</div>',
	'<div class="content"><iframe id="vncframe" src="{url}"></iframe></div>',
'']});
var t_backup = new IX.ITemplate({tpl: [
	'<input type="hidden" id="dlgServStaus" value = "{value}">',
	'<div class="bkway prompt hide" style="color:#ffba00"><span class="ico-prompt"></span>全量备份，运行中的服务会自动关机</div>',
	'<div class="contentRow">',
		'<span class="label">备份时间</span>{bkTimeHTML}',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">备份周期</span>{bkCycleHTML}天',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">备注</span><textarea id="dlgComment"></textarea>',
	'</div>',
'']});

var serviceCfg = {
	product : {id : "dlgProduct", inputClz : "required", type : "product"},
	version : {id : "dlgVersion", inputClz : "required",type : "version"},
	service : {id : "dlgService", inputClz : "required", type : "service"},
	ip : {id : "dlgIp", inputClz : "required"},
	host : {id : "dlgHost", inputClz : "required", type : "host"},
	occupyCpu : {id : "dlgOccupyCpu", inputClz : "required num numLimit rscLimit", quota : 8, min :1},
	virtualCpu : {id : "dlgVirtualCpu", inputClz : "required num numLimit", quota : 8, min :1},
	mem : {id : "dlgMem", inputClz : "required num numLimit rscLimit", quota : 8, min :1},
	disk : {id : "dlgDisk", inputClz : "required num numLimit rscLimit",quota : "无穷大", min :1},
	recovery : {id : "dlgRecovery", inputClz : "required", type : "recovery",  value : "本机"},
	bkway : {id : "dlgBkWay", type : "backup", inputClz : "required"},
	bkCycle : {id : "dlgBkCycle", inputClz : "num"}
};
var range4cfg = {//根据os
	0 : {
		occupyCpu : {text : "请输入 1-16 之间的数值", num : 16},
		virtualCpu : {text : "虚拟CPU不超过占用CPU的100倍", num : "倍数"},
		mem : {text : "请输入 1-32 之间的数值", num :32}
	},
	1 : {
		occupyCpu : {text : "请输入 1-4 之间的数值", num :4},
		virtualCpu : {text : "请输入 1-4 之间的数值", num :4},
		mem : {text : "请输入 1-4 之间的数值", num :4}
	},
	2 : {
		occupyCpu : {text : "请输入 1-8 之间的数值", num : 8},
		virtualCpu : {text : "请输入 1-8 之间的数值", num : 8},
		mem : {text : "请输入 1-8 之间的数值", num : 8}
	}
};
function resizeBodyEl(){
	var bodyEl = jQuery("#nv-dialog .ixw-body")[0];
	var containerBodyEl =jQuery(bodyEl).find(".container-body");
	var areaEl = $(bodyEl).find(".area");
	if(containerBodyEl.height() > 500 && !$(".ixw-body .container-addition").hasClass("active")){
		areaEl.height(500);
		areaEl.css("overflow","auto");
	}else{
		areaEl.height("auto");
		areaEl.css("overflow","visible");
	}
	var posY = ($Xw.getScreen().size[1]- bodyEl.offsetHeight)/2;
	posY = posY > 300? (posY-100): Math.max(posY, 0);
	bodyEl.style.marginTop = (0- bodyEl.offsetHeight- posY) + "px";
}
function getConfigDetailHTML(type, info){
	var occupyCpu, virtualCpu, mem, disk, pmt4occupyCpu="", pmt4virutalCpu = "",pmt4mem = "",min =1;
	if(type){
		var os = $XP(info, "os");
		var clz = "required num numLimit";
		if(os === 0) clz = "required num numLimit compareNum";
		occupyCpu = inputBox.getHTML(IX.inherit(serviceCfg.occupyCpu, {quota : range4cfg[os].occupyCpu.num, inputClz : clz}),$XP(info, "occupyCpu"));
		virtualCpu = inputBox.getHTML(IX.inherit(serviceCfg.virtualCpu, {quota : range4cfg[os].virtualCpu.num, inputClz : clz}),$XP(info, "virtualCpu"));
		mem = inputBox.getHTML(IX.inherit(serviceCfg.mem, {quota : range4cfg[os].mem.num}),$XP(info,"mem"));
		disk = inputBox.getHTML(serviceCfg.disk,$XP(info,"disk"), type === "edit" ? $XP(info,"disk") : "");
		pmt4occupyCpu  = range4cfg[os].occupyCpu.text;
		pmt4virutalCpu = range4cfg[os].virtualCpu.text;
		pmt4mem = range4cfg[os].mem.text;
		if(type === "edit") min = $XP(info,"disk");
	}else{
		occupyCpu = inputBox.getHTML(serviceCfg.occupyCpu);
		virtualCpu = inputBox.getHTML(serviceCfg.virtualCpu);
		mem = inputBox.getHTML(serviceCfg.mem);
		disk = inputBox.getHTML(serviceCfg.disk);
	}
	return t_ConfigDetail.renderData("", {
		occupyCpu : occupyCpu,
		virtualCpu : virtualCpu,
		mem : mem,
		disk : disk,
		pmt4occupyCpu : pmt4occupyCpu,
		pmt4virutalCpu : pmt4virutalCpu,
		pmt4mem : pmt4mem,
		min : min
	});
}
//更新页面信息
function updatePage(type,el, oldValue){
	var areaEl = $XH.ancestor(el, "area");
	var ipsAndHostsEl  = jQuery(areaEl).find(".ipsAndHosts");
	var pname, vname;
	if($X('dlgProduct')) pname = $X('dlgProduct').value;
	if($X('dlgVersion')) vname = $X('dlgVersion').value;
	hostRestRsc = jQuery.extend(true, {}, origHostRestRsc);
	if(type === "product"){
		jQuery(areaEl).find(".version").removeClass("opacity");
		jQuery(areaEl).find(".version .dropdown-menu").html(getAvailList(productHT.get(pname)));
	}else if(type === "version"){
		jQuery(areaEl).find(".service").removeClass("opacity");
		jQuery(areaEl).find(".service .dropdown-menu").html(getAvailList(versionHT.get(pname+"-"+vname)));
	}else if(type === "service"){
		jQuery(areaEl).find(".ConfigDetail").removeClass("hide");
		jQuery(areaEl).find(".rscConfig").removeClass("hide");
		jQuery(areaEl).find(".addBtn1").removeClass("opacity");
		jQuery(areaEl).find(".service .prompt").html("").addClass("hide");
	}
	if(oldValue){
		ipsAndHostsEl.html("");
		jQuery(areaEl).find(".addBtn1").removeClass("hide");
		jQuery(areaEl).find(".addBtn2").addClass("hide");
		if(type !=="service"){
			jQuery(areaEl).find(".ConfigDetail").addClass("hide");
			jQuery(areaEl).find(".rscConfig").addClass("hide");
			$X('dlgService').value ="";
			jQuery(areaEl).find(".service .dropdown-toggle .value").html("");
			jQuery(areaEl).find(".addBtn1").addClass("opacity");
			if(type === "product"){
				jQuery(areaEl).find(".service").addClass("opacity");
				$X('dlgVersion').value ="";
				jQuery(areaEl).find(".version .dropdown-toggle .value").html("");
				jQuery(".area .service .prompt").html("").addClass("hide");
			}
		}else{
			jQuery(areaEl).find(".ConfigDetail").addClass("opacity");
		}
	}
}
globalActionConfig([["serviceDialog.chose", function(params, el){
		var dropdownEl = $XH.ancestor(el, "dropdown");
		if(!dropdownEl) return;
		var value = el.innerHTML;
		var key =params.key;
		var type = $XD.dataAttr(dropdownEl, "type");
		var valueEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "value");
		var inputEl = $XD.first(dropdownEl, "input");
		if(inputEl.value === value || inputEl.value === key) return;
		var oldValue = inputEl.value;//下拉框选择之前选中的值
		inputEl.value =key;
		valueEl.innerHTML = value;
		var pname, vname,sname, ipsAndHostsEl;
		if(type === "product"){
			updatePage(type, el, oldValue);
			resizeBodyEl();
		}else if(type === "version"){
			updatePage(type, el, oldValue);
			resizeBodyEl();
		}else if(type === "service"){
			updatePage(type, el, oldValue);
			var isCheck=0;
			pname = $X('dlgProduct').value;
			vname = $X('dlgVersion').value;
			sname = $X('dlgService').value;
			var condition1 = pname === productConst[0].name && (sname === productConst[0].services[1] || sname === productConst[0].services[2] || sname === productConst[0].services[3]);
			var condition2 = pname === productConst[1].name && (sname === productConst[1].services[0] || sname === productConst[1].services[2]);
			var condition3 = pname === productConst[2].name && sname === productConst[2].services[3];
			var condition4 = pname === productConst[3].name && (sname === productConst[3].services[0] || sname === productConst[3].services[1]);
			if(condition1 || condition2 || condition3 || condition4) isCheck = 1;
			if(isCheck){
				caller("checkNeedOther", {product : pname, version : vname, service : sname}, function(data){
					var isPrompt = $XP(data, "isPrompt");
					if(isPrompt){
						var names = $XP(data, "names",[]).join("和");
						var promptMsg = "系统中还未创建" + names + ",会影响"+sname+"部分功能的使用!";
						var contentRowEl = $XH.ancestor(el, "contentRow");
						var promptEl = $XH.first(contentRowEl, "prompt");
						if(promptEl) {promptEl.innerHTML = promptMsg; $XH.removeClass(promptEl, "hide");}
					}
				});
			}
			var cfg = serviceHT.get(pname+"-"+vname +"-"+value);
			var os = $XP(cfg, "os",0);
			var dlgOccupyCpuEl = $X('dlgOccupyCpu');
			var dlgVirtualCpuEl = $X('dlgVirtualCpu');
			var dlgMemEl = $X('dlgMem');
			var dlgDiskEl= $X('dlgDisk');
			//修改默认的配置项
			dlgOccupyCpuEl.value = $XP(cfg, "occupyCpu");
			dlgVirtualCpuEl.value = $XP(cfg, "virtualCpu");
			dlgMemEl.value = $XP(cfg, "mem");
			dlgDiskEl.value = $XP(cfg, "disk");
			//修改提示数字限制信息，以及更新quota值
			var cpuText= range4cfg[os].occupyCpu.text;
			var cpuNum = range4cfg[os].occupyCpu.num;
			var memText = range4cfg[os].mem.text;
			var memNum = range4cfg[os].mem.num;
			var VcpuText = range4cfg[os].virtualCpu.text;
			var VcpuNum =  range4cfg[os].virtualCpu.num;
			var promptEl4occupyCpu = $XH.first($XH.ancestor(dlgOccupyCpuEl, "contentRow"), "prompt");
			var promptEl4virtualCpu = $XH.first($XH.ancestor(dlgVirtualCpuEl, "contentRow"), "prompt");
			var promptEl4mem = $XH.first($XH.ancestor(dlgMemEl, "contentRow"), "prompt");
			promptEl4occupyCpu.innerHTML = cpuText;
			promptEl4virtualCpu.innerHTML = VcpuText;
			promptEl4mem.innerHTML = memText;
			$XD.setDataAttr(dlgOccupyCpuEl, "quota", cpuNum);
			$XD.setDataAttr(dlgVirtualCpuEl, "quota", VcpuNum);
			$XD.setDataAttr(dlgMemEl, "quota", memNum);
			if(os ===0){
				$XH.addClass(dlgOccupyCpuEl, "compareNum");
				$XH.addClass(dlgVirtualCpuEl, "compareNum");
			}else{
				$XH.removeClass(dlgOccupyCpuEl, "compareNum");
				$XH.removeClass(dlgVirtualCpuEl, "compareNum");
			}
			IX.map(jQuery(".area .ConfigDetail input.morelimit"), function(item){
				$XH.removeClass(item, "morelimit");
			});
			IX.map(jQuery(".area .ConfigDetail input.requiredMark"), function(item){
				$XH.removeClass(item, "requiredMark");
			});
			//保存默认值
			var defaultAEl = jQuery(".rscConfig .default a")[0];
			jQuery(defaultAEl).find(".checkbox").addClass("selected");
			$XD.setDataAttr(defaultAEl, "occupyCpu", $XP(cfg, "occupyCpu"));
			$XD.setDataAttr(defaultAEl, "virtualCpu", $XP(cfg, "virtualCpu"));
			$XD.setDataAttr(defaultAEl, "mem", $XP(cfg, "mem"));
			$XD.setDataAttr(defaultAEl, "disk", $XP(cfg, "disk"));
			//保存初始化自定的值
			var customAEl = jQuery(".rscConfig .custom a")[0];
			jQuery(customAEl).find(".checkbox").removeClass("selected");

			$XD.setDataAttr(customAEl, "occupyCpu", $XP(cfg, "occupyCpu"));
			$XD.setDataAttr(customAEl, "mem", $XP(cfg, "mem"));
			$XD.setDataAttr(customAEl, "disk", $XP(cfg, "disk"));
			resizeBodyEl();
		}else if(type === "host"){
			valueEl.innerHTML = key;
			pname = $X('dlgProduct').value;
			vname = $X('dlgVersion').value;
			sname = $X('dlgService').value;
			ipsAndHostsEl = $XH.ancestor(el, "ipsAndHosts");
			var inputs = jQuery(ipsAndHostsEl).find(".dropdown input");
			var isContinue = true;
			var isDeployed;
			if(sname === productConst[5].services[0] || sname === productConst[7].services[0]){
				if(!inputs.length) return;
				caller("checkIsDeployed", {product : pname, version : vname, service : sname, host : key}, function(data){
					isDeployed = $XP(data, "isDeployed");
					if(isDeployed){
						isContinue = false;
						sdvDialog.alert("主机上"+key+"已部署了"+sname+"，请选择其他主机", function(){
							inputEl.value = "";
							valueEl.innerHTML = "";
						});
					}else{
						IX.map(inputs, function(item){
							if(!jQuery(item).is(jQuery(inputEl))){
								if(item.value === inputEl.value){
									isContinue = false;
									sdvDialog.alert("主机"+key+"上已选择了部署"+sname+"，请选择其他主机", function(){
										inputEl.value = "";
										valueEl.innerHTML = "";
									});
								}
							}
						});
					}
					if(isContinue) updateHostRscInfo(el, oldValue);
				});
			}else if(sname === productConst[6].services[1] || sname === productConst[6].services[2] || sname === productConst[0].services[3]){
				if(!inputs.length) return;
				caller("checkIsDeployed", {name : sname}, function(data){
					isDeployed = $XP(data, "isDeployed");
					if(isDeployed){
						sdvDialog.confirmAlert("提示","主机"+key+"上已部署了"+sname+"，本次操作可能会降低性能，是否继续", function(){
								updateHostRscInfo(el, oldValue);
							}, function(){
								inputEl.value = "";
								valueEl.innerHTML = "";
							});
					}else{
						IX.map(inputs, function(item){
							if(!jQuery(item).is(jQuery(inputEl))){
								if(item.value === inputEl.value){
									sdvDialog.confirmAlert("提示","主机"+key+"上已选择了部署"+sname+"，本次操作可能会降低性能，是否继续", function(){
										updateHostRscInfo(el, oldValue);
									}, function(){
										inputEl.value = "";
										valueEl.innerHTML = "";
									});
								}
							}
						});
					}
				});
			}else{
				updateHostRscInfo(el, oldValue);
			}
		}

}], ["serviceDialog.close", function(){
	hideDialog();
}], ["check.select", function(params, el){
	var checkEl = $XH.first(el, "checkbox");
	if($XH.hasClass(el, "selected")) return;
	var key = params.key;
	var rscConfig = $XH.ancestor(el, "rscConfig");
	jQuery(rscConfig).find(".selected").removeClass("selected");
	$XH.addClass(checkEl, "selected");
	jQuery(".area .ConfigDetail")[parseInt(key) ? "removeClass" : "addClass"]("opacity");
	$X('dlgRscConfig').value = key;
	if(!parseInt(key)){
		$X('dlgOccupyCpu').value = $XD.dataAttr(el, "occupyCpu");
		$X('dlgVirtualCpu').value = $XD.dataAttr(el, "virtualCpu");
		$X('dlgMem').value = $XD.dataAttr(el, "mem");
		$X('dlgDisk').value = $XD.dataAttr(el, "disk");
	}else{
		jQuery("#dlgOccupyCpu").removeClass("morelimit").removeClass("requiredMark");
		jQuery("#dlgVirtualCpu").removeClass("morelimit").removeClass("requiredMark");
		jQuery("#dlgMem").removeClass("morelimit").removeClass("requiredMark");
		jQuery("#dlgDisk").removeClass("morelimit").removeClass("requiredMark");
	}
}], ["serviceDialog.addIP", function(params, el){
	var areaEl = $XH.ancestor(el, "area");
	var cBodyEL = $XH.first(areaEl, "container-body");
	var ipsAndHostsEl = $XH.first(cBodyEL, "ipsAndHosts");
	var cAdditionEL = $XH.first(areaEl, "container-addition");
	var leftSideEl = $XH.first(cAdditionEL, "leftSide");
	jQuery(leftSideEl).find("li").removeClass("hide").removeClass("added");
	var rightSideEl = $XH.first(cAdditionEL, "rightSide");
	IX.map(jQuery(ipsAndHostsEl).find(".group"), function(item){
		var value = $XD.first($XH.first(item, "ip"), "input").value;
		if(!value) return;
		value = value.replace(/\./g, "\\.");//将.替换为\.
		jQuery(leftSideEl).find("#menu-"+value).addClass("hide").addClass("added");
	});
	jQuery(leftSideEl).find("a.selected").removeClass("selected");

	jQuery(rightSideEl).find("ul").html("");
	$XH.removeClass(cBodyEL, "active");
	$XH.addClass(cAdditionEL, "active");
	var dlgEl = $XH.ancestor(areaEl, "ixw-body");
	var btns = $XH.first(dlgEl, "btns");
	$XH.addClass(btns, "hide");
	resizeBodyEl();
}],["ip.delete", function(params, el){
	var groupEl = $XH.ancestor(el, "group");
	var ipsAndHostsEl = $XH.ancestor(groupEl, "ipsAndHosts");
	var hostEl = $XH.first(groupEl, "host");
	var hostIp = jQuery(hostEl).find("input")[0].value;
	if(hostIp && !$XH.first(hostEl, "prompt")){
		var cpuValue = Number($X('dlgOccupyCpu').value);
		var memValue = Number($X('dlgMem').value);
		var diskValue = Number($X('dlgDisk').value);
		hostRestRsc[hostIp].cpu +=  cpuValue;
		hostRestRsc[hostIp].mem += memValue;
		hostRestRsc[hostIp].disk += diskValue;
		updatePrompt4Host(ipsAndHostsEl,hostIp);
	}
	jQuery(groupEl).remove();
	IX.map(jQuery(ipsAndHostsEl).find(".group"), function(item, index){
		jQuery(item).find(".ip .label").html("IP（"+(index +1)+"）");
	});
	if(ipsAndHostsEl.innerHTML === ""){
		var areaEl = $XH.ancestor(ipsAndHostsEl, "area");
		jQuery(areaEl).find(".addBtn1").removeClass("hide");
		jQuery(areaEl).find(".addBtn2").addClass("hide");
	}
	resizeBodyEl();
}],["bkway.chose", function(params, el){
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if(!dropdownEl) return;
	$XH.removeClass($XH.first(dropdownEl, "dropdown-toggle"), "requiredMark");
	var value = el.innerHTML;
	var key = $XD.dataAttr(el, "key", "");
	var valueEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "value");
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = key;
	valueEl.innerHTML = value;
	var status = $X('dlgServStaus').value;
	var areaEl = $XH.ancestor(dropdownEl, "area");
	var promptEl = $XH.first(areaEl, "prompt");
	if(key === "0" && status === "2"){
		$XH.removeClass(promptEl, "hide");
	}else{
		$XH.addClass(promptEl, "hide");
	}
}]]);
function ipSure(params, el){
	var key=params.key;
	var areaEl = $XH.ancestor(el, "area");
	var cBodyEL = $XH.first(areaEl, "container-body");
	var cAdditionEL = $XH.first(areaEl, "container-addition");
	$XH.removeClass(cAdditionEL, "active");
	$XH.addClass(cBodyEL, "active");
	if(key === "ok"){
		var addingIPs = [];//待添加
		var ipsAndHostsEl = $XH.first(cBodyEL, "ipsAndHosts");
		var rightSideEl = $XH.ancestor(el, "rightSide");
		IX.map(jQuery(rightSideEl).find("ul li"), function(item){
			var addingIP = item.id.split("-")[1];
			addingIPs.push(addingIP);
		});
		jQuery(ipsAndHostsEl).append(t_addedIPsContainer.renderData("", {
			addedIPs : IX.map(addingIPs, function(item, index){
				var hostHTML = "";
				hosts = [];
				for(var o in hostRestRsc){
					hosts.push({
						id : o,
						name :"<span class='item-body'>"+o+ "</span><span class='item-prompt'>剩余 CPU " + hostRestRsc[o].cpu+" 核，内存 " + hostRestRsc[o].mem + " GB,硬盘(GB) " + hostRestRsc[o].disk+ " GB</span>",
						title : o + "剩余 CPU "+hostRestRsc[o].cpu+" 核，内存 " +hostRestRsc[o].mem+" GB，硬盘 " +hostRestRsc[o].disk+" GB"
					});
				}
				hostHTML = dropdownBox.getHTML(IX.inherit(serviceCfg.host, {id : "dlgHost-"+index}), hosts, "serviceDialog.chose");
				return {
					idNum : index,
					num : index +1,
					value : item,
					hostHTML : hostHTML
				};
			})
		}));
		$XH.addClass($XH.first(cBodyEL, "addBtn1"), "hide");
		$XH.removeClass($XH.first(cBodyEL, "addBtn2"), "hide");
		resizeBodyEl();
	}
	var dlgEl = $XH.ancestor(areaEl, "ixw-body");
	var btns = $XH.first(dlgEl, "btns");
	$XH.removeClass(btns, "hide");
}
function updateHostRscInfo(el, oldValue){
	var dropdownEl = $XH.ancestor(el, "dropdown");
	var valueEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "value");
	var inputEl = $XD.first(dropdownEl, "input");
	var key = $XD.dataAttr(el, "key");
	var cpuRest4Host = Number(hostRestRsc[key].cpu);
	var memRest4Host = Number(hostRestRsc[key].mem);
	var diskRest4Host = Number(hostRestRsc[key].disk);

	var cpuValue = Number($X('dlgOccupyCpu').value);
	var memValue = Number($X('dlgMem').value);
	var diskValue = Number($X('dlgDisk').value);

	var hostEl = $XH.ancestor(el, "host");
	var promptEl4Host = $XH.first(hostEl, "prompt");
	var ipsAndHostsEl = $XH.ancestor(el, "ipsAndHosts");
	if(oldValue){
		hostRestRsc[oldValue].cpu += cpuValue;
		hostRestRsc[oldValue].mem += memValue;
		hostRestRsc[oldValue].disk += diskValue;
		updatePrompt4Host(ipsAndHostsEl,oldValue);
	}
	if(cpuValue > cpuRest4Host || memValue > memRest4Host || diskValue > diskRest4Host){
		if(promptEl4Host){
			promptEl4Host.innerHTML = '主机'+key+'资源不足，请选择其他主机';
		}else
			jQuery(hostEl).append('<div class="prompt centerRed">主机'+key+'资源不足，请选择其他主机</div>');
		inputEl.value = "";
		valueEl.innerHTML = "";
		return;
	}else{
		cpuRest4Host -= cpuValue;
		memRest4Host -= memValue;
		diskRest4Host -= diskValue;
		hostRestRsc[key].cpu = cpuRest4Host;
		hostRestRsc[key].mem = memRest4Host;
		hostRestRsc[key].disk = diskRest4Host;
		if(promptEl4Host) jQuery(promptEl4Host).remove();
		updatePrompt4Host(ipsAndHostsEl,key);
	}
}
function updatePrompt4Host(ipsAndHostsEl,value){
	IX.map(jQuery(ipsAndHostsEl).find("[title^='" + value + "']"), function(item){
		var updated = "<span class='item-body'>"+value+ "</span><span class='item-prompt'>剩余 CPU " + hostRestRsc[value].cpu+" 核，内存 " + hostRestRsc[value].mem + " GB,硬盘(GB) " + hostRestRsc[value].disk+ " GB</span>";
		var updatedTitle = value + "剩余 CPU "+hostRestRsc[value].cpu+" 核，内存 " +hostRestRsc[value].mem+" GB，硬盘 " +hostRestRsc[value].disk+" GB";
		jQuery(item).attr("title", updatedTitle);
		var aEl = $XD.first(item, "a");
		aEl.innerHTML = updated;
	});
}
function getAvailList(data){
	var availRsrcs = IX.map(data, function(item){
		var name = $XP(item, "name", "");
		var id = $XP(item, "id", name);
		return {
			title : name,
			key : id,
			html : name
		};
	});
	return t_availRsrcsContainer.renderData("", {
		availRsrcs : availRsrcs
	});
}
function getSepratedData(info){
	var productInfo = $XP(info, "product", []);
	productHT.clear();
	versionHT.clear();
	serviceHT.clear();
	//hostHT.clear();//重新赋值前，先清空所有值。
	IX.map(productInfo, function(item, idx){
		var pname = $XP(item, "name", idx);
		var version = $XP(item, "version", []);
		productHT.register(pname, version);
		IX.map(version, function(item, idx){
			var vname = $XP(item, "name", idx);
			var service = $XP(item, "service", []);
			versionHT.register(pname+"-"+vname, service);
			IX.map(service, function(item, idx){
				var sname = $XP(item, "name", idx);
				var cfg = $XP(item, "rscConfig", {});
				serviceHT.register(pname+"-"+vname +"-"+sname, {
					os : $XP(item, "os"),
					occupyCpu : $XP(cfg, "occupyCpu", ""),
					virtualCpu : $XP(cfg, "virtualCpu", ""),
					mem : $XP(cfg, "mem", ""),
					disk : $XP(cfg, "disk", "")
				});
			});
		});
	});
}
function saveHostRscInfo(hosts){
	IX.map(hosts, function(item){
		var hostIp = $XP(item, "hostIp");
		var cpu = $XP(item, "cpu");
		var mem = $XP(item, "mem");
		var disk = $XP(item, "disk");
		hostRestRsc[hostIp]={cpu : cpu, mem : mem, disk:disk};
		origHostRestRsc[hostIp] = {cpu : cpu, mem : mem, disk:disk};
	});
}
function vertifyRequired(){
	var flag = true;
	IX.map(jQuery(".area input.required"), function(el){
		if(el.value === ""){
			flag = false;
		}
		var lastEl = el;
		if($XH.hasClass(el.parentNode, "dropdown")){
			lastEl = $XH.first(el.parentNode, "dropdown-toggle");
		}
		$XH[el.value=== "" ? "addClass" : "removeClass"](lastEl, "requiredMark");
	});
	IX.map(jQuery(".area input.numLimit"), function(el){
		if($XH.hasClass(el, "morelimit")) flag = false;
	});
	if(jQuery(".area .addBtn1").length && !jQuery(".area .addBtn1").hasClass("hide")) flag= false;
	return flag;
}
function bindOnValue(areaEl, type){
	var inputs= null, dropdowns=null;
	if(type === "add"){
		dropdowns = jQuery(areaEl).find(".dropdown input.required");
		IX.map(dropdowns, function(el){
			dropdownBox.bindonDropdown(el);
		});
		inputs = jQuery(".ConfigDetail input.required");
		IX.map(inputs, function(el){
			inputBox.isInputNull(el);
		});
	}else if(type === "edit"){
		inputs = jQuery("input.required");
		IX.map(inputs, function(el){
			inputBox.isInputNull(el);
		});
	}else{
		dropdowns = jQuery(areaEl).find(".dropdown input.required");
		IX.map(dropdowns, function(el){
			dropdownBox.bindonDropdown(el);
		});
	}
	var numInputs = jQuery("input.num");
	IX.map(numInputs, function(el){
		inputBox.isNum(el);
	});
	var numLimitInputs = jQuery("input.numLimit");
	IX.map(numLimitInputs, function(el){
		var quota = parseInt($XD.dataAttr(el, "quota",1));
		var min = parseInt($XD.dataAttr(el, "min",1));
		if($XH.hasClass(el, "rscLimit")){
			inputBox.numLimit(el, min, quota, function(){
				if($XH.hasClass(el, "morelimit")) return;
				var customAEl = $XD.first($XH.first($XH.first($XH.ancestor(el, "container-body"), "rscConfig"), "custom"), "a");
				var ipsAndHostsEl = $XH.first($XH.ancestor(el, "container-body"), "ipsAndHosts");
				var customValue = 0, type;
				if(el.id.indexOf("OccupyCpu") > -1){
					customValue = Number($XD.dataAttr(customAEl, "occupyCpu"));
					type = "cpu";
				}else if(el.id.indexOf("Mem") > -1){
					customValue = Number($XD.dataAttr(customAEl, "mem"));
					type = "mem";
				}else if(el.id.indexOf("Disk") > -1){
					customValue = Number($XD.dataAttr(customAEl, "disk"));
					type = "disk";
				}
				var shortHost = [];
				var selectedHosts =[], objSelectedHosts = {};
				IX.map(jQuery(".ipsAndHosts .group"), function(item){
					var value = $XD.first($XH.first($XH.first(item, "host"), "dropdown"), "input").value;
					if(value) {
						if(!objSelectedHosts[value]) objSelectedHosts[value]=1;
						else objSelectedHosts[value] +=1;
					}
				});
				if((Number(el.value) - customValue) === 0) return;
				var isUpdate = true;//修改完后是否所有所选主机均能满足条件
				var restRsc = 0;
				for(var o in objSelectedHosts){
					restRsc = hostRestRsc[o][type];
					if((Number(el.value) - customValue)* objSelectedHosts[o] > restRsc) {
						isUpdate = false;
						shortHost.push(o);
						el.value = customValue;
					}
				}
				if(isUpdate){
					$XD.setDataAttr(customAEl, type === "cpu" ? "occupycpu" : type, el.value);
					IX.map(jQuery(".ipsAndHosts .group"), function(item){
						var hostIp = $XD.first($XH.first($XH.first(item, "host"), "dropdown"), "input").value;
						if(hostIp){
							restRsc = hostRestRsc[hostIp][type];
							hostRestRsc[hostIp][type] = restRsc - (el.value - customValue);
							updatePrompt4Host(ipsAndHostsEl, hostIp);
						}
					});
				}else{
					sdvDialog.alert("修改后的资源，导致"+shortHost.join("，")+"资源不足， 请重新填写！", function(){});
				}
			});
		}else
			inputBox.numLimit(el, min, quota);
	});
}
function submitService(okFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var product, version, service;
		product = $X('dlgProduct').value;
		version = $X('dlgVersion').value;
		service = $X('dlgService').value;
		var ipsAndHosts = [];
		IX.map(jQuery(".ipsAndHosts .group"), function(item){
			ipsAndHosts.push({
				ip : $XD.first($XH.first(item, "ip"), "input").value,
				host : $XD.first($XH.first($XH.first(item, "host"), "dropdown"), "input").value,
			});
		});
		var rscConfig = $X('dlgRscConfig').value;
		var occupyCpu = $X('dlgOccupyCpu').value;
		var virtualCpu = $X('dlgVirtualCpu').value;
		var mem = $X('dlgMem').value;
		var disk = $X('dlgDisk').value;
		var serviceInfo ={
			product : product,
			version : version,
			service : [{
				name : service,
				ipsAndHosts : ipsAndHosts,
				rscConfig : rscConfig,
				occupyCpu : occupyCpu,
				virtualCpu : virtualCpu,
				mem : mem,
				disk : disk
			}]
		};
		okFn(serviceInfo);
	}
}
function submit4Edit(okFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var occupyCpu = $X('dlgOccupyCpu').value;
		var virtualCpu = $X('dlgVirtualCpu').value;
		var mem = $X('dlgMem').value;
		var disk = $X('dlgDisk').value;
		var serviceInfo = {
			occupyCpu : occupyCpu,
			virtualCpu : virtualCpu,
			mem : mem,
			disk : disk
		};
		okFn(serviceInfo);
	}
}
function dialogBodyRefresh(bodyEl){
	var content;
	bodyEl.className = "ixw-body "+"vncDialog";
	bodyEl.innerHTML = t_vncDialog.renderData("",{url : distanceUrl});
	$XH.addClass($XH.first(bodyEl, "btns"), "hide");
}
function submitRecovery(okFn, btndisableFn){
	if(IX.isFn(btndisableFn)) btndisableFn();
	var recoveryObj = $X('dlgRecovery').value;
	okFn({recoveryId : recoveryObj});
}
function submitBackup(okFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var bkTime = $X('dlgBkTime').value;
		var bkCycle = $X('dlgBkCycle').value;
		var bkComment = $X('dlgComment').value;
		okFn({
			bkTime : bkTime,
			bkCycle : bkCycle,
			bkComment : bkComment
		});
	}
}



function getTimeHTML(){
	var dpt = new IXW.Lib.DatePickTrigger({
		value : new Date().getTime()/1000,
		extraClz : "bkTime",
		id : "dlgBkTime",
		gtDateEnable : 1
	});
	return dpt.getHTML();
}
IX.ns("SDV.serviceDialog");
SDV.serviceDialog.addService = function(okFn){
	caller("getInfo4AddServie", {"serviceAttr" : ""}, function(info){
		getSepratedData(info);
		saveHostRscInfo(info.host);
		ips = info.ip;
		var ipBox = SDV.addIpBox.ipBox({
			ips : ips,
			sureFn : ipSure
		});
		showDialog({
			title : "新建服务",
			clz : "addServiceDlg",
			content : t_addService.renderData("", {
				partHTML : t_addServicePart.renderData("", {
					productHTML : dropdownBox.getHTML(serviceCfg.product, info.product, "serviceDialog.chose"),
					versionHTML : dropdownBox.getHTML(serviceCfg.version, []),
					serviceHTML : dropdownBox.getHTML(serviceCfg.service, []),
					hideClz : "hide"
				}),
				opacityClz : "opacity",
				addedIPsHTML : "",
				configDetailHTML :getConfigDetailHTML(),
				hideClz : "hide",
				additionHTML : ipBox.getHTML()
			}),
			okFn : function(cbFn, btndisableFn){submitService(okFn, btndisableFn);},
			bindOn : function(areaEl){
				bindOnValue(areaEl, "add");
			}
		});
		jQuery(".container-body .ipsAndHosts").on("click", "button.dropdown-toggle", function(event){
			var el = event.target;
			var dropdown = jQuery(el).parents(".dropdown");
			var bottom;
			var areaEl = jQuery(".ixw-body .area");
			if(areaEl.css("overflow") === "auto"){
				dropdown.children(".dropdown-menu ").removeClass("dropdownUp");
				setTimeout(function(){
					areaEl.scrollTop(dropdown.parent().position().top + 10);
				},50);
			}else{
				bottom = jQuery(window).height() - (dropdown.height() + dropdown.offset().top);
				if(bottom < 300) dropdown.children(".dropdown-menu ").addClass("dropdownUp");
				else dropdown.children(".dropdown-menu ").removeClass("dropdownUp");
			}
		});
	});
};
SDV.serviceDialog.editServcie = function(rowModel,okFn){
	var info = {
		os : rowModel.get("os"),
		occupyCpu : $XP(rowModel.get("cpu"),"total"),
		virtualCpu : $XP(rowModel.get("cpu"),"total"),
		mem : $XP(rowModel.get("mem"),"total"),
		disk : $XP(rowModel.get("disk"),"total")
	};
	showDialog({
		title : "编辑服务",
		content : t_editService.renderData("", {
			configDetailHTML : getConfigDetailHTML("edit", info)
		}),
		okFn : function(cbFn, btndisableFn){submit4Edit(okFn, btndisableFn);},
		bindOn : function(areaEl){
			bindOnValue(areaEl, "edit");
		}
	});
};
SDV.serviceDialog.recoveryBackup = function(rowModel,okFn){
	var bkIP = rowModel.get("bkIP");
	var localId ;
	var bkWay = rowModel.get("backupWay");
	caller("getRecoveryObj", {id : rowModel.getId()}, function(data){
		var obj = IX.map(data, function(item){
			var ip = $XP(item, "ip");
			if(bkIP === ip) localId = $XP(item, "id");
			return {
				id : $XP(item, "id"),
				name : bkIP === ip ? "本机" :  $XP(item, "name")+ " " + $XP(item, "ip")
			};
		});
		showDialog({
			title : "恢复备份",
			content : t_recovery.renderData("", {
				hideClz : bkWay ? "hide" : "",
				recoveryObjHTML : dropdownBox.getHTML(IX.inherit(serviceCfg.recovery, {key :localId}), obj)
			}),
			okFn : function(cbFn, btndisableFn){submitRecovery(okFn, btndisableFn);}
		});
	});
};
SDV.serviceDialog.showVNC = function(rowId){
	caller("getConsole", {id : rowId}, function(url){
		distanceUrl = url;
		showDialog({
			autofit : false,
			dialogBodyRefresh : dialogBodyRefresh
		});
		$X('vncframe').focus();
		$X('openInNewWindow').setAttribute("href",url);
	});
};
SDV.serviceDialog.backup = function(rowModel, okFn){
	var status = rowModel.get("status");
	showDialog({
		title : "备份服务",
		content : t_backup.renderData("", {
			value : status,
			bkTimeHTML : getTimeHTML(),
			bkCycleHTML : inputBox.getHTML(serviceCfg.bkCycle)
		}),
		okFn : function(cbFn, btndisableFn){submitBackup(okFn, btndisableFn);},
		bindOn : function(areaEl){
				bindOnValue(areaEl);
			}
	});
};
SDV.serviceDialog.addService4OV = function(infoParams,okFn){//在overview页面添加服务
	caller("getInfo4OV", infoParams, function(info){
		saveHostRscInfo(info.host);
		ips = info.ip;
		var ipBox = SDV.addIpBox.ipBox({
			ips : ips,
			sureFn : ipSure
		});
		showDialog({
			title : "添加服务",
			clz : "addServiceDlg",
			content : t_addService.renderData("", {
				partHTML : t_addService4OVPart.renderData("", {
					pValue : $XP(infoParams, "product"),
					vValue : $XP(infoParams, "version"),
					sValue : $XP(infoParams, "service")
				}),
				opacityClz : "",
				addedIPsHTML : "",
				configDetailHTML : getConfigDetailHTML("add", info),
				hideClz : "",
				additionHTML : ipBox.getHTML()
			}),
			okFn : function(cbFn, btndisableFn){submitService(okFn, btndisableFn);},
			bindOn : function(areaEl){
				bindOnValue(areaEl, "add");
			}
		});
		var defaultAEl = jQuery(".rscConfig .default a")[0];
		$XD.setDataAttr(defaultAEl, "occupyCpu", $XP(info, "occupyCpu"));
		$XD.setDataAttr(defaultAEl, "virtualCpu", $XP(info, "virtualCpu"));
		$XD.setDataAttr(defaultAEl, "mem", $XP(info, "mem"));
		$XD.setDataAttr(defaultAEl, "disk", $XP(info, "disk"));
	});
};
})();
(function () {
var caller = SDV.Global.serviceCaller;
var sdvDialog = SDV.Dialog;
var showDialog = SDV.Dialog.show;
var hideDialog = SDV.Dialog.hide;
var globalActionConfig = IXW.Actions.configActions;
var dropdownBox = SDV.inputBox.dropdownBox();
var productHT = IX.IListManager(), versionHT = IX.IListManager(), serviceHT = IX.IListManager();
var hosts = {}, ips = {};
var proInfo = SDV.Const.ProductInfo;

var t_serviceItemContainer = new IX.ITemplate({tpl: [
	'<tpl id="serviceItem">',
		'<li>',
			'<div class="contentRow">',
				'<span class="label" title="{serviceName}">{serviceName}</span>',
				'<a class="addBtn" data-href="$overviewDialog.addIP" data-key="{serviceName}">添加</a><span class=\'mark\'>*</span>',
			'</div>',
			'<div class="ipsAndHosts" data-name="{serviceName}"></div>',
		'</li>',
	'</tpl>',
'']});
var t_addProduct = new IX.ITemplate({tpl: [
	'<div class="container-body active">',
		'<div class="ov-product contentRow">',
			'<span class="label">产品</span>{productHTML}<span class=\'mark\'>*</span>',
		'</div>',
		'<div class="ov-version contentRow opacity">',
			'<span class="label">版本</span>{versionHTML}<span class=\'mark\'>*</span>',
			'<div class="rowMask"></div>',
		'</div>',
		'<div class="contentRow text-center hide">',
			'<span class="pro-warning mark"></span>',
		'</div>',
		'<ul class="services"></ul>',
	'</div>',
	'<div class="container-addition">{additionHTML}</div>',
'']});
var t_availRsrcsContainer = new IX.ITemplate({tpl: [
	'<tpl id="availRsrcs">',
		'<li class="dropdown-item" title="{title}">',
			'<a data-href="$overviewDialog.chose" data-key="{key}">{html}</a>',
		'</li>',
	'</tpl>',
'']});
var t_addedIPsContainer = new IX.ITemplate({tpl: [
	'<tpl id="addedIPs">',
		'<div class="ip contentRow">',
			'<input id="ovIp-{idNum}" type="hidden" value="{value}">',
			'<span class="label">IP（{num}）</span><span class="value">{value}</span>',
			'<a class="pic-close" data-href="$overviewDialog.ip.delete" data-key="{value}"></a>',
		'</div>',
		'<div class="host contentRow">',
			'<span class="label">所属主机</span>{hostHTML}<span class=\'mark\'>*</span>',
			'<div class="host-warning text-center"></div>',
		'</div>',
	'</tpl>',
'']});
var t_ipsContainer = new IX.ITemplate({tpl: [
	'<tpl id="availIps">',
		'<li id="menu-{value}">',
			'<a class="checkbox {selected}" data-href="$ip.select" data-key="{value}"></a>',
			'<span>{value}</span>',
		'</li>',
	'</tpl>',
'']});
var t_selectedIpsContainer = new IX.ITemplate({tpl: [
	'<tpl id="selectedIps">',
		'<li id="selected-{ip}">',
			'<span>{ip}</span>',
			'<a class=\'pic-close\' data-href=\'$ip.cancle\' data-key=\'{ip}\'></a>',
		'</li>',
	'</tpl>',
'']});
var t_hostItemsContainer = new IX.ITemplate({tpl: [
	'<tpl id="repeat">',
		'<li class="dropdown-item" title="{host}剩余 CPU {cpu} 核，内存 {mem} GB，硬盘 {disk} GB">',
			'<a data-href="$overviewDialog.choseHost" data-key="{host}">',
				'<span class="item-body">{host}</span>',
				'<span class="item-prompt">剩余 CPU {cpu} 核，内存 {mem} GB,硬盘(GB) {disk} GB</span>',
			'</a>',
		'</li>',
	'</tpl>',
'']});

var overviewCfg = {
	product : {id : "ovProduct", inputClz : "required", type : "product"},
	version : {id : "ovVersion", inputClz : "required", type : "version"},
	host : {id : "ovHost", inputClz : "required"}
};
globalActionConfig([["overviewDialog.chose", function(params, el){
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if(!dropdownEl) return;
	var value = el.innerHTML === "空" ? "" : el.innerHTML;
	var key = params.key;
	var type = $XD.dataAttr(dropdownEl, "type");
	var valueEl = $(dropdownEl).find(".dropdown-toggle .value"); //显示值展示处
	var inputEl = $(dropdownEl).find("[type='hidden'].required"); //实际值展示处
	if(inputEl.value === value) return;
	inputEl.val(key);
	valueEl.html(value);
	var pname, vname;
	if($X('ovProduct')) pname = $X('ovProduct').value;
	if($X('ovVersion')) vname = $X('ovVersion').value;
	if(type === "product"){
		$X('ovVersion').value = "";
		$(".area .ov-version .dropdown-toggle .value").text("");
		$(".area .ov-version").removeClass("opacity");
		$(".area .ov-version .dropdown-menu").html(getAvailList(productHT.get(value)));
		$(".area .services").empty();
		$(".area .pro-warning").parent().addClass("hide");
		resizeBodyEl();
	}else if(type === "version"){
		var serviceItem = IX.map(versionHT.get(pname + '-' +value), function(item){
			var name = $XP(item, "name", "");
			return {
				serviceName : name
			};
		});
		var specialPros = [proInfo[0].name, proInfo[1].name, proInfo[2].name, proInfo[3].name];
		if(serviceItem.length > 0){
			$(".area .services").html(t_serviceItemContainer.renderData("", {
				serviceItem : serviceItem
			}));
			if(specialPros.indexOf(pname) > -1){
				caller("checkNeedOther", {
					product : pname,
					version : vname,
					service : ""
				}, function(data){
					if(data.isPrompt === 1){
						$(".area .pro-warning").parent().removeClass("hide");
						$(".area .pro-warning").text("系统中还未创建" + data.names.join("、") + ",会影响"+ pname +"部分功能的使用!");
					}else{
						$(".area .pro-warning").parent().addClass("hide");
					}
				});
			}
			resizeBodyEl();
		}else{
			$(".area .pro-warning").parent().removeClass("hide");
			$(".area .pro-warning").text("您选择的产品当前没有可创建的服务，请重新选择。");
		}
	}
}],["overviewDialog.addIP", function(params, el){
	var serName = params.key;
	$XD.setDataAttr($(".area .okbtn")[0], "serName", serName);
	var areaEl = $XH.ancestor(el, "area");
	var cBodyEL = $XH.first(areaEl, "container-body");
	var cAdditionEL = $XH.first(areaEl, "container-addition");
	$XH.removeClass(cBodyEL, "active");
	$(".ixw-body .btns").addClass("hide");
	$XH.addClass(cAdditionEL, "active");	
	updateleftSideIPs(getUnSelectedIPs(), false);
	var rightSideEl = $(".rightSide .ip-selected > ul");
//	rightSideEl[0].innerHTML = t_selectedIpsContainer.renderData("", {
//		selectedIps : IX.loop(Object.keys(ips), [], function(acc,ip){
//			if(ips[ip].selected && ips[ip].serviceName === serName) acc.push({
//				ip : ip
//			});
//			return acc;
//		})
//	});
	rightSideEl.empty();
	resizeBodyEl();
}],["overviewDialog.ip.search", function(params, el){
	var inputEl = $XD.first(el.parentNode, "input");
	var value = inputEl.value;
	var searchedIPs = [];
	var ob = {};
	$(".rightSide .ip-selected > ul li").each(function(index,item){
		ob[$XD.dataAttr($(item).children("a")[0], "key")] = true;
	});
	IX.map(getUnSelectedIPs(), function(item){
		if(value){
				if(item.indexOf(value) > -1){
				searchedIPs.push({
					ip : item,
					selected : ob[item] === "undefine" ? false : ob[item]
				});
			}
		}else{
			searchedIPs.push({
				ip : item,
				selected : ob[item] === "undefine" ? false : ob[item]
			});
		}
	});
	updateleftSideIPs(searchedIPs, true);
}],["overviewDialog.ip.sure", function(params, el){
	var key = params.key;
	$(".area .container-body").addClass("active");
	$(".area .container-addition").removeClass("active");
	$(".area + .btns").removeClass("hide");
	if(key === "ok"){
		var serName = $XD.dataAttr(el, "serName");
		var rightSideEl = $XH.ancestor(el, "rightSide");
		IX.map($(rightSideEl).find("ul li"), function(item){
			ips[item.id.split("-")[1]].selected = true;
			ips[item.id.split("-")[1]].serviceName = serName;
	});
	var selectedIPs = IX.loop(Object.keys(ips), [], function(acc, ip) {
		if(ips[ip].selected && ips[ip].serviceName === serName) acc.push(ip);
		return acc;
	});
	$(".area .ipsAndHosts[data-name=\'" + serName + "\']")[0].innerHTML = t_addedIPsContainer.renderData("", {
		addedIPs: IX.map(selectedIPs, function(item, index) {
			var hostHTML = "";
			hostHTML = dropdownBox.getHTML(IX.inherit(overviewCfg.host, {
				id: "ovHost-" + index,
				value: ips[item].host ? ips[item].host : "",
				key : ips[item].host ? ips[item].host : ""
			}), IX.loop(Object.keys(hosts), [], function(acc, host){
				acc.push({
					id : host,
					name : "<span class='item-body'>"+ host +"</span><span class='item-prompt'>剩余 CPU " + 
					hosts[host].cpu+" 核，内存 " + hosts[host].mem + " GB,硬盘(GB) " + hosts[host].disk+ " GB</span>",
					title : host + "剩余 CPU "+hosts[host].cpu+" 核，内存 " +hosts[host].mem+" GB，硬盘 " +hosts[host].disk+" GB"
				});
				return acc;
			}), "overviewDialog.choseHost");
			return {
				idNum: index,
				num: index + 1,
				value: item,
				hostHTML: hostHTML
			};
		})
	});
	resizeBodyEl();
}
}], ["overviewDialog.choseHost", function(params, el){ //选择所属主机回调
	$(el).parents(".dropdown").children(".dropdown-toggle").removeClass("requiredMark");
	var par = $(el).parents(".contentRow");
	var host = params.key;
	var oldHost = $(el).parents(".dropdown").children("input.required").val();
	var ip = par.prev().find(".value").text();
	var warnEl = $(el).parents(".contentRow").children(".host-warning");
	var pname = $("#ovProduct").val();
	var vname = $("#ovVersion").val();
	var sname = $XD.dataAttr($(el).parents("li").find(".addBtn")[0], "key");
	var cost = serviceHT.get(pname+"-"+vname +"-"+sname); //所选服务所需资源
	var remain = hosts[host]; //主机剩余资源配置
	var specialSers = [proInfo[5].services[0], proInfo[7].services[0], proInfo[6].services[1], proInfo[6].services[2], proInfo[0].services[3]];
	if(oldHost === host) return;
	if(oldHost) revertHost(oldHost, el);
	warnEl.text("");
	if(specialSers.indexOf(sname) > -1){
		if(hosts[host].serName === sname){ //页面上检测该host是否已部署特殊服务
			sdvDialog.confirmAlert("提示","主机"+ host +"上已选择部署了"+ sname +"，本次操作可能会降低性能，是否继续？", function(){
				updateHost();
			}, function(){
				par.find(".dropdown .required").val("");
				par.find(".dropdown .value").text("");
			});
		}else{
			caller("checkIsDeployed", {
				product: pname,
				version: vname,
				service: sname,
				host: host
			}, function(data){
				if(data.isDeployed){
					if(sname === proInfo[5].services[0] || sname === proInfo[7].services[0]){
						sdvDialog.alert("主机"+ host +"上已选择了部署"+ sname +"，请选择其他主机", function(){
							par.find(".dropdown .required").val("");
							par.find(".dropdown .value").text("");
						});
					}else{
						sdvDialog.confirmAlert("提示","主机"+ host +"上已部署了"+ sname +"，本次操作可能会降低性能，是否继续？", function(){
							updateHost();
						}, function(){
							par.find(".dropdown .required").val("");
							par.find(".dropdown .value").text("");
						});
					}
				}else{
					updateHost();
				}
			});
		}
	}else{
		updateHost();
	}
	$(".area .host.contentRow .dropdown-menu").html(t_hostItemsContainer.renderData("", {
		repeat : IX.loop(Object.keys(hosts), [], function(acc, host){
			acc.push({
				host : host,
				disk : hosts[host].disk,
				mem : hosts[host].mem,
				cpu : hosts[host].cpu
			});
			return acc;
		})
	}));

	function updateHost(){
		if(remain.cpu - cost.occupyCpu >= 0 && remain.disk - cost.disk >= 0 && remain.mem - cost.mem >= 0){
			remain.cpu -= cost.occupyCpu;
			remain.disk -= cost.disk;
			remain.mem -= cost.mem;
			ips[ip].host = host;
			hosts[host].serName = sname;
			par.find(".dropdown .required").val(host);
			par.find(".dropdown .value").text(host);
		}else{
			par.find(".dropdown .required").val("");
			par.find(".dropdown .value").text("");
			warnEl.text("主机"+ host +" 资源不足，请选择其他主机");
		}
	}
}],["overviewDialog.ip.delete", function(params, el){
	var ip = params.key;
	var ipsAndHosts = $(el).parents(".ipsAndHosts");
	ips[ip].selected = false;
	ips[ip].serviceName = "";
	ips[ip].host = "";
	var host = $(el).parent().next().find("input.required").val();
	revertHost(host, el);
	$(el).parent().next().remove();
	$(el).parent().remove();
	ipsAndHosts.children(".contentRow").not(".host").children(".label").each(function(index,item){
		if($(item).text().split("（")[1].split("）")[0] != index + 1){
			$(item).text("IP（"+ (index + 1) +"）");
		}
	});
	resizeBodyEl();
}]]);

function ipSure(params, el) {
	var key = params.key;
	$(".area .container-body").addClass("active");
	$(".area .container-addition").removeClass("active");
	$(".area + .btns").removeClass("hide");
	if(key === "ok") {
		var serName = $XD.dataAttr(el, "serName");
		var rightSideEl = $XH.ancestor(el, "rightSide");
		IX.map($(rightSideEl).find("ul li"), function(item) {
			ips[item.id.split("-")[1]].selected = true;
			ips[item.id.split("-")[1]].serviceName = serName;
		});
		var selectedIPs = IX.loop(Object.keys(ips), [], function(acc, ip) {
			if(ips[ip].selected && ips[ip].serviceName === serName) acc.push(ip);
			return acc;
		});
		$(".area .ipsAndHosts[data-name=\'" + serName + "\']")[0].innerHTML = t_addedIPsContainer.renderData("", {
			addedIPs: IX.map(selectedIPs, function(item, index) {
				var hostHTML = "";
				hostHTML = dropdownBox.getHTML(IX.inherit(overviewCfg.host, {
					id: "ovHost-" + index,
					value: ips[item].host ? ips[item].host : "",
					key: ips[item].host ? ips[item].host : ""
				}), IX.loop(Object.keys(hosts), [], function(acc, host) {
					acc.push({
						id: host,
						name: "<span class='item-body'>" + host + "</span><span class='item-prompt'>剩余 CPU " +
							hosts[host].cpu + " 核，内存 " + hosts[host].mem + " GB,硬盘(GB) " + hosts[host].disk + " GB</span>",
						title: host + "剩余 CPU " + hosts[host].cpu + " 核，内存 " + hosts[host].mem + " GB，硬盘 " + hosts[host].disk + " GB"
					});
					return acc;
				}), "overviewDialog.choseHost");
				return {
					idNum: index,
					num: index + 1,
					value: item,
					hostHTML: hostHTML
				};
			})
		});
	}
	resizeBodyEl();
}

function revertHost(oldHost, el) {//删除IP时还原主机资源
	var pname = $("#ovProduct").val();
	var vname = $("#ovVersion").val();
	var sname = $XD.dataAttr($(el).parents("li").find(".addBtn")[0], "key");
	var cost = serviceHT.get(pname+"-"+vname +"-"+sname); //所选服务所需资源
	if(oldHost){
		hosts[oldHost].cpu += cost.occupyCpu;
		hosts[oldHost].disk += cost.disk;
		hosts[oldHost].mem += cost.mem;
		hosts[oldHost].serName = "";
	}
}
function updateleftSideIPs(ips, isSearch) {
	var leftSideEl = $("#ip-box")[0];
	if(isSearch){
			leftSideEl.innerHTML = t_ipsContainer.renderData("", {
			availIps : IX.map(ips, function(item){
				return {
					value : item.ip,
					selected : item.selected ? "selected" : ""
				};
			})
		});
	}else{
			leftSideEl.innerHTML = t_ipsContainer.renderData("", {
			availIps : IX.map(ips, function(item){
				return {
					value : item
				};
			})
		});
	}
}
function getUnSelectedIPs(){
	return IX.loop(Object.keys(ips), [], function(acc,ip){
		if(!ips[ip].selected) acc.push(ip);
		return acc;
	});
}
function resizeBodyEl(){
	var bodyEl = $("#nv-dialog .ixw-body")[0];
	var containerBodyEl = $(bodyEl).find(".container-body");
	var areaEl = $(bodyEl).find(".area");
	if(containerBodyEl.height() > 500 && !$(".ixw-body .container-addition").hasClass("active")){
		areaEl.height(500);
		areaEl.css("overflow","auto");
	}else{
		areaEl.height("auto");
		areaEl.css("overflow","visible");
	}
	var posY = ($Xw.getScreen().size[1]- bodyEl.offsetHeight)/2;
	posY = posY > 300? (posY-100): Math.max(posY, 0);
	bodyEl.style.marginTop = (0- bodyEl.offsetHeight- posY) + "px";
}
function getAvailList(data){
	var availRsrcs = IX.map(data, function(item){
		var name = $XP(item, "name", "");
		var id = $XP(item, "id", name);
		return {
			title : name,
			key : id,
			html : name
		};
	});
	return t_availRsrcsContainer.renderData("", {
		availRsrcs : availRsrcs
	});
}
function getSepratedData(info){
	var productInfo = $XP(info, "product", []);
	productHT.clear();
	versionHT.clear();
	serviceHT.clear();
	IX.map(productInfo, function(item, idx){
		var pname = $XP(item, "name", idx);
		var version = $XP(item, "version", []);
		productHT.register(pname, version);
		IX.map(version, function(item, idx){
			var vname = $XP(item, "name", idx);
			var service = $XP(item, "service", []);
			versionHT.register(pname+"-"+vname, service);
			IX.map(service, function(item, idx){
				var sname = $XP(item, "name", idx);
				var cfg = $XP(item, "rscConfig", {});
				serviceHT.register(pname+"-"+vname +"-"+sname, {
					occupyCpu : $XP(cfg, "occupyCpu", ""),
					virtualCpu : $XP(cfg, "virtualCpu", ""),
					mem : $XP(cfg, "mem", ""),
					disk : $XP(cfg, "disk", "")
				});
			});
		});
	});
}
function vertifyRequired(){
	var flag = true;
	IX.map($(".area input.required"), function(el){
		if(el.value === ""){
			flag = false;
		}
		var lastEl = el;
		if($XH.hasClass(el.parentNode, "dropdown")){
			lastEl = $XH.first(el.parentNode, "dropdown-toggle");
		}
		$XH[el.value === "" ? "addClass" : "removeClass"](lastEl, "requiredMark");
	});
	IX.map($(".area input.numLimit"), function(el){
		if($XH.hasClass(el, "morelimit")) flag = false;
	});
	IX.map($(".area .services > li"), function(el){
		if(!$(el).children(".ipsAndHosts").children().length) flag = false;
	});
	if($(".area .services > li").length === 0) flag = false;
	return flag;
}
function submitProduct(okFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var product, version, service = [];
		product = $X('ovProduct').value;
		version = $X('ovVersion').value;
		var ob = {};
		IX.map(Object.keys(ips), function(item){
			if(ips[item].selected){
				if(ob[ips[item].serviceName]){
					ob[ips[item].serviceName].push({
						ip : item,
						host : ips[item].host
					});
				}else{
					ob[ips[item].serviceName] = [{
						ip : item,
						host : ips[item].host
					}];
				}
			}
		});
		IX.map(Object.keys(ob), function(item){
			var config = serviceHT.get(product+"-"+version +"-"+item);
			service.push({
				name : item,
				ipsAndHosts : ob[item],
				rscConfig : 0,
				occupyCpu : config.occupyCpu,
				virtualCpu : config.virtualCpu,
				mem : config.mem,
				disk : config.disk
			});
		});
		var productInfo = {
			product : product,
			version : version,
			service : service
		};
		okFn(productInfo);
	}
}
IX.ns("SDV.overviewDialog");
SDV.overviewDialog.addProduct = function(serviceAttr,okFn){
	caller("getInfo4AddServie", {
		serviceAttr : serviceAttr
	}, function(info){
		getSepratedData(info);
		var ipBox = SDV.addIpBox.ipBox({
			ips : [],
			sureFn : ipSure,
			search : "overviewDialog.ip.search"
		});
		IX.map(info.host, function(host){
			hosts[host.hostIp] = {
				cpu : host.cpu,
				mem : host.mem,
				disk : host.disk,
				serName : ""
			};
		});
		IX.map(info.ip, function(ip){
			ips[ip] = {
				selected : false,
				serviceName : "",
				host : ""
			};
		});
		showDialog({
			title : "新建产品",
			content : t_addProduct.renderData("", {
				productHTML: dropdownBox.getHTML(overviewCfg.product, info.product, "overviewDialog.chose"),
				versionHTML: dropdownBox.getHTML(overviewCfg.version, []),
				additionHTML: ipBox.getHTML()
			}),
			okFn : function(cbFn, btndisableFn){submitProduct(okFn, btndisableFn);},
			bindOn : function(areaEl){
				var dropdowns = null;
				dropdowns = $(areaEl).find(".dropdown input.required");
				IX.map(dropdowns, function(el){
					dropdownBox.bindonDropdown(el);
				});
			}
		});
		$(".container-body ul.services").on("click", "button.dropdown-toggle", function(event){
			var el = event.target;
			var dropdown = $(el).parents(".dropdown");
			var bottom;
			var areaEl = $(".ixw-body .area");
			if(areaEl.css("overflow") === "auto"){
				dropdown.children(".dropdown-menu ").removeClass("dropdownUp");
				setTimeout(function(){
					areaEl.scrollTop(dropdown.parent().position().top + 10);
				},50);
			}else{
				bottom = $(window).height() - (dropdown.height() + dropdown.offset().top);
				if(bottom < 300) dropdown.children(".dropdown-menu ").addClass("dropdownUp");
				else dropdown.children(".dropdown-menu ").removeClass("dropdownUp");
			}
		});
	});
};
})();
(function () {
IX.ns("SDV.Wave");
SDV.Wave.SDVWave = function(cfg){
	var vertexes = [], auto = 3, canvas, ctx, j = 0, timer = null;
	var resetVertexes = [];
	var timeInterval = 10;
	var name = $XP(cfg, "name", "");
	var item = $XP(cfg, "item", "");
	var indicsNum = parseFloat(item.indicsNum);
	var baseHeight, perHeight, realHeight;
	var sinCycle ;
	var xOffset = 1;//代表波纹每次移动1个像素
	function draw(tmpVer, offsetHeight){//canvas原点在左上角，向下是正y,向右是正X
		ctx.beginPath();
		ctx.fillStyle = "#00ffc0";
		//ctx.moveTo(tmpVer[0].x, tmpVer[0].y);
		if(offsetHeight === canvas.height){
			ctx.fillStyle = "rgba(255,255,255,0)";
		}
		if(offsetHeight === 0){
			ctx.moveTo(0, 0);
			ctx.lineTo(canvas.width, 0);
		}else{
			ctx.moveTo(tmpVer[0].x, tmpVer[0].y);
			for(var i=1; i<tmpVer.length; i++){
				ctx.lineTo(tmpVer[i].x, tmpVer[i].y);
			}
		}
		ctx.lineTo(canvas.width, canvas.height);
		ctx.lineTo(0, canvas.height);
		//ctx.stroke();
		ctx.fill();
	}
	function Vertex(x,y){
		this.x = x;
		this.y = y;
	}
	function resetVertex(isgt, yOffset){
		var yInterval = vertexes.length -xOffset;
		var i;
		for(i = 0; i< yInterval;i++){
			resetVertexes[i].y = vertexes[i + xOffset].y - yOffset;
		}
		for(i = yInterval; i < yInterval + xOffset; i ++){
			resetVertexes[i].y = vertexes[i-yInterval].y - yOffset;
		}
		//vertexes = resetVertexes;这样两个值会变成一个对象。
		for(i =0; i< vertexes.length;i++){
			vertexes[i].y = resetVertexes[i].y;
		}
	}
	function update(orginOffsetH, yOffset){
		baseHeight = orginOffsetH;
		ctx.clearRect(0, 0, canvas.width,canvas.height);
		var isgt;
		if(perHeight > 0){
			isgt = realHeight - yOffset > baseHeight;
			if(isgt){
				realHeight-=yOffset;
			}else if(realHeight > baseHeight){
				realHeight = baseHeight;
				yOffset = realHeight - baseHeight;
			}else{
				yOffset = 0;
			}
		}else{
			isgt = realHeight - yOffset < baseHeight;
			if(isgt){
	
				realHeight -=yOffset;
			}else if(realHeight < baseHeight){
				realHeight = baseHeight;
				yOffset = realHeight - baseHeight;
			}else{
				yOffset = 0;
			}
		}
		resetVertex(isgt, yOffset);
		draw(resetVertexes, realHeight);

	}
	function initWave(){
		canvas = $X('cav-' + name);
		var width = canvas.width, height = canvas.height;
		ctx = canvas.getContext("2d");
		baseHeight  = height * (1-indicsNum);//实际
		realHeight = height;
		perHeight = height/216;//每次上涨或下降perHeight 0.5像素，保证最长2s左右能动完
		var i;
		sinCycle = 2 * Math.PI/width;//周期为canvas的宽度
		//初始化vertexs
		for(i =0; i<canvas.width+1; i++){
			vertexes[i] = new Vertex(i, auto*Math.sin(sinCycle *i - Math.PI/2) +height);
			resetVertexes[i] = new Vertex(i, 0);
		}
		draw(vertexes);
		timer = setInterval(function(){update(baseHeight, perHeight);}, timeInterval);
	}
	function refresh(item){
		var baseHeightNew = canvas.height *(1-item.indicsNum);
		//realHeight = baseHeight;
		if(item.indicsNum === indicsNum) return;
		indicsNum = item.indicsNum;
		if( (baseHeightNew > baseHeight && perHeight >0) || (baseHeightNew < baseHeight && perHeight <0)) perHeight = -perHeight;
		clearInterval(timer);
		timer = null;
		timer = setInterval(function(){update(baseHeightNew, perHeight);}, timeInterval);
	}
	return {
		initWave : initWave,
		refresh : function(item){
			refresh(item);
		},
		getTimer : function(){
			return timer;
		}
	};

};

})();
(function () {var t_overview = new IX.ITemplate({tpl: [
	'<div class="p_overview">',
		'<img class="ovbg" src="{ovBackground}">',
		'<div class="ov-container">',
			'<div class="ov-panels {panelActiveClz}" id="ovPanels"></div>',
			'<div class="ov-sys {sysActiveClz}" id="ovSys"></div>',
			'<div class="ov-pla {plaActiveClz}" id="ovPla"></div>',
		'</div>',
		'<div class="ov-left">',
			'<a class="{panelActiveClz}" data-href="$ov.switch" data-key = "panel" >产品概况</a>',
			'<a class="sys {sysActiveClz}" data-href="$ov.switch" data-key = "sys">系统状态</a>',
			'<a class="sys {plaActiveClz}" data-href="$ov.switch" data-key = "pla">业务平台</a>',
			'<span class="activeicon"></span>',
		'</div>',
		'<div class="ov-foot {panelActiveClz}" id="ovFoot4Panels"></div>',
		'<div class="ov-foot {panelActiveClz}" id="ovFoot4Sys"></div>',
	'</div>',
'']});
var t_ovfoot = new IX.ITemplate({tpl: [
	'<div><span class="icon icon-total"></span><span class="text">{totalName}</span><span class="value">{total}</span></div>',
	'<div><span class="icon icon-active"></span><span class="text">运行：</span><span class="value">{active}</span></div>',
	'<div><span class="icon icon-stoped"></span><span class="text">{stopedName}</span><span class="value">{stoped}</span></div>',
	'<div><span class="icon icon-error"></span><span class="text">故障：</span><span class="value">{error}</span></div>',
'']});
var t_panelsContainer = new IX.ITemplate({tpl: ['<tpl id="panels">',
	'<div class="panelContainer {clz} {firstClz}">',
		'<div class="panel panel-left {leftPanelClz}">{contentLHTML}',
		'</div>',
		'<div class="line {lineClz}"></div>',
		'<div class="panel panel-right {rightPanelClz}">{contentRHTML}',
		'</div>',
		'<div class="verticalLine"></div>',
	'</div>',
'</tpl>','']});
var t_contentContainer = new IX.ITemplate({tpl: [
	'<div class="versionSwitch {hideClz}">',
		'<a class="verPrev" data-href="$ov.verSwitch" data-key="prev"></a>',
		'<a class="verNext" data-href="$ov.verSwitch" data-key="next"></a>',
	'</div>',
	'<div class="versionNav {hideClz}">','<tpl id="navItem">',
		'<a class="{activeClz}" data-href="$ov.verSwitch" data-key = "{key}" title="{version}"></a>',
	'</tpl>','</div>',
	'<tpl id="content">','<div class="content {contentClz} {version} {disableClz}" data-key = "{key}">',
		'<div class="contentContainer">',
		'<div class="circle" data-href="{href}">',
			'<div class="innerCircle">',
				'<span class="title">{titleName}</span><span class="version">{version}</span>',
			'</div>',
		'</div>',
		'<div class="itemContainer" data-title="{title}" data-version="{version}" style="width:{width}px">',
			'<tpl id="servContent">','<div class="servContent {activeClz} {numClz}" data-key="{key}">','<tpl id="items">',
				'<div class="item {servNumClz} {disableClz} {lastClz} {hasbtnClz}">',
					'<div class="able">',
						'<a data-href="$ov.openServive" class="ov-open">',
							'<span class="text">{servName}</span>',
							'<span class="num">×{servNum}</span>',
						'</a>',
						'<a class="ov-add" data-href = "$ov.addService" data-name="{servName}" data-key = "able"></a>',
					'</div>',
					'<a class="unable" data-href = "$ov.addService" data-name="{servName}" data-key="unable">',
						'<span class="detailCon">',
							'<span class="ov-add"></span>',
							'<span class="text">{servName}</span>',
						'</span>',
					'</a>',
				'</div>',
			'</tpl>','</div>','</tpl>',
			'<div class="servSwitch {hideClz}">',
				'<a class="servPrev hide" data-href="$ov.servSwitch" data-key="prev"></a>',
				'<a class="servNext" data-href="$ov.servSwitch" data-key="next"></a>',
			'</div>',
			'<div class="servNav {hideClz}">','<tpl id="servNavItem">',
				'<a class="{activeClz}" data-href="$ov.servSwitch" data-key = "{key}" title=""></a>',
			'</tpl>','</div>',

		'</div><div class="pointerBg {productClz}"></div>{pointerHTML}',
	'</div></div>','</tpl>',
'']});
var t_pointerContainer = new IX.ITemplate({tpl: ['<tpl id="pointer">',
	'<div class="pointer {productClz} {numClz}" data-key="{key}"></div>',
'</tpl>','']});

var overCaller = SDV.Global.overviewCaller;
var servCaller = SDV.Global.serviceCaller;
var periodic = SDV.Util.PeriodicChecker;
var globalActionConfig = IXW.Actions.configActions;
var Duration = 3; //3sec
var serviceDialog = SDV.serviceDialog;
var sdvDialog = SDV.Dialog;
var hideDialog = SDV.Dialog.hide;
var productNewHT = IX.IListManager(); //用于保存各个产品有多少个新产品
var ixwPages = IXW.Pages;
var userType;
var overviewDialog = SDV.overviewDialog;
var $=jQuery;

var footCfg = {
	overview : {
		total : "服务总数：",
		stoped : "已停止："
	},
	sysOverview : {
		total : "服务器总数：",
		stoped : "关机："
	}
};
function refreshCurService(el, key){
	var ableEl, unableEl,numEl;
	var itemEl = $XH.ancestor(el, "item");
	ableEl = $XH.first(itemEl, "able");
	numEl = $XH.first($XD.first(ableEl, "a"), "num");
	var beforeNum = parseInt(numEl.innerHTML.substring(1));
	numEl.innerHTML = "×"+(beforeNum + 1);
	if(key === "able"){
		$XH.removeClass(itemEl, "disable");
	}else if(key === "unable"){
		$XH.removeClass(itemEl, "none");
	}
	if(beforeNum){
		$XH.removeClass(itemEl, numCfg[beforeNum]);
	}
	if(beforeNum + 1 > 2){
		$XH.addClass(itemEl, "more");
	}else{
		$XH.addClass(itemEl, numCfg[beforeNum+1]);
	}
}
globalActionConfig([["ov.addService", function(params, el){
	var itemEl = $XH.ancestor(el, "item");
	if($XH.hasClass(itemEl, "noBtn")) return;
	var containerEl = $XH.ancestor(el, "itemContainer");
	var product = $XD.dataAttr(containerEl, "title");
	var version = $XD.dataAttr(containerEl, "version");
	var service = $XD.dataAttr(el, "name");
	var infoParams = {
		product : product,
		version : version,
		service : service
	};
	var key = params.key;
	serviceDialog.addService4OV(infoParams,function(data){
		servCaller("addService", data, function(retData){
			var isPrompt = $XP(retData, "isPrompt");
			var names = $XP(retData, "names",[]).join("和");
			var promptInfo = "系统中未创建" + names + ",会影响"+data.product+"部分功能的使用，是否继续创建该服务？";
			hideDialog();
			if(isPrompt){
				sdvDialog.confirm("提示", promptInfo, function(){
					servCaller("addService", IX.inherit(data, {isCheck :0}), function(){
						hideDialog();
						refreshCurService(el, key);
					}, hideDialog);
				});
			}else{
				refreshCurService(el, key);
				var isNeedAuth = $XP(retData, "isNeedAuth");
				var id = $XP(retData, "id");
				if(isNeedAuth){
					var form = jQuery('<form id="form" action="services/downloadKey" method="POST" style="display:none"></from>');
					var input = jQuery('<input type="text" name="serviceId" value="'+id+'">');
					jQuery("#body").append(form);
					form.append(input);
					form.submit();
					form.remove();
				}
			}
		}, hideDialog);
	});
}],["ov.openServive", function(params, el){
	var containerEl = $XH.ancestor(el, "itemContainer");
	var product = $XD.dataAttr(containerEl, "title");
	ixwPages.load(ixwPages.createPath("services"), function(){
		return {product : product};
	});
}], ["ov.switch", function(params, el){
	var key = params.key;
	if($XH.hasClass(el, "active")) return;
	var ovLeftEl = $XH.ancestor(el, "ov-left");
	var activeicon = $XH.first(ovLeftEl, "activeicon");
	if(key === "panel"){
		switchClass("ovPanels");
		activeicon.style.top = "-5px";
		switchOut();
	}else if(key === "sys"){
		switchClass("ovSys");
		activeicon.style.top = "127px";
		wave=null; cpuChart = null; memChart = null; flowChart=null;
		$X('ovSys').innerHTML = t_sysOverview.renderData();
		showSys();
	}else{ //业务平台
		switchClass("ovPla");
		activeicon.style.top = "259px";
		switchOut();
		showPla();
	}
	
	function switchClass(name){
		$XH.removeClass($XH.first(ovLeftEl, "active"), "active");
		$XH.addClass(el, "active");
		$('.ov-container > *').removeClass('active');
		$XH.addClass($X(name),"active");
		$('.ov-foot').removeClass('active');
		if(name === "ovPla"){
			$('.ov-container').addClass('pla-container');
		}else if(name === "ovPanels"){
			$XH.addClass($X('ovFoot4Panels'), "active");
			$('.ov-container').removeClass('pla-container');
		}else{
			$XH.addClass($X('ovFoot4Sys'),"active");
			$('.ov-container').removeClass('pla-container');
		}
	}
}], ["ov.verSwitch", function(params, el){
	var key = params.key;
	if($XH.hasClass(el, "active")) return;
	var panelEl = $XH.ancestor(el, "panel");
	var activeEl = $XH.first(panelEl, "active");
	var isDisable = $XH.hasClass(activeEl,"disable");
	$XH.removeClass(activeEl, "active");
	var nowEl;
	var contentEls = jQuery(panelEl).find(".content");
	var contentlen = contentEls.length;
	var verNavEl;
	if(key === "prev" || key === "next"){
		var vKey = $XD.dataAttr(activeEl, "key");
		$XH.removeClass(activeEl, "active");
		var idx;
		if(key === "prev"){
			idx = parseInt(vKey) -1;
			if( idx=== 0) idx = contentlen;
		}else if(key === "next"){
			idx = parseInt(vKey) + 1;
			if(idx === contentlen +1) idx = 1;
		}
		IX.map(contentEls, function(item){
			if($XD.dataAttr(item, "key") -0 === idx){
				nowEl = item;
				$XH.addClass(item, "active");
			}
		});
		verNavEl = $XH.first(panelEl, "versionNav");
		$XH.removeClass($XH.first(verNavEl, "active"), "active");
		IX.map(jQuery(verNavEl).find("a"), function(item){
			if($XD.dataAttr(item, "key") -0 === idx)
				$XH.addClass(item, "active");
		});
	}else{
		verNavEl = $XH.ancestor(el, "versionNav");
		$XH.removeClass($XH.first(verNavEl, "active"),"active");
		$XH.addClass(el, "active");
		IX.map(contentEls, function(item){
			if($XD.dataAttr(item, "key") -0 === $XD.dataAttr(el, "key")-0){
				nowEl = item;
				$XH.addClass(item, "active");
			}
		});
	}
	var isNowDisable = $XH.hasClass(nowEl, "disable");
	if(isDisable === isNowDisable) return;
	var pointerEl = $XH.first(nowEl, "pointer");
	if(!pointerEl) return;
	var pkey = $XD.dataAttr(pointerEl, "key");
	if(isDisable && !isNowDisable){
		jQuery(".content .to"+pkey).removeClass("disable");
	}else if(!isDisable && isNowDisable){
		jQuery(".content .to"+pkey).addClass("disable");
	}
}], ["ov.servSwitch", function(params, el){
	var key = params.key;
	var itemContainerEl = $XH.ancestor(el, "itemContainer");
	var activeEl = $XH.first(itemContainerEl, "active");
	var servContentEls = jQuery(itemContainerEl).find(".servContent");
	var servContentElLen = servContentEls.length;

	var panelEl = $XH.ancestor(el, "panel");
	var baseWidth;
	var marginLeft = parseInt(jQuery(itemContainerEl).css("margin-left"));
	if($XH.hasClass(panelEl, "panel-left")){
		baseWidth = 631;
	}else{
		baseWidth = 272;
	}
	var idx, nowEl,servSwitchEl,servNavEl;
	var oldKey = $XD.dataAttr(activeEl, "key");
	if(key === "prev" || key === "next"){
		servSwitchEl = $XH.ancestor(el, "servSwitch");
		servNavEl = $XH.first(itemContainerEl, "servNav");
		idx = key === "prev" ?oldKey- 1 :oldKey- (-1);
		if(key === "prev" ){
			$XH.removeClass($XH.first(servSwitchEl, "servNext"), "hide");
			if(idx ===1)
				$XH.addClass(el, "hide");
			jQuery(itemContainerEl).css("margin-left", (marginLeft + baseWidth) + "px");
		}else if(key === "next"){
			$XH.removeClass($XH.first(servSwitchEl, "servPrev"), "hide");
			if(idx === servContentElLen)
				$XH.addClass(el, "hide");
			jQuery(itemContainerEl).css("margin-left", (marginLeft - baseWidth) + "px");
		}
		$XH.removeClass(activeEl, "active");
		IX.map(servContentEls, function(item){
			if( $XD.dataAttr(item, "key") -0 === idx){
				nowEl = item;
				$XH.addClass(item, "active");
			}
		});
		$XH.removeClass($XH.first(servNavEl, "active"), "active");
		IX.map(jQuery(servNavEl).find("a"), function(item){
			if($XD.dataAttr(item, "key") -0 === idx)
				$XH.addClass(item, "active");
		});
	}else{
		if($XH.hasClass(el, "active")) return;
		servNavEl = $XH.ancestor(el, "servNav");
		$XH.removeClass($XH.first(servNavEl, "active"), "active");
		$XH.addClass(el, "active");
		$XH.removeClass(activeEl, "active");
		IX.map(servContentEls, function(item){
			if( $XD.dataAttr(item, "key") -0 === key -0){
				idx = $XD.dataAttr(item, "key") -0;
				nowEl = item;
				$XH.addClass(item, "active");
				jQuery(itemContainerEl).css("margin-left", (marginLeft + baseWidth * (oldKey - key)) + "px");
			}
		});
		servSwitchEl = $XH.first(itemContainerEl, "servSwitch");
		if(idx===1){
			$XH.removeClass($XH.first(servSwitchEl, "hide"), "hide");
			$XH.addClass($XH.first(servSwitchEl, "servPrev"), "hide");
		}else if(idx === servContentElLen){
			$XH.removeClass($XH.first(servSwitchEl, "hide"), "hide");
			$XH.addClass($XH.first(servSwitchEl, "servNext"), "hide");
		}else{
			$XH.removeClass($XH.first(servSwitchEl, "hide"), "hide");
		}

	}
}],["ov.plaSwitch", function(params, el){
	var container = $(el).parents(".plaContainer");
	var ul = container.find(".plaBar");
	var itemLength = ul.children().size();
	var pagerItems = container.find(".pagerItem");
	var activeIndex = container.find(".pagerItem.active").index();
	var dir = params.key;
	var ml = parseInt(ul.css("margin-left"));
	var index;
	if(dir === "left"){
		if(activeIndex === 0) return;
		plaSwitch(ml + 1158, activeIndex - 1);
	}else if(dir === "right"){
		if(activeIndex === itemLength - 1) return;
		plaSwitch(ml - 1158, activeIndex + 1);
	}else{
		index = $(el).index();
		if(index === activeIndex) return;
		plaSwitch(- index * 1158, index);
	}
	
	function plaSwitch(ml,activeIndex){
		ul.css("margin-left", ml);
		pagerItems.removeClass("active");
		pagerItems.eq(activeIndex).addClass("active");
		if(activeIndex === 0)$(".plaPager .leftBtn").addClass("hide");
		else $(".plaPager .leftBtn").removeClass("hide");
		if(activeIndex === itemLength - 1)$(".plaPager .rightBtn").addClass("hide");
		else $(".plaPager .rightBtn").removeClass("hide");
	}
}],["ov.addProduct",function(params, el) {
	overviewDialog.addProduct($XP(params, "key", ""), function(data) {
		servCaller("addService", data, function() {
			hideDialog();
			showPla();
		}, function() {
			hideDialog();
		});
	});
}]]);
var servFlag = {"-1" : "none",
	"0" : "disable",
	"1" : ""
};
var baseProduct = {
	"视云大数据平台" : "PVD",
	"视频云存储" : "PFS",
	"集群云存储": "ROFS",
	"视云联网平台" : "PVG",
	"视频云计算" : "PCC",
	"综合运维管理系统" : "IMS",
	"视云实战平台" : "PVA",
	"视频侦查云平台" : "ICP",
	"pvg" : "PVG",
	"pfs" : "PFS",
	"社会化运营" : "SMT",
	"物理安防信息管理系统" : "SIS"
};
var product4flow = {
	"视云大数据平台" : {
		name : "PVD",
		flowTo : ["PFS","PCC"]
	},
	"视频云存储" : {
		name : "PFS",
		flowTo : ["PCC"]
	},
	"pfs" : {
		name : "PFS",
		flowTo : ["PCC"]
	},
	"集群云存储":{
		name : "ROFS",
		flowTo : ["PFS","ICP","PVA"]
	},
	"视云联网平台" : {
		name : "PVG",
		flowTo : ["PVA","PCC"]
	},
	"pvg" : {
		name : "PVG",
		flowTo : ["PVA","PCC","SMT","SIS"]
	},
	"视频云计算" : {
		name : "PCC",
		flowTo : ["PFS","ICP","IMS"]
	}
};
var formatTitle = {//需要变更格式的名称
	"综合运维管理系统" : "<span>综合运维</span><span>管理系统</span>",
	"视云联网平台" : "<span>视云联网</span><span>平台</span>",
	"视云实战平台" : "<span>视云实战</span><span>平台</span>",
	"视频侦查云平台" : "<span>视频侦查</span><span>云平台</span>"
};
var allOutFlow = ["PFS","ICP","PVA","PCC","IMS"];
var outToinFlow = {//数据流向的流出到流入
	PFS : ["ROFS", "PCC", "PVD"],
	ICP : ["ROFS", "PCC"],
	PVA : ["ROFS", "PVG"],
	PCC : ["PVG", "PFS", "PVD"],
	IMS : ["PCC"]
};
var allInFlow = ["PVD","PFS","ROFS","PVG","PCC"];
var inToOutFlow = {
	PVD : ["PFS", "PCC"],
	PFS : ["PCC"],
	ROFS : ["PFS","ICP","PVA"],
	PVG : ["PVA","PCC"],
	PCC : ["PFS","ICP","IMS"]
};
var numCfg = {
	1 : "one",
	2 : "two",
	3 : "three",
	4 : "four",
	5 : "five"
};
function getServItems(servDatas){
	return IX.map(servDatas, function(servData, index){
		var count = parseInt($XP(servData, "count"));
		var flag = parseInt($XP(servData, "servFlag"));
		return {
			disableClz : servFlag[flag],
			hasbtnClz : userType ? "" : "noBtn",
			servNumClz : count === 1 ? "one" : count === 2 ? "two" : count >2 ? "more" : "",
			lastClz : index === servDatas.length -1 ? "last" : "",
			servName : $XP(servData, "name", ""),
			servNum : count
		};
	});
}
function getReServDatas(servDatas, type){//type用来区分左右，左边一行最多放5个服务，右边2个。
	var reServDatas = [];
	var baseNum = type === "left" ? 5 : 2;
	if(servDatas.length <baseNum +1)
		reServDatas.push(servDatas);
	else{
		var num = Math.ceil(servDatas.length/baseNum);
		for(var i=0; i<num; i++){
			reServDatas.push(servDatas.slice(i*baseNum,i*baseNum + baseNum));
		}
	}
	return reServDatas;
}
function getServContent(reServDatas){
	return IX.map(reServDatas, function(reServData, index){
		return {
			activeClz : index === 0 ? "active" : "",
			numClz : numCfg[index +1],
			key  : index +1,
			items : getServItems(reServData)
		};
	});

}
function isEmptyObj(e){
	var t;
	for(t in e)
		return !1;
	return !0;
}
function getPointerHTML(data){
	var isBase = $XP(data, "isBase");var pointerArr = [];
	if(!isBase) return "";
	var pdt = product4flow[$XP(data, "name")];
	if(!pdt) return "";
	var pdtClz = pdt.name, pdtNum = pdt.flowTo.length;
	var newVersion = $XP(data, "newVersion", []);
	for(var i=0; i< pdtNum; i++){
		pointerArr.push({
			productClz : pdtClz,
			numClz : "to"+pdt.flowTo[i],
			key : pdtClz
		});
	}
	return t_pointerContainer.renderData("", {pointer : pointerArr});
}
function getContent(data, type){
	if(isEmptyObj(data)) return "";
	var version = $XP(data, "version", "");
	var newVersion = $XP(data, "newVersion", []);
	var contentData = [];  //用户保存一个产品的各个版本数组
	contentData.push(data);
	if(newVersion.length){
		contentData = contentData.concat(newVersion);
	}
	var baseNum = type === "left" ? 5 : 2;//每行放多少个服务
	var pointerHTML = getPointerHTML(data);
	return t_contentContainer.renderData("", {
		hideClz : contentData.length >1 ? numCfg[contentData.length] : "hide",
		navItem : IX.map(contentData, function(item, index){
			var ver =  $XP(item, "version");
			return {
				activeClz : ver=== version ? "active" : "",
				version : $XP(item, "version", ""),
				key : index +1
			};
		}),
		content : IX.map(contentData, function(item, index){
					var version = $XP(item, "version", "");
					var servDatas = $XP(item, "services",[]);
					var reServDatas = getReServDatas(servDatas, type);
					var name = $XP(item, "name", "");
					var pdt = product4flow[$XP(data, "name")];
					var pdtClz = pdt ? pdt.name : "";
					return {
						contentClz : index === 0 ? "active" : "",
						disableClz : parseInt($XP(item, "proFlag")) ? "" : "disable",
						key : index +1,
						href : "http://www.baidu.com",//$XP(item, "href", ""),
						titleName : formatTitle[name] ? formatTitle[name] : name,
						title : name,
						version : version,
						width : type ==="left" ? 631 * reServDatas.length : 272 * reServDatas.length,
						servContent : getServContent(reServDatas),
						hideClz : servDatas.length < baseNum +1 ? "hide" : "",
						servNavItem : IX.map(reServDatas, function(item, index){
										return {
											activeClz : index=== 0 ? "active" : "",
											key  : index+1
										};
									}),
						productClz : pdtClz,
						pointerHTML : pointerHTML
					};
				})
	});
}
function getPanels(data){
	//var panelDatas = getPanelDatas(data);//重新获取渲染数组
	var panelDatas = data;
	var firstVer, first;
	return IX.map(panelDatas, function(panelData, index){
		var left = $XP(panelData, "left", {});
		var right = $XP(panelData, "right", {});
		if(!firstVer){
			if(!isEmptyObj(left) || !isEmptyObj(right))
				{firstVer = true;first = index;}
		}
		//var pointerLHTML = getPointerHTML(left);
		//var pointerRHTML = getPointerHTML(right);
		return {
			clz : firstVer ? "hasVerLine" : "",
			firstClz : first === index ? "first" : panelDatas.length === index +1 ? "last" : "",
			leftPanelClz : isEmptyObj(left) ? "invisible" : baseProduct[$XP(left, "name")] ? baseProduct[$XP(left, "name")] : "",
			contentLHTML : getContent(left, "left"),
			lineClz : isEmptyObj(left) ? "lInvisible" : isEmptyObj(right) ? "rInvisible" : "",
			rightPanelClz : isEmptyObj(right) ? "invisible" : baseProduct[$XP(right, "name")] ? baseProduct[$XP(right, "name")] : "",
			contentRHTML : getContent(right, "right"),

		};
	});
}

var t_sysOverview = new IX.ITemplate({tpl: [
	'<div class="section cpu">',
		'<div class="title"><span class="icon-cpu"></span>CPU(核)</div>',
		'<div class="sys-container">',
			'<div class="left">',
				'<div class="detail">',
					'<div class="showDetail"></div>',
				'</div>',
				'<div class="value"></div>',
				'<div class="name">CPU分配</div>',
			'</div>',
			'<div class="right" id="cpu"></div>',
			'<div class="cut"><span></span></div>',
		'</div>',
	'</div>',
	'<div class="section storage">',
		'<div class="title"><span class="icon-storage"></span>存储(TB)</div>',
		'<div class="sys-container">',
			'<div class="outer">',
				'<div class="inner"><canvas id="cav-storage" width="108" height="108"></canvas></div>',
				'<div class="text">',
					'<span class="percent"></span>',
					'<span class="rate"></span>',
				'</div>',
			'</div>',
			'<div class="cut"><span></span></div>',
		'</div>',
	'</div>',
	'<div class="section mem">',
		'<div class="title"><span class="icon-mem"></span>内存(GB)</div>',
		'<div class="sys-container">',
			'<div class="left">',
				'<div class="detail">',
					'<div class="showDetail"></div>',
				'</div>',
				'<div class="value"></div>',
				'<div class="name">内存分配</div>',
			'</div>',
			'<div class="right" id="mem"></div>',
			'<div class="cut"><span></span></div>',
		'</div>',
	'</div>',
	'<div class="section flow">',
		'<div class="title"><span class="icon-flow"></span>网络流量</div>',
		'<div class="sys-container">',
			'<div class="flow-container" id="flow"></div>',
			'<div class="cut"><span></span></div>',
		'</div>',
	'</div>',
'']});

var updateIndicsInterval = null;
var cpuChart, memChart, flowChart;
var wave;
var baseInfo = {
	cpu : {
		text : "CPU使用情况",
		lineColor : "#00f0ff",
		areaColor : "#00f0ff"
	},
	mem : {
		text : "内存使用情况",
		lineColor : "#0affd9",
		areaColor : "#00fac9"
	}
};
var options = {
	base : { //cpu和mem
		title : {
			text : "",
			bottom : 14,
			left: 70,
			textStyle : {
				color : '#00cef8',
				fontSize : 12,
				fontWeight : "normal",
				fontFamily : "宋体"
			}
		},
		tooltip : {
			trigger: 'axis',
			backgroundColor : 'rgba(255,255,255,0.4)',
			padding : [15,10],
			axisPointer : {
				animation : false,
				lineStyle : {color : '#0086c5'}
			},
			formatter : " {b}<br>使用情况 : {c}%"
		},
		grid: {
			show : true,
	        left: 33,
	        right: 33,
	        bottom: 20,
	        top : 30,
	        containLabel: true,
	        backgroundColor : 'rgba(0,49,88,0.3)',
	        borderWidth :0
	    },
		xAxis :
			[{
				type :"category",
				boundaryGap : false,
				axisLine : {
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				splitLine: {
					show: false
				},
				axisLabel : {show:false},
				data : []
			},{
				type :"category",
				boundaryGap : false,
				axisLine : {
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				splitLine: {
					show: false
				},
				data : []
			}],
		yAxis : [{
				type : "value",
				min :0,
				max:100,
				axisLine : {
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				splitLine: {
					show: true,
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				axisTick :{
					show:false
				},
				axisLabel : {
					formatter : '{value}%',
					textStyle : {
						color : '#00cef3'
					}
				}
		}, {
			type : "value",
			axisLine : {
				lineStyle : {
					color : ["#1b507b"]
				}
			},
			splitLine: {
				show: false,
			},
			axisTick :{
				show:false
			},
			axisLabel : {
				show: false
			}
		}],
		series : [{
			name : "百分比",
			type : "line",
			lineStyle : {
				normal : {
					color : "#00f0ff"
				}
			},
			itemStyle : {
				normal : {
					color : "#00f0ff",
					borderWidth : 1
				}
			},
			areaStyle : {
				normal : {
					color : "#00f0ff",
					opacity : 0.6
				}
			},
			data : []
		}]
	},
	flow : {
		legend: {
			data:[{
				name : "下行流量",
				icon : "rect",
				textStyle : {
					color : '#00f0ff'
				}
			},{
				name : "上行流量",
				icon : "rect",
				textStyle : {
					color : '#ff8b8b'
				}
			}],
			bottom : 20
		},
		tooltip : {
			trigger: 'axis',
			backgroundColor : 'rgba(255,255,255,0.4)',
			padding : [15,10],
			axisPointer : {
				animation : false,
				lineStyle : {color : '#0086c5'}
			}
		},
		grid: {
			show:true,
	        left: 18,
	        right: 8,
	        bottom: 38,
	        top : 8,
	        containLabel: true,
	        borderWidth :0
	    },
		xAxis : [
			{
				type :"category",
				boundaryGap : false,
				axisLine : {
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				splitLine: {show: false},
				axisLabel : {
					show : false
				},
				data : []
			},{
				type :"value",
				position : "top",
				axisLine : {
					onZero: false,
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				splitLine: {show: false},
				axisTick :{show:false},
				axisLabel : {show: false},
				data : []
			}
		],
		yAxis : [
	        {
	            type : 'value',
	            axisLine : {
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				splitLine: {
					show: false
				},
				axisTick :{
					show:false
				},
				axisLabel : {
					formatter : '{value}',
					textStyle : {
						color : '#00cef3'
					}
				}
	        },{
	        	type : 'value',
	        	axisLine : {
					lineStyle : {
						color : ["#1b507b"]
					}
				},
				splitLine: {
					show: false,
				},
				axisLabel : {
					show : false
				},
				axisTick :{
					show:false
				},
				inverse : true
	        }
	    ],
		series : [
			{
				name : "下行流量",
				type : "line",
				lineStyle : {
					normal : {
						color : "#00f0ff"
					}
				},
				itemStyle : {
					normal : {
						color : "#00f0ff",
						borderWidth : 1
					}
				},
				areaStyle : {
					normal : {
						color : "#00f0ff",
						opacity : 0.6
					}
				},
				data : []
			},
			{
				name : "上行流量",
				type : "line",
				lineStyle : {
					normal : {
						color : "#ff8b8b"
					}
				},
				itemStyle : {
					normal : {
						color : "#ff8b8b",
						borderWidth : 1
					}
				},
				areaStyle : {
					normal : {
						color : "#ff8b8b",
						opacity : 0.6
					}
				},
				data : []
			}
		]
	}
};
function getComparedFlow(upData, downData){
	var upMax = Math.max.apply(Math, upData);
	var downMax = Math.max.apply(Math, downData);
	var upFlow, downFlow, max;
	if(upMax > downMax){
		upFlow = calYAxis4Flow(upData);
		downFlow = calYAxis4Flow(downData, upFlow.baseNum);
		max = $XP(upFlow, "maxY");
	}else{
		downFlow = calYAxis4Flow(downData);
		upFlow = calYAxis4Flow(upData, downFlow.baseNum);
		max = $XP(downFlow, "maxY");
	}
	return {
		upFlow : upFlow,
		downFlow : downFlow,
		max : max,
		unity : $XP(upFlow, "unity")
	};
}
function calYAxis4Flow(data, baseNum){//后台返回的单位是KB/s
	var flowData = data;
	var maxY = 100;
	var unity;
	var maxNum = Math.max.apply(Math, flowData);
	if(baseNum){
		if(baseNum === 1024*1024*1024){
			unity = "G";
		}else if(baseNum === 1024*1024){
			unity = "M";
		}else if(baseNum === 1024){
			unity = "K";
		}else{
			unity = "";
		}
	}else{
		if(maxNum >= 1024*1024*1024){
			maxY = maxNum/1024/1024/1024;
			unity = "G";
			baseNum = 1024*1024*1024;
		}else if(maxNum >= 1024*1024){
			maxY = maxNum/1024/1024;
			unity = "M";
			baseNum = 1024*1024;
		}else if(maxNum >= 1024){
			maxY = maxNum/1024;
			unity = "K";
			baseNum = 1024;
		}else{
			maxY = maxNum;
			unity = "";
			baseNum = 1;
		}
	}
	if(baseNum !==1){
		for(var i=0; i< flowData.length; i++){
			flowData[i] = Math.ceil(100*flowData[i] /baseNum)/100;
		}
	}
	return {
		maxY : Math.ceil(maxY),
		unity : unity,
		baseNum : baseNum,
		data : flowData
	};

}
function sdvCharts(cfg){
	var container = $XP(cfg, "container");
	var el = $X(container);
	var chart = echarts.init(el);
	return {
		show : function(type){
			chart.setOption(options[type]);
		},
		refresh : function(data){
			if(container !== "flow"){
				options.base.series[0].data = IX.map(data, function(item){
					return $XP(item, "usage",0);
				});
				options.base.title.text = baseInfo[container].text;
				options.base.series[0].lineStyle.normal.color = baseInfo[container].lineColor;
				options.base.series[0].itemStyle.normal.color = baseInfo[container].lineColor;
				options.base.series[0].areaStyle.normal.color = baseInfo[container].areaColor;
				options.base.xAxis[0].data = IX.map(data, function(item){
					return  $XP(item, "time",0);
				});
				chart.setOption({series : options.base.series, title :options.base.title, xAxis : options.base.xAxis});
			}else{
				var downData = IX.map(data, function(item){
					return $XP(item, "down",0);
				});
				var upData = IX.map(data, function(item){
					return $XP(item, "up",0);
				});
				var flowData = getComparedFlow(upData, downData);
				var upInfo = $XP(flowData, "upFlow", {});
				var downInfo = $XP(flowData, "downFlow", {});
				options.flow.series[0].data = $XP(downInfo, "data",[]);
				options.flow.series[1].data = $XP(upInfo, "data",[]);
				options.flow.yAxis[0].max = $XP(flowData, "max",100);
				options.flow.yAxis[0].axisLabel.formatter = '{value} '+ $XP(flowData, "unity","K") + "B/s";
				options.flow.xAxis[0].data = IX.map(data, function(item){
					return  $XP(item, "time",0);
				});
				chart.setOption({series : options.flow.series, xAxis : options.flow.xAxis, yAxis : options.flow.yAxis});
			}
		}
	};
}
function showCpuAndmMem(data){
	IX.map(["cpu", "mem"], function(type){
		var info = $XP(data, type);
		var allocated = 0, total = 0;
		if(info){
			allocated = $XP(info[info.length-1], "allocated",0);
			total = $XP(info[info.length-1], "total",0);
		}
		var usage =total ===0 ? "0%" : Math.round(allocated/total*100) + "%";
		jQuery(".section."+type +" .left .value").html(allocated + "/" + total);
		jQuery(".section."+type +" .left .showDetail").css("bottom", usage).html("<span>"+usage+"</span>");
	});
	if(!cpuChart){
		cpuChart = new sdvCharts({
			container : "cpu"
		});
		cpuChart.show("base");
	}
	cpuChart.refresh($XP(data, "cpu",[]));
	if(!memChart){
		memChart = new sdvCharts({
			container : "mem"
		});
		memChart.show("base");
	}
	memChart.refresh($XP(data, "mem",[]));
}
function showFlow(flowData){
	if(!flowChart){
		flowChart = new sdvCharts({
			container : "flow"
		});
		flowChart.show("flow");
	}
	flowChart.refresh(flowData);
}
function showStorage(storageData){
	var total = $XP(storageData, "total");
	var allocated = $XP(storageData, "allocated");
	var percent = Math.round(allocated / total *100)/100;
	jQuery(".section.storage .text .percent").html(Math.round(allocated / total *100) + "%");
	jQuery(".section.storage .text .rate").html(allocated + "/" + total);
	if(!wave){
		wave = SDV.Wave.SDVWave({name : "storage", item : {indicsNum : percent}});
		wave.initWave();
	}else{
		wave.refresh({indicsNum : percent});
	}
}
function showSys(){
	overCaller("getSysData", {}, function(data){
		var serverInfo = $XP(data, "serverCountInfo", {});
		$X('ovFoot4Sys').innerHTML = t_ovfoot.renderData("",{
			totalName : footCfg.sysOverview.total,
			stopedName : footCfg.sysOverview.stoped,
			total : $XP(serverInfo, "total"),
			active : $XP(serverInfo, "active"),
			stoped : $XP(serverInfo, "stoped"),
			error : $XP(serverInfo, "error")
		});
		showCpuAndmMem(data);
		showFlow($XP(data, "flow", []));
		showStorage($XP(data, "storage", {}));
		//startInterval();
	});
}
function startInterval(){
	updateIndicsInterval = setInterval(function(){
		overCaller("getSysData", {}, function(data){
			showCpuAndmMem(data);
			showFlow($XP(data, "flow", {}));
			showStorage($XP(data, "storage", {}));
		});
	}, 3000);
}

var t_plaOverview = new IX.ITemplate({tpl: [
	'<tpl id="panels">',
		'<div class="plaContainer">',
			'<div class="title text-center">',
				'<span>{levelName}</span>',
			'</div>',
			'<div class="plaPanel">{contentHTML}',
			'</div>',
			'<div class="plaPager {showPager}">',
				'<a class="leftBtn" data-href="$ov.plaSwitch" data-key = "left"></a>',
				'<a class="rightBtn" data-href="$ov.plaSwitch" data-key = "right"></a>',
				'<div class="pageNum">',
					'<tpl id="pagerItem">',
						'<a class="pagerItem {activeClz}" data-href="$ov.plaSwitch" data-key = "num"></a>',
					'</tpl>',
				'</div>',
			'</div>',
		'</div>',
	'</tpl>',
'']});
var t_plaBar = new IX.ITemplate({tpl: [
	'<ul class="plaBar" style="width: {width}px;">',
		'<tpl id="plaItem">',
			'<li class="plaItem">',
				'<tpl id="plaBox">',
					'<div class="plaBox {lastClz}">',
						'<div class="plaTitle">{plaName}</div>',
						'<div class="plaContent">',
							'<tpl id="proItem">',
								'<div class="proItem {disabled}">',
									'<span class="text">{proName}</span>',
									'<span class="ver">{proVer}</span>',
								'</div>',
							'</tpl>',
							'<a class="addProBtn" data-href="$ov.addProduct" data-key="{plaName}"></a>',
						'</div>',
					'</div>',
				'</tpl>',
			'</li>',
		'</tpl>',
	'</ul>',
'']});

function showPla(){
	overCaller("getPlaData", {}, function(data){
		$X('ovPla').innerHTML = t_plaOverview.renderData("", {panels : getPlaPanels($XP(data, "levels", []))}); //给panels传入数组数据填充
		var margin = ($(".pla-container").height() - $(".plaContainer").height()*3)/4;
		$(".plaContainer").css("margin-bottom", margin);
		$(".plaContainer:first").css("margin-top", margin);
	});
}
function getPlaPanels(data){
	var panelDatas = data;
	return IX.map(panelDatas, function(panelData, index){
		var plaItem = getPlaItem($XP(panelData, "platforms", []));
		return {
			levelName : $XP(panelData, "levelname", ""),
			showPager : plaItem.length > 1 ? "" : "hide",
			pagerItem : IX.map(plaItem, function(item,index){
				return {
					activeClz : index === 0 ? "active" : ""
				};
			}),
			contentHTML : getPlaBar(plaItem)
		};
	});
}
function getPlaItem(data){ //根据固定承载宽度计算得出每层中的ul中li数量以及li中承载的数据
	var plaItem = [];
	var totalWidth = 0;
	var arr = [];
	IX.map(data, function(item,index){
		var products = $XP(item, "products", []);
		var width = totalWidth;
		if(products.length){
			width += products.length * (95+15) + 86 + 2 + 20;
		}else{
			width += 151 + 20;
		}
		if(width - 15 < 1158){
			arr.push(item);
			totalWidth = width;
		}else{
			plaItem.push(arr);
			totalWidth = 0;
			arr = [];
			arr.push(item);
		}
		if(index === data.length - 1 && arr.length !== 0) plaItem.push(arr);
	});
	return plaItem;
}
function getPlaBar(plaItem){
	return t_plaBar.renderData("", {
		width : plaItem.length*1158,
		plaItem : IX.map(plaItem, function(item,index){
			return {
				plaBox : IX.map(item, function(plaItems,plaIndex){
					return {
						plaName : $XP(plaItems, "name", ""),
						lastClz : plaIndex === item.length - 1 ? "last" : "",
						proItem : IX.map(plaItems.products, function(proItems,proIndex){
							return {
								proName : $XP(proItems, "name", ""),
								proVer : $XP(proItems, "version", ""),
								disabled : $XP(proItems, "proFlag", 0) ? "" : "disabled"
							};
						})
					};
				})
			};
		})
	});
}


function switchOut(){
	if(wave){
		var timer = wave.getTimer();
		if(timer){
			clearInterval(timer);
			timer = null;
		}
	}
	if (!updateIndicsInterval)
		return;
	clearInterval(updateIndicsInterval);
	updateIndicsInterval = null;
}

IX.ns("SDV.Overview");
SDV.Overview.init = function(pageCfg, pageParams, cbFn){
	pageCfg.switchOut = switchOut;
	userType = SDV.Env.getUserType();
	$X('body').innerHTML = t_overview.renderData("",{
		ovBackground : SDV.Global.ovbgUrl,
		panelActiveClz : "active",
		sysActiveClz : "",
		plaActiveClz : ""
	});
	overCaller("getOverView", {}, function(data){
		if(!$XH.hasClass(document.body, "overview")) return;
		var servInfo = $XP(data, "serviceCountInfo", {});
		$X('ovFoot4Panels').innerHTML = t_ovfoot.renderData("",{
			totalName : footCfg.overview.total,
			stopedName : footCfg.overview.stoped,
			total : $XP(servInfo, "total"),
			active : $XP(servInfo, "active"),
			stoped : $XP(servInfo, "stoped"),
			error : $XP(servInfo, "error")
		});
		$X('ovPanels').innerHTML = t_panelsContainer.renderData("", {panels : getPanels($XP(data, "product"), [])}) ;
		// jQuery(".remove.first").bind("animationend", function(){
		// 	//jQuery(".ROFS.one").addClass("hasAinmate");
		// 	jQuery(".remove.second").addClass("hasAinmate");
		// 	jQuery(".remove.three").addClass("hasAinmate");
		// });
		if(jQuery("#ovPanels").height() < 700){
			var marginTop = (700 - jQuery("#ovPanels").height())/2;
			jQuery("#ovPanels").css("marginTop", marginTop > 15 ? marginTop : 15);
		}else{
			jQuery("#ovPanels").css("marginTop", 15);
		}
		jQuery(".ov-container .circle").hover(function(){
			var contentEl = $XH.ancestor(this, "content");
			if(!$XH.hasClass(contentEl, "disable"))
				$XH.addClass(this, "hover");
		},function(){
			$XH.removeClass(this, "hover");
		});
		jQuery(".ov-container .circle").bind("click", function(){
			var href = $XD.dataAttr(this, "href");
			if(href) window.open(href);
		});
		IX.map(allInFlow,function(item){
			if(jQuery(".panel."+item).length){
				IX.map(inToOutFlow[item], function(to){
					if(!jQuery(".panel."+to).length || jQuery(".panel."+to+" .content.active.disable").length){
						jQuery(".panel."+item+" .to"+to).addClass("disable");
					}
				});
			}
		});
	});
	SDV.Env.onResize4Body();
};
})();
(function () {
var caller = SDV.Global.serviceCaller;
var ixwPages = IXW.Pages;
var serviceDialog = SDV.serviceDialog;
var sdvDialog = SDV.Dialog;
var hideDialog = SDV.Dialog.hide;
var updateGridInterval = null;
var uploadedCbHT = new IX.IListManager();

var GridCfgs = {
	service : {
		clz : "serviceGrid",
		columns : ["_checkbox","_no","serviceName","product","version","ip","cpuUsage","memUsage","diskUsage","flow","serviceStatus"],
		itemPageName : "services",
		tools : {
			type : "service",
			buttons : ["refresh", "add", "poweron", "poweroff","restart","delete"],
			search : true,
			filter : ["status","product"]
		}
	},
	backup : {
		clz : "backupGrid",
		columns : ["_checkbox","_no", "bkService","bkIP","backupTime","cycle","recoveryTime","recoveryService","comment","bkStatus"],
		itemPageName : "serviceBackups",
		sortParams : {name :"backupTime", ifDown : 1},
		tools : {
			type : "backup",
			buttons : ["delete"],
			search : true,
			filter : ["status"]
		}
	}
};
var InfoTexts = {
	service : {
		listCaller : "listServices"
	},
	backup : {
		listCaller : "listBackups4Service"
	}
};
var optionInfos = {
	service :{
		name : "服务",
		deleteCaller : "deleteServices",
	},
	backup : {
		name : "备份",
		deleteCaller : "deleteBackups4Service"
	}
};

var t_page = new IX.ITemplate({tpl: [
	'<div class="card-switch">',
		'<a class="{serviceClz}" data-href="services">服务</a>',
		'<a class="{backupClz}" data-href="service/backups">备份</a>',
	'</div>',
	'<div id="gridTools" class="grid-tools"></div>',
	'<div id="gridContainer"></div>',
	'<img id="refreshLoading" class="loading" src="{imgUrl}">',
	'<div class="test"></div>',
'']});
var t_uploadkey = new IX.ITemplate({tpl: [
	'<form action="{url}" method="POST" enctype="multipart/form-data" id="key_form" name="key_form" target="key_frame">',
		'<input name="serviceId" value="{value}">',
		'<input type="file" id="authKey" name="authKey">',
		'<input type="hidden" name="tkey" value="{tkey}">',
		'<iframe name="key_frame" id="key_frame" style="display:none" src = "about:blank"></iframe>',
	'</form>',
'']});

function ifInArrayStatus(status,  arr){
	var isEnabled = false;
	IX.map(arr, function(item){
		if(status === item){
			isEnabled = true;
		}
	});
	return isEnabled;
}
function getEnabledBtns(selectedRows){
	var status = "", arrbtnStatus=[];
	var poweron, poweroff, restart, del;
	IX.map(selectedRows, function(rowModel){
		status = rowModel.get("status");
		if(!poweron) poweron = ifInArrayStatus(status, [4]);
		if(!poweroff) poweroff = ifInArrayStatus(status, [2]);
		if(!restart) restart = ifInArrayStatus(status, [2]);
		if(!del) del = true;
	});
	if(poweron) arrbtnStatus.push("poweron");
	if(poweroff) arrbtnStatus.push("poweroff");
	if(restart) arrbtnStatus.push("restart");
	if(del) arrbtnStatus.push("delete");
	return arrbtnStatus;
}
function getEnableActs(rowData){
	var poweron, poweroff,restart,edit,upload, download;
	var status = rowData.status;
	var isNeedAuth = $XP(rowData, "isNeedAuth");
	poweron = ifInArrayStatus(status, [4]);
	poweroff = ifInArrayStatus(status, [2]);
	restart = ifInArrayStatus(status, [2]);
	edit = ifInArrayStatus(status, [4]);
	return {
		"poweron" : poweron,
		"poweroff" : poweroff,
		"restart" : restart,
		"edit" : edit,
		isNeedAuth : isNeedAuth
	};
}
function poweronFn(ids, grid){
	caller("poweronServices", {ids : ids}, function(){
		grid.refresh();
	});
}
function poweroffFn(ids, grid){
	caller("poweroffServices", {ids : ids}, function(){
		grid.refresh();
	});
}
function restartFn(ids, grid){
	caller("restartServices", {ids : ids}, function(){
		grid.refresh();
	});
}
function deleteFn(type, info, grid){
	var optInfo = optionInfos[type];
	sdvDialog.confirm("删除"+optInfo.name, "确认删除选中的"+optInfo.name+"吗？", function(){
		caller(optInfo.deleteCaller, {ids : info.ids}, function(){
			hideDialog();
			grid.refresh();
		}, hideDialog);
	});
}
function backupFn(rowModel, grid){
	serviceDialog.backup(rowModel, function(data){
		caller("backupService", IX.inherit({id : rowModel.getId()}, data), function(){
			hideDialog();
			grid.refreshGrid();
		});
	});
}
function distanceFn(rowModel, grid){
	serviceDialog.showVNC(rowModel.getId());
}

function uploadFn(rowModel){
	var tkey = IX.id();
	jQuery("#body").append(t_uploadkey.renderData("", {
		url : SDV.Global.uploadKeyUrl + "?tkey="+tkey,
		tkey : tkey,
		value : rowModel.getId()
	}));
	$X('key_form').querySelectorAll('input[type="file"]')[0].click();
	$X('key_form').onchange = function(){
		submitUpload();
	};
	function submitUpload(){
		uploadedCbHT.register(tkey, function(retData){
			$X('key_form').remove();
			switch(retData.retCode){
				case 0 :
					SDV.Dialog.alert(retData.err);
					break;
				case -1 :
					SDV.Env.clearSession();
					break;
				default :
					return /*cbFn(retData.data)*/;
			}
		});
		$X('key_form').submit();
	}
}
function downloadFn(rowModel){
	var form = jQuery('<form id="form" action="services/downloadKey" method="POST" style="display:none"></form>');
	var input = jQuery('<input type="text" name="serviceId" value="'+rowModel.getId()+'">');
	jQuery("#body").append(form);
	form.append(input);
	form.submit();
	form.remove();
}
function recoveryFn(rowModel, grid){
	serviceDialog.recoveryBackup(rowModel, function(data){
		caller("revoceryBackup4Service", IX.inherit({id : rowModel.getId()}, data), function(){
			hideDialog();
			grid.refreshGrid();
		}, hideDialog);
	});
}
function editFn(type, rowModel, grid){
	serviceDialog.editServcie(rowModel, function(data){
		caller("editService", IX.inherit({id : rowModel.getId()}, data), function(){
			hideDialog();
			grid.refreshGrid();
		}, hideDialog);
	});
}
function showServices(type,cbFn){
	var userType = SDV.Env.getUserType();
	var serviceClz, backupClz, moveClz;
	var refreshTime;
	var hasProduct;//是否是从概况页点击进来的某种产品下的服务{product : product}
	if(type === "service") {
		serviceClz = "active";
		backupClz = "";
		moveClz = "servActive";
		if(IX.isFn(cbFn)) hasProduct = cbFn();
		refreshTime = 5000;
	}else{
		serviceClz = "";
		backupClz = "active";
		moveClz = "bkActive";
		refreshTime = 3000;
	}
	$X('body').innerHTML = t_page.renderData("", {
		serviceClz : serviceClz,
		backupClz : backupClz,
		moveClz : moveClz,
		imgUrl : SDV.Global.refreshIntervalUrl
	});
	var options = IX.inherit(type === "service" ? hasProduct ? hasProduct : {product : "-1"} : {},{status : "-1"});
	var commonTools = {
		service : ["refresh"],
		backup : ["test"]//这个button是为了布局而设置的不显示的button
	};
	var gridCfg = GridCfgs[type], textInfo = InfoTexts[type];
	gridCfg.clz = userType ? gridCfg.clz  : gridCfg.clz  +" noactionGrid";
	gridCfg.tools.buttons = userType ? gridCfg.tools.buttons : commonTools[type];
	var grid = new SDV.Grid.NVGrid(IX.inherit(gridCfg,{
		container : "gridContainer",
		actions : userType ? type === "service" ? [["poweron","运行",function(rowModel){
			poweronFn([rowModel.getId()], grid);
		}, "disable"],["poweroff","停止",function(rowModel){
			poweroffFn([rowModel.getId()], grid);
		}, "disable"],["restart","重启", function(rowModel){
			restartFn([rowModel.getId()], grid);
		}, "disable"], ["edit", "编辑", function(rowModel){
			editFn(type, rowModel, grid);
		}, "disable"],["delete", "删除", function(rowModel){
			deleteFn(type, {ids : [rowModel.getId()], names : rowModel.get("name")}, grid);
		}],["backup","备份",function(rowModel){
			backupFn(rowModel, grid);
		}],["distance","远程",function(rowModel){
			distanceFn(rowModel);
		}],["upload","上传key",function(rowModel){
			uploadFn(rowModel);
		}, "disable"],["download", "下载key",function(rowModel){
			downloadFn(rowModel);
		}, "disable"]] : [["recovery", "恢复备份", function(rowModel){
			recoveryFn(rowModel, grid);
		}],["delete", "删除", function(rowModel){
			deleteFn(type, {ids : [rowModel.getId()], names : rowModel.get("name")}, grid);
		}],] : [],
		dataLoader : function(params, cbFn){
			caller(textInfo.listCaller, IX.inherit(options, params), cbFn, function(){
				switchOut();
			});
		},
		clickOnRow : function(rowId, cellName, cellEl){
			if(type === "backup") return;
			ixwPages.load(ixwPages.createPath("service-info", {id : rowId}));
		},
		onselect : function(){
			var enableBtns = getEnabledBtns(grid.getSelectedRows());
			SDV.GridTools.enableTools("gridTools",false, enableBtns);
		},
		ifactionsEnable : function(rowData){
			return getEnableActs(rowData);
		}
	}));
	SDV.Grid.currentGrid = {
		refresh :function(){
			grid.refreshGrid();
		},
		add : function(){
			serviceDialog.addService(function(data){
				caller("addService", data, function(retData){
					hideDialog();
					grid.refreshGrid();
					/*var isPrompt4Host = $XP(retData, "isPrompt4Host");
					if(isPrompt4Host){
						var serviceName = $XP(data, "service");
						var host = $XP(retData, "host");
						if(serviceName === "视频云存储服务PFS" || serviceName === "集群云存储存储服务ROFS"){
							sdvDialog.alert("主机"+host+"上已部署有"+ serviceName+",请选择其他主机", function(){
								jQuery("#nv-dialog .okbtn").removeClass("disable");
							});
						}else if(serviceName === "媒体转发服务FS" || serviceName === "标准媒体服务MS" || serviceName === "卡口接入服务IOD"){
							sdvDialog.confirmAlert("提示", "主机"+host+"上已部署有"+serviceName+"，本次操作可能会降低服务性能，是否继续？", function(){
								caller("addService", IX.inherit(data, {isCheck4Service :0, isCheck4Host : 0}), function(){
									hideDialog();
									grid.refreshGrid();
								}, hideDialog);
							}, function(){
								jQuery("#nv-dialog .okbtn").removeClass("disable");
							});
						}else{
							hideDialog();
							grid.refreshGrid();
						}
					}else{
						hideDialog();
						grid.refreshGrid();
					}*/
				}, hideDialog);
			});
		},
		poweron : function(){
			var ids = [];
			IX.map(grid.getSelectedRows(), function(rowModel){
				if(rowModel.get("status") === 4) ids.push(rowModel.getId());
			});
			poweronFn(ids, grid);
		},
		poweroff : function(){
			var ids = [];
			IX.map(grid.getSelectedRows(), function(rowModel){
				if(rowModel.get("status") === 2) ids.push(rowModel.getId());
			});
			poweroffFn(ids, grid);
		},
		restart : function(){
			var ids = [];
			IX.map(grid.getSelectedRows(), function(rowModel){
				if(rowModel.get("status") === 2) ids.push(rowModel.getId());
			});
			restartFn(ids, grid);
		},
		"delete" : function(){
			var ids = [];
			var names = "";
			IX.map(grid.getSelectedRows(), function(rowModel){
				ids.push(rowModel.getId());
				names = names +rowModel.get("name") + "、" ;
			});
			if(names) names = names.substring(0, names.length-1);
			deleteFn(type, {ids : ids, names : names}, grid);
		},
		filter : function(_options){
			var type = $XP(_options, "type", "status");
			var value = $XP(_options, "key", "");
			options[type] = value;
			//options = _options;
			grid.refreshGrid(0);
		},
		search : function(value){
			grid.search(value);
		}
	};
	if(type === "service"){
		var defaultProduct = hasProduct ? {value : hasProduct.product} : "";
		caller("getProducts4Filter", {}, function(filterData){
			SDV.GridTools.showTools("gridTools", gridCfg.tools, {"filterData":filterData, "defaultData":defaultProduct}, "");
			SDV.Env.onResize4Body();
		});
	}else{
		SDV.GridTools.showTools("gridTools", gridCfg.tools);
		SDV.Env.onResize4Body();
	}
	grid.show(function(){
		if(SDV.Global.autoRefresh) updateGridInterval = setInterval(grid.refresh, refreshTime);
	});
	cbFn();
}

var t_serviceInfo = new IX.ITemplate({tpl: [
	'<div id="pathNav"></div>',
	'<div class="serviceInfo">',
		'<div class="infoContainer">',
			'<div class="title">{name}</div>',
			'<div class="hdr"><span class="no">序号</span><span class="text">名称</span><span class="value">详细信息</span></div>',
			'<div class="itemContainer"><div class="item">',
				'<div><span class="no">1</span><span class="text">所属主机IP</span><span class="value">{ip}</span></div>',
				'<div><span class="no">2</span><span class="text">占用CPU</span><span class="value">{occupyCpu}</span></div>',
				'<div><span class="no">3</span><span class="text">虚拟CPU</span><span class="value">{virtualCpu}</span></div>',
				'<div><span class="no">4</span><span class="text">内存</span><span class="value">{mem}</span></div>',
				'<div><span class="no">5</span><span class="text">硬盘</span><span class="value">{disk}</span></div>',
				'<div><span class="no">6</span><span class="text">新建时间</span><span class="value">{addTime}</span></div>',
			'</div></div>',
		'</div>',
	'</div>',
'']});


function formatMem(mem){
	if(mem > 1024)
		return Math.round(mem/1024*100)/100 + "GB";
	else return mem + "MB";
}
function _showServiceInfo(serviceId, type, cbFn){
	$X('body').innerHTML = new IX.ITemplate({tpl : ['<img id="refreshLoading" class="loading" src="{imgUrl}">']}).renderData("",{
		imgUrl : SDV.Global.refreshIntervalUrl
	});
	caller("getServiceInfo", {id : serviceId}, function(serviceInfo){
		$X('body').innerHTML = t_serviceInfo.renderData("", {
			name : $XP(serviceInfo, "name", ""),
			ip : $XP(serviceInfo, "ip", ""),
			occupyCpu : $XP(serviceInfo, "occupyCpu", "") + "核",
			virtualCpu : $XP(serviceInfo, "virtualCpu", "")+ "核",
			mem : formatMem($XP(serviceInfo, "mem", 0)),
			disk : $XP(serviceInfo, "disk", "") + "GB",
			addTime : $XP(serviceInfo, "addTime", "")
		});
		SDV.PathNav.showPathNav("pathNav", ["services"], $XP(serviceInfo, "name", ""));
	});
}
function switchOut(){
	if(!updateGridInterval) return;
	clearInterval(updateGridInterval);
	updateGridInterval=null;
}
IX.ns("SDV.Service");
SDV.Service.keyUploadedCB= function(tkey, retData){
	var fn = uploadedCbHT.get(tkey);
	if(IX.isFn(fn)) fn(retData);
};
SDV.Service.init = function(pageCfg, pageParams, cbFn){
	pageCfg.switchOut = switchOut;
	var pageName = pageCfg.name;
	var serviceId = $XP(pageParams,"id");
	switch(pageName){
	case "services":
		showServices("service",cbFn);
		break;
	case "service-backup":
		showServices("backup", cbFn);
		break;
	case "service-info":
		_showServiceInfo(serviceId, "info", cbFn);
		break;

	}
};
})();
(function () {
var caller = SDV.Global.productCaller;
var showDialog = SDV.Dialog.show;
var hideDialog = SDV.Dialog.hide;
var globalActionConfig = IXW.Actions.configActions;
var dropdownBox = SDV.inputBox.dropdownBox();
var inputBox = SDV.inputBox.inputBox();
var uploadedCbHT = new IX.IListManager();

var t_editProduct = new IX.ITemplate({tpl: [
	'<div class="contentRow">',
		'<span class="label">产品名称</span>{productHTML}<span class=\'mark\'>*</span>',
	'</div>',
	'<div class="prompt">1-18个字符 中文 英文 数字 _@/.</div>',
	'<div class="contentRow">',
		'<span class="label">产品版本</span>{versionHTML}<span class=\'mark\'>*</span>',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">业务属性</span>{attributeHTML}<span class=\'mark\'>*</span>',
	'</div>',
'']});
var t_addService = new IX.ITemplate({tpl: [
'<form action="{url}" method="POST" enctype="multipart/form-data" id="product_form" name="product_form" target="product_frame">',
	'<div class="contentRow">',
		'<span class="label">服务名称</span>{serviceHTML}<span class=\'mark\'>*</span>',
	'</div>',
	'<div class="prompt">1-18个字符 中文 英文 数字 _@-/.</div>',
	'<div class="contentRow">',
		'<input type="hidden" id="{id}" name="id" value="{id}">',
		'<span class="label">服务镜像</span>',
		'<span class="relative_file">',
			'<a class="updata_file">选择文件</a>',
			'<input type="file" id="imageFile" class="required" name="imageFile">',
			'<input type="hidden" name="tkey" value="{tkey}" id="tkey">',
			'<span class="txt" id="fileName"></span>',
		'</span>',
		'<span class=\'mark\'>*</span>',
	'</div>',
	'<div class="ConfigDetail">{configDetailHTML}</div>',
	'<iframe name="product_frame" id="product_frame" style="display:none" src="about:blank"></iframe>',
'</form>',
'']});
var t_editService = new IX.ITemplate({tpl: [
		'<div class="contentRow {editStatus}">',
			'<span class="label">服务名称</span>{serviceHTML}<span class=\'mark\'>*</span>',
		'</div>',
		'<div class="prompt {editStatus}">1-18个字符 中文 英文 数字 _@-/.</div>',
		'<div class="contentRow {viewStatus}">',
			'<span class="label">服务名称</span><span class="viewtxt">{serviceName}</span>',
		'</div>',
		'<div class="ConfigDetail">{configDetailHTML}</div>',
'']});
var t_ConfigDetail = new IX.ITemplate({tpl: [
	'<div class="contentRow">',
		'<span class="label">占用CPU</span>{occupyCpu}核<span class=\'mark\'>*</span><span class="prompt">请输入大于 0 的数值</span>',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">虚拟CPU</span>{virtualCpu}核<span class=\'mark\'>*</span><span class="prompt">请输入大于 0 的数值</span>',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">内存</span>{mem}GB<span class=\'mark\'>*</span><span class="prompt">请输入大于 0 的数值</span>',
	'</div>',
	'<div class="contentRow">',
		'<span class="label">硬盘</span>{disk}GB<span class=\'mark\'>*</span><span class="prompt">请输入大于等于 {min} 的数值</span>',
	'</div>',

'']});

var productCfg = {
	product : {id : "proname", inputClz : "required textLimit", type : "product"},
	version : {id : "version", inputClz : "required",type : "version"},
	service : {id : "servname", inputClz : "required textLimit", type : "service"},
	occupyCpu : {id : "occupyCpu", inputClz : "required num numLimit",  min : 1},
	virtualCpu : {id : "virtualCpu", inputClz : "required num numLimit",  min : 1},
	mem : {id : "occupyMem", inputClz : "required num numLimit",  min : 1},
	disk : {id : "occupyDisk", inputClz : "required num numLimit",  min : 1},
	serviceAttr : {id : "serAttr", inputClz : "required"}
};
function vertifyRequired(){
	var flag = true;
	IX.map(jQuery(".area input.required"), function(el){
		if(el.value === ""){
			flag = false;
		}
		var lastEl = el;
		if($XH.hasClass(el.parentNode, "dropdown")){
			lastEl = $XH.first(el.parentNode, "dropdown-toggle");
		}
		$XH[el.value=== "" ? "addClass" : "removeClass"](lastEl, "requiredMark");
	});
	IX.map(jQuery(".area input.numLimit"), function(el){
		if($XH.hasClass(el, "morelimit")) flag = false;
	});
	return flag;
}
function bindOnValue(areaEl){
	var inputs = jQuery("input.required");
	IX.map(inputs, function(el){
		inputBox.isInputNull(el);
	});
	var textLimitInputs = jQuery("input.textLimit");
	IX.map(textLimitInputs, function(el){
		inputBox.textLimit(el);
	});
	var numInputs = jQuery("input.num");
	IX.map(numInputs, function(el){
		inputBox.isNum(el);
	});
	var numLimitInputs = jQuery("input.numLimit");
	IX.map(numLimitInputs, function(el){
		var quota = parseInt($XD.dataAttr(el, "quota",1));
		var min = parseInt($XD.dataAttr(el, "min",1));
		inputBox.numLimit(el,min, quota);
	});
}
function submitProduct(okFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var name = $X('proname').value;
		var version = $X('version').value;
		var serviceAttr = $X('serAttr').value;
		var productInfo = {
			name : name,
			version : version,
			serviceAttr : serviceAttr
		};
		okFn(productInfo);
	}
}
function submitService(tkeyName, cbFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var formEl = $X('product_form');
		uploadedCbHT.register(tkeyName, function(retData){
			switch(retData.retCode){
				case 0 :
					hideDialog();
					SDV.Dialog.alert(retData.err);
					break;
				case -1 :
					SDV.Env.clearSession();
					break;
				default :
					return cbFn(retData.data);
			}
		});
		formEl.submit();
	}
}
function submit4EditProduct(okFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var name = $X('proname').value;
		var version = $X('version').value;
		var serviceAttr = $X('serAttr').value;
		var productInfo = {
			name : name,
			version : version,
			serviceAttr : serviceAttr
		};
		okFn(productInfo);
	}
}
function submit4EditService(okFn, btndisableFn){
	var flag = vertifyRequired();
	if(flag){
		if(IX.isFn(btndisableFn)) btndisableFn();
		var name = $X('servname').value;
		var occupyCpu = $X('occupyCpu').value;
		var virtualCpu = $X('virtualCpu').value;
		var mem = $X('occupyMem').value;
		var disk = $X('occupyDisk').value;
		var serviceInfo = {
			name : name,
			occupyCpu : occupyCpu,
			virtualCpu : virtualCpu,
			occupyMem : mem,
			occupyDisk : disk
		};
		okFn(serviceInfo);
	}
}
function fileChange(){
	var fileEl = $X('imageFile');
	if(!fileEl) return;
	jQuery(fileEl).bind("change", function(){
		jQuery("#fileName").html(fileEl.value.split('\\').pop());
		jQuery("#fileName").attr("title",fileEl.value.split('\\').pop());
	});
}



IX.ns("SDV.productDialog");
SDV.productDialog.FileUploadedCB = function(tkey, retData){
	var fn = uploadedCbHT.get(tkey);
	fn(retData);
};
SDV.productDialog.addProduct = function(okFn){
	caller("getAttributes4Filter",{},function(info){
		showDialog({
			title : "添加产品",
			content : t_editProduct.renderData("", {
				productHTML : inputBox.getHTML(productCfg.product),
				versionHTML : inputBox.getHTML(productCfg.version),
				attributeHTML : dropdownBox.getHTML(productCfg.serviceAttr, IX.loop(info,[],function(acc,item){
					acc.push(item.name);
					return acc;
				}))
			}),
			okFn : function(cbFn, btndisableFn){submitProduct(okFn, btndisableFn);},
			bindOn : function(areaEl){
				bindOnValue(areaEl, "add");
			}
		});
	});
};
SDV.productDialog.editProduct = function(rowModel,okFn){
	caller("getAttributes4Filter",{},function(info){
		showDialog({
			title : "编辑产品",
			content : t_editProduct.renderData("", {
				productHTML : inputBox.getHTML(productCfg.product, rowModel.get("name")),
				versionHTML : inputBox.getHTML(productCfg.version, rowModel.get("version")),
				attributeHTML : dropdownBox.getHTML(IX.inherit(productCfg.serviceAttr,{value : rowModel.get("serviceAttr")}), 
				IX.loop(info,[],function(acc,item){
					acc.push(item.name);
					return acc;
				}))
			}),
			okFn : function(cbFn, btndisableFn){submit4EditProduct(okFn, btndisableFn);},
			bindOn : function(areaEl){
				bindOnValue(areaEl, "edit");
			}
		});
	});
};
SDV.productDialog.addService4Product = function(okFn, rowId){
	var tkeyName = IX.id();
	showDialog({
		title : "新建服务",
		content : t_addService.renderData("", {
			url : SDV.Global.serviceFileUploadUrl,
			serviceHTML : inputBox.getHTML(productCfg.service),
			tkey : tkeyName,
			id : rowId,
			configDetailHTML : t_ConfigDetail.renderData("", {
				occupyCpu : inputBox.getHTML(productCfg.occupyCpu),
				virtualCpu : inputBox.getHTML(productCfg.virtualCpu),
				mem : inputBox.getHTML(productCfg.mem),
				disk : inputBox.getHTML(productCfg.disk),
				min :1
			})
		}),
		okFn : function(cbFn, btndisableFn){submitService(tkeyName, okFn, btndisableFn);},
		bindOn : function(areaEl){
			bindOnValue(areaEl, "add");
		}
	});
	fileChange();
};
SDV.productDialog.editService4Product = function(rowModel, okFn, isBase){
	showDialog({
		title : "编辑服务",
		content : t_editService.renderData("", {
			serviceHTML : inputBox.getHTML(productCfg.service, rowModel.get("name")),
			editStatus : isBase ? "hide" : "",
			viewStatus : isBase ? "" : "hide",
			serviceName : rowModel.get("name"),
			configDetailHTML : t_ConfigDetail.renderData("", {
				occupyCpu : inputBox.getHTML(productCfg.occupyCpu, rowModel.get("occupyCpu")),
				virtualCpu : inputBox.getHTML(productCfg.virtualCpu, rowModel.get("virtualCpu")),
				mem : inputBox.getHTML(productCfg.mem, rowModel.get("occupyMem")),
				disk : inputBox.getHTML(productCfg.disk, rowModel.get("occupyDisk"), rowModel.get("occupyDisk")),
				min : rowModel.get("occupyDisk")
			})
		}),
		okFn : function(cbFn, btndisableFn){submit4EditService(okFn, btndisableFn);},
		bindOn : function(areaEl){
			bindOnValue(areaEl, "edit");
		}
	});
};

})();
(function () {
var caller = SDV.Global.productCaller;
var ixwPages = IXW.Pages;
var globalActionConfig = IXW.Actions.configActions;
var productDialog = SDV.productDialog;
var sdvDialog = SDV.Dialog;
var hideDialog = SDV.Dialog.hide;
var updateGridInterval = null;

var GridCfgs = {
	product : {
		clz : "productGrid",
		columns : ["_checkbox", "_no","productName","version","serviceAttr"],
		itemPageName : "products",
		tools : {
			type : "product",
			buttons : ["add", "delete"],
			search : true,
			filter : ["serviceAttr"]
		}
	},
	service : {
		clz : "productServiceGrid",
		columns : ["_checkbox", "_no", "serviceName", "occupyCpu", "virtualCpu", "occupyMem", "occupyDisk"],
		itemPageName : "productServices",
		tools : {
			type : "service",
			buttons : ["add", "delete"]
		}
	}
};
var InfoTexts = {
	product : {
		name : "产品",
		listCaller : "listProducts",
		editCaller : "editProduct",
		deleteCaller : "deleteProducts",
		addCaller : "addProduct",
		addDlg : "addProduct",
		editDlg : "editProduct"
	},
	service : {
		name : "服务",
		listCaller : "listServices4Product",
		editCaller : "editService4Product",
		deleteCaller : "deleteServices4Product",
		addDlg : "addService4Product",
		editDlg : "editService4Product"
	}
};
var editTexts = {
	product : "editProduct",
	service : "editService4Product"
};
function getEnabledBtns(selectedRows){
	var isBase, arrbtnStatus=[];
	var del;
	IX.map(selectedRows, function(rowModel){
		isBase = rowModel.get("isBase");
		if(!del && !isBase) del = true;
	});
	if(del) arrbtnStatus.push("delete");
	return arrbtnStatus;
}
function deleteFn(type, info, grid){
	var optInfo = InfoTexts[type];
	sdvDialog.confirm("删除"+optInfo.name, "确认删除选中的"+optInfo.name+"吗？", function(){
		caller(optInfo.deleteCaller, {ids : info.ids}, function(){
			hideDialog();
			grid.refresh();
		}, hideDialog);
	});
}
function editFn(rowModel, type, grid, isBase){
	var textInfo = InfoTexts[type];
	productDialog[textInfo.editDlg](rowModel, function(data){
		caller(textInfo.editCaller, IX.inherit({id : rowModel.getId()}, data), function(){
			hideDialog();
			grid.refreshGrid();
		},function(){
			hideDialog();
		});
	}, isBase);
}
function distanceFn(){}

var t_page = new IX.ITemplate({tpl: [
	'<div id="pathNav"></div>',
	'<div id="gridTools" class="grid-tools"></div>',
	'<div id="gridContainer"></div>',
	'<img id="refreshLoading" class="loading" src = "{imgUrl}">',
'']});

function showGrid(type,cbFn, rowId,isBase){
	var userType = SDV.Env.getUserType();
	var options = type === "service" ? {id : rowId} : {serviceAttrId : -1};
	var gridCfg = GridCfgs[type], textInfo = InfoTexts[type];
	var noBtns = type === "product" ? ["test"] : "";
	gridCfg.clz = userType ? gridCfg.clz  : gridCfg.clz  +" noactionGrid";
	gridCfg.tools.buttons = userType ? gridCfg.tools.buttons : noBtns;
	var grid = new SDV.Grid.NVGrid(IX.inherit(gridCfg, {
		container : "gridContainer",
		actions :userType ? [["edit", "编辑", function(rowModel){
			editFn(rowModel, type, grid, isBase);
		}], isBase ? ["delete", "删除", function(rowModel){
			deleteFn(type, {ids : [rowModel.getId()], names : rowModel.get("name")}, grid);
		}, "disable"]: ["delete", "删除", function(rowModel){
			deleteFn(type, {ids : [rowModel.getId()], names : rowModel.get("name")}, grid);
		}] ].concat(type === "product" ? [["distance", "远程登录", function(rowModel){
			distanceFn();
		},"disable"]] : []):type === "product"? [["distance", "远程登录", function(rowModel){
			distanceFn();
		}]]:[],
		dataLoader : function(params, cbFn){
			caller(textInfo.listCaller, IX.inherit(params,options), cbFn, function(){
				switchOut();
			});
		},
		clickOnRow : function(rowId, cellName, cellEl){
			if(type === "service") return;
			ixwPages.load(ixwPages.createPath("product-service", {id : rowId}));
		},
		onselect : function(){
			//SDV.GridTools.enableTools("gridTools",grid.getSelectedRows().length >0);
			var enableBtns =[];
			if(isBase) enableBtns = [];
			else enableBtns= getEnabledBtns(grid.getSelectedRows());
			SDV.GridTools.enableTools("gridTools",false, enableBtns);
		},
		ifactionsEnable : function(rowData){
			return {
				"distance" : rowData.allowLogin ? true : false
			};
		}
	}));
	SDV.Grid.currentGrid = {
		add : function(){
			var optInfo = InfoTexts[type];
			productDialog[optInfo.addDlg](function(data){
				if(type === "service"){ //服务
					hideDialog();
					grid.refreshGrid();
				}else{ //产品
					caller(optInfo.addCaller, data, function(){
						hideDialog();
						grid.refreshGrid();
					},function(){
						hideDialog();
					});
				}
			}, rowId);
		},
		"delete" : function(){
			var ids = [];
			var names = "";
			IX.map(grid.getSelectedRows(), function(rowModel){
				if(!rowModel.get("isBase")){
					ids.push(rowModel.getId());
					names = names +rowModel.get("name") + "、" ;
				}
			});
			if(names) names = names.substring(0, names.length-1);
			deleteFn(type, {ids : ids, names : names}, grid);
		},
		search : function(value){
			grid.search(value);
		},
		filter : function(_options){
//			var type = $XP(_options, "type", "status");
//			var value = $XP(_options, "key", "");
			options.serviceAttrId = $XP(_options, "key", "-1");
			grid.refreshGrid(0);
		}
	};
	if(type === "product"){
		caller("getAttributes4Filter", {}, function(filterData){
			SDV.GridTools.showTools("gridTools", gridCfg.tools, {"filterData":filterData}, "");
		});
	}
	SDV.GridTools.showTools("gridTools", gridCfg.tools,{});
	SDV.Env.onResize4Body();
	var refreshFn = IX.emptyFn();
	if(type === "service" && SDV.Global.autoRefresh)
		refreshFn = function(){
			updateGridInterval = setInterval(grid.refresh, 5000);
		};
	grid.show(refreshFn);
	cbFn();
}
function showProducts(type,cbFn, rowId){
	$X('body').innerHTML = t_page.renderData("",{imgUrl : SDV.Global.refreshIntervalUrl});
	if(type === "service"){
		caller("getProductName", {id : rowId}, function(data){
			SDV.PathNav.showPathNav("pathNav", ["products"], $XP(data, "name"));
			var isBase = $XP(data, "isBase");
			showGrid(type,cbFn, rowId,isBase);
		});
	}else{
		showGrid(type,cbFn);
	}
}


function switchOut(){
	if(!updateGridInterval) return;
	clearInterval(updateGridInterval);
	updateGridInterval=null;
}
IX.ns("SDV.Product");
SDV.Product.init = function(pageCfg, pageParams, cbFn){
	pageCfg.switchOut = switchOut;
	var pageName = pageCfg.name;
	var productId = $XP(pageParams, "id");
	switch(pageName){
	case "products":
		showProducts("product",cbFn);
		break;
	case "product-service":
		showProducts("service", cbFn, productId);
		break;
	}
};
})();
(function () {
var caller = SDV.Global.operationCaller;
var ixwPages = IXW.Pages;
var globalActionConfig = IXW.Actions.configActions;
var productDialog = SDV.productDialog;
var sdvDialog = SDV.Dialog;
var hideDialog = SDV.Dialog.hide;
var updateGridInterval = null;

var GridCfgs = {
	operation : {
		clz : "operationGrid",
		columns : ["_checkbox", "_no","servIp","allocatedCpu", "allocatedMem", "allocatedDisk", "serverStatus"],
		itemPageName : "operationList",
		tools : {
			type : "operation",
			buttons : ["refresh","startup", "shutdown", "delete"],
			search : true,
			filter :["status"]
		}
	},
	service : {
		clz : "operationServiceGrid",
		columns : ["_checkbox","_no","serviceName","product","version","ip","cpuUsage","memUsage","diskUsage","serviceStatus"],
		itemPageName : "operationServices",
		tools : {
			type : "service"
		}
	}
};
var InfoTexts = {
	operation : {
		name : "服务器",
		listCaller : "listServers",
		deleteCaller : "deleteServers"
	},
	service : {
		name : "服务",
		listCaller : "listServices4Server"
	}
};

function ifInArrayStatus(status,  arr){
	var isEnabled = false;
	IX.map(arr, function(item){
		if(status === item){
			isEnabled = true;
		}
	});
	return isEnabled;
}
function getEnabledBtns(selectedRows){
	var status = "", arrbtnStatus=[];
	var startup, shutdown, deleteServ;
	IX.map(selectedRows, function(rowModel){
		status = rowModel.get("status");
		if(!startup) startup = ifInArrayStatus(status, [1]);
		if(!shutdown) shutdown = ifInArrayStatus(status, [0]);
		if(!deleteServ) deleteServ = ifInArrayStatus(status, [4]);
	});
	if(startup) arrbtnStatus.push("startup");
	if(shutdown) arrbtnStatus.push("shutdown");
	if(deleteServ) arrbtnStatus.push("delete");
	return arrbtnStatus;
}
function getEnableActs(rowData){
	var startup, shutdown, deleteServ;
	var status = rowData.status;
	startup = ifInArrayStatus(status, [1]);
	shutdown = ifInArrayStatus(status, [0]);
	deleteServ = ifInArrayStatus(status, [4]);
	return {
		"startup" : startup,
		"shutdown" : shutdown,
		"delete" : deleteServ
	};
}
function startupFn(ids, grid){
	caller("startupServers", {ids : ids}, function(){
		grid.refresh();
	});
}
function shutdownFn(ids, grid){
	caller("shutdownServers", {ids : ids}, function(){
		grid.refresh();
	});
}
function deleteFn(type, info, grid){
	var optInfo = InfoTexts[type];
	sdvDialog.confirm("删除"+optInfo.name, "确认删除选中的"+optInfo.name+"吗？", function(){
		caller(optInfo.deleteCaller, {ids : info.ids}, function(){
			hideDialog();
			grid.refresh();
		}, hideDialog);
	});
}

var t_page = new IX.ITemplate({tpl: [
	'<div id="pathNav"></div>',
	'<div id="gridTools" class="grid-tools"></div>',
	'<div id="gridContainer"></div>',
	'<img id="refreshLoading" class="loading" src = "{imgUrl}">',
'']});
var t_subpage = new IX.ITemplate({tpl: [
	'<div id="pathNav"></div>',
	'<div class="optService">',
		'<div class="card-switch">',
			'<a class="" data-href="{infoHref}">服务器详情</a>',
			'<a class="active" data-href="{serviceHref}">服务情况</a>',
		'</div>',
	'</div>',
	'<div id="gridContainer"></div>',
	'<img id="refreshLoading" class="loading" src = "{imgUrl}">',
'']});


function showOperations(type,cbFn, rowId){
	var userType = SDV.Env.getUserType();
	if(type === "operation")
		$X('body').innerHTML = t_page.renderData("",{imgUrl : SDV.Global.refreshIntervalUrl});
	else{
		$X('body').innerHTML = t_subpage.renderData("",{
			infoHref : ixwPages.createPath("operation-info", {id : rowId}),
			serviceHref : ixwPages.createPath("operation-service", {id : rowId}),
			imgUrl : SDV.Global.refreshIntervalUrl
		});
		caller("getServerIp", {id : rowId}, function(ip){
			SDV.PathNav.showPathNav("pathNav", ["operations"], ip);
		});
	}

	var gridCfg = GridCfgs[type], textInfo = InfoTexts[type];
	gridCfg.clz = userType ? gridCfg.clz  : gridCfg.clz  +" noactionGrid";
	gridCfg.tools.buttons = userType ? gridCfg.tools.buttons : ["test"];
	var options = type === "operation" ? {status : "-1"} : {id : rowId};
	var grid = new SDV.Grid.NVGrid(IX.inherit(gridCfg, {
		container : "gridContainer",
		actions :userType && type==="operation" ? [["startup", "启动", function(rowModel){
			startupFn([rowModel.getId()], grid);
		}, "disable"],["shutdown", "关机", function(rowModel){
			shutdownFn([rowModel.getId()], grid);
		}, "disable"], ["delete", "删除", function(rowModel){
			deleteFn(type, {ids : [rowModel.getId()], names : rowModel.get("name")}, grid);
		}, "disable"]]:[],
		dataLoader : function(params, cbFn){
			caller(textInfo.listCaller, IX.inherit(params, options), cbFn, function(){
				switchOut();
			});
		},
		clickOnRow : function(rowId, cellName, cellEl){
			if(type === "service") return;
			ixwPages.load(ixwPages.createPath("operation-info", {id : rowId}));
		},
		onselect : function(){
			//SDV.GridTools.enableTools("gridTools",grid.getSelectedRows().length >0);
			var enableBtns = getEnabledBtns(grid.getSelectedRows());
			SDV.GridTools.enableTools("gridTools",false, enableBtns);
		},
		ifactionsEnable : function(rowData){
			return getEnableActs(rowData);
		}
	}));
	SDV.Grid.currentGrid = {
		refresh : function(){
			grid.refreshGrid();
		},
		startup : function(){
			var ids = [];
			IX.map(grid.getSelectedRows(), function(rowModel){
				var status = rowModel.get("status");
				if(status === 1){
					ids.push(rowModel.getId());
				}
			});
			startupFn(ids, grid);
		},
		shutdown : function(){
			var ids = [];
			IX.map(grid.getSelectedRows(), function(rowModel){
				var status = rowModel.get("status");
				if(status === 0){
					ids.push(rowModel.getId());
				}
			});
			shutdownFn(ids, grid);
		},
		"delete" : function(){
			var ids = [];
			var names = "";
			IX.map(grid.getSelectedRows(), function(rowModel){
				var status = rowModel.get("status");
				if(status === 4){
					ids.push(rowModel.getId());
					names = names +rowModel.get("name") + "、" ;
				}
			});
			if(names) names = names.substring(0, names.length-1);
			deleteFn(type, {ids : ids, names : names}, grid);
		},
		filter : function(_options){
			var type = $XP(_options, "type", "status");
			var value = $XP(_options, "key", "");
			options[type] = value;
			//options = _options;
			grid.refreshGrid(0);
		},
		search : function(value){
			grid.search(value);
		}

	};
	if(type === "operation")
		SDV.GridTools.showTools("gridTools", gridCfg.tools);
	SDV.Env.onResize4Body();
	grid.show(function(){
		if(SDV.Global.autoRefresh) updateGridInterval = setInterval(grid.refresh, 5000);
	});
	cbFn();
}

var t_serverInfo = new IX.ITemplate({tpl: [
	'<div id="pathNav"></div>',
	'<div class="card-switch">',
		'<a class="active" data-href="{infoHref}">服务器详情</a>',
		'<a class="" data-href="{serviceHref}">服务情况</a>',
	'</div>',
	'<div class="serviceInfo">',
		'<div class="infoContainer">',
			'<div class="title">{name}</div>',
			'<div class="hdr"><span class="no">序号</span><span class="text">名称</span><span class="value">详细信息</span></div>',
			'<div class="itemContainer"><div class="item">',
				'<div><span class="no">1</span><span class="text">CPU类型</span><span class="value">{cpuType}</span></div>',
				'<div><span class="no">2</span><span class="text">CPU主频</span><span class="value">{cpuClocked}</span></div>',
				'<div><span class="no">3</span><span class="text">CPU处理器</span><span class="value">{cpuProcessor}</span></div>',
				'<div><span class="no">4</span><span class="text">内存</span><span class="value">{mem}</span></div>',
				'<div><span class="no">5</span><span class="text">操作系统</span><span class="value">{os}</span></div>',
				'<div><span class="no">6</span><span class="text">带宽</span><span class="value">{bandwidth}</span></div>',
				'<div><span class="no">7</span><span class="text">添加时间</span><span class="value">{addTime}</span></div>',
			'</div></div>',
		'</div>',
	'</div>',
'']});

function formatMem(mem){
	if(mem > 1024)
		return Math.round(mem/1024*100)/100 + "GB";
	else return mem + "MB";
}
function formatBand(band){
	if(band > 1024){
		return Math.round(band/1024*100)/100 + "Gbps";
	}else
		return band + "Mbps";
}
function _showOperationInfo(serverId, type, cbFn){
	$X('body').innerHTML = new IX.ITemplate({tpl : ['<img id="refreshLoading" class="loading" src="{imgUrl}">']}).renderData("",{
		imgUrl : SDV.Global.refreshIntervalUrl
	});
	caller("getServerInfo", {id : serverId}, function(serverInfo){
		var cpuProcessor = $XP(serverInfo, "cpuProcessor", {});
		$X('body').innerHTML = t_serverInfo.renderData("", {
			infoHref : ixwPages.createPath("operation-info", {id : serverId}),
			serviceHref : ixwPages.createPath("operation-service", {id : serverId}),
			name : $XP(serverInfo, "ip", ""),
			cpuType : $XP(serverInfo, "cpuType", ""),
			cpuClocked : $XP(serverInfo, "cpuClocked", ""),
			cpuProcessor : $XP(cpuProcessor, "core", 0) + "核/" + $XP(cpuProcessor, "thread", 0) + "线程",
			mem : $XP(serverInfo, "mem", 0) + "GB",
			os : $XP(serverInfo, "os", ""),
			bandwidth : formatBand($XP(serverInfo, "bandwidth", "")),
			addTime : $XP(serverInfo, "addTime", "")
		});
		SDV.PathNav.showPathNav("pathNav", ["operations"], $XP(serverInfo, "ip", ""));
	});


}


function switchOut(){
	if(!updateGridInterval) return;
	clearInterval(updateGridInterval);
	updateGridInterval=null;
}
IX.ns("SDV.Operation");
SDV.Operation.init = function(pageCfg, pageParams, cbFn){
	pageCfg.switchOut = switchOut;
	var pageName = pageCfg.name;
	var serverId = $XP(pageParams, "id");
	switch(pageName){
	case "operations":
		showOperations("operation", cbFn);
		break;
	case "operation-list":
		showOperations("operation", cbFn);
		break;
	case "operation-info":
		_showOperationInfo(serverId, "info", cbFn);
		break;
	case "operation-service":
		showOperations("service", cbFn, serverId);
		break;
	}
};
})();
(function () {
	var caller = SDV.Global.logCaller;
	var userType;
	var formatDate = SDV.Util.formatDate;
	var sdvDialog = SDV.Dialog;

	var GridCfgs = {
		log: {
			clz: "logGrid",
			columns: ["_checkbox", "_no", "alarmDetail", "alarmStatus", "alarmDate"],
			itemPageName: "logs",
			tools: {
				type: "log",
				search: true,
				dpt: true,
				buttons: ["mark"],
				filter: ["status"]
			}
		},
		operation: {
			clz: "logGrid",
			columns: ["_no", "optDetail", "optDate"],
			itemPageName: "logOperation",
			tools: {
				type: "operation",
				search: true,
				dpt: true
			}
		}
	};
	var InfoTexts = {
		log: {
			listCaller: "getAltLogs"
		},
		operation: {
			listCaller: "getOptLogs"
		}
	};

var t_page = new IX.ITemplate({tpl: [
	'<div class="card-switch">',
		'<a class="{logClz}" data-href="logs">报警日志</a>',
		'<a class="{operationClz}" data-href="log/operation">操作日志</a>',
	'</div>',
	'<div id="gridTools" class="grid-tools"></div>',
	'<div id="gridContainer"></div>',
	'<img id="refreshLoading" class="loading" src="{imgUrl}">',
'']});

	function switchOut() {}

	function showLog(type, cbFn) {
		var isUndealAlarm;
		if(IX.isFn(cbFn)) isUndealAlarm = cbFn();
		var status = {};
		var userType = SDV.Env.getUserType();
		var gridCfg = GridCfgs[type],
			textInfo = InfoTexts[type];
		if(type === "log") {
			gridCfg.tools.buttons = userType ? gridCfg.tools.buttons : [];
			status = {
				"status": isUndealAlarm ? 0 : -1
			};
		}
		$X("body").innerHTML = t_page.renderData("", {
			logClz: type === "log" ? "active" : "",
			operationClz: type === "log" ? "" : "active",
			imgUrl: SDV.Global.refreshIntervalUrl
		});
		var toDate = new Date().getTime();
		var dtpDate = {
			from: (toDate - 90 * 24 * 60 * 60 * 1000),
			to: toDate
		};
		var dtpDateStr = {
			from: formatDate((toDate - 90 * 24 * 60 * 60 * 1000)),
			to: formatDate(toDate)
		};
		var options = IX.inherit(status, dtpDateStr);
		var grid = new SDV.Grid.NVGrid(IX.inherit(gridCfg, {
			container: "gridContainer",
			dataLoader: function(params, cbFn) {
				caller(textInfo.listCaller, IX.inherit(params, options), cbFn, function() {
					switchOut();
				});
			},
			onselect: function() {
				var arr = IX.loop(grid.getSelectedRows(), [], function(oldAccumulator, data) {
					if(data.get("status") === 0) oldAccumulator.push(data);
					return oldAccumulator;
				});
				SDV.GridTools.enableTools("gridTools", arr.length);
			}
		}));
		SDV.Grid.currentGrid = {
			mark: function() {
				var ids = IX.loop(grid.getSelectedRows(), [], function(acc, log, idx) {
					if(log.get("status") === 0)
						acc.push(log.getId());
					return acc;
				});
				if(ids.length) {
					sdvDialog.confirm("标记报警信息", "确认已处理这些报警了吗？", function(cbFn) {
						caller("handleAlarms", {
							ids: ids
						}, function() {
							grid.refreshGrid(0);
							sdvDialog.hide();
						}, function() {
							sdvDialog.hide();
						});
					});
				}
			},
			"dtp-filter": function() { //时间条
				IX.iterate(arguments, function(date) {
					var type = $XP(date, "type", "");
					var value = $XP(date, "key", "");
					options[type] = formatDate(value);
				});
				grid.refreshGrid(0);
			},
			filter: function(_options) { //状态筛选
				var type = $XP(_options, "type", "status");
				var value = $XP(_options, "key", "");
				options[type] = parseInt(value);
				grid.refreshGrid(0);
			},
			search: function(value) {
				grid.search(value);
			}
		};
		var defaultStatus = isUndealAlarm ? {
			value: "未处理",
			type : "status"
		} : "";
		SDV.GridTools.showTools("gridTools", gridCfg.tools, IX.inherit(dtpDate, {
			"defaultData": defaultStatus
		}));
		SDV.Env.onResize4Body();
		grid.show();
		cbFn();
	}
	IX.ns("SDV.Log");
	SDV.Log.init = function(pageCfg, pageParams, cbFn) {
		userType = SDV.Env.getUserType();
		pageCfg.switchOut = switchOut;
		var pageName = pageCfg.name;
		switch(pageName) {
			case "logs":
				showLog("log", cbFn);
				break;
			case "log-operation":
				showLog("operation", cbFn);
				break;
		}
	};
})();
(function () {
var isFoundInArray = IX.Array.isFound;
var ixwPages = IXW.Pages;
var ixwActions = IXW.Actions;
var overviewTransform = IX.CSSVendorName + 'transform:scale({deg});';
var caller = SDV.Global.logCaller;
var commonCaller = SDV.Global.commonCaller;
var sdvDialog = SDV.Dialog;
var checker = null;
var audioEl = null;
var count = 0;

var t_page = new IX.ITemplate({tpl: [
	'<div class="topnav">',
		'<div class="l logo">',
			'<span class="logoText">视云数据中心</span>',
		'</div>',
		'<nav>',
			'<ul class="top">','<tpl id="nav">','<li id="nav-{name}" class="{clz}">',
				'<a data-href="{navHref}">{text}</a>',
			'</li>','</tpl>','</ul>',
		'</nav>',
		'<div class="r">',
			'<span class="versionText">当前版本号:{version}</span>',
			'<a class="link" data-href="$alramLog"><span class="pic-alarm"></span><span class="num">0</span><audio id="audio" src="{src}"></audio></a>',
			'<a class="link open" data-href="$toggleVoice" data-key="open"><span class="pic-voice"></span></a>',
			'<a class="profile"><span class="pic-avatar"></span><span class="text">{username}</span></a>',
			'<a class="link" data-href="$logout"><span class="logout"></span></a>',
		'</div>',
	'</div>',
	'<div class="bg"><img src="{background}"></div>',
	'<div id="body"></div>',
'']});

var isLogout = false;
function SessionManager(data){
	var sessionData = data;
	var userName = $XP(data, "name", "");
	var userId = $XP(data, "id", null);
	var type = parseInt($XP(data, "type", 0));
	var enabledModules = $XP(data, "modules", []);

	return {
		hasAuth : function(){return userId !== null;},
		getUserName : function(){return userName;},
		getUserId : function(){return userId;},
		getUserType : function(){return type;},
		isLogout : function(){return isLogout;},
		checkIfModuleEnabled : function(module){ return isFoundInArray(module, enabledModules);}
	};
}
var sessionMgr = new SessionManager();

var NavItems = [
["overview", "系统概况"],
["services",  "服务管理"],
["products",   "产品管理"],
["operations",   "运维管理"],
["logs",   "系统日志"]
];
var DefaultNav = "overview";
function NavManager(focusedNavName){
	var focused = focusedNavName || DefaultNav;
	function _getNavItemTplData(name, item){
		return {
			name : name,
			text : item[1],
			clz : (focused == name ? "active": ""),
			navHref : ixwPages.createPath(name)
		};
	}
	function _focus(itemName){
		if (itemName !=="overview"){
			var lastChar = itemName.charAt(itemName.length-1);
			if (lastChar !== "s") itemName = itemName + "s";//作用是得到class为active的nav(详情页返回的itemName都是去掉s后的)
		}
		var el = $X('nav-' + itemName) ;
		if (itemName == focused || !el)
			return;
		$XH.removeClass($X("nav-" + focused), "active");
		focused = itemName;
		$XH.addClass(el, "active");
	}

	function enableHover(){
		jQuery("nav li").hover(function(){
			$XH.addClass(this, "hover");
		}, function(){
			$XH.removeClass(this, "hover");
		});
	}

	return {
		getRenderData : function(){ return IX.loop(NavItems, [], function loopNavItem(acc, item){
			var name = item[0];
			/*if (name == "home" || sessionMgr.checkIfModuleEnabled(name))*/
				acc.push(_getNavItemTplData(name, item));
			return acc;
		});},
		enableHover : enableHover,
		focus : _focus
	};
}
var navMgr = new NavManager();

function clearSession(){
	sessionMgr = new SessionManager();
	isLogout = true;
	IXW.Pages.load("entry");
}
function startSession(data){
	sessionMgr = new SessionManager(data);
	var alarmNum = 0;
	document.body.innerHTML = t_page.renderData("",{
		nav : navMgr.getRenderData(),
		src: SDV.Global.alertorUrl,
		version : $XP(data, "version", "1.0"),
		username : $XP(data, "name", ""),
		background : SDV.Global.backgroundUrl

	});
	navMgr.enableHover();
	function _checkerFn(cbFn){
		caller("getPrompt", {}, function(data){
			var alarmNum = $XP(data, "alarmNum", 0);
			var isWarn=$XP(data, "isWarn", 0);
			var numEl = jQuery(".topnav .num");
//			count = parseInt(alarmNum) + count;
			numEl.html(parseInt(alarmNum));
			audioEl = $X('audio');
			if (alarmNum && jQuery(".topnav .open").length > 0 && audioEl && isWarn) {
				audioEl.play();
				setTimeout(function(){audioEl.pause();}, 1000);
			}
			cbFn();
		}, function(){
			checker.stop();
		});
	}
	if (!checker)
		checker = new SDV.Util.PeriodicChecker(_checkerFn, 3000);
	if(SDV.Global.autoRefresh) checker.start();
}
function switchout(){
	//if(checker) checker.stop();
}
var PagesConfiurations = IX.map([
//{type?, name+, path?, bodyClz?, needAuth?},
{type: "ErrPage", name: "401", bodyClz: "exception", needAuth : false},
{type: "ErrPage", name: "404", bodyClz: "exception", needAuth : false},

{name: "overview", isDefault: true, bodyClz:"overview"},

{type: "Service", name: "services", bodyClz:"services"},
{name: "service-info", path: "service/{id}/info", bodyClz : "serviceInfo"},
{name: "service-backup", path: "service/backups", bodyClz : "serviceBackups"},

{type: "Product", name: "products", bodyClz:"products"},
{name: "product-service", path: "product/{id}/services",bodyClz:"productServices"},

{type: "Operation", name: "operations", bodyClz:"operationList"},//operation
{name: "operation-list", path: "operation/list", bodyClz:"operationList"},
{name: "operation-info", path: "operation/{id}/info", bodyClz:"operationInfo"},
{name: "operation-service", path: "operation/{id}/services", bodyClz:"operationServices"},

/*{name : "log-msg", path : "log/msg", bodyClz:"msg"},
{name : "log-operation", path : "log/operation", bodyClz:"operation"},*/
{type: "Log", name: "logs", bodyClz:"logs"}, //报警日志
{name: "log-operation", path:"log/operation", bodyClz:"logOperation"}, //操作日志

{name: "entry", bodyClz: "entry", needAuth : false}
], function(item){
	var name = item.name;
	var moduleName = name.split("-")[0];
	var className = item.type || moduleName.capitalize();
	return IX.inherit({
		initiator : "SDV." + className + ".init",
		path : name,

		nav : "service",
		navItem : moduleName,

		needAuth : true
	}, item);
});

ixwActions.configActions([["logout", function(){
	sdvDialog.confirm("退出", "确认是否退出？", function(){
		SDV.Global.entryCaller("logout", {}, function(){
			SDV.Entry.clearCookie();
			clearSession();
			switchout();
		});
	});
}], ["toggleVoice", function(params, el){
	if($XH.hasClass(el,"open")){
		$XH.removeClass(el,"open");
		$XH.addClass(el,"mute");
	}else if($XH.hasClass(el,"mute")){
		$XH.removeClass(el,"mute");
		$XH.addClass(el,"open");
	}
}], ["alramLog", function(){
	ixwPages.load(ixwPages.createPath("logs"), function(){
		return true;
	});
}]]);

function loadSession(pageFn){
	if(jQuery.cookie("autologon") !== "true")
		return ixwPages.load("entry");
	startSession({id :  jQuery.cookie("id"), name : jQuery.cookie("account"), type : jQuery.cookie("type"), version : jQuery.cookie("version")});
	pageFn();
	//startSession({id : 1, name : "admin", type : 1});
	//pageFn();
}
function onResize4Body(){
	var bodyHeight =document.documentElement.clientHeight;
	var height = 0;
	var bodyWidth = document.documentElement.clientWidth;
	var bodyPadding = 0, topnavH = 50;
	if($XH.first($X('body'), "p_overview")){
		var rate = 1;
		if (bodyWidth >1599){
			rate=1;
		}else if(bodyWidth<=1599 && bodyWidth>1366){
			rate = Math.floor((bodyWidth)/1559 *100)/100;
		}else{
			rate = 0.88;
		}
		var overviewEL = jQuery(".p_overview");
		if(overviewEL[0])
			overviewEL[0].style.cssText = overviewTransform.replaceByParams({deg: rate});
	}
	if($X('gridContainer')){
		var pgH = 58,  marginH = 60;
		var pathNavH = jQuery('#pathNav').height();
		var toolH = jQuery("#gridTools").height();
		var cardH = jQuery(".card-switch").height();
		cardH = cardH ? cardH+1 : cardH;
			height = bodyHeight -topnavH- toolH - pathNavH-cardH-marginH;
		jQuery("#gridContainer").height(height);
		if($XH.first($X('gridContainer'), "nv-grid")){
			jQuery("#gridContainer").height("auto");
			var grid = jQuery($XH.first($X('gridContainer'), "nv-grid"));//jQuery("#body .ixw-grid");
			var gridHeaderH = 40;
			if(jQuery("#itemList").height() < height-pgH-gridHeaderH){
				grid.height(height-2);//减去上下边框
				if(grid.hasClass("operationServiceGrid"))
					grid.height(height-2-10);
			}else{
				grid.height("auto");
			}
		}
	}
}
IX.ns("SDV.Env");
SDV.Env.init = function(){
	ixwPages.listenOnClick(document.body);
	ixwPages.configPages(PagesConfiurations, function(pageName, pageCfg){
		return !$XP(pageCfg, "needAuth", true) || sessionMgr.hasAuth();
	});

	IXW.Navs.register("service", function(cfg){
		navMgr.focus(cfg.navItem || "");
	});

	loadSession(function(){
		ixwPages.start();
	});
};
SDV.Env.isMe = function(userId){return userId === sessionMgr.getUserId();};
SDV.Env.isLogout = function(){return sessionMgr.isLogout();};
SDV.Env.getUserType = function(){return sessionMgr.getUserType();};
SDV.Env.reloadSession = function(){
	loadSession(function(){
		ixwPages.reload();
	});
};
SDV.Env.clearSession = clearSession;
SDV.Env.hasSession = function(){return sessionMgr.hasAuth();};
SDV.Env.resetSession = function(data){startSession(data);};
SDV.Env.clearAlarmNum = function(){
	count = 0;
	jQuery(".topnav .num").html(count);
};
SDV.Env.onResize4Body = onResize4Body;

var appInitialized = false;
SDV.init = function(){
	if (appInitialized)
		return;
	appInitialized = true;
	$Xw.bind({"resize" : onResize4Body});
	SDV.Env.init();
};
})();