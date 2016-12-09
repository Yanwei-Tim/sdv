(function(){
IX.ns("SDV.Global");

var urlEngine = IXW.urlEngine, ajaxEngine = IXW.ajaxEngine;
var ixwGenUrl = IXW.urlEngine.genUrl;
var ajaxMapping = ajaxEngine.mappingUrls;
var ixwCreateCaller = IXW.ajaxEngine.createCaller;

var baseUrl = SDV_BaseUrl;
var imgUrl = SDV_BaseUrl + "/images";

IXW.ajaxEngine.init({
	ajaxFn : jQuery.ajax,
	baseUrl : baseUrl,
	imgUrl : imgUrl
});

IXW.urlEngine.mappingUrls([
["rightbgImg", "/right-bg.jpg", "img"],
["refreshImg", "/refreshLoading.gif", "img"],
["processStatusImg", "/refreshLoading.gif", "img"]
]);
SDV.Global.baseUrl = baseUrl;
SDV.Global.rightbgUrl = IXW.urlEngine.genUrl("rightbgImg");
SDV.Global.refreshIntervalUrl = IXW.urlEngine.genUrl("refreshImg");
SDV.Global.processStatusUrl = IXW.urlEngine.genUrl("processStatusImg");
SDV.Global.uploadKeyUrl  = baseUrl + "/Services/uploadKey";

ajaxEngine.resetSetting({
	onfail : function(data, failFn){
		if(data==null){
			return SDV.Dialog.alert("连接异常，请检查网络或者服务器是否正常！");
		}else if(data.retCode==-1){
			SDV.Dialog.alert(data.err || "与服务器失去联系，请重新登录！", function(){
				SDV.Entry.clearCookie();
				SDV.Env.clearSession();
			});
			return;
		}else if(data.retCode==0 || data.retCode == -2){
			var fail = $XP(data, "fail",0), success = $XP(data, "success",0);
			if(IX.isFn(failFn)) failFn();
            if(fail || success)
				SDV.Dialog.alertMulti({fail : fail, success : success}, data.err)
			else
				SDV.Dialog.alert(data.err);
			return;
		}
		IX.isFn(failFn) && failFn(data);
		SDV.Dialog.alert(data.err);
	}
});

//将所有接口分别对应上,url需要后台填写处理该请求的地址。
ajaxMapping("sdv", [
	/**[name, 	url,	urlType:base,	type:GET,	dataType:"json"  ]*/
		["login", "", "base", "POST","json"],
		["logout", "", "base", "POST","json"],

		["listServices",		"/Services/listServices", "base", "POST","json"],
		["addService",		"", "base", "POST","json"]
	]);

var AllEntryCallerNames = [
	"login",
	"logout"
];
var AllServiceCallerNames = [
	"listServices","addService", "editService", "poweronServices","poweroffServices","restartServices",
	"deleteServices", "backupService", "getServiceName", "getServiceInfo", "listBackups4Service",
	"deleteBackups4Service", "revoceryBackup4Service"
];

SDV.Global.entryCaller = ixwCreateCaller("sdv",IX.map(AllEntryCallerNames, function(name){
	return "sdv-" + name;
}));

SDV.Global.ServiceCaller = ixwCreateCaller("sdv",IX.map(AllServiceCallerNames, function(name){
	return "sdv-" + name;
}));
/*
	所有接口后台返回json数据格式。
	{
		retCode : 1:请求成功 0：请求失败 -1：后台服务断开，没有响应,
		err : 错误信息,
		data : 这里面显示后面注释的每个接口需要返回的信息。
	}
*/
// 登录
// PCC.Global.entryCaller = function(name, params, cbFn, failFn){
// 	switch(name){
// 	case "login":
// 	/*登录
// 	params : {username, password}
// 	cbFn({id, name,type,version}) type = 1/0,1表示管理员，0表示普通用户

// 	case "logout":
//	退出
// 		//return cbFn();

// 		return;
// 	}
// };
//系统概况
// SDV.Global.overviewCaller = function(name, params, cbFn, failFn){
// 	switch(name){
// 		case "getOverView":

// 		/*params : {}
// 		return : {
// 			serviceCountInfo : {total, active, stoped, error},
//			product : [
// 			{
	// 			left : {proFlag(1,0), name, version,isBase(1,0), services : [
	// 				{servFlag(1,0,-1), name, count},
	//				...
	// 			], newVersion : [
	// 				{proFlag(1,0), name,version,isBase(1,0), services : [
	// 					{servFlag(1,0,-1), name, count},
	// 					...
	// 				]}, ...
	// 			]
	// 			},
	// 			right : {proFlag(1,0), name, version,isBase(1,0), services : [
	// 					{servFlag(1,0,-1), name, count},
	// 					...
	// 				], newVersion : []}
// 				},
//				...
//			]

// 		}
//		*/
//	case "getSysData":
	/*params : {}
// 		return : {
			serverCountInfo : {total, active, stoped, error},
// 			cpu : [{total(整型), allocated(整型), uasge(0-100), time(hh:mm:ss)}, ...],//显示1分钟，60个点
		//	mem : [{total, allocated, uasge, time}, ...],
		// 	storage : {total, allocated},
		// 	flow : {B/s
		// 		[{up, down, time}, ......]
		// 	}
// 		}
//		*/
// 	}

//	case "getPlaData":
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
//服务管理
// SDV.Global.serviceCaller = function(name, params, cbFn, failFn){
// 	switch(name){
// 	case "listServices":
// 		/* 进入服务管理页面
//    os :  是为了编辑服务，根据os类型设置不同的数字限制。
//   isNeedAuth : 是为了判断上传key和下载key是否可用
//ServiceStatus
	// {
	// "初始化":0
	// "开启中":1
	// "运行":2
	// "停止中":3
	// "已停止":4
	// "故障":5
	// "备份中":6
	// "恢复中":7

	// }
// 		params :{
// 			pageNo, pageSize, key(搜索字符), product(-1:全部，),status(-1:全部，)
// 		}
// 		cbFn({
// 			total :,
// 			items :[{id,_no,name,product,version,ip, cpu: {total, used}, mem: {total,used}, disk : {total, used},flow : {up, down}, status,
//					os(0:linux,1:windows标准版,2:windows服务器版), isNeedAuth(1/0)},
// 					......]
// 		})
// 		*/
// 		return setTimeout(function(){cbFn(Test.listStorageNodes(params));},200);
//	case "getProducts4Filter":
// 		/* 获取用户页面筛选的产品
// 		params :{}
// 		cbFn([{id, name}, .....])
// 		*/
//	case "getAvailIPsAndHosts":
// 		/* 获取可用的ip和主机
// 		params :{}
// 		cbFn([ip1, .....])
// 		*/
//	case "getInfo4OV": //用于在系统概况页添加服务时，获取所需的信息
// 		/* 获取可用的ip和主机
// 		params :{product, version, service}
// 		cbFn({
//                        ip : [ip1, ....],
//                        host : [{hostIp, cpu, mem, disk},,......],
//						  os : (0:linux,1:windows标准版,2:windows服务器版),
//                        occupyCpu , virtualCpu, mem , disk
//                    })
// 		*/
//	case "getInfo4AddServie":
// 		/* 获取新建服务的初始信息
//		params:{
//			serviceAttr(业务属性字符)//为""表述不限制业务属性
//		}
// 		cbFn ({
//		product : [{name, version : [name, service : [{name, os(0:linux,1:windows标准版,2:windows服务器版), rscConfig:{occupyCpu, virtualCpu, mem, disk}}]]}],
//			ip : [ip1, .....],
//			host : [{hostIp, cpu, mem, disk}, ......]
//	)}
// 		*/
//	case "checkNeedOther":
	/* 新建服务选择服务时，检查是否需要其他产品服务
// 		params :{
// 			product,version,service(传""表示根据产品和版本检查此项)
// 		}
// 		cbFn({
//			isPrompt :1/0,//1:新建的服务需要其他产品服务，且没有安装，需要给出提示
//			names ； [],//需要提示的服务所属的产品名称
// 		})
// 		*/
//	case "checkIsDeployed":
		/* 新建服务选择主机时，检查主机上是否部署有该服务
// 		params :{
// 			product, version, service, host
// 		}
// 		cbFn({
//			isDeployed :1/0  //是否部署
// 		})
// 		*/
//	case "addService":
	/* 新建服务
//		params :{
// 			product,version,service : [
//				{name, ipsAndHosts : [{ip1,host1},...],rscConfig(0:默认/1：自定义),occupyCpu, virtualCpu,mem,disk},
//				......]
//		}
// 		cbFn()
// 		*/
//	case "editService":
// 		/* 编辑服务
// 		params :{
//			id : serviceId,
// 			occupyCpu, virtualCpu,mem,disk //disk可以不支持
// 		}
// 		cbFn()
// 		*/
//	case "poweronServices":
// 		/* 运行服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
//	case "poweroffServices":
// 		/* 停止服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
//	case "restartServices":
// 		/* 重启服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
//	case "deleteServices":
// 		/* 删除服务
// 		params :{
// 			ids : [serviceId1, ......]
// 		}
// 		cbFn()
// 		*/
//	case "backupService":
// 		/* 备份服务
// 		params :{
// 			serviceId,bkTime,bkCycle,bkComment
// 		}
// 		cbFn()
// 		*/
//	case "distanceService":
// 		/* 远程服务
// 		params :{
// 			id : serviceId
// 		}
// 		cbFn(url)
// 		*/
//	case "getServiceName":
//	/** 获取服务名称
//			params: {id: serviceId}
//			cbFn(name)
//	*/
//	case "getServiceInfo":
//	/** 获取服务信息详情页
//			params: {id: serviceId}
//			cbFn({name, ip, occupyCpu, virtualCpu,mem, disk, addTime})
//	*/
// 	case "listBackups4Service":
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
//					{id,_no,bkService,bkIP,backupTime, cycle, recoveryTime,recoveryService{id(-1:本机),name,ip},  comment, status},
//					......]
// 		})
//		*/
// 	case "deleteBackups4Service":
// 		 /*删除备份
// 		params :{
// 			ids : [backupId1,......]
// 		}
// 		cbFn()
//		*/
// 	case "getRecoveryObj":
// 		 /*获取恢复目标列表
// 		params :{
// 			id : backupId
// 		}
// 		cbFn([{id, name, ip}, ...])
//		*/
// 	case "revoceryBackup4Service":
// 		 /*恢复服务
// 		params :{
// 			id : backupId,
//			recoveryId
// 		}
// 		cbFn()
//		*/
// 	}
// };

//产品管理
// SDV.Global.productCaller = function(name, params, cbFn, failFn){
// 	switch(name){
// 	case "listProducts":
// 		/* 进入产品管理页面
// 		params :{
// 			pageNo, pageSize,key,  serviceAttrId //业务属性id
// 		}
// 		cbFn({
// 			total,
// 			items :[
//					{id,_no,name,version,serviceAttr,isBase,allowLogin},
//					......]
// 		})
//		*/
//	case "addProduct":
// 		/* 新增产品
// 		params :{
// 			name,version,serviceAttr
// 		}
// 		cbFn()
//		*/
//	case "editProduct":
// 		/* 编辑产品
// 		params :{
// 			id:productId,
//			name, version,serviceAttr
// 		}
// 		cbFn()
//		*/
//	case "deleteProducts":
// 		/* 删除产品
// 		params :{
// 			ids:[productId1, ......]
// 		}
// 		cbFn()
//		*/
//	case "getProductName":
// 		/* 获取产品名称和是否是预置产品
// 		params :{
// 			id:productId
// 		}
// 		cbFn({name,isBase})
//		*/
//	case "listServices4Product":
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
//	case "getAttributes4Filter":
// 		/* 获取业务属性筛选项
// 		params :{}
// 		cbFn([{id,name}, .....])
// 		*/
//		*/
//	case "editService4Product":
// 		/* 编辑服务
// 		params :{
// 			id:productId,
//			name : name,
//			occupyCpu : ,
//			virtualCpu : ,
//			occupyMem : ,
//			occupyDisk : 
// 		}
// 		cbFn()
//		*/
//	case "deleteServices4Product":
// 		/* 删除某个产品下的服务
// 		params :{
// 			id:productId,
//			ids :[serviceId1, ......]
// 		}
// 		cbFn()
//		*/
//	}
//};
//运维管理
// SDV.Global.operationCaller = function(name, params, cbFn, failFn){
// 	switch (name) {
// 	case "listServers":
// 		/*	服务器列表页面
// 			params: {pageNo, pageSize, key}
// 			cbFn({
// 				total :,
// 	 			items :[{id,_no,ip,cpu: {total, used}, mem: {total,used}, disk : {total, used}, status},
// 						......]
// 	 		})
// 		*/
//	case "startupServers":
// 		/*	启动服务器
// 			params: {ids : [id1, ...]}
// 			cbFn()
// 		*/
//	case "shutdownServers":
// 		/*	关机服务器
// 			params: {ids : [id1, ...]}
// 			cbFn()
// 		*/
//	case "deleteServers":
// 		/*	删除服务器
// 			params: {ids : [id1, ...]}
// 			cbFn()
// 		*/
// 	case "getServerInfo":
// 		/*服务器详情页面
// 			params: {id}
// 			cbFn({ip, cpuType, cpuClocked, cpuProcessor(core,thread), mem, os, bandwidth, addTime});
// 		*/

// 	case "getServerIp":
// 	/*	
// 			params: {id}
// 			cbFn(ip);
// 		*/

// 	case "listServices4Server":
// 		/*	
// 			params: {id : serverId, pageNo, pageSize}
// 			cbFn({
// 				total :,
// 	 			items :[{id,_no,name,product,version,ip, cpu: {total, used}, mem: {total,used}, disk : {total, used}, status},
//  					......]
// 	 		})
// 		*/

// 	}
// };
//系统日志
// SDV.Global.logCaller = function(name, params, cbFn, failFn){
// 	switch(name){
// case "getAltLogs":
		/**报警日志
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
//		case "getOptLogs":
//		/**操作日志
//			params: {pageNo, pageSize, from, to, key}//from,to为毫秒数
//			return : {
//				total,
//				items: [{
//					_no,
//					id,
//					detail,
//					date,
//					status,
//					type
//				}...]
//			}
//		*/
//		case "getPrompt" : 
//		/**导航上报警提示
//			return {
//				alarmNum: 2,//未处理报警总数
//				isWarn:true //是否有新增报警
//			}
//		*/
//		case "handleAlarms":
//		/**标记为已处理
//			params: {ids:[id1,...]}
//		*/
// 	}
// };
})();