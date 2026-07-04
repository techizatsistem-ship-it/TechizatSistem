// Firebase 'korusers' kolleksiyasından ixrac edilmiş məlumatlar
const korusersData = [
    {
        "id": "1",
        "name": "K - Mirsəməd Səlimov (1)"
    },
    {
        "id": "100",
        "name": "OFİS -  (100)"
    },
    {
        "id": "111",
        "name": "K - Nüşabə Həsənova (111)"
    },
    {
        "id": "16",
        "name": "K - Emin Əhmədov (16)"
    },
    {
        "id": "18",
        "name": "K - Nuran İsmayılova (Ofisait WEB) (18)"
    },
    {
        "id": "208",
        "name": "K - Elnur Məmmədov (208)"
    },
    {
        "id": "211",
        "name": "K - VAKANSİYA (211)"
    },
    {
        "id": "212",
        "name": "K - Anar Əmirzadə (212)"
    },
    {
        "id": "214",
        "name": "K - Rəmalə Cəlilova (214)"
    },
    {
        "id": "215",
        "name": "K - Firəngiz Şahbazova (215)"
    },
    {
        "id": "220",
        "name": "K - Fidan Ağayeva (220)"
    },
    {
        "id": "221",
        "name": "K - Samir Mirzəyev (221)"
    },
    {
        "id": "222",
        "name": "K - Gözəl Musazadə (222)"
    },
    {
        "id": "223",
        "name": "K - Ramil Qədəmullazadə (223)"
    },
    {
        "id": "224",
        "name": "K - İslam Əsgərov (224)"
    },
    {
        "id": "240",
        "name": "K - Taleh Tacibov (240)"
    },
    {
        "id": "241",
        "name": "K - Vakansiya (241)"
    },
    {
        "id": "242",
        "name": "K - Rüfət Bənnəyev (242)"
    },
    {
        "id": "244",
        "name": "K - Turan Abdullayeva (244)"
    },
    {
        "id": "245",
        "name": "K - Samir Nəsirov (245)"
    },
    {
        "id": "246",
        "name": "K - Pərvanə Nuraliyeva (246)"
    },
    {
        "id": "248",
        "name": "K - Fərid (248)"
    },
    {
        "id": "250",
        "name": "K - Sevda Məmmədli (250)"
    },
    {
        "id": "251",
        "name": "K - Ülkər Seyfullayeva (251)"
    },
    {
        "id": "252",
        "name": "K - Nurlanə Əsədova (252)"
    },
    {
        "id": "254",
        "name": "K - Ayşən Quliyeva (254)"
    },
    {
        "id": "255",
        "name": "K - Elşən Salahov (255)"
    },
    {
        "id": "256",
        "name": "K - Kənan Qarazadə (256)"
    },
    {
        "id": "257",
        "name": "K - Optimal (257)"
    },
    {
        "id": "258",
        "name": "K - Şəbnəm Ağazadə (258)"
    },
    {
        "id": "259",
        "name": "K - Emil Hacıyev (259)"
    },
    {
        "id": "260",
        "name": "K - Nurlan Rəhimov (260)"
    },
    {
        "id": "262",
        "name": "K - Orxan Babalı (262)"
    },
    {
        "id": "50",
        "name": "K - Əhmədağa Piriyev (50)"
    },
    {
        "id": "53",
        "name": "K - Turanə Əmrahova (53)"
    },
    {
        "id": "61",
        "name": "K - Dilbər Seyidova (61)"
    },
    {
        "id": "64",
        "name": "K - Mirzəli Quliyev (64)"
    },
    {
        "id": "67",
        "name": "K - Sevil Hüseynli (67)"
    },
    {
        "id": "68",
        "name": "K - Təhminə İsmayılova (68)"
    },
    {
        "id": "70",
        "name": "K - Teymur Babayev (70)"
    },
    {
        "id": "71",
        "name": "K - Hüseyn Cəbiyev (71)"
    },
    {
        "id": "72",
        "name": "K - Şövkət Əsədova (72)"
    },
    {
        "id": "73",
        "name": "K - Xəqani Maqsudov (73)"
    },
    {
        "id": "74",
        "name": "K - Fail Orucov (74)"
    },
    {
        "id": "75",
        "name": "K - Sənan Xudiyev (75)"
    },
    {
        "id": "76",
        "name": "K - Rəna Həsənli (76)"
    },
    {
        "id": "77",
        "name": "K - Lalə Alan-Əliyeva (77)"
    },
    {
        "id": "78",
        "name": "K - Ümid Qasımzadə (78)"
    },
    {
        "id": "79",
        "name": "K - Rəşad Xudiyev (79)"
    },
    {
        "id": "88",
        "name": "K - Barat Əlizadə (88)"
    },
    {
        "id": "93",
        "name": "K - Vakansiya (93)"
    },
    {
        "id": "P19",
        "name": "OF - ƏHMƏDLİ KÖHNƏ (P19)"
    },
    {
        "id": "P20",
        "name": "OF - Problemlilər (P20)"
    },
    {
        "id": "P22",
        "name": "K - (Problemli müştərilər) (P22)"
    },
    {
        "id": "SM04",
        "name": "K - Rəmalə Cəlilova (SM04)"
    },
    {
        "id": "SM10",
        "name": "K - Nicat Abdullayev (SM10)"
    },
    {
        "id": "SM30",
        "name": "OF - İlkin Rufullayev (SM30)"
    },
    {
        "id": "SM32",
        "name": "OF - Rasim Abbasov (SM32)"
    },
    {
        "id": "SM34",
        "name": "OF - Vidadi Rəhimov (SM34)"
    },
    {
        "id": "SM35",
        "name": "OF - Mağazaları (SM35)"
    },
    {
        "id": "SM36",
        "name": "OF - Azər Eminov (SM36)"
    },
    {
        "id": "SM38",
        "name": "OF - Babək Həsənov (SM38)"
    },
    {
        "id": "SM40",
        "name": "K - Vakansiya (SM40)"
    },
    {
        "id": "SM41",
        "name": "OF - Elşad Cəfərov (SM41)"
    },
    {
        "id": "SM42",
        "name": "K - Fazil Məmmədov (SM42)"
    },
    {
        "id": "SM44",
        "name": "K -  (SM44)"
    },
    {
        "id": "SM45",
        "name": "K - Tural Bayramlı (SM45)"
    },
    {
        "id": "SM46",
        "name": "K - Tural Hacıyev (SM46)"
    },
    {
        "id": "SM50",
        "name": "OF - Nicat Ibrahimov (SM50)"
    },
    {
        "id": "ST001",
        "name": "OF - ELMLƏR (ST001)"
    },
    {
        "id": "ST002",
        "name": "OF - 46170 (ST002)"
    },
    {
        "id": "ST003",
        "name": "OF - DİLARƏ ƏLİYEVA 237/14 (ST003)"
    },
    {
        "id": "ST004",
        "name": "OF - ŞAHBAZOV (ST004)"
    },
    {
        "id": "ST005",
        "name": "OF - QUICKS (ST005)"
    },
    {
        "id": "ST006",
        "name": "OF - SƏDƏRƏK (ST006)"
    },
    {
        "id": "ST007",
        "name": "TS - HƏMİDƏ DADAŞOVA (ST007)"
    },
    {
        "id": "ST008",
        "name": "OF - 8-Cİ KM/85 (ST008)"
    },
    {
        "id": "ST009",
        "name": "OF - 8-Cİ KM/390 (ST009)"
    },
    {
        "id": "ST010",
        "name": "OF - VAĞZAL (ST010)"
    },
    {
        "id": "ST011",
        "name": "OF - BİNƏ QƏSƏBƏSİ (ST011)"
    },
    {
        "id": "ST012",
        "name": "OF - ƏHMƏDLİ (ST012)"
    },
    {
        "id": "ST013",
        "name": "OF - SUMQAYIT (ST013)"
    },
    {
        "id": "ST014",
        "name": "OF - HƏZİ ASLANOV (ST014)"
    },
    {
        "id": "ST015",
        "name": "OF - BAKIXANOV (ST015)"
    },
    {
        "id": "ST016",
        "name": "OF - LƏNKƏRAN (ST016)"
    },
    {
        "id": "ST017",
        "name": "OF - Mingəçevir (ST017)"
    },
    {
        "id": "ST019",
        "name": "OF - ULDUZ- ONLINE (ST019)"
    },
    {
        "id": "ST020",
        "name": "OF - TOVUZ (ST020)"
    },
    {
        "id": "ST021",
        "name": "OF - BƏRDƏ (ST021)"
    },
    {
        "id": "ST022",
        "name": "OF - GÖYÇAY (ST022)"
    },
    {
        "id": "ST023",
        "name": "OF - ŞAMAXİNKA 1 (ST023)"
    },
    {
        "id": "ST024",
        "name": "OF - GƏNCƏ (ST024)"
    },
    {
        "id": "ST025",
        "name": "OF - SUMQAYIT 2 (ST025)"
    },
    {
        "id": "ST026",
        "name": "OF - NEFTÇİLƏR (ST026)"
    },
    {
        "id": "ST027",
        "name": "OF - SUMQAYIT 3 (ST027)"
    },
    {
        "id": "ST028",
        "name": "OF - İNŞAATÇILAR (ST028)"
    },
    {
        "id": "ST029",
        "name": "OF - XALQLAR (ST029)"
    },
    {
        "id": "ST030",
        "name": "OF - NƏSİMİ (ST030)"
    },
    {
        "id": "ST031",
        "name": "OF - XIRDALAN-1 (ST031)"
    },
    {
        "id": "ST032",
        "name": "OF - XIRDALAN-2 (ST032)"
    },
    {
        "id": "ST033",
        "name": "OF - S. RÜSTƏM (ST033)"
    },
    {
        "id": "ST034",
        "name": "OF - NƏRİMANOV (ST034)"
    },
    {
        "id": "ST035",
        "name": "OF - Qara Qarayev (ST035)"
    },
    {
        "id": "ST036",
        "name": "OF - GƏNCƏ - 2 (ST036)"
    },
    {
        "id": "ST038",
        "name": "OF - ŞƏRİFZADƏ (ST038)"
    },
    {
        "id": "ST039",
        "name": "K - Esmira Abdullayeva (ST039)"
    },
    {
        "id": "ST040",
        "name": "K - Tural Bayramlı (ST040)"
    },
    {
        "id": "ST041",
        "name": "K - Tural Hacıyev (ST041)"
    },
    {
        "id": "ST042",
        "name": "OF - Şəmkir (ST042)"
    },
    {
        "id": "ST043",
        "name": "K - Elmira Axundova (ST043)"
    },
    {
        "id": "ST044",
        "name": "OF - ŞAMAXİNKA 2 (ST044)"
    },
    {
        "id": "ST045",
        "name": "OF - Mingəçevir - 2 (ST045)"
    },
    {
        "id": "ST046",
        "name": "OF - NƏRİMANOV 2 (ST046)"
    },
    {
        "id": "ST047",
        "name": "OF - AĞDAŞ (ST047)"
    },
    {
        "id": "ST048",
        "name": "OF - Xankəndi (ST048)"
    },
    {
        "id": "ST049",
        "name": "K - Nuranə Rzazadə (ST049)"
    },
    {
        "id": "ST050",
        "name": "OF - GÜNƏŞLİ (ST050)"
    },
    {
        "id": "ST051",
        "name": "OF - AYNA SULTANOVA (ST051)"
    },
    {
        "id": "ST052",
        "name": "OF - Nuran İsmayılova (ST052)"
    },
    {
        "id": "ST053",
        "name": "OF - QAZAX (ST053)"
    },
    {
        "id": "ST054",
        "name": "OF - ŞAMAXI (ST054)"
    },
    {
        "id": "ST055",
        "name": "K - Qaim Cəfərli (ST055)"
    },
    {
        "id": "ST056",
        "name": "OF - SUMQAYIT 4 (ST056)"
    },
    {
        "id": "ST057",
        "name": "OF - Qovlar (ST057)"
    },
    {
        "id": "ST058",
        "name": "OF - İsmayillı (ST058)"
    },
    {
        "id": "ST059",
        "name": "OF - BƏRDƏ - 2 (ST059)"
    },
    {
        "id": "TS02",
        "name": "TS - Ülkər Gürzalıyeva (TS02)"
    }
];
