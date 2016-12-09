(function(){
/*var url=baseUrl +"/list.json";
var data=JSON.stringify(params);
$.ajax({
	type: "GET",
	url: url,
	data: "",
	dataType:"json",
	contentType: "application/json;charset=utf-8",
	beforeSend : function(XHR){
		XHR.setRequestHeader("if-Modified-Since", "0");
	},
	success: function(msg){
		if(msg.retCode==1){
			var type = params.sortInfo.substring(5);
			if(type!==""&& $XP(msg.data, "items",[])){
				$XP(msg.data, "items",[]).sort(function(a, b){
					return $XP($XP(b, type+"Usage", {}), "used", 0) - $XP($XP(a, type+"Usage", {}), "used", 0);
				});
			}
			cbFn(msg.data);
		}else{
			commonFailFn(msg, failFn);
		}
	},
	complete : function(XHR, TS){
		XHR = null;
	},
	error:function(msg){
		CCS.Dialog.alert("报错：连接服务器异常");
		if(IX.isFn(failFn)) failFn();
	}
});
return;*/
IX.ns("SDV.Global");

var baseUrl = SDV_BaseUrl + "/sim";
var imgUrl = SDV_BaseUrl + "/_dist/images";

IXW.ajaxEngine.init({
	ajaxFn : jQuery.ajax,
	baseUrl : baseUrl,
	imgUrl : imgUrl
});

IXW.urlEngine.mappingUrls([
["uploadKey", "/uploadKey.html"],
["backgroundImg", "/bg.png", "img"],
["layoutbgImg", "/layoutbg.png", "img"],
["titlebgImg", "/title-bg.png", "img"],
["ovbgImg", "/ov-bg.png", "img"],
["refreshImg", "/refreshLoading.gif", "img"],
["processStatusImg", "/refreshLoading.gif", "img"],
["loader", "/loader.gif", "img"]
]);
SDV.Global.baseUrl = baseUrl;
SDV.Global.uploadKeyUrl = IXW.urlEngine.genUrl("uploadKey");
SDV.Global.backgroundUrl = IXW.urlEngine.genUrl("backgroundImg");
SDV.Global.layoutbgUrl = IXW.urlEngine.genUrl("layoutbgImg");
SDV.Global.titlebgUrl = IXW.urlEngine.genUrl("titlebgImg");
SDV.Global.ovbgUrl = IXW.urlEngine.genUrl("ovbgImg");
SDV.Global.refreshIntervalUrl = IXW.urlEngine.genUrl("refreshImg");
SDV.Global.processStatusUrl = IXW.urlEngine.genUrl("processStatusImg");
SDV.Global.loader = IXW.urlEngine.genUrl("loader");
SDV.Global.productFileUploadUrl = baseUrl + "/productFile.html";
SDV.Global.serviceFileUploadUrl = baseUrl + "/productFile.html";
SDV.Global.alertorUrl = imgUrl + "/alert.mp3";
SDV.Global.autoRefresh = true;
function randomInt(maxV){return Math.floor(Math.random()*maxV);}
IXW.ajaxEngine.mappingUrls("common", [
["session", "/sessionData.json", "", "GET", "form"]
]);

SDV.Global.entryCaller = function(name, params, cbFn, failFn){
	var remotefile = null;
	switch(name){
	case "login"://params : {username, password}
		if (params.username == "admin" && params.password == "123456")
			remotefile = baseUrl + "/sessionData.json";
		else
			remotefile = baseUrl + "/failLogin.json";
		break;
	case "logout":
		//return cbFn();
		var url=baseUrl +"/logout.json";
		$.ajax({
			type: "GET",
			url: url,
			data:"",
			dataType:"json",
			contentType: "application/json;charset=utf-8",
			beforeSend : function(XHR){
				XHR.setRequestHeader("if-Modified-Since", "0");
			},
			success: function(msg){
				//if(msg.retCode==1){

					cbFn(msg.data);
				//}else{
					//commonFailFn(msg, failFn);
				//}
			},
			complete : function(XHR, TS){
				XHR = null;
			},
			error:function(msg){
				CCS.Dialog.alert("报错：连接服务器异常");
			}
		});

		return;
	}
	IX.Net.loadFile(remotefile, function(txt){
		var ret = JSON.parse(txt);
		if (ret.retCode != 1)
			IX.isFn(failFn)?failFn(ret) : alert(ret.err);
		else
			cbFn(ret.data);
	});
};

/*CCS.Global.commonCaller = IXW.ajaxEngine.createCaller("common",[
"common-session"
]);*/
SDV.Global.commonCaller = function(name, params, cbFn, failFn){
	switch(name){
		case "session"://params : {}
			return cbFn({
				"id" : 1,
				"name" : "管理员",
				"type" :0
			});
		case "getAuthInfo":
			return cbFn({
				isAuth : 1,
				authTime : "2016-06-26",
				authCore : 5,
				version : 1.0
			});
	}
};

function randomInt(maxV){return Math.floor(Math.random()*maxV);}
SDV.Global.overviewCaller = function(name, params, cbFn, failFn){
/*	xmlhttp = null;
	xmlhttp = create();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState ==4 && xmlhttp.status == 200){
			cbFn(JSON.parse(xmlhttp.responseText).data);
			xmlhttp = null;
		}
	}*/
	switch(name){
	case "getOverView":
// 		/*params : {}
// 		return : {
// 			serviceCountInfo : {total, active, stoped, errpr},
//			product : [
//				{proFlag(1,0), name, version, services[
//					{serviceFlag(-1:没有,1：开,0：关), name, count},
//					...
//				]},
//				...
//			]
// 		}
//		*/
		return setTimeout(function(){cbFn(Test.getOverView());},200);
	case "getSysData":
	/*params : {}
// 		return : {
		serverCountInfo : {total, active, stoped, error},
// 			cpu : [{total, allocated, uasge, time}, ...],
		//	mem : [{total, allocated, uasge, time}, ...],
		// 	storage : {total, allocated},
		// 	flow : {
		// 		down : [{value, time}, ......],
		// 		up : [{value, time}, ......]
		// 	}
// 		}
//		*/
		return cbFn(Test.getSysData());
	case "getPlaData":
// 		/*params : {}
// 		return : {
//			levels : [
//				{levelname, platforms:[
//					{name, products:[name,version,proFlag(1,0)]},
//					...
//				]},
//				...
//			]
// 		}
//		*/
		return setTimeout(function(){cbFn(Test.getPlaData());},200);
	}
};
//服务管理
SDV.Global.serviceCaller = function(name, params, cbFn, failFn){
	switch(name){
	case "listServices":
		/* 进入服务管理页面
// 		params :{
// 			pageNo, pageSize, key(搜索字符), product(-1:全部，),status(-1:全部，)
// 		}
// 		cbFn({
// 			total :,
// 			items :[{id,_no,name,product,version,ip, cpu: {total, used}, mem: {total,used}, disk : {total, used},flow : {up, down}, status},
// 					......]
// 		})
// 		*/
		return setTimeout(function(){cbFn(Test.listServices(params));},200);
		//return SDV.Dialog.alert("连接异常，请检查网络或者服务器是否正常！");
		//return SDV.Dialog.alertMulti({fail : 1, success : 3}, "错误\n山东人");
		// return SDV.Dialog.alert("" || "与服务器失去联系，请重新登录！", function(){
		// 		SDV.Entry.clearCookie();
		// 		SDV.Env.clearSession();
		// 	});
	case "getProducts4Filter":
// 		/* 获取用户页面筛选的产品
// 		params :{}
// 		cbFn([name1, .....])
// 		*/
	return setTimeout(function(){cbFn(Test.getProducts4Filter());}, 200);
	case "getInfo4OV":
// 		/* 获取可用的ip和主机
// 		params :{product, version, service}
// 		cbFn({
//                        ip : [ip1, ....],
//                        host : [{hostIp, cpu, mem, disk},,......],
//						  os : (0:linux,1:windows标准版,2:windows服务器版),
//                        occupyCpu , virtualCpu, mem , disk
//                    })
// 		*/
	return setTimeout(function(){cbFn(Test.getInfo4OV(params));},200);
	case "getInfo4AddServie":
// 		/* 获取新建服务的初始信息
//		params:{
//			serviceAttr(业务属性字符)//为""表述不限制业务属性
//		}
// 		cbFn ({
//		product : [{name, version : [name, service : [{name, rscConfig:{occupyCpu, virtualCpu, mem, disk}}]]}],
//			ip : [ip1, .....],
//			host : [{hostIp, cpu, mem, disk}, ......]
//	)}
// 		*/
	return setTimeout(function(){cbFn(Test.getInfo4AddServie(params));},200);
	case "getServiceInfo":
//	/** 获取服务信息详情页
//			params: {id: serviceId}
//			cbFn({name, ip, occupyCpu, virtualCpu,mem, disk, addTime})
//	*/
	return setTimeout(function(){cbFn(Test.getServiceInfo(params));},200);
	case "checkNeedOther":
	/* 新建服务选择服务时，检查是否需要其他产品服务
// 		params :{
// 			product,version,service(传""表示根据产品和版本检查此项)
// 		}
// 		cbFn({
//			isPrompt :1/0,//1:新建的服务需要其他产品服务，且没有安装，需要给出提示
//			names ； [],//需要提示的服务所属的产品名称
// 		})
// 		*/
		return cbFn({isPrompt : 1, names : ["视频云计算", "视频云存储"]});
	case "checkIsDeployed":
		/* 新建服务选择主机时，检查主机上是否部署有该服务
// 		params :{
// 			product, version, service, host
// 		}
// 		cbFn({
//			isDeployed :1/0  //是否部署
// 		})
// 		*/
	return cbFn({isDeployed : [0,1][randomInt(2)]});
	case "addService":
	/* 新建服务
//		params :{
// 			product,version,service : [
//				{name, ipsAndHosts : [{ip1,host1},...],rscConfig(0:默认/1：自定义),occupyCpu, virtualCpu,mem,disk},
//				......]
//		}
// 		cbFn()
// 		*/
	return cbFn({isPrompt4Host :1, host : "172.16.103.201"});
	//return cbFn(Test.getRetData4aaService());
	case "editService":
// 		/* 编辑服务
// 		params :{
//			id : serviceId,
// 			occupyCpu, virtualCpu,mem,disk //disk可以不支持
// 		}
 		return cbFn()
// 		*/
	case "poweronServices":
// 		/* 运行服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
	return cbFn();
	case "poweroffServices":
// 		/* 停止服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
	return cbFn();
	case "restartServices":
// 		/* 重启服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
	return cbFn();
	case "deleteServices":
// 		/* 删除服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
	return cbFn();
	case "backupService":
// 		/* 备份服务
// 		params :{
// 			serviceId,bkTime,bkCycle,bkComment
// 		}
// 		cbFn()
// 		*/
	return cbFn();
	case "getConsole":
// 		/* 远程服务
// 		params :{
// 			id : serviceId
// 		}
// 		cbFn(url)
// 		*/
	return cbFn("www.baidu.com");
	case "listBackups4Service":
		/* 进入备份页面
// 		/* 进入备份页面
		// BackupStatus
		// {
		// "备份中"0
		// "备份成功":1
		// "备份失败":2
		// }
// 		params :{
// 			pageNo, pageSize, backupWay(-1:全部,0全量/1增量), status(-1:全部),key, sortInfo[{name,ifDown},...](根据哪一项排序，backupTime, cycle, recoveryTime)
// 		}
// 		cbFn({
// 			total,
// 			items :[
//					{id,_no,bkService,bkIP,backupTime, cycle, recoveryTime,recoveryService, comment, status},
//					......]
// 		})
//		*/
		return setTimeout(function(){cbFn(Test.listBackups4Service(params));},200);
	 	case "deleteBackups4Service":
// 		 /*删除备份
// 		params :{
// 			ids : [backupId1,......]
// 		}
// 		cbFn()
//		*/
	return cbFn();
 	case "getRecoveryObj":
// 		 /*获取恢复目标列表
// 		params :{
// 			id : backupId
// 		}
// 		cbFn([{id, name, ip}, ...])
//		*/
		return cbFn(Test.getRecoveryObj(params));
	case "revoceryBackup4Service":
		return cbFn();
	}
};
//产品管理
SDV.Global.productCaller = function(name,params,cbFn,failFn){
	switch(name){
 	case "listProducts":
// 		/* 进入产品管理页面
// 		params :{
// 			pageNo, pageSize,key,serviceAttrId
// 		}
// 		cbFn({
// 			total,
// 			items :[
//					{id,
//	                  _no,name,version,serviceAttr,isBase,
//	                  allowLogin //是否支持一键登录
//	                },
//					......]
// 		})
//		*/
	return setTimeout(function(){cbFn(Test.listProducts(params));},200);
		case "addProduct":
// 		/* 新增产品
// 		params :{
// 			proname,version,serviceAttr
// 		}
// 		cbFn()
//		*/
	return cbFn();
		case "editProduct":
// 		/* 编辑产品
// 		params :{
// 			id:productId,proname,version,serviceAttr
// 		}
// 		cbFn()
//		*/
	return cbFn();
	case "getProductName":
// 		/* 获取产品名称
// 		params :{
// 			id:productId
// 		}
// 		cbFn(name)
//		*/
	return setTimeout(function(){cbFn(Test.getProductName(params));},200);
	case "listServices4Product":
// 		/* 点击产品进入服务页面
// 		params :{
// 			id:productId,
//			pageNo, pageSize
// 		}
// 		cbFn({
// 			total,
// 			items :[
//					{id,_no,name,occupyCpu,virtualCpu,occupyMem, occupyDisk},
//					......]
// 		})
//		*/
	return setTimeout(function(){cbFn(Test.listServices4Product(params));},200);
	case "getAttributes4Filter":
// 		/* 获取业务属性筛选项
// 		params :{}
// 		cbFn([{id,name}, .....])
// 		*/
	return setTimeout(function(){cbFn(Test.getAttributes4Filter());}, 200);

	}
};
//系统日志
SDV.Global.sysCaller = function(name,params,cbFn,failFn){
	switch(name){
	case "listLogs":
		/*
		params :{
			type : "alarm"/msg/operation,
			from : "timeInSec",
			to : "timeInSec",
			pageNo, pageSize, key
		}
		return : {
			total: ,
			items : [{id,_no,detail,date},......]
		}
		*/
		return setTimeout(function(){cbFn(Test.listLogs(params));},200);
	case "getPrompt" : 
		/**导航上报警提示
			return {
				alarmNum: 2
			}
		*/
		return setTimeout(function(){cbFn(Test.getPrompt(params));},200);
	}
};
//运维管理
SDV.Global.operationCaller = function(name, params, cbFn, failFn){
	switch (name) {
	case "listServers":
		/*	
			params: {pageNo, pageSize, key, status}
			cbFn({
				total :,
	 			items :[{id,_no,ip,cpu: {total, used}, mem: {total,used}, disk : {total, used}, status},
						......]
	 		})
		*/
		return setTimeout(function(){cbFn(Test.listServers(params));}, 200);
		break;
	case "startupServers":
		/*	启动服务器
			params: {ids : [id1, ...]}
			cbFn()
		*/
		/*return setTimeout(function(){cbFn(Test.startupServers(params));}, 200);
		break;*/
		return cbFn();
	case "shutdownServers":
		/*	关机服务器
			params: {ids : [id1, ...]}
			cbFn()
		*/
		/*return setTimeout(function(){cbFn(Test.shutdownServers(params));}, 200);
		break;*/
		return cbFn();
	case "deleteServers":
		/*	删除服务器
			params: {ids : [id1, ...]}
			cbFn()
		*/
		/*return setTimeout(function(){cbFn(Test.deleteServers(params));}, 200);
		break;*/
		return cbFn();
	case "getServerInfo":
		/*
			params: {id}
			cbFn({ip, cpuType, cpuClocked, cpuProcessor, mem, os, bandwidth, addTime});
		*/
		return setTimeout(function(){cbFn(Test.getServerInfo(params));}, 200);
		break;
	case "getServerIp":
	/*	
			params: {id}
			cbFn(ip);
		*/
		return setTimeout(function(){cbFn(Test.getServerIp(params));}, 200);
	case "listServices4Server":
		/*	
			params: {id : serverId, pageNo, pageSize, key}
			cbFn({
				total :,
	 			items :[{id,_no,name,product,version,ip, cpu: {total, used}, mem: {total,used}, disk : {total, used}, status},
 					......]
	 		})
		*/
		return setTimeout(function(){cbFn(Test.listServices4Server(params));}, 200);
		break;
	}
};
//系统日志
SDV.Global.logCaller = function(name, params, cbFn, failFn){
	switch(name){
	case "getAltLogs":
		/**
			params: {pageNo, pageSize, from, to, key, status}//from,to为毫秒数
			return : {
				total,
				items: [{
					_no,
					id,
					detail,
					date,
					status
				}...]
			}
		*/
	case "getOptLogs":
		/**
			params: {pageNo, pageSize, from, to, key}//from,to为毫秒数
			return : {
				total,
				items: [{
					_no,
					id,
					detail,
					date,
					status,
					type
				}...]
			}
		*/
		return setTimeout(function(){cbFn(Test.getLogs(params));}, 200);
		break;
	case "getPrompt" : 
		/**导航上报警提示
			return {
				alarmNum: 2,//未处理报警总数
				isWarn:true //是否有新增报警
			}
		*/
		return setTimeout(function(){cbFn(Test.getPrompt(params));},200);
	case "handleAlarms":
		/**标记为已处理
			params: {ids:[id1,...]}
		*/
		return setTimeout(function(){cbFn(Test.handleAlarms(params));}, 200);
		break;
	}
};
})();