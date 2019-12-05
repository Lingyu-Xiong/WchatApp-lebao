//本地银行数据
var bank = [
  {
    "id": 1,
    "abbr": "ICBC",
    "text": "中国工商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ICBC.png"
  },
  {
    "id": 2,
    "abbr": "ABC",
    "text": "中国农业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ABC.png"
  },
  {
    "id": 3,
    "abbr": "BOC",
    "text": "中国银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOC.png"
  },
  {
    "id": 4,
    "abbr": "CCB",
    "text": "中国建设银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CCB.png"
  },
  {
    "id": 5,
    "abbr": "PSBC",
    "text": "中国邮政储蓄银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/PSBC.png"
  },
  {
    "id": 6,
    "abbr": "COMM",
    "text": "交通银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/COMM.png"
  },
  {
    "id": 7,
    "abbr": "CMB",
    "text": "招商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CMB.png"
  },
  {
    "id": 8,
    "abbr": "SPDB",
    "text": "上海浦东发展银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SPDB.png"
  },
  {
    "id": 9,
    "abbr": "CIB",
    "text": "兴业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CIB.png"
  },
  {
    "id": 10,
    "abbr": "HXBANK",
    "text": "华夏银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HXBANK.png"
  },
  {
    "id": 11,
    "abbr": "GDB",
    "text": "广东发展银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GDB.png"
  },
  {
    "id": 12,
    "abbr": "CMBC",
    "text": "中国民生银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CMBC.png"
  },
  {
    "id": 13,
    "abbr": "CITIC",
    "text": "中信银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CITIC.png"
  },
  {
    "id": 14,
    "abbr": "CEB",
    "text": "中国光大银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CEB.png"
  },
  {
    "id": 15,
    "abbr": "EGBANK",
    "text": "恒丰银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/EGBANK.png"
  },
  {
    "id": 16,
    "abbr": "CZBANK",
    "text": "浙商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CZBANK.png"
  },
  {
    "id": 17,
    "abbr": "BOHAIB",
    "text": "渤海银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOHAIB.png"
  },
  {
    "id": 18,
    "abbr": "SPABANK",
    "text": "平安银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SPABANK.png"
  },
  {
    "id": 19,
    "abbr": "SHRCB",
    "text": "上海农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SHRCB.png"
  },
  {
    "id": 20,
    "abbr": "YXCCB",
    "text": "玉溪市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/YXCCB.png"
  },
  {
    "id": 21,
    "abbr": "YDRCB",
    "text": "尧都农商行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/YDRCB.png"
  },
  {
    "id": 22,
    "abbr": "BJBANK",
    "text": "北京银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BJBANK.png"
  },
  {
    "id": 23,
    "abbr": "SHBANK",
    "text": "上海银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SHBANK.png"
  },
  {
    "id": 24,
    "abbr": "JSBANK",
    "text": "江苏银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JSBANK.png"
  },
  {
    "id": 25,
    "abbr": "HZCB",
    "text": "杭州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HZCB.png"
  },
  {
    "id": 26,
    "abbr": "NJCB",
    "text": "南京银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/NJCB.png"
  },
  {
    "id": 27,
    "abbr": "NBBANK",
    "text": "宁波银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/NBBANK.png"
  },
  {
    "id": 28,
    "abbr": "HSBANK",
    "text": "徽商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HSBANK.png"
  },
  {
    "id": 29,
    "abbr": "CSCB",
    "text": "长沙银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CSCB.png"
  },
  {
    "id": 30,
    "abbr": "CDCB",
    "text": "成都银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CDCB.png"
  },
  {
    "id": 31,
    "abbr": "CQBANK",
    "text": "重庆银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CQBANK.png"
  },
  {
    "id": 32,
    "abbr": "DLB",
    "text": "大连银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/DLB.png"
  },
  {
    "id": 33,
    "abbr": "NCB",
    "text": "南昌银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/NCB.png"
  },
  {
    "id": 34,
    "abbr": "FJHXBC",
    "text": "福建海峡银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/FJHXBC.png"
  },
  {
    "id": 35,
    "abbr": "HKB",
    "text": "汉口银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HKB.png"
  },
  {
    "id": 36,
    "abbr": "WZCB",
    "text": "温州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/WZCB.png"
  },
  {
    "id": 37,
    "abbr": "QDCCB",
    "text": "青岛银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/QDCCB.png"
  },
  {
    "id": 38,
    "abbr": "TZCB",
    "text": "台州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/TZCB.png"
  },
  {
    "id": 39,
    "abbr": "JXBANK",
    "text": "嘉兴银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JXBANK.png"
  },
  {
    "id": 40,
    "abbr": "CSRCB",
    "text": "常熟农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CSRCB.png"
  },
  {
    "id": 41,
    "abbr": "NHB",
    "text": "南海农村信用联社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/NHB.png"
  },
  {
    "id": 42,
    "abbr": "CZRCB",
    "text": "常州农村信用联社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CZRCB.png"
  },
  {
    "id": 43,
    "abbr": "H3CB",
    "text": "内蒙古银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/H3CB.png"
  },
  {
    "id": 44,
    "abbr": "SXCB",
    "text": "绍兴银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SXCB.png"
  },
  {
    "id": 45,
    "abbr": "SDEB",
    "text": "顺德农商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SDEB.png"
  },
  {
    "id": 46,
    "abbr": "WJRCB",
    "text": "吴江农商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/WJRCB.png"
  },
  {
    "id": 47,
    "abbr": "ZBCB",
    "text": "齐商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZBCB.png"
  },
  {
    "id": 48,
    "abbr": "GYCB",
    "text": "贵阳市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GYCB.png"
  },
  {
    "id": 49,
    "abbr": "ZYCBANK",
    "text": "遵义市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZYCBANK.png"
  },
  {
    "id": 50,
    "abbr": "HZCCB",
    "text": "湖州市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HZCCB.png"
  },
  {
    "id": 51,
    "abbr": "DAQINGB",
    "text": "龙江银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/DAQINGB.png"
  },
  {
    "id": 52,
    "abbr": "JINCHB",
    "text": "晋城银行JCBANK",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JINCHB.png"
  },
  {
    "id": 53,
    "abbr": "ZJTLCB",
    "text": "浙江泰隆商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZJTLCB.png"
  },
  {
    "id": 54,
    "abbr": "GDRCC",
    "text": "广东省农村信用社联合社,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GDRCC.png"
  },
  {
    "id": 55,
    "abbr": "DRCBCL",
    "text": "东莞农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/DRCBCL.png"
  },
  {
    "id": 56,
    "abbr": "MTBANK",
    "text": "浙江民泰商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/MTBANK.png"
  },
  {
    "id": 57,
    "abbr": "GCB",
    "text": "广州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GCB.png"
  },
  {
    "id": 58,
    "abbr": "LYCB",
    "text": "辽阳市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/LYCB.png"
  },
  {
    "id": 59,
    "abbr": "JSRCU",
    "text": "江苏省农村信用联合社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JSRCU.png"
  },
  {
    "id": 60,
    "abbr": "LANGFB",
    "text": "廊坊银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/LANGFB.png"
  },
  {
    "id": 61,
    "abbr": "CZCB",
    "text": "浙江稠州商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CZCB.png"
  },
  {
    "id": 62,
    "abbr": "DYCB",
    "text": "德阳商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/DYCB.png"
  },
  {
    "id": 63,
    "abbr": "JZBANK",
    "text": "晋中市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JZBANK.png"
  },
  {
    "id": 64,
    "abbr": "BOSZ",
    "text": "苏州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOSZ.png"
  },
  {
    "id": 65,
    "abbr": "GLBANK",
    "text": "桂林银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GLBANK.png"
  },
  {
    "id": 66,
    "abbr": "URMQCCB",
    "text": "乌鲁木齐市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/URMQCCB.png"
  },
  {
    "id": 67,
    "abbr": "CDRCB",
    "text": "成都农商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CDRCB.png"
  },
  {
    "id": 68,
    "abbr": "ZRCBANK",
    "text": "张家港农村商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZRCBANK.png"
  },
  {
    "id": 69,
    "abbr": "BOD",
    "text": "东莞银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOD.png"
  },
  {
    "id": 70,
    "abbr": "LSBANK",
    "text": "莱商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/LSBANK.png"
  },
  {
    "id": 71,
    "abbr": "BJRCB",
    "text": "北京农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BJRCB.png"
  },
  {
    "id": 72,
    "abbr": "TRCB",
    "text": "天津农商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/TRCB.png"
  },
  {
    "id": 73,
    "abbr": "SRBANK",
    "text": "上饶银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SRBANK.png"
  },
  {
    "id": 74,
    "abbr": "FDB",
    "text": "富滇银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/FDB.png"
  },
  {
    "id": 75,
    "abbr": "CRCBANK",
    "text": "重庆农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CRCBANK.png"
  },
  {
    "id": 76,
    "abbr": "ASCB",
    "text": "鞍山银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ASCB.png"
  },
  {
    "id": 77,
    "abbr": "NXBANK",
    "text": "宁夏银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/NXBANK.png"
  },
  {
    "id": 78,
    "abbr": "BHB",
    "text": "河北银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BHB.png"
  },
  {
    "id": 79,
    "abbr": "HRXJB",
    "text": "华融湘江银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HRXJB.png"
  },
  {
    "id": 80,
    "abbr": "ZGCCB",
    "text": "自贡市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZGCCB.png"
  },
  {
    "id": 81,
    "abbr": "YNRCC",
    "text": "云南省农村信用社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/YNRCC.png"
  },
  {
    "id": 82,
    "abbr": "JLBANK",
    "text": "吉林银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JLBANK.png"
  },
  {
    "id": 83,
    "abbr": "DYCCB",
    "text": "东营市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/DYCCB.png"
  },
  {
    "id": 84,
    "abbr": "KLB",
    "text": "昆仑银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/KLB.png"
  },
  {
    "id": 85,
    "abbr": "ORBANK",
    "text": "鄂尔多斯银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ORBANK.png"
  },
  {
    "id": 86,
    "abbr": "XTB",
    "text": "邢台银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/XTB.png"
  },
  {
    "id": 87,
    "abbr": "JSB",
    "text": "晋商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JSB.png"
  },
  {
    "id": 88,
    "abbr": "TCCB",
    "text": "天津银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/TCCB.png"
  },
  {
    "id": 89,
    "abbr": "BOYK",
    "text": "营口银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOYK.png"
  },
  {
    "id": 90,
    "abbr": "JLRCU",
    "text": "吉林农信",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JLRCU.png"
  },
  {
    "id": 91,
    "abbr": "SDRCU",
    "text": "山东农信",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SDRCU.png"
  },
  {
    "id": 92,
    "abbr": "XABANK",
    "text": "西安银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/XABANK.png"
  },
  {
    "id": 93,
    "abbr": "HBRCU",
    "text": "河北省农村信用社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HBRCU.png"
  },
  {
    "id": 94,
    "abbr": "NXRCU",
    "text": "宁夏黄河农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/NXRCU.png"
  },
  {
    "id": 95,
    "abbr": "GZRCU",
    "text": "贵州省农村信用社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GZRCU.png"
  },
  {
    "id": 96,
    "abbr": "FXCB",
    "text": "阜新银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/FXCB.png"
  },
  {
    "id": 97,
    "abbr": "HBHSBANK",
    "text": "湖北银行黄石分行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HBHSBANK.png"
  },
  {
    "id": 98,
    "abbr": "ZJNX",
    "text": "浙江省农村信用社联合社,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZJNX.png"
  },
  {
    "id": 99,
    "abbr": "XXBANK",
    "text": "新乡银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/XXBANK.png"
  },
  {
    "id": 100,
    "abbr": "LSCCB",
    "text": "乐山市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/LSCCB.png"
  },
  {
    "id": 101,
    "abbr": "TCRCB",
    "text": "江苏太仓农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/TCRCB.png"
  },
  {
    "id": 102,
    "abbr": "BZMD",
    "text": "驻马店银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BZMD.png"
  },
  {
    "id": 103,
    "abbr": "GZB",
    "text": "赣州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GZB.png"
  },
  {
    "id": 104,
    "abbr": "WRCB",
    "text": "无锡农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/WRCB.png"
  },
  {
    "id": 105,
    "abbr": "BGB",
    "text": "广西北部湾银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BGB.png"
  },
  {
    "id": 106,
    "abbr": "GRCB",
    "text": "广州农商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GRCB.png"
  },
  {
    "id": 107,
    "abbr": "JRCB",
    "text": "江苏江阴农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JRCB.png"
  },
  {
    "id": 108,
    "abbr": "BOP",
    "text": "平顶山银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOP.png"
  },
  {
    "id": 109,
    "abbr": "TACCB",
    "text": "泰安市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/TACCB.png"
  },
  {
    "id": 110,
    "abbr": "CGNB",
    "text": "南充市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CGNB.png"
  },
  {
    "id": 111,
    "abbr": "CCQTGB",
    "text": "重庆三峡银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CCQTGB.png"
  },
  {
    "id": 112,
    "abbr": "XLBANK",
    "text": "中山小榄村镇银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/XLBANK.png"
  },
  {
    "id": 113,
    "abbr": "HDBANK",
    "text": "邯郸银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HDBANK.png"
  },
  {
    "id": 114,
    "abbr": "BOJZ",
    "text": "锦州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOJZ.png"
  },
  {
    "id": 115,
    "abbr": "QLBANK",
    "text": "齐鲁银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/QLBANK.png"
  },
  {
    "id": 116,
    "abbr": "BOQH",
    "text": "青海银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOQH.png"
  },
  {
    "id": 117,
    "abbr": "YQCCB",
    "text": "阳泉银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/YQCCB.png"
  },
  {
    "id": 118,
    "abbr": "SJBANK",
    "text": "盛京银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SJBANK.png"
  },
  {
    "id": 119,
    "abbr": "FSCB",
    "text": "抚顺银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/FSCB.png"
  },
  {
    "id": 120,
    "abbr": "ZZBANK",
    "text": "郑州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZZBANK.png"
  },
  {
    "id": 121,
    "abbr": "SRCB",
    "text": "深圳农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SRCB.png"
  },
  {
    "id": 122,
    "abbr": "BANKWF",
    "text": "潍坊银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BANKWF.png"
  },
  {
    "id": 123,
    "abbr": "JJBANK",
    "text": "九江银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JJBANK.png"
  },
  {
    "id": 124,
    "abbr": "JXRCU",
    "text": "江西省农村信用,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JXRCU.png"
  },
  {
    "id": 125,
    "abbr": "HNRCU",
    "text": "河南省农村信用,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HNRCU.png"
  },
  {
    "id": 126,
    "abbr": "GSRCU",
    "text": "甘肃省农村信用,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GSRCU.png"
  },
  {
    "id": 127,
    "abbr": "SCRCU",
    "text": "四川省农村信用,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SCRCU.png"
  },
  {
    "id": 128,
    "abbr": "GXRCU",
    "text": "广西省农村信用,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/GXRCU.png"
  },
  {
    "id": 129,
    "abbr": "SXRCCU",
    "text": "陕西信合",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SXRCCU.png"
  },
  {
    "id": 130,
    "abbr": "WHRCB",
    "text": "武汉农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/WHRCB.png"
  },
  {
    "id": 131,
    "abbr": "YBCCB",
    "text": "宜宾市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/YBCCB.png"
  },
  {
    "id": 132,
    "abbr": "KSRB",
    "text": "昆山农村商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/KSRB.png"
  },
  {
    "id": 133,
    "abbr": "SZSBK",
    "text": "石嘴山银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SZSBK.png"
  },
  {
    "id": 134,
    "abbr": "HSBK",
    "text": "衡水银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HSBK.png"
  },
  {
    "id": 135,
    "abbr": "XYBANK",
    "text": "信阳银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/XYBANK.png"
  },
  {
    "id": 136,
    "abbr": "NBYZ",
    "text": "鄞州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/NBYZ.png"
  },
  {
    "id": 137,
    "abbr": "ZJKCCB",
    "text": "张家口市商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ZJKCCB.png"
  },
  {
    "id": 138,
    "abbr": "XCYH",
    "text": "许昌银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/XCYH.png"
  },
  {
    "id": 139,
    "abbr": "JNBANK",
    "text": "济宁银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JNBANK.png"
  },
  {
    "id": 140,
    "abbr": "CBKF",
    "text": "开封市商业银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/CBKF.png"
  },
  {
    "id": 141,
    "abbr": "WHCCB",
    "text": "威海市商业银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/WHCCB.png"
  },
  {
    "id": 142,
    "abbr": "HBC",
    "text": "湖北银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HBC.png"
  },
  {
    "id": 143,
    "abbr": "BOCD",
    "text": "承德银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOCD.png"
  },
  {
    "id": 144,
    "abbr": "BODD",
    "text": "丹东银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BODD.png"
  },
  {
    "id": 145,
    "abbr": "JHBANK",
    "text": "金华银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/JHBANK.png"
  },
  {
    "id": 146,
    "abbr": "BOCY",
    "text": "朝阳银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOCY.png"
  },
  {
    "id": 147,
    "abbr": "LSBC",
    "text": "临商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/LSBC.png"
  },
  {
    "id": 148,
    "abbr": "BSB",
    "text": "包商银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BSB.png"
  },
  {
    "id": 149,
    "abbr": "LZYH",
    "text": "兰州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/LZYH.png"
  },
  {
    "id": 150,
    "abbr": "BOZK",
    "text": "周口银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/BOZK.png"
  },
  {
    "id": 151,
    "abbr": "DZBANK",
    "text": "德州银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/DZBANK.png"
  },
  {
    "id": 152,
    "abbr": "SCCB",
    "text": "三门峡银行,0",
    "picUrl": "http://www.lebao108.com/images/bank_logo/SCCB.png"
  },
  {
    "id": 153,
    "abbr": "AYCB",
    "text": "安阳银行",
    "picUrl": "http://www.lebao108.com/images/bank_logo/AYCB.png"
  },
  {
    "id": 154,
    "abbr": "ARCU",
    "text": "安徽省农村信用社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/ARCU.png"
  },
  {
    "id": 155,
    "abbr": "HURCB",
    "text": "湖北省农村信用社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HURCB.png"
  },
  {
    "id": 156,
    "abbr": "HNRCC",
    "text": "湖南省农村信用社",
    "picUrl": "http://www.lebao108.com/images/bank_logo/HNRCC.png"
  }
]

module.exports={
  bankList:bank
}