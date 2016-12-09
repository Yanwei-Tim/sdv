(function(){
IX.ns("Test");
function convertTickToDate(tick){return new Date(tick*1000);}
var formatDate = function(tick, withTime){
	if (!tick)
		return "";
	return IX.Date.format(convertTickToDate(tick), withTime?"":"Date");
};
function getPagedData(arr, pageNo, pageSize){
	return {
		total : arr.length,
		items : IX.partLoop(arr, pageNo* pageSize, pageNo*pageSize + pageSize, [], function(acc, item){
			// item.status =randomInt(2);
			acc.push(item); return acc;
		})
	};
}
function randomInt(maxV){return Math.floor(Math.random()*maxV);}
function random(min,max){
	return Math.floor(min + Math.random()*(max-min));
}
var startTime = 1422000000000;

var services = [];
var backups=[];
var products = [];
var index;

var SMT = {
	name : "社会化运营",
	version : "V2.0",
	services : ["中心服务","转码服务","地图服务","GPS接入服务"],
	cpu : {total :4, used : 3},
	mem : {total : 4, used : 1},
	disk : {total : 100, used : 42}
};
var SER = {
	name : "执法记录仪",
	version : "V2.0",
	services : ["视频接入服务","管理服务"],
	cpu : {total :4, used : 2},
	mem : {total : 4, used : 1},
	disk : {total : 100, used : 23}
};
var IMS = {
	name : "综合运维管理系统",
	version : "V3.0",
	services : ["集群运维管理服务","Oracle服务","监测探针服务","视频诊断服务"],
	cpu : {total :4, used : 1},
	mem : {total : 4, used : 1.4},
	disk : {total : 200, used : 47}

};
var ICP = {
	name : "视频侦查云平台",
	version : "V2.0.2",
	services : ["WEB及视频服务","PFS服务"],
	cpu : {total :4, used : 2},
	mem : {total : 4, used : 1.5},
	disk : {total : 200, used : 68}
};
var PCC = {
	name : "视频云计算",
	version : "V1.0",
	services : ["云计算节点服务PCC_Node","云计算管理服务PCC_Center"],
	cpu : {total :8, used : 6},
	mem : {total : 8, used : 2.6},
	disk : {total : 100, used : 27}
};
var PFS = {
	name : "视频云存储",
	version : "V3.4",
	services : ["视频云存储服务PFS"],
	cpu : {total :4, used : 1},
	mem : {total : 4, used : 2.1},
	disk : {total : 1000, used : 580}
};
var PVG = {
	name : "视云联网平台",
	version : "V6.7.1 72483",
	services : ["中心管理服务CMS", "媒体转发服务FS"],
	cpu : {total :4, used : 1.5},
	mem : {total : 4, used : 2},
	disk : {total : 40, used : 17}
};
var SIS = {
	name : "物理安防信息管理系统",
	version : "V5.4.6",
	services : ["后台服务", "地图服务"],
	cpu : {total :8, used : 1},
	mem : {total : 8, used : 2.8},
	disk : {total : 100, used : 33}
};
var productInfo = IX.IListManager();
var productBrief = ["SMT","SER","IMS","ICP","PCC","PFS","PVG","SIS"];
productInfo.register("SMT", SMT);
productInfo.register("SER", SER);
productInfo.register("IMS", IMS);
productInfo.register("ICP", ICP);
productInfo.register("PCC", PCC);
productInfo.register("PFS", PFS);
productInfo.register("PVG", PVG);
productInfo.register("SIS", SIS);
var servicesInPro = [{name :"PCC", index :0},{name :"IMS", index :0}, {name :"SIS", index :0}, {name :"SMT", index :0}, 
{name :"PVG", index :0}, {name :"PCC", index :1}, {name :"IMS", index:1}, {name :"ICP", index :0},{name :"PFS", index :0}, 
{name :"SMT", index :1},{name :"IMS", index :2}, {name :"SER", index :0}, {name :"SMT", index :2},{name :"ICP", index :1}, 
{name :"IMS", index :3}, {name :"SIS", index :1}, {name :"PVG", index:1}, {name :"SER", index:1}, {name :"SMT", index :3}];
var ip4Service = [101,105,106,117,121,176,180, 189, 112, 137, 168, 170, 154, 178,185, 143, 129, 135, 191];
//运维管理servers
var servers = [];
var cpuUsed= [23, 20, 25, 26, 27, 21, 25, 22];
var diskTotal = [500, 36000,36000,36000,36000,36000,500,36000];
for(var i=0;i<8;i++){
	var no = i<9 ? "0" +(i+1):(i+1);
	var ipno = i<5 ? "0" +(2*i+1):(2*i+1);
	servers.push({
		id : "172.16.103.2" + ipno,
		_no : no,
		ip : "172.16.103.2" + ipno,
		cpu : {total : 32, usable : 25, used : cpuUsed[i], percent : Math.floor(25/32)},
		mem : {total: 64, used: random(43, 53)},
		disk : {total: diskTotal[i], used: Math.floor(Math.random()*diskTotal[i])},
		status : [0,1,2,3,4][randomInt(5)]//0

	});
}
//services
for (i=0; i<19; i++){
	var status = Math.floor(Math.random()*100) % 2;
	var tmpP = productInfo.get(servicesInPro[i].name);
	services.push({
		id :  "172.16.103." + ip4Service[i],
		_no : i<9 ? "0" +(i+1):(i+1),
		name : tmpP.services[servicesInPro[i].index],
		product : tmpP.name,
		version : tmpP.version,
		ip : "172.16.103." + ip4Service[i],
		host : servers[randomInt(8)].ip,
		os : [0,1,2][randomInt(3)],
		cpu : {total : tmpP.cpu.total, usable : 80, used :tmpP.cpu.used, percent : Math.floor(25/32)},
		mem : {total: tmpP.mem.total, used: tmpP.mem.used/*Math.floor(Math.random()*64*1024)*/},
		disk : {total:tmpP.disk.total, used: tmpP.disk.used},
		flow : {up : randomInt(2000), down : randomInt(2000)},
		status : [0,1,2,3,4,5,6,7,8][randomInt(9)],//2,
		driver : [0,1][randomInt(2)],
		isNeedAuth : [0,1][randomInt(2)],
		occupyCpu : 4,
		virtualCpu :4,
		occupyMem : 4,
		occupyDisk :4
	});
}
//backups
for(i=0;i<10;i++){
	var _servicesTmp = services[randomInt(15)];
	backups.push({
		id : "backup-" + i,
		_no : i<9 ? "0" +(i+1):(i+1),
		bkService : _servicesTmp.name,
		bkIP : _servicesTmp.ip,
		backupTime : "2016-07-27 09:34:36",
		cycle : randomInt(6),
		recoveryTime : "2016-05-21 14:34:26",
		recoveryService: {id : 1, name : "", ip : ""},
		backupWay :[0,1][randomInt(1)],
		comment : "",
		status :1
	});
}

Test.listServices = function(params){
	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 35;
	var _services = IX.loop(services, [], function(acc, item){
			acc.push(item);
		return acc;
	});
	return getPagedData(_services, pageNo, pageSize);
};
Test.getProducts4Filter = function(){
	var products4Filter = [];
	for(i=0;i<8;i++){
		products4Filter.push(productInfo.get(productBrief[i]).name);
	}
	return products4Filter;
	/*return [
	{id : "pvg", name : "pvg"},
	{id : "pva", name : "pva"},
	{id : "pcc", name : "pcc"},
	{id : "nvs", name : "nvs"}
	];*/
};
var ips = [];
var tmp;
for (i=0;i<99;i++){
	tmp = i < 9 ? "0"+(i+1) : (i+1);
	ips.push("172.16.103.1"+tmp);
}
ips.push("172.16.103.200");
for(i=0;i<ip4Service.length;i++){
	index = ips.indexOf("172.16.103."+ip4Service[i]);
	ips.splice(index, 1);
}
Test.getInfo4AddServie = function(){
	var tmpProduct = [];
	for(var i=0;i<8;i++){
		var _product= productInfo.get(productBrief[i]);
		var _services = [];
		for(var j=0;j<_product.services.length; j++){
			_services.push({
				name : _product.services[j],
				os : [0,1,2][randomInt(3)],
				 rscConfig : {occupyCpu : 4, virtualCpu : 4, mem : 4, disk : 100}
			});
		}
		tmpProduct.push({
			name : _product.name,
			version : [{
				name : _product.version,
				service : _services
			}]
		});
	}
	var tmpHosts = [];
	for(var k=0; k<8;k++){
		var ipno = k<5 ? "0" +(2*k+1):(2*k+1);
		tmpHosts.push({hostIp : "172.16.103.2" + ipno, cpu : random(1,100), mem : random(1,100), disk : random(80, 1000)});
	}
	return {
		/*product : [
			{name : "PVG", version : [
				{name : "v1.2.3", service : [
					{name : "CMS",driver :1, rscConfig : {occupyCpu : 4, virtualCpu : 4, mem : 100, disk : 100}}
				]}
			]},
			{name : "PVA", version : [
				{name : "v2.2.3", service : [
					{name : "FS", driver :0, rscConfig : {occupyCpu : 4, virtualCpu : 4, mem : 100, disk : 200}},
					{name : "SS", driver :1, rscConfig : {occupyCpu : 4, virtualCpu : 4, mem : 400, disk : 200}}
				]},
				{name : "v2.2.8", service : [
					{name : "pc", driver :0, rscConfig : {occupyCpu : 4, virtualCpu : 4, mem : 100, disk : 200}}
				]}
			]}
		],*/
		product : tmpProduct,
		ip : ips,
		host : tmpHosts/*[
		{hostIp:"192.168.0.2", driver :1}, {hostIp:"192.168.10.201", driver :0},
		 {hostIp:"192.168.13.134", driver :0},{hostIp:"192.168.10.208", driver :1}
		 ]*/
	};
};
Test.getInfo4OV = function(){
		var tmpHosts = [];
	for(var k=0; k<8;k++){
		var ipno = k<5 ? "0" +(2*k+1):(2*k+1);
		tmpHosts.push({hostIp : "172.16.103.2" + ipno, cpu : random(1,100), mem : random(1,100), disk : random(80, 1000)});
	}
	return {
		ip : ips,
		host : tmpHosts,
		os : [0,1,2][randomInt(3)],
		occupyCpu : 4, virtualCpu : 4, mem : 4, disk : 100
	};
};
Test.getRetData4aaService = function(){
	var tmpHosts = [];
	for(var k=0; k<8;k++){
		var ipno = k<5 ? "0" +(2*k+1):(2*k+1);
		tmpHosts.push("172.16.103.2" + ipno);
	}
	return {
		isPrompt4Service :1,//1:新建的服务需要其他产品服务，且没有安装，需要给出提示
		products : [{name : "视频云计算", version : [{name : "v1.2", service : [
			{name : "云计算管理服务PCC_Center", rscConfig:{occupyCpu :4, virtualCpu :4, mem :4, disk :100}},
			{name : "云计算管理服务PCC_Node", rscConfig:{occupyCpu :4, virtualCpu :4, mem :4, disk :100}}]
			}, {name : "v1.3", service : [
			{name : "云计算管理服务PCC_Center", rscConfig:{occupyCpu :4, virtualCpu :4, mem :4, disk :100}},
			{name : "云计算管理服务PCC_Node", rscConfig:{occupyCpu :4, virtualCpu :4, mem :4, disk :100}}]}]
		}, {
			name : "视频云存储", version : [{name : "v2.2", service : [
			{name : "视频云存储服务PFS", rscConfig:{occupyCpu :4, virtualCpu :4, mem :4, disk :100}}]
			}, {name : "v2.3", service : [
			{name : "视频云存储服务PFS", rscConfig:{occupyCpu :4, virtualCpu :4, mem :4, disk :100}}]
		}]}],
		ips : ips,
		hosts : tmpHosts,
		isPrompt4Host : 0,
		host : "172.16.103.201" //已将创建该服务的主机
	};
};
Test.listBackups4Service = function(params){
	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 35;
	var _backups = IX.loop(backups , [], function(acc, item){
			acc.push(item);
		return acc;
	});
	return getPagedData(_backups, pageNo, pageSize);
};
Test.getRecoveryObj = function(params){
	return [
		{id : 5, ip : "172.16.103.105", name : "后台服务"},
		{id : 1, ip : "172.16.103.127", name : "转码服务"},
		{id : 2, ip : "172.16.103.156", name : "云计算节点服务PCC_Node"}
	];
};
Test.getServiceInfo = function(params){
	//var id = params.id.split("-")[1];
	var id=params.id.split(".")[3];
	index = ip4Service.indexOf(Number(id));
	return {
		name : services[index].name,
		occupyCpu : services[index].cpu.used,
		virtualCpu : "4",
		ip : services[index].host,
		mem : services[index].mem.used,
		disk : services[index].disk.used,
		addTime : "2016-06-06 16:23:30"
	};
};
//products
var productNames = [{name :"社会化运营", version:"v1.3.4"},{name:"执法记录仪", version:"v5.4.6"},
{name :"综合运维管理系统", version:"v3.0"},{name :"视频侦查云平台", version:"v5.4.6"},
{name :"视频云计算", version:"v3.0"},{name :"pfs", version : "v6.7.1 72483"},{name : "pvg", version :"v3.4"},
{name :"物理安防信息管理系统", version:"v5.4.6"}];
var serviceAttribute=[{id:0,name:"视频联网平台"},{id:1,name:"云计算平台"},{id:2,name:"云存储平台"},
{id:3,name:"视频综合应用平台"},{id:4,name:"运维平台"},{id:5,name:"视频侦查平台"},{id:6,name:"其它"}];

for(i=0;i<8;i++){
	products.push({
		id : productBrief[i],
		_no : i<9 ? "0" +(i+1):(i+1),
		name : productInfo.get(productBrief[i]).name,
		version :  productInfo.get(productBrief[i]).version,
		serviceAttr : ["视频联网平台", "视频综合应用平台", "云存储平台"][Math.round(Math.random()*2)],
		isBase : true,//i<8 ? true : false
		allowLogin : true
	});
}
Test.listProducts = function(params){
	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 35;
	var _products = IX.loop(products, [], function(acc, item){
			acc.push(item);
		return acc;
	});
	return getPagedData(_products, pageNo, pageSize);
};
Test.getProductName = function(params){
	var id = params.id;
	return 	{
		name : productInfo.get(id).name,
		isBase : true
	};
};
Test.listLogs = function(params){
	var type = params.type,
		from = params.from || null,
		to = params.to || null;

	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 35;
	var _log = IX.loop(log, [], function(acc, item){
		if ((item.type == type) &&(!from || item.date >= from) && (!to  || item.date <= to)) 
			acc.push(item);
		return acc;
	});
	return getPagedData(_log, pageNo, pageSize);
};
Test.listServices4Product = function(params){
	var id=params.id;
	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 35;
	var _services = IX.loop(services, [], function(acc, item){
			if(item.product === productInfo.get(id).name)
			acc.push(item);
		return acc;
	});
	return getPagedData(_services, pageNo, pageSize);
};
Test.getAttributes4Filter = function(){
	return serviceAttribute;
	/*return [
	{id : , name : "pvg"},
	{id : , name : "pva"},
	{id : , name : "pcc"},
	{id : , name : "nvs"}
	];*/
};


Test.listServers = function(params){
	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 35;
	var _servers = IX.loop(servers, [], function(acc, item){
			acc.push(item);
		return acc;
	});
	return getPagedData(_servers, pageNo, pageSize);
};
Test.getServerInfo = function(params){
	return {
		ip : params.id, cpuType : "E5 2670 v3", cpuClocked : "2.4GHZ", cpuProcessor : {core : 32, thread : 64},
		mem : "64", os : "Red Hat 7.2", bandwidth : "1000", addTime : "2016-10-14 12:23:34"
	};
};
Test.getServerIp = function(params){
	return params.id;
};
Test.listServices4Server = function(params){
	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 35;
	var _services = IX.loop(services, [], function(acc, item){
			if(item.host === params.id)
			acc.push(item);
		return acc;
	});
	return getPagedData(_services, pageNo, pageSize);
};

/**------  overview -----*/
var allCpu = 400;
var allMem = 500;
var allNode = 100;
var arr = [];
for (i=59; i>=0;i--){
	arr.push(i);
}
function random4Use(num, now){
	return IX.map(arr, function(item, idx){
		var random = Math.round(Math.random() * 100);
		var mean = Math.round(num / 5);
		return {
			total : allNode,
			allocated : allNode - random,
			time : new Date(now - 1000 * item).getTime()
		};
	});
}
function random4Two(type, key1, key2, now){
	return IX.map(arr, function(item, idx){
		var obj = {};
		if (type == "flow") {
			obj[key1] = (Math.random() * 10000).toFixed(2); 
			obj[key2] = (Math.random() * 1000).toFixed(2); 
		} else {
			obj[key1] = Math.round(Math.random() * 100);
			obj[key2] = Math.round(Math.random() * 100); 
		}
		obj.time = new Date(now - 1000 * item).toLocaleTimeString().replace(/^\D*/, "");
		return obj;
	});
}
Test.getSysData = function(){
	var now = new Date();
	return {
		serverCountInfo : {total : 50, active : 21, stoped : 1, error : 0},
		cpu : IX.map(random4Use(allCpu, now), function(cpu, idx){
			cpu.usage = Math.floor(Math.random() * 90);
			return cpu;
		}),
		mem : IX.map(random4Use(allMem, now), function(mem, idx){
			mem.usage = Math.floor(Math.random() * 90);
			return mem;
		}),
		storage : /*random4Use(allNode, now)[2]*/{total : 100, allocated :[0, 50,60, 100][randomInt(4)]},
		flow : IX.map(random4Use(allCpu, now), function(cpu, idx){
				cpu.up = Math.floor(Math.random() * 1000);
				cpu.down = Math.floor(Math.random() * 1000);
				return cpu;
			})
	};
};
Test.getPlaData = function(){
	return {
		levels : [
			{
		  		levelname : "应用层",
		  		platforms : [
		  			{
		  				name : "视频综合应用平台",
		  				products : [
		  					{
		  						name : "视频云计算",
		  						version : "V3.0",
		  						proFlag : 1
		  					},
		  					{
		  						name : "视云大数据平台",
		  						version : "V2.0",
		  						proFlag : 0
		  					}
		  				]
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "运维平台",
		  				products : [
		  					{
		  						name : "综合运维管理平台",
		  						version : "V3.0",
		  						proFlag : 1
		  					}
		  				]
		  			}
		  		]
			},
			{
		  		levelname : "解析层",
		  		platforms : [
		  			{
		  				name : "云计算平台",
		  				products : [
		  					{
		  						name : "视频云计算",
		  						version : "V3.0",
		  						proFlag : 1
		  					},

		  					{
		  						name : "视云大数据平台",
		  						version : "V2.0",
		  						proFlag : 0
		  					}
		  				]
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台",
		  				products : []
		  			},
		  			{
		  				name : "云存储平台",
		  				products : [
		  					{
		  						name : "综合运维管理平台",
		  						version : "V3.0",
		  						proFlag : 1
		  					}
		  				]
		  			},
		  			{
		  				name : "视频侦查平台1",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台2",
		  				products : []
		  			},
		  			{
		  				name : "视频侦查平台3",
		  				products : []
		  			},
		  			{
		  				name : "云存储平台",
		  				products : [
		  					{
		  						name : "综合运维管理平台",
		  						version : "V3.0",
		  						proFlag : 1
		  					}
		  				]
		  			}
		  		]
			},
			{
		  		levelname : "联网层",
		  		platforms : [
		  			{
		  				name : "视频联网平台",
		  				products : [
		  					{
		  						name : "综合运维管理平台",
		  						version : "V3.0",
		  						proFlag : 1
		  					}
		  				]
		  			}
		  		]
			}
		]
	}
}
Test.getOverView = function(){
	var now = new Date();
	return {
		serviceCountInfo : {total : 21, active : 21, stoped : 0, error : 0},
		product : [
		/*{
			left : {proFlag : 1, name : "新产品3",version : "v1.3.4", services : [
				{servFlag : -1, name : "基础服务", count : 5},
				{servFlag : 1, name : "应用服务", count : 1},
				{servFlag : 1, name : "应用服务1", count : 1},
				{servFlag : 1, name : "应用服务2", count : 1},
				{servFlag : 1, name : "应用服务3", count : 1},
				{servFlag : 0, name : "IOD", count : 2}
			], newVersion : [
				{proFlag : 1, name : "新产品3-版本1",version : "v2.3.4", services : [
					{servFlag : -1, name : "基础服务", count : 5},
					{servFlag : 0, name : "应用服务", count : 1},
					{servFlag : 0, name : "IOD", count : 2}
				]}, {proFlag : 1, name : "新产品1-版本2",version : "v3.3.4", services : [
					{servFlag : 1, name : "基础服务", count : 5},
					{servFlag : -1, name : "应用服务", count : 1},
					{servFlag : 0, name : "IOD", count : 2}
				]}
			]
		},
			right : {proFlag : 0, name : "新产品4", version : "v5.4.6", services : [
				{servFlag : 1, name : "后台", count : 8},
				{servFlag : 0, name : "地图", count : 2}
			]}
		},*/
		//{
			/*left : {proFlag : 1, name : "新产品3",version : "v1.3.4", services : [
				{servFlag : -1, name : "基础服务", count : 5},
				{servFlag : 1, name : "应用服务", count : 1},
				{servFlag : 1, name : "应用服务1", count : 1},
				{servFlag : 1, name : "应用服务2", count : 1},
				{servFlag : 1, name : "应用服务3", count : 1},
				{servFlag : 0, name : "IOD", count : 2}
			], newVersion : [
				{proFlag : 1, name : "新产品3-版本1",version : "v2.3.4", services : [
					{servFlag : -1, name : "基础服务", count : 5},
					{servFlag : 0, name : "应用服务", count : 1},
					{servFlag : 0, name : "IOD", count : 2}
				]}, {proFlag : 1, name : "新产品1-版本2",version : "v3.3.4", services : [
					{servFlag : 1, name : "基础服务", count : 5},
					{servFlag : -1, name : "应用服务", count : 1},
					{servFlag : 0, name : "IOD", count : 2}
				]}
			]
		},*/
			/*right : {proFlag : 1, name : "物理安防信息管理系统", version : "v5.4.6", services : [
				{servFlag : 1, name : "后台", count : 8},
				{servFlag : 0, name : "地图", count : 2}
			]}*/
		//},
		{
			left : {proFlag : 1, name : "社会化运营",version : "V2.0", services : [
				{servFlag : 1, name : "中心服务", count : 1},
				{servFlag : 1, name : "转码服务", count : 1},
				{servFlag : 1, name : "地图服务", count : 1},
				{servFlag : 1, name : "GPS接入服务", count : 1}
			], newVersion : [
				/*{proFlag : 1, name : "社会化运营",version : "v2.3.4", services : [
					{servFlag : -1, name : "基础服务", count : 5},
					{servFlag : 0, name : "应用服务", count : 1},
					{servFlag : 0, name : "IOD", count : 2}
				]}, {proFlag : 1, name : "新产品1-版本2",version : "v3.3.4", services : [
					{servFlag : 1, name : "基础服务", count : 5},
					{servFlag : -1, name : "应用服务", count : 1},
					{servFlag : 0, name : "IOD", count : 2}
				]}*/
			]
		},
			right : {proFlag : 1, name : "执法记录仪", version : "V2.0", services : [
				{servFlag : 1, name : "视频接入服务", count : 1},
				{servFlag : 1, name : "管理服务", count : 1}
			]}
		},
		{
			left : {proFlag : 1, name : "视云大数据平台",isBase : 1, version : "v4.6.5", services : [
				{servFlag : -1, name : "大数据存储服务OPAQ", count : 5},
				{servFlag : 1, name : "大数据分析服务", count : 1},
				{servFlag : 1, name : "应用服务", count : 1},
				{servFlag : 1, name : "应用服务1", count : 1},
				{servFlag : 1, name : "应用服务2", count : 1},
				{servFlag : 1, name : "应用服务3", count : 1},
				{servFlag : 0, name : "卡口接入服务IOD", count : 2}
			], newVersion : [
				{proFlag : 0, name : "视云大数据平台",version : "v2.3.4", services : [
					{servFlag : -1, name : "大数据存储服务OPAQ", count : 5},
					{servFlag : 1, name : "大数据分析服务", count : 1},
					{servFlag : 0, name : "卡口接入服务IOD", count : 2},
					{servFlag : 0, name : "应用服务", count : 2}
				]}, {proFlag : 1, name : "视云大数据平台",version : "v3.3.4", services : [
					{servFlag : -1, name : "基础服务", count : 5},
					{servFlag : 1, name : "应用服务", count : 1},
					{servFlag : 0, name : "IOD", count : 2}
				]}
			]
		},
			right : {proFlag : 1, name : "视云实战平台",isBase : 1, version : "v2.4.12", services : [
				{servFlag : 1, name : "后台服务", count : 8},
				{servFlag : 1, name : "后台服务1", count : 8},
				{servFlag : 1, name : "后台服务2", count : 8},
				{servFlag : 1, name : "后台服务3", count : 8},
				{servFlag : 0, name : "地图服务", count : 2}
			]}
		},
		{
			left : {proFlag : 1, name : "综合运维管理系统",isBase : 1,version : "V3.0", services : [
				{servFlag : 1, name : "集群运维管理服务", count : 1},
				{servFlag : 1, name : "Oracle服务", count : 1},
				{servFlag : 1, name : "监测探针服务", count : 1},
				{servFlag : 1, name : "视频诊断服务", count : 1}
			]},
			right : {proFlag : 1, name : "视频侦查云平台",isBase : 1, version : "V2.0.2", services : [
				{servFlag : 1, name : "WEB及视频服务", count : 1},
				{servFlag : 1, name : "pfs服务", count : 1}
			]}
		},
		{
			left : {proFlag : 1, name : "视频云计算",isBase : 1,version : "V1.0", services : [
				{servFlag : 1, name : "云计算节点服务PCC_Node", count : 3},
				{servFlag : 1, name : "云计算管理服务PCC_Center", count : 1}
			]},
			right : {proFlag : 1, name : "视频云存储",isBase : 1, version : "v3.4", services : [
				{servFlag : 1, name : "视频云存储服务PFS", count : 1}
			], newVersion : [
				/*{proFlag : 0, name : "视频云存储", version : "v6.4.6", services : [
					{servFlag : 0, name : "POFS", count : 8}
				]}*/
			]}
		},
		{
			left : {proFlag : 1, name : "视云联网平台",isBase : 1,version : "V6.7.1 72483", services : [
				{servFlag : 1, name : "中心管理服务CMS", count : 1},
				{servFlag : 1, name : "媒体转发服务FS", count : 1}
			]},
			right : /*{proFlag : 1, name : "物理安防信息管理系统", version : "V5.4.6", services : [
				{servFlag : 1, name : "后台服务", count : 1},
				{servFlag : 1, name : "地图服务", count : 1}
			]}*/{proFlag : 1, name : "集群云存储",isBase : 1, version : "v5.4.6", services : [
				{servFlag : 1, name : "ROFS", count : 8},
				{servFlag : -1, name : "客户端服务", count : 2}
			]}
		}
		]
	};
};

/**---------- logs -----*/
var logs = [];
IX.iterate("o".multi(88).split(""), function(item, idx){
	logs.push({
		id : "log-" +idx,
		_no : idx<9 ? "0"+(idx+1):(idx+1),
		type: ["计算资源不足", "计算节点故障", "作业处理失败"][Math.round(Math.random()*2)],
		status : [1, 0][Math.round(Math.random()*1)],
		date : formatDate((new Date().getTime()-Math.round(randomInt(3600*24))*1000)/1000, true),
		detail : ["系统存储空间已不足5%","添加服务成功详情：添加服务'"+services[Math.round(randomInt(19))].name+"'成功","删除服务成功详情：删除服务'"+services[Math.round(randomInt(19))].name+"'成功", "作业54处理失败"][Math.round(Math.random()*2)]
	});
});
Test.getLogs = function(params){
	var pageNo = params.pageNo || 0,
		pageSize = params.pageSize || 20;
	if (params.status === -1)
		return getPagedData(logs, pageNo, pageSize);
	else if (params.status === 0) 
		return getPagedData(IX.loop(logs, [], function(acc, log, idx){
			if (log.status === 0)
				acc.push(log);
			return acc;
		}), pageNo, pageSize);
	else 
		return getPagedData(IX.loop(logs, [], function(acc, log, idx){
			if (log.status === 1)
				acc.push(log);
			return acc;
		}), pageNo, pageSize);
};
Test.getPrompt = function(params){
	return {
		alarmNum : randomInt(5),
   		isWarn : true
	};
};
Test.handleAlarms = function(params){
	IX.iterate(params.ids, function(id){
		IX.iterate(logs, function(log){
			if (id === log.id)
				log.status = 1;
		});
	});
};
})();
