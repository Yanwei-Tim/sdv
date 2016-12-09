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