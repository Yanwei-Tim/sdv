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