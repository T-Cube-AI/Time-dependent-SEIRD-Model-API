define({ "api": [
  {
    "type": "get",
    "url": "/countries/India",
    "title": "/ redirects to /countries/India/states",
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "allStatesInIndia",
            "description": "<p>list of states</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"allStatesInIndia\":[\"Andaman and Nicobar Islands\",\"Andhra Pradesh\",\"Arunachal Pradesh\",\"Assam\",\"Bihar\",\"Chandigarh\",\"Chhattisgarh\",\"Delhi\",\"Dadra and Nagar Haveli and Daman and Diu\",\"Goa\",\"Gujarat\",\"Himachal Pradesh\",\"Haryana\",\"Jharkhand\",\"Jammu and Kashmir\",\"Karnataka\",\"Kerala\",\"Ladakh\",\"Lakshadweep\",\"Maharashtra\",\"Meghalaya\",\"Manipur\",\"Madhya Pradesh\",\"Mizoram\",\"Nagaland\",\"Odisha\",\"Punjab\",\"Puducherry\",\"Rajasthan\",\"Sikkim\",\"Telangana\",\"Tamil Nadu\",\"Tripura\",\"Uttar Pradesh\",\"Uttarakhand\",\"West Bengal\"]}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndia"
  },
  {
    "type": "get",
    "url": "/countries/India/districts",
    "title": "/districts districts of a particular state in India",
    "group": "/countries/India",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "state",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>list of districts</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n[\"Ahmednagar\",\"Akola\",\"Amravati\",\"Aurangabad\",\"Beed\",\"Bhandara\",\"Buldhana\",\"Chandrapur\",\"Dhule\",\"Gadchiroli\",\"Gondia\",\"Hingoli\",\"Jalgaon\",\"Jalna\",\"Kolhapur\",\"Latur\",\"Mumbai\",\"Mumbai Suburban\",\"Nanded\",\"Nandurbar\",\"Nagpur\",\"Nashik\",\"Osmanabad\",\"Palghar\",\"Parbhani\",\"Pune\",\"Raigad\",\"Ratnagiri\",\"Sangli\",\"Satara\",\"Sindhudurg\",\"Solapur\",\"Thane\",\"Wardha\",\"Washim\",\"Yavatmal\"]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found",
          "content": "HTTP / 404 Not Found\n  {\"message\":\"Please provide a valid state name\"}",
          "type": "json"
        },
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaDistricts"
  },
  {
    "type": "get",
    "url": "/countries/India/endpoints",
    "title": "/endpoints available endpoints",
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "Endpoints",
            "description": "<p>list of endpoints</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"Endpoints\":[\"/states\",\"/districts\",\"/predict\",\"/past\",\"/heatfactors\",\"insights\"]}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaEndpoints"
  },
  {
    "type": "get",
    "url": "/countries/India/heatfactors",
    "title": "/heatfactors heatfactors",
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "state-name",
            "description": "<p>heatfactors of each state</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"Andhra Pradesh\":88.05317040951122,\"Arunachal Pradesh\":0.037153236459709374,\"Assam\":22.023612945838835,\"Bihar\":36.22027741083223,\"Chhattisgarh\":1.506770145310436,\"Goa\":0.7471928665785996,\"Gujarat\":2.3323976221928664,\"Haryana\":1.4820013210039629,\"Himachal Pradesh\":0,\"Jharkhand\":8.986955085865258,\"Karnataka\":33.66908850726552,\"Kerala\":7.166446499339497,\"Madhya Pradesh\":1.4696169088507265,\"Maharashtra\":100,\"Manipur\":0.8462681638044913,\"Meghalaya\":0.44996697490092463,\"Mizoram\":0,\"Nagaland\":11.29458388375165,\"Odisha\":8.334709379128137,\"Punjab\":0.11558784676354028,\"Rajasthan\":6.34494715984148,\"Sikkim\":0.4540951122853369,\"Tamil Nadu\":0,\"Telangana\":8.623678996036988,\"Tripura\":0,\"Uttar Pradesh\":36.253302509907535,\"Uttarakhand\":0,\"West Bengal\":20.302179656538968,\"Andaman and Nicobar Islands\":0,\"Chandigarh\":1.081571994715984,\"Dadra and Nagar Haveli and Daman and Diu\":0.22704755614266844,\"Jammu and Kashmir\":4.049702774108322,\"Ladakh\":0.11971598414795244,\"Lakshadweep\":0,\"Delhi\":2.022787318361955,\"Puducherry\":1.4365918097754293}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaHeatfactors"
  },
  {
    "type": "get",
    "url": "/countries/India/heatfactors/:state",
    "title": "/heatfactors/:state heatfactors",
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "district-name",
            "description": "<p>heatfactors of each district</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n {\"Ahmednagar\":19.609261939218527,\"Akola\":0,\"Amravati\":1.3748191027496381,\"Aurangabad\":1.3314037626628077,\"Beed\":4.703328509406656,\"Bhandara\":0,\"Buldhana\":1.5340086830680173,\"Chandrapur\":1.186685962373372,\"Dhule\":2.3589001447178,\"Gadchiroli\":0.7380607814761216,\"Gondia\":1.4471780028943562,\"Hingoli\":0.3328509406657019,\"Jalgaon\":15.658465991316934,\"Jalna\":0.08683068017366136,\"Kolhapur\":34.500723589001446,\"Latur\":12.547033285094066,\"Mumbai\":29.507959479015923,\"Mumbai Suburban\":0,\"Nanded\":14.790159189580319,\"Nandurbar\":0.43415340086830684,\"Nagpur\":59.4356005788712,\"Nashik\":22.416787264833577,\"Osmanabad\":5.151953690303908,\"Palghar\":9.739507959479015,\"Parbhani\":0,\"Pune\":100,\"Raigad\":3.2127351664254706,\"Ratnagiri\":0,\"Sangli\":16.70043415340087,\"Satara\":6.845151953690304,\"Sindhudurg\":0,\"Solapur\":8.509406657018815,\"Thane\":36.38205499276411,\"Wardha\":0.5209840810419682,\"Washim\":0,\"Yavatmal\":2.4167872648335744}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        },
        {
          "title": "Failed",
          "content": "HTTP/1.1 404 State Not Found",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaHeatfactorsState"
  },
  {
    "type": "get",
    "url": "/countries/India/predict",
    "title": "",
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "overallPredictions",
            "description": "<p>3-week predictions of INDIA</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"overallPredictions\":[{\"Week-1\":{\"predictions\":[{\"date\":\"2020-08-07\",\"active\":617910,\"deaths\":42640,\"confirmed\":2081276},{\"date\":\"2020-08-08\",\"active\":630257,\"deaths\":43611,\"confirmed\":2142721},{\"date\":\"2020-08-09\",\"active\":643280,\"deaths\":44600,\"confirmed\":2205823},{\"date\":\"2020-08-10\",\"active\":656953,\"deaths\":45611,\"confirmed\":2270610},{\"date\":\"2020-08-11\",\"active\":671253,\"deaths\":46642,\"confirmed\":2337110},{\"date\":\"2020-08-12\",\"active\":686162,\"deaths\":47696,\"confirmed\":2405355},{\"date\":\"2020-08-13\",\"active\":701662,\"deaths\":48774,\"confirmed\":2475376}],\"total\":{\"active\":701662,\"deaths\":48774,\"confirmed\":2475376}}},{\"Week-2\":{\"predictions\":[{\"date\":\"2020-08-14\",\"active\":717742,\"deaths\":49876,\"confirmed\":2547209},{\"date\":\"2020-08-15\",\"active\":734389,\"deaths\":51003,\"confirmed\":2620886},{\"date\":\"2020-08-16\",\"active\":751594,\"deaths\":52156,\"confirmed\":2696444},{\"date\":\"2020-08-17\",\"active\":769350,\"deaths\":53336,\"confirmed\":2773920},{\"date\":\"2020-08-18\",\"active\":787651,\"deaths\":54544,\"confirmed\":2853352},{\"date\":\"2020-08-19\",\"active\":806492,\"deaths\":55781,\"confirmed\":2934778},{\"date\":\"2020-08-20\",\"active\":825871,\"deaths\":57047,\"confirmed\":3018239}],\"total\":{\"active\":825871,\"deaths\":57047,\"confirmed\":3018239}}},{\"Week-3\":{\"predictions\":[{\"date\":\"2020-08-21\",\"active\":845785,\"deaths\":58344,\"confirmed\":3103775},{\"date\":\"2020-08-22\",\"active\":866233,\"deaths\":59672,\"confirmed\":3191427},{\"date\":\"2020-08-23\",\"active\":887216,\"deaths\":61033,\"confirmed\":3281240},{\"date\":\"2020-08-24\",\"active\":908734,\"deaths\":62426,\"confirmed\":3373254},{\"date\":\"2020-08-25\",\"active\":930789,\"deaths\":63853,\"confirmed\":3467515},{\"date\":\"2020-08-26\",\"active\":953381,\"deaths\":65314,\"confirmed\":3564065},{\"date\":\"2020-08-27\",\"active\":976515,\"deaths\":66811,\"confirmed\":3662953}],\"total\":{\"active\":976515,\"deaths\":66811,\"confirmed\":3662953}}}]}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaPredict"
  },
  {
    "type": "get",
    "url": "/countries/India/predict/:state",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": ""
          }
        ]
      }
    },
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "overallPredictions",
            "description": "<p>3-week predictions of given state</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"overallPredictions\":[{\"Week-1\":{\"predictions\":[{\"date\":\"2020-08-07\",\"active\":617910,\"deaths\":42640,\"confirmed\":2081276},{\"date\":\"2020-08-08\",\"active\":630257,\"deaths\":43611,\"confirmed\":2142721},{\"date\":\"2020-08-09\",\"active\":643280,\"deaths\":44600,\"confirmed\":2205823},{\"date\":\"2020-08-10\",\"active\":656953,\"deaths\":45611,\"confirmed\":2270610},{\"date\":\"2020-08-11\",\"active\":671253,\"deaths\":46642,\"confirmed\":2337110},{\"date\":\"2020-08-12\",\"active\":686162,\"deaths\":47696,\"confirmed\":2405355},{\"date\":\"2020-08-13\",\"active\":701662,\"deaths\":48774,\"confirmed\":2475376}],\"total\":{\"active\":701662,\"deaths\":48774,\"confirmed\":2475376}}},{\"Week-2\":{\"predictions\":[{\"date\":\"2020-08-14\",\"active\":717742,\"deaths\":49876,\"confirmed\":2547209},{\"date\":\"2020-08-15\",\"active\":734389,\"deaths\":51003,\"confirmed\":2620886},{\"date\":\"2020-08-16\",\"active\":751594,\"deaths\":52156,\"confirmed\":2696444},{\"date\":\"2020-08-17\",\"active\":769350,\"deaths\":53336,\"confirmed\":2773920},{\"date\":\"2020-08-18\",\"active\":787651,\"deaths\":54544,\"confirmed\":2853352},{\"date\":\"2020-08-19\",\"active\":806492,\"deaths\":55781,\"confirmed\":2934778},{\"date\":\"2020-08-20\",\"active\":825871,\"deaths\":57047,\"confirmed\":3018239}],\"total\":{\"active\":825871,\"deaths\":57047,\"confirmed\":3018239}}},{\"Week-3\":{\"predictions\":[{\"date\":\"2020-08-21\",\"active\":845785,\"deaths\":58344,\"confirmed\":3103775},{\"date\":\"2020-08-22\",\"active\":866233,\"deaths\":59672,\"confirmed\":3191427},{\"date\":\"2020-08-23\",\"active\":887216,\"deaths\":61033,\"confirmed\":3281240},{\"date\":\"2020-08-24\",\"active\":908734,\"deaths\":62426,\"confirmed\":3373254},{\"date\":\"2020-08-25\",\"active\":930789,\"deaths\":63853,\"confirmed\":3467515},{\"date\":\"2020-08-26\",\"active\":953381,\"deaths\":65314,\"confirmed\":3564065},{\"date\":\"2020-08-27\",\"active\":976515,\"deaths\":66811,\"confirmed\":3662953}],\"total\":{\"active\":976515,\"deaths\":66811,\"confirmed\":3662953}}}]}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found",
          "content": "HTTP / 404 Not Found\n  {\"message\":\"Please provide a valid state name\"}",
          "type": "json"
        },
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaPredictState"
  },
  {
    "type": "get",
    "url": "/countries/India/predict/:state/:district",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "district",
            "description": ""
          }
        ]
      }
    },
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "overallPredictions",
            "description": "<p>3-week predictions of given district</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"overallPredictions\":[{\"Week-1\":{\"predictions\":[{\"date\":\"2020-08-07\",\"active\":617910,\"deaths\":42640,\"confirmed\":2081276},{\"date\":\"2020-08-08\",\"active\":630257,\"deaths\":43611,\"confirmed\":2142721},{\"date\":\"2020-08-09\",\"active\":643280,\"deaths\":44600,\"confirmed\":2205823},{\"date\":\"2020-08-10\",\"active\":656953,\"deaths\":45611,\"confirmed\":2270610},{\"date\":\"2020-08-11\",\"active\":671253,\"deaths\":46642,\"confirmed\":2337110},{\"date\":\"2020-08-12\",\"active\":686162,\"deaths\":47696,\"confirmed\":2405355},{\"date\":\"2020-08-13\",\"active\":701662,\"deaths\":48774,\"confirmed\":2475376}],\"total\":{\"active\":701662,\"deaths\":48774,\"confirmed\":2475376}}},{\"Week-2\":{\"predictions\":[{\"date\":\"2020-08-14\",\"active\":717742,\"deaths\":49876,\"confirmed\":2547209},{\"date\":\"2020-08-15\",\"active\":734389,\"deaths\":51003,\"confirmed\":2620886},{\"date\":\"2020-08-16\",\"active\":751594,\"deaths\":52156,\"confirmed\":2696444},{\"date\":\"2020-08-17\",\"active\":769350,\"deaths\":53336,\"confirmed\":2773920},{\"date\":\"2020-08-18\",\"active\":787651,\"deaths\":54544,\"confirmed\":2853352},{\"date\":\"2020-08-19\",\"active\":806492,\"deaths\":55781,\"confirmed\":2934778},{\"date\":\"2020-08-20\",\"active\":825871,\"deaths\":57047,\"confirmed\":3018239}],\"total\":{\"active\":825871,\"deaths\":57047,\"confirmed\":3018239}}},{\"Week-3\":{\"predictions\":[{\"date\":\"2020-08-21\",\"active\":845785,\"deaths\":58344,\"confirmed\":3103775},{\"date\":\"2020-08-22\",\"active\":866233,\"deaths\":59672,\"confirmed\":3191427},{\"date\":\"2020-08-23\",\"active\":887216,\"deaths\":61033,\"confirmed\":3281240},{\"date\":\"2020-08-24\",\"active\":908734,\"deaths\":62426,\"confirmed\":3373254},{\"date\":\"2020-08-25\",\"active\":930789,\"deaths\":63853,\"confirmed\":3467515},{\"date\":\"2020-08-26\",\"active\":953381,\"deaths\":65314,\"confirmed\":3564065},{\"date\":\"2020-08-27\",\"active\":976515,\"deaths\":66811,\"confirmed\":3662953}],\"total\":{\"active\":976515,\"deaths\":66811,\"confirmed\":3662953}}}]}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found",
          "content": "HTTP / 404 Not Found\n  {\"message\":\"Please provide a valid district name\"}",
          "type": "json"
        },
        {
          "title": "Not Found",
          "content": "HTTP / 404 Not Found\n  {\"message\":\"Please provide a valid state name\"}",
          "type": "json"
        },
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaPredictStateDistrict"
  },
  {
    "type": "get",
    "url": "/countries/India/states",
    "title": "/states states in India",
    "group": "/countries/India",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "allStatesInIndia",
            "description": "<p>list of states</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"allStatesInIndia\":[\"Andaman and Nicobar Islands\",\"Andhra Pradesh\",\"Arunachal Pradesh\",\"Assam\",\"Bihar\",\"Chandigarh\",\"Chhattisgarh\",\"Delhi\",\"Dadra and Nagar Haveli and Daman and Diu\",\"Goa\",\"Gujarat\",\"Himachal Pradesh\",\"Haryana\",\"Jharkhand\",\"Jammu and Kashmir\",\"Karnataka\",\"Kerala\",\"Ladakh\",\"Lakshadweep\",\"Maharashtra\",\"Meghalaya\",\"Manipur\",\"Madhya Pradesh\",\"Mizoram\",\"Nagaland\",\"Odisha\",\"Punjab\",\"Puducherry\",\"Rajasthan\",\"Sikkim\",\"Telangana\",\"Tamil Nadu\",\"Tripura\",\"Uttar Pradesh\",\"Uttarakhand\",\"West Bengal\"]}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./Routes/India/india_api.js",
    "groupTitle": "/countries/India",
    "name": "GetCountriesIndiaStates"
  },
  {
    "type": "get",
    "url": "/countries",
    "title": "List the available countries",
    "group": "/countries",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "availableCountries",
            "description": "<p>countries' list</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"availableCountries\": [\"Russia\",\"US\",\"Peru\",\"India\"]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api.js",
    "groupTitle": "/countries",
    "name": "GetCountries"
  },
  {
    "type": "get",
    "url": "/countries/:country",
    "title": "Access particular country",
    "group": "/countries",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>list of regions or states</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"states/regions\": [.... .... ....]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api.js",
    "groupTitle": "/countries",
    "name": "GetCountriesCountry"
  }
] });
